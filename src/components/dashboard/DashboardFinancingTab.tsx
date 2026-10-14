import React from 'react';

interface DashboardFinancingTabProps {
  mfsUnits: number;
  setMfsUnits: (val: number) => void;
  mfsStructure: 'lease' | 'loan';
  setMfsStructure: (val: 'lease' | 'loan') => void;
  mfsTerm: number;
  setMfsTerm: (val: number) => void;
  mfsDownPct: number;
  setMfsDownPct: (val: number) => void;
  mfsDownPayment: number;
  mfsFinanced: number;
  mfsTotalCapCost: number;
  mfsMonthlyPayment: number;
  mfsSubmitting: boolean;
  mfsSuccess: boolean;
  onSaveMfsQuote: () => void;
}

export const DashboardFinancingTab: React.FC<DashboardFinancingTabProps> = ({
  mfsUnits,
  setMfsUnits,
  mfsStructure,
  setMfsStructure,
  mfsTerm,
  setMfsTerm,
  mfsDownPct,
  setMfsDownPct,
  mfsDownPayment,
  mfsFinanced,
  mfsTotalCapCost,
  mfsMonthlyPayment,
  mfsSubmitting,
  mfsSuccess,
  onSaveMfsQuote,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-white">Mack Financial Services (MFS) Fleet Financing</h2>
              <span className="text-[11px] bg-blue-500/20 text-blue-400 font-mono px-2 py-0.5 rounded font-bold">OEM DIRECT FINANCING</span>
            </div>
            <p className="text-[13px] text-gray-400 mt-1">
              Structured commercial equipment financing, TRAC leasing, and capital loans tailored for owner-operators and enterprise carriers.
            </p>
          </div>
          {mfsSuccess && (
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-[8px] text-[13px] font-medium flex items-center gap-2">
              <span>✓</span>
              <span>MFS Credit Pre-Approval inquiry submitted to your Mack Commercial Representative!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 mb-6">
          <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
            <label className="block text-[13px] text-gray-300 font-medium mb-2">Financing Structure</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMfsStructure('lease')}
                className={`py-2 px-3 rounded-[6px] text-[13px] font-semibold transition-all cursor-pointer ${
                  mfsStructure === 'lease'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                TRAC Lease
              </button>
              <button
                type="button"
                onClick={() => setMfsStructure('loan')}
                className={`py-2 px-3 rounded-[6px] text-[13px] font-semibold transition-all cursor-pointer ${
                  mfsStructure === 'loan'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Retail Loan
              </button>
            </div>
            <div className="text-[11px] text-gray-400 mt-2">
              {mfsStructure === 'lease' ? 'Lower monthly payments with end-of-term buyout.' : 'Traditional ownership with depreciation benefits.'}
            </div>
          </div>

          <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[13px] text-gray-300 font-medium">Trucks in Package</label>
              <span className="text-[15px] font-bold text-white font-mono">{mfsUnits} Units</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={mfsUnits}
              onChange={(e) => setMfsUnits(Number(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer mt-2"
            />
            <div className="text-[11px] text-gray-400 mt-2">Total Value: ${mfsTotalCapCost.toLocaleString()}</div>
          </div>

          <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
            <label className="block text-[13px] text-gray-300 font-medium mb-1">Term Length</label>
            <select
              value={mfsTerm}
              onChange={(e) => setMfsTerm(Number(e.target.value))}
              className="w-full bg-[#111827] border border-gray-700 rounded-[8px] px-3 py-2 text-white text-[14px] mt-1"
            >
              <option value={36}>36 Months (3 Years)</option>
              <option value={48}>48 Months (4 Years)</option>
              <option value={60}>60 Months (5 Years)</option>
              <option value={72}>72 Months (6 Years)</option>
            </select>
            <div className="text-[11px] text-gray-400 mt-2">Optimized for truck lifecycle warranty</div>
          </div>

          <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[13px] text-gray-300 font-medium">Down Payment</label>
              <span className="text-[15px] font-bold text-emerald-400 font-mono">{mfsDownPct}% (${mfsDownPayment.toLocaleString()})</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={mfsDownPct}
              onChange={(e) => setMfsDownPct(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer mt-2"
            />
            <div className="text-[11px] text-gray-400 mt-2">Financed: ${mfsFinanced.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-900/10 border border-blue-500/40 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-blue-300 font-semibold tracking-wider">Estimated Fleet Monthly Payment</div>
            <div className="text-[30px] font-black text-white mt-1">${mfsMonthlyPayment.toLocaleString()}<span className="text-[14px] text-gray-400 font-normal"> / mo</span></div>
            <div className="text-[12px] text-blue-300 mt-1">For all {mfsUnits} Anthem units ({mfsTerm} mo term)</div>
          </div>

          <div className="bg-[#1F2937]/80 border border-white/10 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Monthly Payment Per Single Unit</div>
            <div className="text-[30px] font-black text-amber-400 mt-1">${Math.round(mfsMonthlyPayment / mfsUnits).toLocaleString()}<span className="text-[14px] text-gray-400 font-normal"> / unit</span></div>
            <div className="text-[12px] text-gray-400 mt-1">Includes standard Mack powertrain warranty</div>
          </div>

          <div className="bg-[#1F2937]/80 border border-white/10 rounded-[12px] p-5 flex flex-col justify-between">
            <div>
              <div className="text-[12px] uppercase text-emerald-400 font-semibold tracking-wider">OEM Direct Benefits</div>
              <div className="text-[13px] text-gray-300 mt-1.5 space-y-1">
                <div>✓ No prepayment penalty</div>
                <div>✓ Seasonal payment flexibility</div>
                <div>✓ Bundled insurance & telematics</div>
              </div>
            </div>
            <button
              type="button"
              disabled={mfsSubmitting}
              onClick={onSaveMfsQuote}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-[8px] text-[13px] transition-all cursor-pointer shadow active:scale-98 disabled:opacity-50"
            >
              {mfsSubmitting ? 'Submitting Application...' : 'Apply for MFS Fleet Pre-Approval →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
