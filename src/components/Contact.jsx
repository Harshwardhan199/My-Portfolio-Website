import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import phoneIcon from "../assets/images/phone.png";
import nameIcon from "../assets/images/name.png";
import emailIcon from "../assets/images/email.png";
import messageIcon from "../assets/images/message.png";
import { useCursor } from "../cursor/useCursor";

function Contact() {
  const inputCursor = useCursor("input");
  const btnCursor = useCursor("button");
  const linkCursor = useCursor("link");
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });

    const form = e.target;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    })
      .then((res) => {
        if (res.ok) {
          setStatus({ submitting: false, submitted: true, error: null });
        } else {
          setStatus({
            submitting: false,
            submitted: false,
            error: "Something went wrong. Please check your inputs and try again."
          });
        }
      })
      .catch((err) => {
        setStatus({
          submitting: false,
          submitted: false,
          error: err.message || "A network error occurred. Please check your connection and try again."
        });
      });
  };

  return (
    <section
      id="contact"
      className="w-full py-20 px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-[10vh] transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        {/* Section Header */}
        <motion.h2 
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-6 tracking-tight font-sans header-shadow"
        >
          CONTACT
        </motion.h2>

        {/* Contact Container Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[700px] bg-card-dark p-6 min-[500px]:p-8 my-5 mx-4 min-h-[480px] rounded-2xl border border-border-theme shadow-sm flex flex-col justify-center relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {status.submitted ? (
              /* Success Animation Screen */
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                {/* Circular pulsing green check icon */}
                <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-10 h-10 text-emerald-500 dark:text-emerald-450"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  Message Sent!
                </h3>
                
                <p className="text-text-secondary max-w-[420px] text-[15px] leading-relaxed font-sans">
                  Thank you for reaching out. Your message has been received, and I will get back to you as soon as possible.
                </p>
                
                <button
                  onClick={() =>
                    setStatus({ submitting: false, submitted: false, error: null })
                  }
                  className="mt-8 px-6 py-2.5 bg-input-bg hover:bg-input-focus-bg text-text-primary border border-border-theme rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              /* Contact Form Screen */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header Info */}
                <div className="flex justify-between items-center w-full text-brand-red font-semibold mb-8">
                  <span className="font-sans text-[clamp(14px,3vw,18px)] text-text-primary tracking-wider uppercase">
                    GET IN TOUCH
                  </span>
                  <span className="flex items-center text-[clamp(14px,3vw,18px)] text-text-primary">
                    <img
                      src={phoneIcon}
                      alt="Phone Icon"
                      className="w-3.5 h-3.5 mr-2 object-contain select-none filter dark:invert-0 light:invert-1"
                    />
                    (+91) 7357980181
                  </span>
                </div>

                <form
                  className="w-full font-sans text-text-primary flex flex-col gap-5"
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  onSubmit={handleSubmit}
                >
                  <input type="hidden" name="form-name" value="contact" />

                  {status.error && (
                    <div className="p-3.5 bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold rounded-xl text-left">
                      ⚠️ {status.error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Name Input */}
                    <div className="flex flex-col text-left w-full sm:w-1/2">
                      <label
                        htmlFor="name"
                        className="flex items-center text-sm font-semibold text-text-secondary mb-2"
                      >
                        <img
                          src={nameIcon}
                          alt=""
                          className="w-4 h-4 mr-2 object-contain select-none filter dark:invert-0 light:invert-1"
                        />
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        className="w-full p-3 bg-input-bg text-text-primary border border-border-theme focus:border-brand-red/60 rounded-xl outline-none text-[15px] transition-all duration-300 focus:shadow-[0_0_15px_rgba(229,9,20,0.08)] focus:bg-card-dark shadow-xs"
                        {...inputCursor}
                      />
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col text-left w-full sm:w-1/2">
                      <label
                        htmlFor="email"
                        className="flex items-center text-sm font-semibold text-text-secondary mb-2"
                      >
                        <img
                          src={emailIcon}
                          alt=""
                          className="w-4 h-3.5 mr-2 object-contain select-none filter dark:invert-0 light:invert-1"
                        />
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Your email"
                        required
                        className="w-full p-3 bg-input-bg text-text-primary border border-border-theme focus:border-brand-red/60 rounded-xl outline-none text-[15px] transition-all duration-300 focus:shadow-[0_0_15px_rgba(229,9,20,0.08)] focus:bg-card-dark shadow-xs"
                        {...inputCursor}
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col text-left w-full mt-2">
                    <label
                      htmlFor="message"
                      className="flex items-center text-sm font-semibold text-text-secondary mb-2"
                    >
                      <img
                        src={messageIcon}
                        alt=""
                        className="w-4 h-3.5 mr-2 object-contain select-none filter dark:invert-0 light:invert-1"
                      />
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Your message"
                      required
                      className="w-full p-3 bg-input-bg text-text-primary border border-border-theme focus:border-brand-red/60 rounded-xl outline-none text-[15px] resize-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(229,9,20,0.08)] focus:bg-card-dark shadow-xs"
                      {...inputCursor}
                    />
                  </div>

                  {/* State Machine Submit Button (Send -> Loading -> Success) */}
                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="w-full p-3.5 mt-4 border border-transparent rounded-xl bg-brand-red text-white text-base font-bold cursor-pointer transition-all duration-300 hover:bg-red-600 shadow-md hover:shadow-[0_4px_25px_rgba(229,9,20,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    {...btnCursor}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {status.submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </span>
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social Profile Links Row (Hover Motion scale/lifts) */}
        <div className="flex justify-center items-center gap-10 my-10 relative z-10">
          {/* GitHub */}
          <a
            href="https://github.com/Harshwardhan199"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-brand-red scale-[1.5] hover:scale-[1.6] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            aria-label="GitHub Profile"
            {...linkCursor}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 496 512"
              height="28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
          </a>

          {/* Gmail */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=harshwardhan199saini@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-brand-red scale-[1.5] hover:scale-[1.6] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            aria-label="Gmail Account Link"
            {...linkCursor}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/harshwardhan-saini/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-brand-red scale-[1.5] hover:scale-[1.6] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            aria-label="LinkedIn Profile"
            {...linkCursor}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              height="28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
