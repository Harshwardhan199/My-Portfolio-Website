import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import phoneIcon from "../../../assets/images/phone.png";
import nameIcon from "../../../assets/images/name.png";
import emailIcon from "../../../assets/images/email.png";
import messageIcon from "../../../assets/images/message.png";
import { defaultContactData, defaultSocialsData } from "../../../assets/data/contact";
import { useCursor } from "../cursor/useCursor";

function Contact({ data, socials }) {
  const inputCursor = useCursor("input");
  const btnCursor = useCursor("button");
  const linkCursor = useCursor("link");
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

  const contact = data || defaultContactData;
  const activeSocials = socials?.items?.length ? socials.items : defaultSocialsData.items;

  const email = contact.email || defaultContactData.email;
  const phone = contact.phone || defaultContactData.phone;
  const locationText = contact.location || defaultContactData.location;
  const isFormEnabled = contact.formEnabled ?? defaultContactData.formEnabled;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });

    const form = e.target;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then((res) => {
        if (res.ok) {
          setStatus({ submitting: false, submitted: true, error: null });
        } else {
          setStatus({
            submitting: false,
            submitted: false,
            error: "Something went wrong. Please check your inputs and try again.",
          });
        }
      })
      .catch((err) => {
        setStatus({
          submitting: false,
          submitted: false,
          error: err.message || "A network error occurred. Please check your connection and try again.",
        });
      });
  };

  return (
    <section
      id="contact"
      className="w-full py-14 min-[400px]:py-20 px-3 min-[400px]:px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-24 lg:scroll-mt-[12vh] transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(26px,7vw,54px)] font-black text-text-primary text-center mb-10 min-[400px]:mb-16 tracking-tight header-shadow font-sans"
        >
          CONTACT
        </motion.h2>

        {/* Contact Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[800px] bg-card-dark p-4 min-[400px]:p-6 sm:p-10 rounded-2xl border border-border-theme shadow-sm relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {status.submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center py-6 min-[400px]:py-8"
              >
                <div className="w-14 h-14 min-[400px]:w-20 min-[400px]:h-20 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full flex items-center justify-center mb-4 min-[400px]:mb-6 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 min-[400px]:w-10 min-[400px]:h-10 text-emerald-500"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h3 className="text-lg min-[400px]:text-2xl font-bold text-text-primary mb-2 min-[400px]:mb-3">
                  Message Sent!
                </h3>

                <p className="text-text-secondary max-w-[420px] text-xs min-[400px]:text-sm sm:text-[15px] leading-relaxed font-sans">
                  Thank you for reaching out. Your message has been received, and I will get back to you as soon as possible.
                </p>

                <button
                  onClick={() =>
                    setStatus({ submitting: false, submitted: false, error: null })
                  }
                  className="mt-6 min-[400px]:mt-8 px-5 py-2 min-[400px]:px-6 min-[400px]:py-2.5 bg-input-bg hover:bg-input-focus-bg text-text-primary border border-border-theme rounded-xl font-bold text-xs min-[400px]:text-sm transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header Info - Always Single Line */}
                <div className="flex flex-row justify-between items-center w-full text-brand-red font-semibold mb-6 min-[400px]:mb-8 gap-2">
                  <span className="font-sans text-[11px] min-[360px]:text-xs min-[400px]:text-sm sm:text-base text-text-primary tracking-wider uppercase shrink-0">
                    GET IN TOUCH
                  </span>
                  {phone && (
                    <span className="flex items-center text-[11px] min-[360px]:text-xs min-[400px]:text-sm sm:text-base text-text-primary shrink-0">
                      <img
                        src={phoneIcon}
                        alt="Phone Icon"
                        className="w-3 h-3 min-[400px]:w-3.5 min-[400px]:h-3.5 mr-1.5 object-contain select-none"
                      />
                      {phone}
                    </span>
                  )}
                </div>

                {isFormEnabled ? (
                  <form
                    className="w-full font-sans text-text-primary flex flex-col gap-4 min-[400px]:gap-5"
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    onSubmit={handleSubmit}
                  >
                    <input type="hidden" name="form-name" value="contact" />

                    {status.error && (
                      <div className="p-3 bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold rounded-xl text-left">
                        ⚠️ {status.error}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-5">
                      <div className="flex flex-col text-left w-full sm:w-1/2">
                        <label className="text-[10px] min-[400px]:text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center">
                          <img src={nameIcon} alt="Name Icon" className="w-3 h-3 min-[400px]:w-3.5 min-[400px]:h-3.5 mr-1.5 object-contain select-none" />
                          YOUR NAME
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="e.g. John Doe"
                          className="px-3 py-2.5 min-[400px]:px-4 min-[400px]:py-3 bg-input-bg border border-border-theme focus:border-brand-red/60 rounded-xl text-text-primary placeholder:text-text-secondary/50 text-xs min-[400px]:text-sm outline-none transition duration-200"
                          {...inputCursor}
                        />
                      </div>

                      <div className="flex flex-col text-left w-full sm:w-1/2">
                        <label className="text-[10px] min-[400px]:text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center">
                          <img src={emailIcon} alt="Email Icon" className="w-3 h-3 min-[400px]:w-3.5 min-[400px]:h-3.5 mr-1.5 object-contain select-none" />
                          YOUR EMAIL
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="e.g. john@example.com"
                          className="px-3 py-2.5 min-[400px]:px-4 min-[400px]:py-3 bg-input-bg border border-border-theme focus:border-brand-red/60 rounded-xl text-text-primary placeholder:text-text-secondary/50 text-xs min-[400px]:text-sm outline-none transition duration-200"
                          {...inputCursor}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col text-left w-full">
                      <label className="text-[10px] min-[400px]:text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center">
                        <img src={messageIcon} alt="Message Icon" className="w-3 h-3 min-[400px]:w-3.5 min-[400px]:h-3.5 mr-1.5 object-contain select-none" />
                        YOUR MESSAGE
                      </label>
                      <textarea
                        name="message"
                        rows="4"
                        required
                        placeholder="Write your message here..."
                        className="px-3 py-2.5 min-[400px]:px-4 min-[400px]:py-3 bg-input-bg border border-border-theme focus:border-brand-red/60 rounded-xl text-text-primary placeholder:text-text-secondary/50 text-xs min-[400px]:text-sm outline-none transition duration-200 resize-y"
                        {...inputCursor}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status.submitting}
                      className="mt-1 w-full bg-brand-red text-white py-3 min-[400px]:py-3.5 rounded-xl font-extrabold text-xs min-[400px]:text-sm uppercase tracking-wider hover:opacity-90 transition duration-200 shadow-md shadow-brand-red/20 cursor-pointer disabled:opacity-50"
                      {...btnCursor}
                    >
                      {status.submitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-sm min-[400px]:text-base text-text-primary font-bold">Direct Contact Email</p>
                    <a href={`mailto:${email}`} className="text-brand-red font-mono text-sm min-[400px]:text-lg underline">
                      {email}
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Location & Social Links Footer */}
          <div className="mt-6 min-[400px]:mt-8 pt-4 min-[400px]:pt-6 border-t border-border-theme flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] min-[400px]:text-xs text-text-secondary">
            <span className="text-center sm:text-left">📍 {locationText} · {email}</span>
            {activeSocials?.length > 0 && (
              <div className="flex gap-3 min-[400px]:gap-4">
                {activeSocials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-text-primary font-bold transition"
                    {...linkCursor}
                  >
                    {soc.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;
