import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Terminal, Download, Code, Trash2, AlertTriangle } from 'lucide-react';
import { SystemSettings, SystemUser } from '../types';

interface SettingsProps {
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
  currentUser: SystemUser;
  onResetData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSaveSettings, currentUser, onResetData }) => {
  const [form, setForm] = useState<SystemSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'agent' | 'danger'>('config');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const pythonAgentCode = `"""
LAB PC MONITORING SYSTEM - WINDOWS AGENT
MTs Negeri 14 Jakarta
Author: IT Infrastructure Team
Description: Lightweight background agent that collects CPU, RAM, disk, and heartbeat metrics
and sends them securely to the monitoring backend via HTTPS.
"""

import time
import requests
import psutil
import socket
import json

SERVER_URL = "https://your-backend-endpoint.run.app/api/telemetry"
DEVICE_ID = "dev-01"  # Unique PC ID registered in inventory
API_KEY = "your-agent-secret-key"
INTERVAL_SECONDS = 30

def collect_and_send():
    while True:
        try:
            cpu = psutil.cpu_percent(interval=1)
            mem = psutil.virtual_memory().percent
            disk = psutil.disk_usage('C:\\')
            
            payload = {
                "deviceId": DEVICE_ID,
                "cpuUsage": cpu,
                "memoryUsage": mem,
                "diskUsage": disk.percent,
                "diskFreeGB": round(disk.free / (1024**3), 2),
                "hostname": socket.gethostname(),
                "ipAddress": socket.gethostbyname(socket.gethostname()),
                "agentVersion": "v2.4.1"
            }
            
            headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
            response = requests.post(SERVER_URL, json=payload, headers=headers, timeout=10)
            if response.status_code == 200:
                print(f"[SUCCESS] Heartbeat sent for {DEVICE_ID} - CPU: {cpu}% RAM: {mem}%")
            else:
                print(f"[WARNING] Server responded with code {response.status_code}")
        except Exception as e:
            print(f"[ERROR] Failed to send telemetry: {e}")
            
        time.sleep(INTERVAL_SECONDS)

if __name__ == "__main__":
    print("Starting LAB PC Monitoring Windows Agent...")
    collect_and_send()
`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pengaturan Sistem & Windows Agent</h2>
          <p className="text-xs text-slate-500">
            Konfigurasi ambang batas peringatan, waktu timeout, dan kode program agent monitoring PC Windows.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'config' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Konfigurasi
          </button>
          <button
            onClick={() => setActiveTab('agent')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'agent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Script Agent Windows
          </button>
          {currentUser.role === 'Super Admin' && (
            <button
              onClick={() => setActiveTab('danger')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'danger' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              Zona Bahaya
            </button>
          )}
        </div>
      </div>

      {activeTab === 'config' ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Institusi</label>
              <input
                type="text"
                value={form.institutionName}
                onChange={e => setForm({...form, institutionName: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Laboratorium</label>
              <input
                type="text"
                value={form.labName}
                onChange={e => setForm({...form, labName: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ambang Batas Peringatan CPU (%)</label>
              <input
                type="number"
                value={form.cpuThreshold}
                onChange={e => setForm({...form, cpuThreshold: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ambang Batas Peringatan RAM (%)</label>
              <input
                type="number"
                value={form.ramThreshold}
                onChange={e => setForm({...form, ramThreshold: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Timeout Deteksi Offline (Menit)</label>
              <input
                type="number"
                value={form.offlineTimeoutMinutes}
                onChange={e => setForm({...form, offlineTimeoutMinutes: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Interval Heartbeat Agent (Detik)</label>
              <input
                type="number"
                value={form.heartbeatIntervalSeconds}
                onChange={e => setForm({...form, heartbeatIntervalSeconds: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kepala Laboratorium (Tanda Tangan)</label>
              <input
                type="text"
                value={form.labHeadName}
                onChange={e => setForm({...form, labHeadName: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Teknisi Laboratorium (Tanda Tangan)</label>
              <input
                type="text"
                value={form.technicianName}
                onChange={e => setForm({...form, technicianName: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {saved && <span className="text-emerald-600 font-bold text-xs">Pengaturan berhasil disimpan!</span>}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      ) : activeTab === 'agent' ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm">Windows Monitoring Agent (Python Source Code)</h3>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([pythonAgentCode], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'monitor_agent.py';
                a.click();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Unduh file monitor_agent.py</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Instal script ini sebagai Windows Service atau Startup script pada setiap PC laboratorium menggunakan Python 3.x dan library <code className="text-blue-300">psutil</code> & <code className="text-blue-300">requests</code>.
          </p>
          <pre className="bg-slate-950 p-4 rounded-xl text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800">
            {pythonAgentCode}
          </pre>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 text-rose-600">
            <AlertTriangle className="w-8 h-8" />
            <h3 className="text-xl font-black">Zona Bahaya (Super Admin Only)</h3>
          </div>
          <p className="text-sm text-slate-600">
            Tindakan ini tidak dapat dibatalkan. Menghapus semua data sistem akan menghapus seluruh data inventaris, tiket, log, dan konfigurasi saat ini.
          </p>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Semua Data Sistem</span>
          </button>
        </div>
      )}

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Seluruh Data?</h3>
            <p className="text-sm text-slate-600">
              Apakah Anda yakin? Seluruh data sistem akan dihapus dan aplikasi akan dimuat ulang.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetData();
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-lg shadow-rose-600/20"
              >
                Ya, Hapus Semua Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
