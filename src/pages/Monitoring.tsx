import React, { useState } from 'react';
import { Activity, Cpu, HardDrive, Wifi, WifiOff, Search, Filter, ShieldCheck, RefreshCw } from 'lucide-react';
import { Device, DeviceMetric } from '../types';

interface MonitoringProps {
  devices: Device[];
  metrics: Record<string, DeviceMetric>;
  onSelectDevice: (device: Device) => void;
  onRefreshMetrics: () => void;
}

export const Monitoring: React.FC<MonitoringProps> = ({
  devices,
  metrics,
  onSelectDevice,
  onRefreshMetrics,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.ipAddress.includes(searchTerm) ||
                          d.hostname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.connectionStatus === statusFilter || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Monitoring Kondisi & Telemetri PC</h2>
          <p className="text-xs text-slate-500">
            Pemantauan penggunaan CPU, RAM, disk, suhu, dan heartbeat agent secara real-time.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefreshMetrics}
            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Simulasi Refresh Telemetri</span>
          </button>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tabel
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Grid Kartu
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama PC, IP address, hostname..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="all">Semua Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="normal">Normal</option>
          <option value="critical">Bermasalah</option>
        </select>
      </div>

      {/* View Mode: Table */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">Perangkat</th>
                  <th className="px-6 py-3">Koneksi</th>
                  <th className="px-6 py-3">CPU Usage</th>
                  <th className="px-6 py-3">RAM Usage</th>
                  <th className="px-6 py-3">Disk Usage</th>
                  <th className="px-6 py-3">Suhu CPU</th>
                  <th className="px-6 py-3">IP Address</th>
                  <th className="px-6 py-3">Heartbeat</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map(d => {
                  const m = metrics[d.id];
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          <span>{d.deviceName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          d.connectionStatus === 'online' ? 'bg-emerald-100 text-emerald-800' :
                          d.connectionStatus === 'offline' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {d.connectionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">
                        {m ? `${m.cpuUsage}%` : '—'}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">
                        {m ? `${m.memoryUsage}%` : '—'}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">
                        {m ? `${m.diskUsage}%` : '—'}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">
                        {m && m.temperature ? `${m.temperature}°C` : '—'}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">{d.ipAddress}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {m ? new Date(m.lastHeartbeat).toLocaleTimeString('id-ID') : 'Belum Ada'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onSelectDevice(d)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDevices.map(d => {
            const m = metrics[d.id];
            return (
              <div
                key={d.id}
                onClick={() => onSelectDevice(d)}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{d.deviceName}</h3>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    d.connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                </div>
                {m ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>CPU Usage</span>
                        <span className="font-bold text-slate-800">{m.cpuUsage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${m.cpuUsage}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>RAM Usage</span>
                        <span className="font-bold text-slate-800">{m.memoryUsage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${m.memoryUsage}%` }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">Telemetri tidak tersedia (Offline)</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
