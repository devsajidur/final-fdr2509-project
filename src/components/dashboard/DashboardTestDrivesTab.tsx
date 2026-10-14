import React from 'react';
import { TestDriveBooking } from '@/types';

interface DashboardTestDrivesTabProps {
  testDrives: TestDriveBooking[];
  tdModel: string;
  setTdModel: (val: string) => void;
  tdDate: string;
  setTdDate: (val: string) => void;
  tdLocation: string;
  setTdLocation: (val: string) => void;
  tdSubmitting: boolean;
  tdSuccess: boolean;
  onBookTestDrive: (e: React.FormEvent) => void;
}

export const DashboardTestDrivesTab: React.FC<DashboardTestDrivesTabProps> = ({
  testDrives,
  tdModel,
  setTdModel,
  tdDate,
  setTdDate,
  tdLocation,
  setTdLocation,
  tdSubmitting,
  tdSuccess,
  onBookTestDrive,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
        <h2 className="text-[20px] font-bold text-white mb-2">Schedule Commercial Test Drive</h2>
        <p className="text-[14px] text-gray-400 mb-6">
          Take the Mack Anthem on the highway with your drivers. A certified commercial specialist will prepare the vehicle for your route requirements.
        </p>

        {tdSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-[8px] text-[14px]">
            ✓ Test drive request recorded! Your local dealer will contact you to confirm.
          </div>
        )}

        <form onSubmit={onBookTestDrive} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-300 mb-1">Select Truck Model</label>
            <select
              value={tdModel}
              onChange={(e) => setTdModel(e.target.value)}
              className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white text-[14px] focus:outline-none focus:border-amber-400"
            >
              <option value='Mack Anthem 70" Stand-Up Sleeper'>Mack Anthem 70&quot; Stand-Up Sleeper (MP8 505HP)</option>
              <option value="Mack Anthem Day Cab 6x4">Mack Anthem Day Cab 6x4 (MP8 445HP)</option>
              <option value='Mack Anthem 48" Flat Top Sleeper'>Mack Anthem 48&quot; Flat Top Sleeper</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-300 mb-1">Preferred Date</label>
            <input
              type="date"
              required
              value={tdDate}
              onChange={(e) => setTdDate(e.target.value)}
              className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white text-[14px] focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-300 mb-1">Dealer Hub Location</label>
            <select
              value={tdLocation}
              onChange={(e) => setTdLocation(e.target.value)}
              className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white text-[14px] focus:outline-none focus:border-amber-400"
            >
              <option value="Mack Regional Dealer — Chicago North Hub">Mack Regional Dealer — Chicago North Hub (Illinois)</option>
              <option value="Mack Northeast Commercial Center — Allentown">Mack Northeast Commercial Center — Allentown (PA)</option>
              <option value="Mack Southern Logistics Fleet Center — Dallas">Mack Southern Logistics Fleet Center — Dallas (TX)</option>
              <option value="Mack West Coast Distribution Center — Reno">Mack West Coast Distribution Center — Reno (NV)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={tdSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-[8px] transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {tdSubmitting ? 'Booking Test Drive...' : 'Confirm Test Drive Request'}
          </button>
        </form>
      </div>

      <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-[18px] font-bold text-white mb-2">My Test Drive History</h3>
          <p className="text-[13px] text-gray-400 mb-4">
            Past and upcoming test drive bookings recorded in your account.
          </p>

          {testDrives.length === 0 ? (
            <p className="text-[13px] text-gray-500 py-6 text-center">No test drives scheduled yet.</p>
          ) : (
            <div className="space-y-3">
              {testDrives.map((d) => (
                <div key={d.id} className="p-3.5 rounded-[8px] bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white text-[14px]">{d.model}</div>
                    <div className="text-[12px] text-gray-400">{d.preferredLocation}</div>
                    <div className="text-[11px] text-amber-400 mt-0.5">Date: {d.preferredDate}</div>
                  </div>
                  <span className="text-[11px] bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-bold uppercase">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 rounded-[8px] bg-amber-500/10 border border-amber-500/20 text-[13px] text-amber-300">
          💡 <strong>Fleet Tip:</strong> Commercial test drives include full access to Mack Connect telematics dashboard during your highway test run.
        </div>
      </div>
    </div>
  );
};
