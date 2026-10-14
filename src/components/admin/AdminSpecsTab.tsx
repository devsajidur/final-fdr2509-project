'use client';

import React from 'react';
import { SpecificationItem } from '@/types';

interface AdminSpecsTabProps {
  specs: SpecificationItem[];
  editingSpec: SpecificationItem | null;
  setEditingSpec: (spec: SpecificationItem | null) => void;
  onSaveSpec: (e: React.FormEvent) => void;
  specSaveSuccess: boolean;
}

export function AdminSpecsTab({
  specs,
  editingSpec,
  setEditingSpec,
  onSaveSpec,
  specSaveSuccess,
}: AdminSpecsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
        <h2 className="text-[18px] font-bold text-white mb-2">Technical Specifications on Live Website</h2>
        <p className="text-[13px] text-gray-400 mb-4">
          Selecting a spec loads it into the editor. Changes saved here sync live to the showcase landing page!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specs.map((s) => (
            <div
              key={s.id}
              onClick={() => setEditingSpec(s)}
              className={`p-4 rounded-[12px] border cursor-pointer transition-all ${
                editingSpec?.id === s.id
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-mono text-amber-400 uppercase">{s.iconType}</span>
                <span className="text-[11px] text-gray-400">ID: {s.id}</span>
              </div>
              <div className="text-[16px] font-bold text-white">{s.title}</div>
              <div className="text-[14px] text-gray-200 font-semibold mt-1">{s.primaryDetail}</div>
              <div className="text-[12px] text-gray-400 mt-0.5">{s.secondaryDetail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-[18px] font-bold text-white mb-2">Live Spec Editor</h3>
          {editingSpec ? (
            <form onSubmit={onSaveSpec} className="space-y-4 mt-4">
              {specSaveSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-[8px] text-[13px]">
                  ✓ Updated! Live website now shows this updated spec.
                </div>
              )}
              <div>
                <label className="block text-[12px] font-medium text-gray-400 mb-1">Spec Title</label>
                <input
                  type="text"
                  value={editingSpec.title}
                  onChange={(e) => setEditingSpec({ ...editingSpec, title: e.target.value })}
                  className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3 py-2 text-white text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-400 mb-1">Primary Detail (Top Line)</label>
                <input
                  type="text"
                  value={editingSpec.primaryDetail}
                  onChange={(e) => setEditingSpec({ ...editingSpec, primaryDetail: e.target.value })}
                  className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3 py-2 text-white text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-400 mb-1">Secondary Detail (Subtext)</label>
                <input
                  type="text"
                  value={editingSpec.secondaryDetail}
                  onChange={(e) => setEditingSpec({ ...editingSpec, secondaryDetail: e.target.value })}
                  className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3 py-2 text-white text-[13px]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-[8px] text-[13px] transition-all cursor-pointer shadow-md"
              >
                Save & Sync to Live Site
              </button>
            </form>
          ) : (
            <p className="text-[13px] text-gray-400 py-10 text-center">
              Select any specification card on the left to edit its parameters live.
            </p>
          )}
        </div>
        <div className="mt-4 text-[11px] text-gray-500">
          Connected database updates trigger immediate browser-side reactive subscriptions without server restart.
        </div>
      </div>
    </div>
  );
}
