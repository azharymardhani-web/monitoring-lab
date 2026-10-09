import React, { useState } from 'react';
import { Monitor, Cpu, HardDrive, Wifi, WifiOff, AlertTriangle, AlertOctagon, Wrench, CheckCircle2 } from 'lucide-react';
import { Device, DeviceMetric } from '../types';

interface DeviceMapProps {
  devices: Device[];
  metrics: Record<string, DeviceMetric>;
  onSelectDevice: (device: Device) => void;
}

export const DeviceMap: React.FC<DeviceMapProps> = ({ devices, metrics, onSelectDevice }) => {
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [filterConnection, setFilterConnection] = useState<string>('all');

  // Build grid representation: 4 rows x 8 columns
  // Row 1 (Right to Left): PC-8 to PC-1
  // Row 2 (Left to Right): PC-9 to PC-16
  // Row 3 (Right to Left): PC-24 to PC-17
  // Row 4 (Left to Right): PC-25 to PC-32

  const getDeviceByPosition = (row: number, col: number): Device | undefined => {
    let targetIndex = 1;
    if (row === 1) {
      targetIndex = 9 - col; // col 1 is PC-8, col 8 is PC-1
    } else if (row === 2) {
      targetIndex = 8 + col; // col 1 is PC-9, col 8 is PC-16
    } else if (row === 3) {
      targetIndex = 25 - col; // col 1 is PC-24, col 8 is PC-17
    } else if (row === 4) {
      targetIndex = 24 + col; // col 1 is PC-25, col 8 is PC-32
    }
    return devices.find(d => d.positionIndex === targetIndex);
  };

  const getStatusColor = (d?: Device) => {
    if (!d) return 'bg-slate-100 border-slate-300 text-slate-400';
    if (d.connectionStatus === 'offline' || d.connectionStatus === 'not_connected') {
      return 'bg-slate-200 border-slate-300 text-slate-600';
    }
    switch (d.status) {
      case 'normal':
        return 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 shadow-emerald-500/10';
      case 'needs_inspection':
        return 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-amber-500/10';
      case 'critical':
        return 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100 shadow-rose-500/10';
      case 'maintenance':
        return 'bg-purple-50 border-purple-300 text-purple-900 hover:bg-purple-100 shadow-purple-500/10';
      default:
        return 'bg-white border-slate-200 text-slate-800';
    }
  };

  const filteredDevicesCount = devices.filter(d => {
    if (filterCondition !== 'all' && d.status !== filterCondition) return false;
    if (filterConnection !== 'all' && d.connectionStatus !== filterConnection) return false;
    return true;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Peta Posisi Komputer Laboratorium (Zigzag 8×4)</h2>
          <p className="text-xs text-slate-500">
            Tata letak fisik 32 PC laboratorium. PC-1 berada di pojok kanan depan, tersusun zigzag bolak-balik per baris.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterCondition}
            onChange={e => setFilterCondition(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">Semua Kondisi</option>
            <option value="normal">Normal</option>
            <option value="needs_inspection">Perlu Pemeriksaan</option>
            <option value="critical">Bermasalah</option>
            <option value="maintenance">Dalam Perbaikan</option>
          </select>
          <select
            value={filterConnection}
            onChange={e => setFilterConnection(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">Semua Koneksi</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="not_connected">Belum Terhubung</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between text-xs gap-3">
        <span className="font-bold text-slate-700">Legenda Status:</span>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Normal</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Perlu Pemeriksaan</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span>Bermasalah / Kritis</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          <span>Dalam Perbaikan</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-slate-300"></span>
          <span>Offline / Belum Terhubung</span>
        </div>
      </div>

      {/* Lab Room Layout Box */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 text-white space-y-6">
        {/* Top: Papan Tulis / Depan Lab */}
        <div className="text-center py-3 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-inner">
          <p className="text-xs uppercase tracking-widest font-black text-blue-400">DEPAN LAB / PAPAN TULIS / MEJA GURU</p>
        </div>

        {/* 4 Rows Grid */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((rowNum) => (
            <div key={rowNum} className="space-y-1">
              <div className="flex justify-between items-center text-[11px] text-blue-300 px-2 font-mono">
                <span>BARIS {rowNum}</span>
                <span>{rowNum === 1 ? 'Kanan ke Kiri (PC-8 s.d PC-1)' : rowNum === 2 ? 'Kiri ke Kanan (PC-9 s.d PC-16)' : rowNum === 3 ? 'Kanan ke Kiri (PC-24 s.d PC-17)' : 'Kiri ke Kanan (PC-25 s.d PC-32)'}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((colNum) => {
                  const device = getDeviceByPosition(rowNum, colNum);
                  const metric = device ? metrics[device.id] : undefined;
                  const isFilteredOut = device && (
                    (filterCondition !== 'all' && device.status !== filterCondition) ||
                    (filterConnection !== 'all' && device.connectionStatus !== filterConnection)
                  );

                  return (
                    <div
                      key={colNum}
                      onClick={() => device && onSelectDevice(device)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm relative group ${
                        getStatusColor(device)
                      } ${isFilteredOut ? 'opacity-30' : 'opacity-100 hover:scale-102 hover:shadow-lg'}`}
                    >
                      {device ? (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs tracking-tight">{device.deviceName}</span>
                            <span className={`w-2 h-2 rounded-full ${
                              device.connectionStatus === 'online' ? 'bg-emerald-500' :
                              device.connectionStatus === 'offline' ? 'bg-rose-500' : 'bg-slate-400'
                            }`} title={device.connectionStatus} />
                          </div>

                          <div className="my-1 space-y-1 text-[11px]">
                            <div className="flex justify-between text-slate-500 font-mono">
                              <span>Pos #{device.positionIndex}</span>
                              <span className="text-slate-700 font-bold">{metric ? `${metric.cpuUsage}% CPU` : '—'}</span>
                            </div>
                            <div className="flex justify-between text-slate-500 font-mono">
                              <span>RAM</span>
                              <span className="text-slate-700 font-bold">{metric ? `${metric.memoryUsage}%` : '—'}</span>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                            <span className="truncate">{device.ipAddress}</span>
                            <span className="font-bold text-blue-600 capitalize">{device.status === 'normal' ? 'Normal' : device.status === 'needs_inspection' ? 'Cek' : device.status === 'critical' ? 'Bermasalah' : 'Perbaikan'}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-6 text-slate-400 text-xs">
                          Kosong
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: Belakang Lab */}
        <div className="text-center py-3 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-inner">
          <p className="text-xs uppercase tracking-widest font-black text-slate-400">BELAKANG LAB / PINTU MASUK</p>
        </div>
      </div>
    </div>
  );
};
