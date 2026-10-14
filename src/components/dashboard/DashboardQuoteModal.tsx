import React from 'react';

interface DashboardQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  engine: string;
  setEngine: (val: string) => void;
  timeframe: string;
  setTimeframe: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const DashboardQuoteModal: React.FC<DashboardQuoteModalProps> = ({
  isOpen,
  onClose,
  engine,
  setEngine,
  timeframe,
  setTimeframe,
  message,
  setMessage,
  submitting,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-white/20 rounded-[16px] max-w-[500px] w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-white">Request Direct Fleet Quote</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-[20px] cursor-pointer"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-300 mb-1">Engine Configuration</label>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2 text-white text-[14px] focus:outline-none focus:border-amber-400"
            >
              <option value="Mack MP8 13L — 505 HP">Mack MP8 13L — 505 HP (High Performance)</option>
              <option value="Mack MP8 13L — 445 HP">Mack MP8 13L — 445 HP (Fuel Optimizer)</option>
              <option value="Mack MP8 13L — 415 HP">Mack MP8 13L — 415 HP (Regional Carrier)</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-300 mb-1">Expected Delivery Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2 text-white text-[14px] focus:outline-none focus:border-amber-400"
            >
              <option value="Immediate">Immediate (Stock Inventory)</option>
              <option value="Within 30 Days">Within 30 Days</option>
              <option value="1-3 Months">1 - 3 Months</option>
              <option value="Custom Build Schedule">Custom Build Schedule</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-300 mb-1">Optional Fleet Notes</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Specify trailer requirements, aerodynamic fairings, or warranty options..."
              className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2 text-white text-[14px] placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 rounded-[8px] text-[13px] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-[8px] text-[13px] disabled:opacity-50 cursor-pointer transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit to Firebase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
