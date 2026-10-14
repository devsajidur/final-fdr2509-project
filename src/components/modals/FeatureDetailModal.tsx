import React from 'react';

export interface TelemetryData {
  speed: number;
  rpm: number;
  fuelRate: number;
  coolantTemp: number;
  oilPressure: number;
  engineLoad: number;
}

interface FeatureDetailModalProps {
  selectedFeature: 'safety' | 'connected' | 'comfort';
  telemetry: TelemetryData;
  onClose: () => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  selectedFeature,
  telemetry,
  onClose,
}) => {
  return (
    <div>
      <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
        {selectedFeature === 'safety' && 'Safety First: Bendix Wingman Fusion 2.0'}
        {selectedFeature === 'connected' && 'GuardDog® Connect: Live Telematics Simulator'}
        {selectedFeature === 'comfort' && 'Driver Comfort: Ergonomic Cab Architecture'}
      </h2>

      {selectedFeature === 'safety' && (
        <div className="mt-4 space-y-4 text-[14px] text-gray-700">
          <p>
            The Mack Anthem features comprehensive radar and camera-based collision mitigation, designed to keep drivers and motorists safe on every mile.
          </p>
          <div className="space-y-2 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px]">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Full Automated Emergency Braking (AEB)</strong> on stationary and moving vehicles.</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Lane Departure Warning (LDW)</strong> with audible cabin alerts.</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Adaptive Cruise Control</strong> maintaining safe highway following distances.</span>
            </div>
          </div>
        </div>
      )}

      {selectedFeature === 'connected' && (
        <div className="mt-4 space-y-4 text-[14px] text-gray-700">
          <p className="text-[13px] text-gray-600">
            Live Telematics Simulation streaming 24/7 diagnostic parameters from Mack GuardDog® Connect on-board telematics gateway:
          </p>

          <div className="grid grid-cols-3 gap-2.5 p-4 bg-gray-900 text-white rounded-[8px]">
            <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
              <span className="text-[11px] text-gray-400 block uppercase">Speed</span>
              <span className="text-[20px] font-bold text-green-400">{telemetry.speed}</span>
              <span className="text-[10px] text-gray-400 block">MPH</span>
            </div>
            <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
              <span className="text-[11px] text-gray-400 block uppercase">Engine RPM</span>
              <span className="text-[20px] font-bold text-blue-400">{telemetry.rpm}</span>
              <span className="text-[10px] text-gray-400 block">RPM</span>
            </div>
            <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
              <span className="text-[11px] text-gray-400 block uppercase">Fuel Flow</span>
              <span className="text-[20px] font-bold text-yellow-400">{telemetry.fuelRate}</span>
              <span className="text-[10px] text-gray-400 block">GAL/HR</span>
            </div>
            <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
              <span className="text-[11px] text-gray-400 block uppercase">Coolant</span>
              <span className="text-[18px] font-bold text-white">{telemetry.coolantTemp}°F</span>
              <span className="text-[10px] text-gray-400 block">Optimal</span>
            </div>
            <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
              <span className="text-[11px] text-gray-400 block uppercase">Oil Press.</span>
              <span className="text-[18px] font-bold text-white">{telemetry.oilPressure}</span>
              <span className="text-[10px] text-gray-400 block">PSI</span>
            </div>
            <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
              <span className="text-[11px] text-gray-400 block uppercase">Faults</span>
              <span className="text-[18px] font-bold text-green-400">0 Active</span>
              <span className="text-[10px] text-gray-400 block">100% Health</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-[6px] text-[13px] text-green-800">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span>Connected to Mack OneCall Diagnostic Center</span>
            </span>
            <strong className="text-[12px] bg-green-200 px-2 py-0.5 rounded-full">Active</strong>
          </div>
        </div>
      )}

      {selectedFeature === 'comfort' && (
        <div className="mt-4 space-y-4 text-[14px] text-gray-700">
          <p>
            Engineered around driver ergonomics to reduce fatigue on 11-hour shifts and maximize sleeper resting comfort.
          </p>
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px]">
            <div>
              <span className="text-gray-500 block">Sleeper Height</span>
              <strong className="text-gray-900">Full 70&quot; Stand-Up Clearance</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Driver Seating</span>
              <strong className="text-gray-900">Sears Air-Suspension Lumbar</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Driver Cluster</span>
              <strong className="text-gray-900">7&quot; Full Color Co-Pilot</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Storage Volume</span>
              <strong className="text-gray-900">Up to 35.8 cu. ft.</strong>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-5 bg-black text-white font-semibold rounded-[6px] cursor-pointer"
        >
          Close Feature Overview
        </button>
      </div>
    </div>
  );
};
