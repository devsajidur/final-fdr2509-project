import React from 'react';

interface ContactModalProps {
  contactName: string;
  setContactName: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  contactPhone: string;
  setContactPhone: (val: string) => void;
  contactType: string;
  setContactType: (val: string) => void;
  contactSubmitted: boolean;
  contactError: string;
  onSubmitContact: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  contactType,
  setContactType,
  contactSubmitted,
  contactError,
  onSubmitContact,
  onClose,
}) => {
  return (
    <div>
      <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
        Contact Authorized Mack Dealer
      </h2>
      <p className="text-[14px] text-[#4B5563] mt-2">
        Direct communication with authorized sales representatives and certified service managers.
      </p>

      {contactSubmitted ? (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-[8px] text-center">
          <div className="w-12 h-12 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <h3 className="text-[18px] font-bold text-gray-900 mt-3">Message Dispatched</h3>
          <p className="text-[14px] text-gray-700 mt-2">
            Thank you, <strong>{contactName}</strong>. Your inquiry regarding{' '}
            <strong>{contactType}</strong> has been routed to your local dealership.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 py-2 px-6 bg-black text-white font-semibold rounded-[6px] cursor-pointer"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmitContact} className="mt-5 space-y-4">
          {contactError && <p className="text-[13px] text-red-600 font-medium">{contactError}</p>}
          <div>
            <label htmlFor="contact-name" className="block text-[14px] font-semibold text-gray-900 mb-1">
              Full Name *
            </label>
            <input
              id="contact-name"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="contact-email" className="block text-[14px] font-semibold text-gray-900 mb-1">
                Email Address *
              </label>
              <input
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-[14px] font-semibold text-gray-900 mb-1">
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-type" className="block text-[14px] font-semibold text-gray-900 mb-1">
              Inquiry Topic
            </label>
            <select
              id="contact-type"
              value={contactType}
              onChange={(e) => setContactType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[6px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option>New Truck Purchase</option>
              <option>Certified Pre-Owned Inventory</option>
              <option>Maintenance & Engine Service</option>
              <option>Mack Genuine Parts Inquiry</option>
              <option>Fleet Financing & Leasing</option>
            </select>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Send Inquiry
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
