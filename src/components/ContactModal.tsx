import React, { useState, useEffect } from 'react';
import { X, Send, Heart, Check, Sparkles, Calendar } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBrief?: {
    scope: string;
    timeline: string;
    aesthetic: string;
    estimatedPrice: string;
  } | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialBrief,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    instagram: '',
    github: '',
    projectScope: 'Business Website',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialBrief) {
      setFormData((prev) => ({
        ...prev,
        projectScope: ['Business Website', 'Portfolio Website', 'E-commerce Website', 'Booking Website', 'Landing Page', 'Website Redesign', 'Other / Not Sure'].includes(initialBrief.scope)
          ? initialBrief.scope
          : 'Other / Not Sure',
        message: `Selected service: ${initialBrief.scope}. Estimated investment: ${initialBrief.estimatedPrice}. Desired aesthetic: ${initialBrief.aesthetic}. Target timeline: ${initialBrief.timeline}.`,
      }));
    }
  }, [initialBrief]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          instagram: formData.instagram,
          github: formData.github,
          websiteType: formData.projectScope,
          message: formData.message,
          company_website: (e.currentTarget.elements.namedItem('company_website') as HTMLInputElement | null)?.value || '',
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Your note could not be sent. Please try again.');
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#2B2326]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#FFFDFB] rounded-3xl shadow-2xl border border-[#F4B8C5] p-6 sm:p-10 text-[#34282C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Washi tape visual on top */}
        <div className="w-28 h-5 bg-[#F9D8DE]/90 mx-auto -mt-3 mb-6 rotate-[-1deg] border-l border-r border-[#C47B89]/30 shadow-2xs" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#FFF9FA] hover:bg-[#FCECEF] text-[#59464C] hover:text-[#34282C] border border-[#F9D8DE] transition-colors cursor-pointer"
          aria-label="Close inquiry modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Confirmation Stationery State */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#FCECEF] border border-[#F4B8C5] mx-auto flex items-center justify-center mb-6 shadow-sm">
              <Heart className="w-8 h-8 text-[#C47B89] fill-[#C47B89]" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-widest text-[#C47B89] block mb-2">
              Note Received With Love
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif font-medium text-[#34282C] mb-4">
              Thank you, {formData.name || 'friend'}!
            </h3>

            <p className="text-base text-[#59464C] max-w-md mx-auto mb-6 leading-relaxed">
              Your inquiry has landed gently in my studio inbox. I personally review every brief and will reply with thoughtful initial ideas within 24 business hours.
            </p>

            <div className="p-4 bg-[#FFF9FA] rounded-2xl border border-[#F9D8DE] text-xs text-[#7A646A] max-w-sm mx-auto mb-8 font-script text-base">
              “great websites begin with a quiet, genuine conversation” ♡
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 bg-[#34282C] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#44373B] transition-colors cursor-pointer"
            >
              Return To Portfolio
            </button>
          </div>
        ) : (
          /* Inquiry Form */
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C47B89]">
                  Start A Project
                </span>
                <span className="text-xs font-script text-[#B86B7B] text-base">✦ bespoke inquiry</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#34282C]">
                Let’s Work Together
              </h2>
              <p className="text-sm text-[#59464C] mt-2">
                Tell me a little about your brand and what you’re dreaming of building.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44373B] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Camille Delacroix"
                    className="w-full px-4 py-3 rounded-xl border border-[#F9D8DE] bg-[#FFF9FA] focus:bg-[#FFFDFB] focus:border-[#C47B89] outline-none text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44373B] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="camille@brand.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#F9D8DE] bg-[#FFF9FA] focus:bg-[#FFFDFB] focus:border-[#C47B89] outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44373B] mb-1.5">Phone / WhatsApp (optional)</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 555 123 4567" autoComplete="tel" className="w-full px-4 py-3 rounded-xl border border-[#F9D8DE] bg-[#FFF9FA] focus:bg-[#FFFDFB] focus:border-[#C47B89] outline-none text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44373B] mb-1.5">What kind of website do you need? *</label>
                  <select required value={formData.projectScope} onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[#F9D8DE] bg-[#FFF9FA] focus:bg-[#FFFDFB] focus:border-[#C47B89] outline-none text-sm transition-colors cursor-pointer">
                    <option value="Business Website">Business / Service Website</option>
                    <option value="Portfolio Website">Portfolio Website</option>
                    <option value="E-commerce Website">E-commerce Website</option>
                    <option value="Booking Website">Booking / Appointment Website</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Website Redesign">Website Redesign</option>
                    <option value="Other / Not Sure">Other / Not Sure Yet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44373B] mb-1.5">Instagram (optional)</label>
                  <input type="text" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="@yourbrand" autoComplete="off" className="w-full px-4 py-3 rounded-xl border border-[#F9D8DE] bg-[#FFF9FA] focus:bg-[#FFFDFB] focus:border-[#C47B89] outline-none text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44373B] mb-1.5">GitHub (optional)</label>
                  <input type="url" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/yourname" className="w-full px-4 py-3 rounded-xl border border-[#F9D8DE] bg-[#FFF9FA] focus:bg-[#FFFDFB] focus:border-[#C47B89] outline-none text-sm transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44373B] mb-1.5">
                  Project Details (optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Anything else we should know? Share your business, goals, or examples you love..."
                  className="w-full px-4 py-3 rounded-xl border border-[#F9D8DE] bg-[#FFF9FA] focus:bg-[#FFFDFB] focus:border-[#C47B89] outline-none text-sm transition-colors resize-none"
                />
              </div>

              <div aria-hidden="true" className="hidden"><label>Leave this field empty<input name="company_website" tabIndex={-1} autoComplete="off" /></label></div>
              {errorMessage && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#34282C] hover:bg-[#44373B] text-[#FFFDF9] text-xs font-semibold uppercase tracking-widest rounded-full shadow-paper transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span>Sending your note...</span>
                  ) : (
                    <>
                      <span>Send Project Note ↗</span>
                      <Send className="w-3.5 h-3.5 text-[#F9D8DE]" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-[#87636D] font-script text-base">
                  no spam ever · strictly confidential creative collaboration ♡
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
