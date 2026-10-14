import React from 'react';

export const DashboardConfigurationsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded">CONFIG-01</span>
          <span className="text-[12px] text-gray-400">Saved on 2026-10-10</span>
        </div>
        <h3 className="text-[20px] font-bold text-white">Mack Anthem 70&quot; Stand-Up Sleeper</h3>
        <ul className="mt-4 space-y-2 text-[14px] text-gray-300">
          <li className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Engine:</span>
            <span className="font-semibold">Mack MP8 13L (505 HP / 1,860 lb.-ft.)</span>
          </li>
          <li className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Transmission:</span>
            <span className="font-semibold">mDRIVE 12-Speed Automated Manual</span>
          </li>
          <li className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Axle Configuration:</span>
            <span className="font-semibold">6x4 Tandem Axle</span>
          </li>
          <li className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Sleeper Interior:</span>
            <span className="font-semibold">Premium Driver Comfort Package</span>
          </li>
        </ul>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => alert('Downloading official Mack Anthem Technical Spec Sheet PDF...')}
            className="flex-1 bg-white hover:bg-gray-100 text-black font-semibold py-2.5 rounded-[8px] text-[13px] transition-colors cursor-pointer"
          >
            Download Spec Sheet (PDF)
          </button>
        </div>
      </div>

      <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] bg-blue-500/20 text-blue-400 font-mono px-2 py-0.5 rounded">CONFIG-02</span>
          <span className="text-[12px] text-gray-400">Saved on 2026-10-12</span>
        </div>
        <h3 className="text-[20px] font-bold text-white">Mack Anthem Day Cab Regional Hauler</h3>
        <ul className="mt-4 space-y-2 text-[14px] text-gray-300">
          <li className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Engine:</span>
            <span className="font-semibold">Mack MP8 13L (445 HP / 1,750 lb.-ft.)</span>
          </li>
          <li className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Transmission:</span>
            <span className="font-semibold">mDRIVE HD 13-Speed with Creeper</span>
          </li>
          <li className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Fuel Capacity:</span>
            <span className="font-semibold">Up to 300 Gallons Dual Aluminum</span>
          </li>
          <li className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-gray-400">Telematics:</span>
            <span className="font-semibold">Mack Connect Active Fleet Analytics</span>
          </li>
        </ul>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => alert('Downloading official Mack Anthem Day Cab Spec Sheet PDF...')}
            className="flex-1 bg-white hover:bg-gray-100 text-black font-semibold py-2.5 rounded-[8px] text-[13px] transition-colors cursor-pointer"
          >
            Download Spec Sheet (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
