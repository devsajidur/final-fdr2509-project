import React from 'react';

export interface Dealership {
  name: string;
  city: string;
  state: string;
  zip: string;
  distance: string;
  phone: string;
  address: string;
  inventory: number;
}

interface FindDealerModalProps {
  dealerZip: string;
  setDealerZip: (val: string) => void;
  onDealerSearch: (e: React.FormEvent) => void;
  dealerSearchResult: string | null;
  filteredDealers: Dealership[];
  onSelectDealerVisit: () => void;
}

export const FindDealerModal: React.FC<FindDealerModalProps> = ({
  dealerZip,
  setDealerZip,
  onDealerSearch,
  dealerSearchResult,
  filteredDealers,
  onSelectDealerVisit,
}) => {
  return (
    <div>
      <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
        Mack Trucks Dealer Locator
      </h2>
      <p className="text-[14px] text-[#4B5563] mt-2">
        Find authorized sales, parts, and certified master service centers across North America.
      </p>

      <form onSubmit={onDealerSearch} className="mt-5 flex gap-2">
        <input
          type="text"
          value={dealerZip}
          onChange={(e) => setDealerZip(e.target.value)}
          placeholder="Enter City, State, or ZIP code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="py-2 px-5 bg-black text-white text-[14px] font-semibold rounded-[6px] hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      {dealerSearchResult && (
        <p className="text-[13px] font-medium text-gray-700 mt-3">{dealerSearchResult}</p>
      )}

      <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {filteredDealers.map((d) => (
          <div
            key={d.name}
            className="p-3.5 border border-gray-200 rounded-[8px] hover:border-black transition-colors bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 text-[14px]">{d.name}</h4>
                <span className="text-[12px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  {d.inventory} in stock
                </span>
              </div>
              <p className="text-[13px] text-gray-600 mt-1">{d.address}</p>
              <p className="text-[12px] text-gray-500 mt-0.5">Distance: {d.distance}</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[13px]">
              <a
                href={`tel:${d.phone.replace(/[^0-9]/g, '')}`}
                className="font-semibold text-black hover:underline"
              >
                {d.phone}
              </a>
              <button
                type="button"
                onClick={onSelectDealerVisit}
                className="text-[12px] font-semibold text-gray-700 hover:text-black underline cursor-pointer"
              >
                Schedule Visit →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-[13px] text-gray-600 flex items-center justify-between">
        <span>24/7 Roadside OneCall:</span>
        <a href="tel:18008661177" className="font-bold text-black hover:underline">
          1-800-866-1177
        </a>
      </div>
    </div>
  );
};
