import { useState, useEffect } from "react";

/**
 * ARCHITECTURAL DECISION:
 * Assets (Profile image, Project preview images, Resume PDF) are intentionally
 * converted to Base64 Data URLs client-side and stored directly in Firestore.
 * This keeps the application 100% backendless, free-tier compatible, and eliminates
 * any dependency on Firebase Cloud Storage or external object buckets.
 */

function compressImage(file, maxWidth = 1000, maxHeight = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL(file.type || "image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Profile Image Crop Modal Overlay for Circular Avatars.
 * Action Buttons: [Change Photo] | [Cancel] [Save Crop]
 */
function ImageCropModal({ imageUrl, onSave, onClose }) {
  const [workingImage, setWorkingImage] = useState(imageUrl);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

  const boxSize = 256;

  useEffect(() => {
    setWorkingImage(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleImageLoad = (e) => {
    const img = e.target;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const aspect = naturalSize.w && naturalSize.h ? naturalSize.w / naturalSize.h : 1;
  let baseW = boxSize;
  let baseH = boxSize;

  if (aspect >= 1) {
    baseH = boxSize;
    baseW = boxSize * aspect;
  } else {
    baseW = boxSize;
    baseH = boxSize / aspect;
  }

  const getClampedPan = (rawX, rawY, currentZoom = zoom) => {
    const currentMaxX = Math.max(0, (baseW * currentZoom - boxSize) / 2);
    const currentMaxY = Math.max(0, (baseH * currentZoom - boxSize) / 2);
    return {
      x: clamp(rawX, -currentMaxX, currentMaxX),
      y: clamp(rawY, -currentMaxY, currentMaxY),
    };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setPan(getClampedPan(rawX, rawY, zoom));
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) {}
      setIsDragging(false);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const newZoom = clamp(zoom + delta, 1, 3);
    setZoom(newZoom);
    setPan((prevPan) => getClampedPan(prevPan.x, prevPan.y, newZoom));
  };

  const handleZoomChange = (newZoom) => {
    setZoom(newZoom);
    setPan((prevPan) => getClampedPan(prevPan.x, prevPan.y, newZoom));
  };

  const handleNewFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      if (dataUrl) {
        setWorkingImage(dataUrl);
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    } catch (err) {
      console.error("Error reading new image file:", err);
    }
  };

  const handleApply = () => {
    const canvas = document.createElement("canvas");
    const outputSize = 400; // Output 400x400 square DataURL
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = workingImage;
    img.onload = () => {
      const scaleRatio = outputSize / boxSize;
      const drawW = baseW * zoom * scaleRatio;
      const drawH = baseH * zoom * scaleRatio;

      const drawX = (outputSize - drawW) / 2 + pan.x * scaleRatio;
      const drawY = (outputSize - drawH) / 2 + pan.y * scaleRatio;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
      onSave(croppedDataUrl);
      onClose();
    };
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-default"
      onClick={onClose}
    >
      <div
        className="bg-card-dark border border-border-theme p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-6 flex flex-col items-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Close Cross */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-input-bg border border-border-theme hover:border-brand-red text-text-secondary hover:text-text-primary transition cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-text-primary">Image Editor</h3>
          <p className="text-xs text-text-secondary">Drag image to position, scroll wheel or slider to zoom</p>
        </div>

        {/* Interactive Circle Preview Mask Box */}
        <div
          className="w-64 h-64 rounded-full border-4 border-brand-red shadow-2xl bg-black relative overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          <img
            src={workingImage}
            alt="Crop Preview"
            onLoad={handleImageLoad}
            draggable={false}
            className="select-none pointer-events-none shrink-0"
            style={{
              width: `${baseW}px`,
              height: `${baseH}px`,
              maxWidth: "none",
              maxHeight: "none",
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
              willChange: "transform",
            }}
          />
        </div>

        {/* Zoom Slider */}
        <div className="w-full space-y-2 px-2">
          <div className="flex justify-between text-xs font-mono text-text-secondary">
            <span>Zoom ({zoom.toFixed(2)}x)</span>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="text-brand-red hover:underline font-semibold cursor-pointer"
            >
              Reset
            </button>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            className="w-full accent-brand-red cursor-pointer"
          />
        </div>

        {/* Action Buttons: [Change Photo] | [Cancel] [Save Crop] */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pt-2">
          <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-input-bg border border-border-theme hover:border-brand-red text-text-primary text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm">
            <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Change Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleNewFileSelected}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-input-bg border border-border-theme text-text-primary text-xs font-bold hover:bg-border-theme/40 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:opacity-90 transition shadow-md shadow-brand-red/20 cursor-pointer"
            >
              Save Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Expanded Media Modal for Documents (PDFs) and Images with Scrollable Viewport.
 * Action Buttons: [Change Document / Image] | [Cancel] [Save]
 */
function ExpandedImageModal({ imageUrl, onSave, onClose, isPdf = false }) {
  const [workingImage, setWorkingImage] = useState(imageUrl);

  useEffect(() => {
    setWorkingImage(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleNewFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let finalDataUrl = "";
      if (file.type.startsWith("image/")) {
        finalDataUrl = await compressImage(file);
      } else {
        finalDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (evt) => resolve(evt.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      if (finalDataUrl) {
        setWorkingImage(finalDataUrl);
      }
    } catch (err) {
      console.error("Error reading media:", err);
    }
  };

  const handleApply = () => {
    onSave(workingImage);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-default"
      onClick={onClose}
    >
      <div
        className="bg-card-dark border border-border-theme p-6 rounded-3xl max-w-4xl w-full shadow-2xl space-y-6 flex flex-col items-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Close Cross */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-input-bg border border-border-theme hover:border-brand-red text-text-secondary hover:text-text-primary transition cursor-pointer z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-text-primary">
            {isPdf ? "Resume Document Preview" : "Project Preview Image"}
          </h3>
        </div>

        {/* Media Preview Viewport Container - Allows full PDF scrolling */}
        <div className="max-h-[60vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-border-theme bg-black/40">
          {isPdf ? (
            <iframe
              src={workingImage}
              title="Document Preview"
              className="w-full h-[58vh] rounded-xl border-0 bg-white"
            />
          ) : (
            <img
              src={workingImage}
              alt="Preview"
              className="max-h-[58vh] max-w-full object-contain rounded-xl select-none"
            />
          )}
        </div>

        {/* Action Buttons: [Change Document / Image] | [Cancel] [Save] */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pt-2">
          <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-input-bg border border-border-theme hover:border-brand-red text-text-primary text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm">
            <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isPdf ? "Change Document" : "Change Image"}</span>
            <input
              type="file"
              accept={isPdf ? "application/pdf" : "image/*"}
              onChange={handleNewFileSelected}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-input-bg border border-border-theme text-text-primary text-xs font-bold hover:bg-border-theme/40 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:opacity-90 transition shadow-md shadow-brand-red/20 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FileUpload({
  label = "Upload File",
  accept = "application/pdf,image/*",
  currentUrl = "",
  onUploadSuccess,
  isCircular = false,
  className = "",
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [showExpandedModal, setShowExpandedModal] = useState(false);
  const [cropSource, setCropSource] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(40);

    try {
      let finalDataUrl = "";

      if (file.type.startsWith("image/")) {
        finalDataUrl = await compressImage(file);
      } else {
        finalDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (evt) => resolve(evt.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      if (finalDataUrl) {
        if (isCircular) {
          // Open Image Editor Modal for circular avatar
          setCropSource(finalDataUrl);
        } else {
          onUploadSuccess(finalDataUrl);
        }
      }

      setProgress(100);
      setTimeout(() => setUploading(false), 200);
    } catch (err) {
      console.error("File processing error:", err);
      setError("Failed to process file.");
      setUploading(false);
    }
  };

  const isPdf =
    currentUrl?.startsWith("data:application/pdf") ||
    currentUrl?.toLowerCase().includes(".pdf");

  return (
    <div className={`space-y-2 w-full h-full flex flex-col justify-between ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary shrink-0">
          {label}
        </label>
      )}

      <div className="p-4 bg-input-bg border border-border-theme rounded-2xl flex flex-col justify-between gap-3 h-full flex-1">
        {currentUrl ? (
          isCircular ? (
            /* Circular Avatar Preview Layout - Click Image to Edit */
            <div className="flex flex-col items-center justify-center gap-2 py-2 h-full my-auto">
              <div
                onClick={() => setCropSource(currentUrl)}
                className="relative rounded-full overflow-hidden border-2 border-brand-red hover:border-red-500 bg-card-dark w-44 h-44 shadow-lg flex items-center justify-center shrink-0 cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
                title="Click image to edit crop or change photo"
              >
                <img
                  src={currentUrl || null}
                  alt={label}
                  className="w-full h-full object-cover rounded-full select-none"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 text-white backdrop-blur-xs">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-[11px] font-bold">Edit Image</span>
                </div>

                {/* Uploading Progress Overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-3 z-30 space-y-1 rounded-full">
                    <span className="text-[10px] font-bold text-white tracking-wider uppercase font-mono">
                      {progress}%
                    </span>
                    <div className="w-20 bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-red h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[11px] text-text-secondary font-medium">Click image to edit crop or change photo</span>
            </div>
          ) : (
            /* Standard Rectangular Preview Container (Completely clips off native PDF scrollbars) */
            <div className="flex flex-col items-center justify-between gap-2 h-full flex-1">
              <div
                onClick={() => setShowExpandedModal(true)}
                className="relative overflow-hidden border border-border-theme hover:border-brand-red bg-card-dark h-full flex-1 w-full flex items-center justify-center cursor-pointer group transition-all duration-300 min-h-[160px]"
                title={isPdf ? "Click to preview or replace document" : "Click image to expand or edit"}
              >
                {isPdf ? (
                  <div className="w-full h-full min-h-[180px] overflow-hidden bg-white relative flex items-center justify-center">
                    <iframe
                      src={`${currentUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      title={label}
                      scrolling="no"
                      className="border-0 bg-white pointer-events-none select-none"
                      style={{
                        width: "calc(100% + 24px)",
                        height: "calc(100% + 24px)",
                        marginRight: "-24px",
                        marginBottom: "-24px",
                        overflow: "hidden",
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={currentUrl || null}
                    alt={label}
                    className="w-full h-full min-h-[160px] object-cover object-center"
                  />
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 text-white backdrop-blur-xs z-10">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4" />
                  </svg>
                  <span className="text-[11px] font-bold">
                    {isPdf ? "Preview Document" : "Expand Image"}
                  </span>
                </div>

                {/* Uploading Progress Overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-30 space-y-2">
                    <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                      Uploading file ({progress}%)...
                    </span>
                    <div className="w-full max-w-xs bg-white/20 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-red h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[11px] text-text-secondary font-medium">
                {isPdf ? "Click document to expand preview or change PDF" : "Click image to expand or edit"}
              </span>
            </div>
          )
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 h-full flex-1">
            <span className="text-xs text-text-secondary">No file uploaded yet</span>
            <label className="px-4 py-2 bg-card-dark border border-border-theme hover:border-brand-red text-text-primary text-xs font-semibold rounded-xl cursor-pointer transition shrink-0">
              {uploading ? `Processing (${progress}%)...` : "Choose File"}
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Upload Progress Bar for initial empty file upload */}
        {uploading && !currentUrl && (
          <div className="space-y-1.5 py-1 shrink-0">
            <div className="flex justify-between text-xs text-text-secondary font-mono">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-border-theme h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-red h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-brand-red font-medium shrink-0">{error}</p>}
      </div>

      {/* Profile Image Crop Modal Overlay */}
      {cropSource && (
        <ImageCropModal
          imageUrl={cropSource}
          onSave={(croppedUrl) => onUploadSuccess(croppedUrl)}
          onClose={() => setCropSource(null)}
        />
      )}

      {/* Expanded Media Modal Overlay for Images & PDFs */}
      {showExpandedModal && (
        <ExpandedImageModal
          imageUrl={currentUrl}
          isPdf={isPdf}
          onSave={(updatedUrl) => onUploadSuccess(updatedUrl)}
          onClose={() => setShowExpandedModal(false)}
        />
      )}
    </div>
  );
}
