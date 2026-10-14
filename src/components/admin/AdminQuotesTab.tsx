'use client';

import React, { useState } from 'react';
import { QuoteRequestRecord } from '@/types';

interface AdminQuotesTabProps {
  quotes: QuoteRequestRecord[];
  updatingId: string | null;
  onStatusChange: (quoteId: string, newStatus: QuoteRequestRecord['status']) => void;
  onDeleteQuote: (quoteId: string) => void;
}

export function AdminQuotesTab({
  quotes,
  updatingId,
  onStatusChange,
  onDeleteQuote,
}: AdminQuotesTabProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter = filter === 'all' || q.status === filter;
    const matchesSearch =
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.company && q.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.model.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-[18px] font-bold text-white">Live Incoming Quote Submissions</h2>
          <p className="text-[13px] text-gray-400">
            Update customer status in real-time. Changes sync to the customer dashboard instantly.
          </p>
        </div>
        <div className="text-[12px] text-gray-400 font-mono">
          Total Records: {quotes.length}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Filter by customer, company or model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2 text-white placeholder-gray-400 text-[13px] focus:outline-none focus:border-amber-400"
        />
        <div className="flex gap-2">
          {['all', 'pending', 'reviewing', 'approved', 'contacted'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-[6px] text-[12px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === st
                  ? 'bg-amber-400 text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[12px] uppercase text-gray-400 font-semibold tracking-wider">
              <th className="py-3 px-4">Customer & Company</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Engine / Model</th>
              <th className="py-3 px-4">Submitted</th>
              <th className="py-3 px-4">Status & Action</th>
              <th className="py-3 px-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredQuotes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400 text-[14px]">
                  No quote inquiries matching your criteria.
                </td>
              </tr>
            ) : (
              filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white text-[14px]">{q.name}</div>
                    <div className="text-[12px] text-gray-400">{q.company || 'Private Carrier'}</div>
                    {q.fleetSize && (
                      <div className="text-[11px] text-gray-500 mt-0.5">Fleet: {q.fleetSize}</div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-[13px] text-gray-300">
                    <div>{q.email}</div>
                    <div className="text-gray-400">{q.phone || 'N/A'}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-[13px] font-medium text-amber-300">{q.model}</div>
                    <div className="text-[12px] text-gray-400 mt-0.5">
                      Est: ${q.estimatedValue ? q.estimatedValue.toLocaleString() : '235,000'}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-gray-400">
                    {new Date(q.submittedAt).toLocaleDateString()} {new Date(q.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={q.status}
                        onChange={(e) => onStatusChange(q.id, e.target.value as QuoteRequestRecord['status'])}
                        disabled={updatingId === q.id}
                        className="bg-[#1F2937] border border-gray-700 rounded-[6px] px-2.5 py-1 text-[12px] text-white focus:outline-none focus:border-amber-400 cursor-pointer disabled:opacity-50"
                      >
                        <option value="pending">PENDING</option>
                        <option value="reviewing">REVIEWING</option>
                        <option value="approved">APPROVED</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="archived">ARCHIVED</option>
                      </select>
                      {updatingId === q.id && (
                        <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteQuote(q.id)}
                      className="text-red-400 hover:text-red-300 text-[12px] px-2 py-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
