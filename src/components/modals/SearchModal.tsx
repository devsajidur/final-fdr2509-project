import React, { RefObject } from 'react';

export interface SearchItem {
  category: string;
  title: string;
  snippet: string;
  href: string;
}

interface SearchModalProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchResults: SearchItem[];
  searchInputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  searchInputRef,
  onClose,
}) => {
  return (
    <div>
      <h2 id="modal-title" className="text-[20px] font-bold text-[#111827] leading-[28px]">
        Search Mack Anthem®
      </h2>
      <div className="relative mt-4">
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search specifications, powertrain, features, dealers..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="absolute left-3.5 top-3.5 text-gray-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div className="mt-5 space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {searchResults.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            onClick={onClose}
            className="block p-3 rounded-[6px] hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors group"
          >
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-[4px]">
                {item.category}
              </span>
              <h4 className="text-[14px] font-semibold text-gray-900 group-hover:text-black">
                {item.title}
              </h4>
            </div>
            <p className="text-[13px] text-gray-600 mt-1">{item.snippet}</p>
          </a>
        ))}
        {searchResults.length === 0 && (
          <div className="py-8 text-center text-gray-500 text-[14px]">
            No results found for &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;engine&rdquo;, &ldquo;fuel&rdquo;, or &ldquo;safety&rdquo;.
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500">
        <span>Navigation: Press Esc to close</span>
        <span>Tip: Press Cmd+K / Ctrl+K anywhere</span>
      </div>
    </div>
  );
};
