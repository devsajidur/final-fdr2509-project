import React from 'react';

interface BrochureModalProps {
  onDownloadSpecSheet: () => void;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({
  onDownloadSpecSheet,
  onClose,
}) => {
  return (
    <div>
      <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
        Mack Anthem® Specification Sheet
      </h2>
      <p className="text-[14px] text-[#4B5563] mt-2">
        Comprehensive engineering overview, dimensions, powertrain curves, and standard features.
      </p>

      <div className="mt-6 border border-gray-200 rounded-[8px] p-4 bg-gray-50 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-[6px] bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
            PDF
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-gray-900">
              Mack Anthem Engineering Brochure (2026 Edition)
            </h4>
            <p className="text-[12px] text-gray-500">24 Pages • High Resolution Technical Guide • 4.8 MB</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onDownloadSpecSheet}
          className="flex-1 py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Download Summary (.txt)
        </button>
        <button
          type="button"
          onClick={onClose}
          className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-[6px] hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
