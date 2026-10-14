import React from 'react';
import { QuoteRequestRecord } from '@/types';

interface DashboardQuotesTabProps {
  quotes: QuoteRequestRecord[];
  onRequestNewQuote: () => void;
}

export const DashboardQuotesTab: React.FC<DashboardQuotesTabProps> = ({
  quotes,
  onRequestNewQuote,
}) => {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[18px] font-bold text-white">Live Commercial Quotation Pipeline</h2>
          <p className="text-[13px] text-gray-400">
            Submissions made on the website or dashboard appear here instantly via Cloud Firestore.
          </p>
        </div>
        <span className="text-[12px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Live Connected
        </span>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-[32px] mb-2">📋</div>
          <p className="text-[15px] text-gray-300 font-medium">No quote inquiries found under your account.</p>
          <p className="text-[13px] text-gray-500 mt-1">Click the button below to submit a custom quote request.</p>
          <button
            type="button"
            onClick={onRequestNewQuote}
            className="mt-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-[6px] text-[13px] cursor-pointer transition-colors"
          >
            Create Quote Request
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[12px] uppercase">
                <th className="py-3 px-4">Quote ID</th>
                <th className="py-3 px-4">Model & Powertrain</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[13px] text-gray-300">{q.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{q.model}</div>
                    <div className="text-[12px] text-gray-400">{q.message || 'Commercial Fleet Configuration'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 text-[13px]">
                    {new Date(q.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-amber-400">
                    {q.estimatedValue ? `$${q.estimatedValue.toLocaleString()}` : '$235,000'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        q.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : q.status === 'reviewing'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : q.status === 'contacted'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
