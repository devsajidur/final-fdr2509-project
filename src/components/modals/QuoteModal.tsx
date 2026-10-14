import React from 'react';

interface QuoteModalProps {
  quoteCompany: string;
  setQuoteCompany: (val: string) => void;
  quoteEmail: string;
  setQuoteEmail: (val: string) => void;
  quoteFleetSize: string;
  setQuoteFleetSize: (val: string) => void;
  quoteSubmitted: boolean;
  quoteError: string;
  onSubmitQuote: (e: React.FormEvent) => void;
  onClose: () => void;
  /** Optional item the quote is about (truck, engine or part) */
  subject?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  quoteCompany,
  setQuoteCompany,
  quoteEmail,
  setQuoteEmail,
  quoteFleetSize,
  setQuoteFleetSize,
  quoteSubmitted,
  quoteError,
  onSubmitQuote,
  onClose,
  subject,
}) => {
  return (
    <div>
      <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
        Request Commercial Fleet Quote
      </h2>
      <p className="text-[14px] text-[#4B5563] mt-2">
        Receive personalized fleet pricing, Mack Financial Services leasing terms, and warranty options.
      </p>

      {subject && (
        <div className="mt-4 px-3 py-2 rounded-[6px] bg-amber-50 border border-amber-200 text-[13px] text-amber-900">
          <span className="font-semibold">Quote for:</span> {subject}
        </div>
      )}

      {quoteSubmitted ? (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-[8px] text-center">
          <div className="w-12 h-12 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <h3 className="text-[18px] font-bold text-gray-900 mt-3">Quote Request Submitted</h3>
          <p className="text-[14px] text-gray-700 mt-2">
            Thank you! Your quotation inquiry for <strong>{quoteCompany}</strong> ({quoteFleetSize}) has been registered.
            A regional commercial account manager will reach out to <strong>{quoteEmail}</strong> within 1 business day.
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
        <form onSubmit={onSubmitQuote} className="mt-5 space-y-4">
          {quoteError && <p className="text-[13px] text-red-600 font-medium">{quoteError}</p>}
          <div>
            <label htmlFor="quote-company" className="block text-[14px] font-semibold text-gray-900 mb-1">
              Company / Fleet Name *
            </label>
            <input
              id="quote-company"
              type="text"
              value={quoteCompany}
              onChange={(e) => setQuoteCompany(e.target.value)}
              placeholder="e.g. Continental Freight Logistics"
              className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="quote-email" className="block text-[14px] font-semibold text-gray-900 mb-1">
              Corporate Email *
            </label>
            <input
              id="quote-email"
              type="email"
              value={quoteEmail}
              onChange={(e) => setQuoteEmail(e.target.value)}
              placeholder="operations@continentalfreight.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="quote-fleet" className="block text-[14px] font-semibold text-gray-900 mb-1">
                Fleet Size
              </label>
              <select
                id="quote-fleet"
                value={quoteFleetSize}
                onChange={(e) => setQuoteFleetSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>1–5 Units</option>
                <option>6–20 Units</option>
                <option>21–50 Units</option>
                <option>50+ Enterprise Fleet</option>
              </select>
            </div>
            <div>
              <label htmlFor="quote-application" className="block text-[14px] font-semibold text-gray-900 mb-1">
                Primary Haul
              </label>
              <select
                id="quote-application"
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Long Haul Interstate</option>
                <option>Regional Distribution</option>
                <option>Vocational / Heavy Haul</option>
              </select>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Submit Quote Request
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
