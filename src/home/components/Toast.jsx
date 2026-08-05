import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Toast() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const message = location.state?.authError || location.state?.toast;
    if (message) {
      setToastMessage(typeof message === "string" ? message : message.text);

      // Clear navigation state so toast does not repeat on manual state updates
      navigate(location.pathname, { replace: true, state: {} });

      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  if (!toastMessage) return null;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-card-dark border border-red-500/30 text-text-primary p-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
        <div className="p-2 bg-red-500/20 text-red-500 rounded-lg flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="text-sm font-medium flex-1 text-text-primary">
          {toastMessage}
        </div>
        <button
          onClick={() => setToastMessage(null)}
          className="text-text-secondary hover:text-text-primary p-1 rounded-md transition cursor-pointer"
          aria-label="Close message"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
