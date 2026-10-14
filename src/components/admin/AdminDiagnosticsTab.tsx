'use client';

import React, { useState } from 'react';
import { checkFirebaseConnection } from '@/lib/firebase/firestore';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not configured';
const APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'not configured';
const AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'not configured';

export function AdminDiagnosticsTab() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    projectId?: string;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await checkFirebaseConnection();
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-white mb-1">Live Firebase Architecture Diagnostics</h2>
          <p className="text-[13px] text-gray-400">
            Real-time connection verification and operational metrics for Cloud Firestore.
          </p>
        </div>
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testing}
          className="px-4 py-2.5 rounded-[8px] bg-amber-500 hover:bg-amber-400 text-black font-bold text-[13px] transition-all cursor-pointer shadow-md disabled:opacity-50 shrink-0"
        >
          {testing ? 'Testing Live Connection...' : '⚡ Probe Live Firestore'}
        </button>
      </div>

      {testResult && (
        <div
          className={`p-4 rounded-[12px] border text-[13px] flex items-center gap-3 ${
            testResult.connected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <span className="text-[18px]">{testResult.connected ? '✓' : '⚠️'}</span>
          <div>
            <div className="font-semibold">{testResult.message}</div>
            {testResult.latencyMs !== undefined && (
              <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                Round-trip query latency: {testResult.latencyMs}ms
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-[12px] bg-white/[0.02] border border-white/10">
          <div className="text-[13px] font-bold text-amber-400 mb-2">Cloud Firestore Database</div>
          <div className="space-y-1.5 font-mono text-[12px] text-gray-300">
            <div>Project ID: {PROJECT_ID}</div>
            <div>Database Mode: Native Cloud Firestore</div>
            <div>
              Status:{' '}
              {testResult ? (
                <span className={testResult.connected ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {testResult.connected ? 'CONNECTED' : 'UNREACHABLE'}
                </span>
              ) : (
                <span className="text-gray-400">Not tested yet</span>
              )}
            </div>
            <div>Security Rules: firestore.rules (Role-Based Protected)</div>
          </div>
        </div>

        <div className="p-4 rounded-[12px] bg-white/[0.02] border border-white/10">
          <div className="text-[13px] font-bold text-blue-400 mb-2">Project Credentials</div>
          <div className="space-y-1.5 font-mono text-[12px] text-gray-300">
            <div>Project ID: {PROJECT_ID}</div>
            <div>App ID: {APP_ID}</div>
            <div>Auth Domain: {AUTH_DOMAIN}</div>
            <div>Client Auth: Active on AuthContext</div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-[12px] bg-amber-500/10 border border-amber-500/20 text-[13px] text-amber-200">
        📌 <strong>Live Seeding CLI Commands:</strong>
        <br />
        • Seed Cloud Firestore with Admin Role:{' '}
        <code className="bg-black/40 px-2 py-0.5 rounded text-white font-mono">
          npm run firebase:seed:firestore
        </code>
      </div>
    </div>
  );
}
