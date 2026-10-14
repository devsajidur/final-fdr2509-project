import React from 'react';

interface ConfigureModalProps {
  selectedHp: string;
  setSelectedHp: (val: string) => void;
  selectedCab: string;
  setSelectedCab: (val: string) => void;
  selectedAxle: string;
  setSelectedAxle: (val: string) => void;
  selectedColor: string;
  setSelectedColor: (val: string) => void;
  configSaved: boolean;
  setConfigSaved: (val: boolean) => void;
  estimatedPrice: number;
  onSaveConfig: () => void;
  onRequestQuote: () => void;
}

export const ConfigureModal: React.FC<ConfigureModalProps> = ({
  selectedHp,
  setSelectedHp,
  selectedCab,
  setSelectedCab,
  selectedAxle,
  setSelectedAxle,
  selectedColor,
  setSelectedColor,
  configSaved,
  estimatedPrice,
  onSaveConfig,
  onRequestQuote,
}) => {
  return (
    <div>
      <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
        Configure & Price — Mack Anthem®
      </h2>
      <p className="text-[14px] text-[#4B5563] mt-2">
        Select your powertrain rating, cab dimensions, and axle configuration.
      </p>

      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-[14px] font-semibold text-[#111827] mb-1">
            Engine Rating (Mack MP8 13L)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['415 HP', '445 HP', '505 HP'].map((hp) => (
              <button
                key={hp}
                type="button"
                onClick={() => setSelectedHp(hp)}
                className={`py-2 px-3 text-[14px] font-medium rounded-[6px] border transition-colors cursor-pointer ${
                  selectedHp === hp
                    ? 'border-black bg-black text-white shadow-xs'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {hp}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-[#111827] mb-1">
            Cab Configuration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['Day Cab', '48" Flat Top', '70" Stand Up Sleeper'].map((cab) => (
              <button
                key={cab}
                type="button"
                onClick={() => setSelectedCab(cab)}
                className={`py-2 px-3 text-[13px] font-medium rounded-[6px] border transition-colors cursor-pointer ${
                  selectedCab === cab
                    ? 'border-black bg-black text-white shadow-xs'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cab}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-[#111827] mb-1">
            Axle Setup
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['6x2 Fuel Efficient', '6x4 Heavy Duty'].map((axle) => (
              <button
                key={axle}
                type="button"
                onClick={() => setSelectedAxle(axle)}
                className={`py-2 px-3 text-[13px] font-medium rounded-[6px] border transition-colors cursor-pointer ${
                  selectedAxle === axle
                    ? 'border-black bg-black text-white shadow-xs'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {axle}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-[#111827] mb-1">
            Exterior Finish: <span className="font-normal text-gray-600">{selectedColor}</span>
          </label>
          <div className="flex items-center space-x-3 mt-1.5">
            {[
              { name: 'Mack Silver Metallic', color: '#D1D5DB' },
              { name: 'Obsidian Black', color: '#111827' },
              { name: 'Polar White', color: '#F3F4F6' },
              { name: 'Midnight Blue', color: '#1E3A8A' },
              { name: 'Mack Crimson Red', color: '#991B1B' },
            ].map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                aria-label={`Select ${c.name}`}
                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                  selectedColor === c.name ? 'scale-115 border-black shadow-md' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c.color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[14px]">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <span className="font-semibold text-gray-900">Current Configuration:</span>
          <span className="text-[16px] font-bold text-black">
            ${estimatedPrice.toLocaleString()} <span className="text-[12px] font-normal text-gray-500">MSRP</span>
          </span>
        </div>
        <ul className="mt-2 list-disc list-inside text-gray-600 space-y-0.5 text-[13px]">
          <li>Mack MP8 13L — {selectedHp} (Up to 1,860 lb-ft)</li>
          <li>Cab: {selectedCab}</li>
          <li>Axle: {selectedAxle} (GVWR 80,000 lbs)</li>
          <li>Color: {selectedColor}</li>
        </ul>
        {configSaved && (
          <p className="mt-2.5 text-green-700 font-medium text-[13px] flex items-center space-x-1.5">
            <span>✓</span>
            <span>Configuration saved to current session. Ready for dealer review.</span>
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onSaveConfig}
          className="flex-1 py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Save Configuration
        </button>
        <button
          type="button"
          onClick={onRequestQuote}
          className="py-2.5 px-4 bg-gray-100 text-gray-900 font-semibold rounded-[6px] hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Request Dealer Quote
        </button>
      </div>
    </div>
  );
};
