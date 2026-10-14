import React from 'react';

interface DashboardTcoTabProps {
  tcoFleetSize: number;
  setTcoFleetSize: (val: number) => void;
  tcoAnnualMiles: number;
  setTcoAnnualMiles: (val: number) => void;
  tcoFuelPrice: number;
  setTcoFuelPrice: (val: number) => void;
  annualDollarsSaved: number;
  annualGalSaved: number;
  fiveYearSavings: number;
  co2ReductionTons: number;
  tcoSubmitting: boolean;
  tcoSuccess: boolean;
  onSaveTcoQuote: () => void;
}

export const DashboardTcoTab: React.FC<DashboardTcoTabProps> = ({
  tcoFleetSize,
  setTcoFleetSize,
  tcoAnnualMiles,
  setTcoAnnualMiles,
  tcoFuelPrice,
  setTcoFuelPrice,
  annualDollarsSaved,
  annualGalSaved,
  fiveYearSavings,
  co2ReductionTons,
  tcoSubmitting,
  tcoSuccess,
  onSaveTcoQuote,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-white">Mack Anthem Total Cost of Ownership (TCO) Calculator</h2>
              <span className="text-[11px] bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded font-bold">MP8 HE ENGINE</span>
            </div>
            <p className="text-[13px] text-gray-400 mt-1">
              Calculate real-world diesel fuel and operational savings across your commercial fleet based on Mack MP8 Turbo Compounding aerodynamic efficiency.
            </p>
          </div>
          {tcoSuccess && (
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-[8px] text-[13px] font-medium flex items-center gap-2">
              <span>✓</span>
              <span>TCO Calculation saved to your live quotation pipeline!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mb-8">
          <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[13px] text-gray-300 font-medium">Fleet Size (Class 8 Units)</label>
              <span className="text-[16px] font-bold text-amber-400 font-mono">{tcoFleetSize} Trucks</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={tcoFleetSize}
              onChange={(e) => setTcoFleetSize(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1">
              <span>1 Unit</span>
              <span>50 Units</span>
              <span>100 Units</span>
            </div>
          </div>

          <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[13px] text-gray-300 font-medium">Annual Miles Per Truck</label>
              <span className="text-[16px] font-bold text-blue-400 font-mono">{tcoAnnualMiles.toLocaleString()} mi</span>
            </div>
            <input
              type="range"
              min={50000}
              max={200000}
              step={5000}
              value={tcoAnnualMiles}
              onChange={(e) => setTcoAnnualMiles(Number(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1">
              <span>50k mi (Regional)</span>
              <span>120k mi (Long-Haul)</span>
              <span>200k mi</span>
            </div>
          </div>

          <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[13px] text-gray-300 font-medium">Average Diesel Fuel Price</label>
              <span className="text-[16px] font-bold text-emerald-400 font-mono">${tcoFuelPrice.toFixed(2)}/gal</span>
            </div>
            <input
              type="range"
              min={3.00}
              max={6.00}
              step={0.05}
              value={tcoFuelPrice}
              onChange={(e) => setTcoFuelPrice(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1">
              <span>$3.00/gal</span>
              <span>$4.50/gal</span>
              <span>$6.00/gal</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-amber-300 font-semibold tracking-wider">Annual Fleet Fuel Savings</div>
            <div className="text-[30px] font-black text-amber-400 mt-1">${annualDollarsSaved.toLocaleString()}</div>
            <div className="text-[12px] text-gray-400 mt-1 font-mono">+{annualGalSaved.toLocaleString()} gal diesel saved/yr</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-emerald-300 font-semibold tracking-wider">5-Year TCO Advantage</div>
            <div className="text-[30px] font-black text-emerald-400 mt-1">${fiveYearSavings.toLocaleString()}</div>
            <div className="text-[12px] text-gray-400 mt-1 font-mono">Compared to 6.8 MPG industry baseline</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-blue-300 font-semibold tracking-wider">CO2 Carbon Reduced</div>
            <div className="text-[30px] font-black text-blue-400 mt-1">{co2ReductionTons.toLocaleString()} Tons</div>
            <div className="text-[12px] text-gray-400 mt-1 font-mono">EPA SmartWay Certified Reduction</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-purple-300 font-semibold tracking-wider">Estimated Fleet Value</div>
            <div className="text-[30px] font-black text-white mt-1">${(tcoFleetSize * 235000).toLocaleString()}</div>
            <div className="text-[12px] text-gray-400 mt-1 font-mono">Based on $235,000 MSRP per Anthem</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[12px] bg-white/[0.03] border border-white/10">
          <div className="text-[13px] text-gray-300 text-center sm:text-left">
            💡 <strong>Fleet Manager Notice:</strong> Mack Anthem achieves up to <strong>8.0+ MPG</strong> highway fuel economy with Mack MP8-TC (Turbo Compounding), Wave Piston technology, and factory roof fairings.
          </div>
          <button
            type="button"
            disabled={tcoSubmitting}
            onClick={onSaveTcoQuote}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-[8px] text-[13px] transition-all shadow-md active:scale-98 cursor-pointer shrink-0 disabled:opacity-50"
          >
            {tcoSubmitting ? 'Saving Analysis...' : `Request Quote for ${tcoFleetSize} Trucks →`}
          </button>
        </div>
      </div>
    </div>
  );
};
