'use client';

import React from 'react';
import { TestDriveBooking } from '@/types';

interface AdminTestDrivesTabProps {
  testDrives: TestDriveBooking[];
}

export function AdminTestDrivesTab({ testDrives }: AdminTestDrivesTabProps) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[18px] font-bold text-white">Dealer Test Drive Inquiries</h2>
          <p className="text-[13px] text-gray-400">
            Real-time reservations booked by customer fleet managers across regional dealer hubs.
          </p>
        </div>
        <span className="text-[12px] text-gray-400 font-mono">
          Total Bookings: {testDrives.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[12px] uppercase text-gray-400 font-semibold tracking-wider">
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Email & Phone</th>
              <th className="py-3 px-4">Requested Model</th>
              <th className="py-3 px-4">Target Date</th>
              <th className="py-3 px-4">Dealer Location</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {testDrives.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400 text-[14px]">
                  No test drives booked yet. Real-time entries will appear here.
                </td>
              </tr>
            ) : (
              testDrives.map((d) => (
                <tr key={d.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-semibold text-white">{d.customerName}</td>
                  <td className="py-3.5 px-4 text-[13px] text-gray-300">
                    <div>{d.email}</div>
                    <div className="text-gray-400">{d.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[13px] font-medium text-amber-300">{d.model}</td>
                  <td className="py-3.5 px-4 text-gray-200 text-[13px]">{d.preferredDate}</td>
                  <td className="py-3.5 px-4 text-gray-400 text-[13px]">{d.preferredLocation}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">
                      {d.status}
                    </span>
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
