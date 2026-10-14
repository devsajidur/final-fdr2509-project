import React from 'react';

interface SpecDetailModalProps {
  selectedSpec: 'engine' | 'fuel' | 'gvwr' | 'wheelbase';
  onClose: () => void;
}

export const SpecDetailModal: React.FC<SpecDetailModalProps> = ({
  selectedSpec,
  onClose,
}) => {
  return (
    <div>
      <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
        Technical Specification: {selectedSpec.toUpperCase()}
      </h2>

      {selectedSpec === 'engine' && (
        <div className="mt-4 space-y-4 text-[14px] text-gray-700">
          <p>
            The <strong>Mack MP®8 engine</strong> is engineered for highway line-haul and regional distribution, offering an exceptional power-to-weight ratio.
          </p>
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px]">
            <div>
              <span className="text-gray-500 block">Displacement</span>
              <strong className="text-gray-900">13 Liters (780 cu. in.)</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Horsepower Range</span>
              <strong className="text-gray-900">415 – 505 HP</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Peak Torque</span>
              <strong className="text-gray-900">Up to 1,860 lb-ft @ 900 RPM</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Fuel Injection</span>
              <strong className="text-gray-900">Ultra-High Pressure Common Rail</strong>
            </div>
          </div>
          <p className="text-[13px] text-gray-600">
            Standard transmission pairing: <strong>mDRIVE™ 12-speed automated manual</strong> with grade gripper anti-roll technology.
          </p>
        </div>
      )}

      {selectedSpec === 'fuel' && (
        <div className="mt-4 space-y-4 text-[14px] text-gray-700">
          <p>
            The aerodynamic design of the Mack Anthem delivers up to an <strong>8.5 MPG rating</strong> on long highway runs, reducing total cost of ownership by up to 3% annually.
          </p>
          <div className="p-4 bg-gray-50 rounded-[8px] border border-gray-200 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span>Aerodynamic Sloped Hood & Fairings:</span>
              <strong className="text-green-700">+1.5% Fuel Savings</strong>
            </div>
            <div className="flex justify-between">
              <span>Predictive Cruise with GPS Mapping:</span>
              <strong className="text-green-700">+1.0% Fuel Savings</strong>
            </div>
            <div className="flex justify-between">
              <span>Smart Idle Shutdown & Downspeeding:</span>
              <strong className="text-green-700">+0.5% Fuel Savings</strong>
            </div>
          </div>
        </div>
      )}

      {selectedSpec === 'gvwr' && (
        <div className="mt-4 space-y-4 text-[14px] text-gray-700">
          <p>
            Rated at <strong>80,000 lbs Gross Vehicle Weight Rating (GVWR)</strong> for maximum interstate freight capacity.
          </p>
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px]">
            <div>
              <span className="text-gray-500 block">Front Axle Rating</span>
              <strong className="text-gray-900">12,000 – 14,600 lbs</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Rear Tandem Axle</span>
              <strong className="text-gray-900">38,000 – 46,000 lbs</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Frame Rail Material</span>
              <strong className="text-gray-900">120,000 PSI Steel</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Brake System</span>
              <strong className="text-gray-900">Bendix Air Disc Brakes</strong>
            </div>
          </div>
        </div>
      )}

      {selectedSpec === 'wheelbase' && (
        <div className="mt-4 space-y-4 text-[14px] text-gray-700">
          <p>
            Configurable wheelbase options from <strong>189&quot; to 280&quot;</strong> adapt to flatbeds, refrigerated reefers, and dry van trailers.
          </p>
          <div className="p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px] space-y-1.5">
            <div className="flex justify-between">
              <span>Day Cab Wheelbase:</span>
              <strong className="text-gray-900">189&quot; – 210&quot;</strong>
            </div>
            <div className="flex justify-between">
              <span>48&quot; Sleeper Wheelbase:</span>
              <strong className="text-gray-900">215&quot; – 235&quot;</strong>
            </div>
            <div className="flex justify-between">
              <span>70&quot; Stand-Up Sleeper Wheelbase:</span>
              <strong className="text-gray-900">230&quot; – 280&quot;</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-gray-200">
              <span>Wheel Cut Angle:</span>
              <strong className="text-green-700">Up to 50° Maneuverability</strong>
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
          Close Specifications
        </button>
      </div>
    </div>
  );
};
