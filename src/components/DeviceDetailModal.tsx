import React, { useState } from 'react';
import { X, Monitor, Cpu, HardDrive, Wifi, ShieldAlert, CheckCircle, Clock, Wrench, QrCode } from 'lucide-react';
import { Device, DeviceMetric, FaultTicket, MaintenanceRecord } from '../types';

interface DeviceDetailModalProps {
  device: Device | null;
  metric?: DeviceMetric;
  tickets: FaultTicket[];
  maintenance: MaintenanceRecord[];
  onClose: () => void;
  onUpdateDevice: (updated: Device) => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  device,
  metric,
  tickets,
  maintenance,
  onClose,
  onUpdateDevice,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'telemetry' | 'tickets' | 'qr'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Device | null>(device);

  if (!device) return null;

  const deviceTickets = tickets.filter(t => t.deviceId === device.id);

  const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case 'normal':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Normal</span>;
      case 'needs_inspection':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">Perlu Pemeriksaan</span>;
      case 'critical':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">Bermasalah</span>;
      case 'maintenance':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">Dalam Perbaikan</span>;
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      onUpdateDevice({ ...editForm, updatedAt: new Date().toISOString() });
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold">{device.deviceName}</h2>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Posisi: R{device.row} C{device.column} (#{device.positionIndex})
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{device.inventoryNumber} | {device.hostname}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          {[
            { id: 'info', label: 'Spesifikasi & Detail' },
            { id: 'telemetry', label: 'Monitoring Real-time' },
            { id: 'tickets', label: `Tiket Kerusakan (${deviceTickets.length})` },
            { id: 'qr', label: 'QR Code Perangkat' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-xs text-slate-400">Status Kesehatan</p>
                    <div className="mt-1">{getStatusBadge(device.status)}</div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Koneksi Agent</p>
                    <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      device.connectionStatus === 'online' ? 'bg-emerald-100 text-emerald-800' :
                      device.connectionStatus === 'offline' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {device.connectionStatus === 'online' ? 'Online' : device.connectionStatus === 'offline' ? 'Offline' : 'Belum Terhubung'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditForm(device);
                    setIsEditing(!isEditing);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors"
                >
                  {isEditing ? 'Batal Edit' : 'Ubah Data'}
                </button>
              </div>

              {isEditing && editForm ? (
                <form onSubmit={handleSaveEdit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Edit Data & Spesifikasi Perangkat</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Nama Perangkat</label>
                      <input
                        type="text"
                        value={editForm.deviceName || ''}
                        onChange={e => setEditForm({...editForm, deviceName: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Nomor Inventaris</label>
                      <input
                        type="text"
                        value={editForm.inventoryNumber || ''}
                        onChange={e => setEditForm({...editForm, inventoryNumber: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Merek & Model</label>
                      <input
                        type="text"
                        value={editForm.brandModel || ''}
                        onChange={e => setEditForm({...editForm, brandModel: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Serial Number</label>
                      <input
                        type="text"
                        value={editForm.serialNumber || ''}
                        onChange={e => setEditForm({...editForm, serialNumber: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Prosesor (CPU)</label>
                      <input
                        type="text"
                        value={editForm.processor || ''}
                        onChange={e => setEditForm({...editForm, processor: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Kapasitas RAM</label>
                      <input
                        type="text"
                        value={editForm.ramCapacity || ''}
                        onChange={e => setEditForm({...editForm, ramCapacity: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Penyimpanan (Storage)</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editForm.storageType || ''}
                          onChange={e => setEditForm({...editForm, storageType: e.target.value})}
                          className="w-1/3 px-3 py-2 bg-white border border-slate-300 rounded-lg"
                          placeholder="SSD / HDD"
                        />
                        <input
                          type="text"
                          value={editForm.storageCapacity || ''}
                          onChange={e => setEditForm({...editForm, storageCapacity: e.target.value})}
                          className="w-2/3 px-3 py-2 bg-white border border-slate-300 rounded-lg"
                          placeholder="256 GB"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Sistem Operasi (OS)</label>
                      <input
                        type="text"
                        value={editForm.os || ''}
                        onChange={e => setEditForm({...editForm, os: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Kondisi Mouse</label>
                      <select
                        value={editForm.mouseCondition}
                        onChange={e => setEditForm({...editForm, mouseCondition: e.target.value as any})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value="Baik">Baik</option>
                        <option value="Ringan">Ringan</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Rusak Berat">Rusak Berat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Kondisi Keyboard</label>
                      <select
                        value={editForm.keyboardCondition}
                        onChange={e => setEditForm({...editForm, keyboardCondition: e.target.value as any})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value="Baik">Baik</option>
                        <option value="Ringan">Ringan</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Rusak Berat">Rusak Berat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Kondisi Kesehatan</label>
                      <select
                        value={editForm.status}
                        onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value="normal">Normal</option>
                        <option value="needs_inspection">Perlu Pemeriksaan</option>
                        <option value="critical">Bermasalah</option>
                        <option value="maintenance">Dalam Perbaikan</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 mb-1">Catatan</label>
                      <input
                        type="text"
                        value={editForm.notes || ''}
                        onChange={e => setEditForm({...editForm, notes: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Merek & Model</span>
                    <span className="font-semibold text-slate-800">{device.brandModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Nomor Seri</span>
                    <span className="font-semibold text-slate-800 font-mono">{device.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Prosesor</span>
                    <span className="font-semibold text-slate-800">{device.processor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Kapasitas RAM</span>
                    <span className="font-semibold text-slate-800">{device.ramCapacity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Penyimpanan</span>
                    <span className="font-semibold text-slate-800">{device.storageType} {device.storageCapacity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Sistem Operasi</span>
                    <span className="font-semibold text-slate-800">{device.os}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">IP / MAC Address</span>
                    <span className="font-semibold text-slate-800 font-mono">{device.ipAddress} / {device.macAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Catatan Tambahan</span>
                    <span className="font-semibold text-slate-800">{device.notes || '-'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              {metric ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-700">Penggunaan CPU</span>
                        <Cpu className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-2xl font-black text-blue-900">{metric.cpuUsage}%</p>
                      <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${metric.cpuUsage}%` }}></div>
                      </div>
                    </div>

                    <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-700">Penggunaan RAM</span>
                        <HardDrive className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-black text-emerald-900">{metric.memoryUsage}%</p>
                      <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${metric.memoryUsage}%` }}></div>
                      </div>
                    </div>

                    <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-700">Penggunaan Disk</span>
                        <HardDrive className="w-4 h-4 text-amber-600" />
                      </div>
                      <p className="text-2xl font-black text-amber-900">{metric.diskUsage}%</p>
                      <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: `${metric.diskUsage}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Suhu CPU:</span>
                      <span className="font-bold text-slate-800">{metric.temperature ? `${metric.temperature}°C` : 'Tidak Tersedia'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sisa Ruang Disk:</span>
                      <span className="font-bold text-slate-800">{metric.diskFreeGB} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Versi Agent:</span>
                      <span className="font-bold text-slate-800 font-mono">{metric.agentVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Heartbeat Terakhir:</span>
                      <span className="font-bold text-slate-800">{new Date(metric.lastHeartbeat).toLocaleTimeString('id-ID')} WIB</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Tidak ada data telemetri aktif untuk perangkat ini. (Agent belum terhubung atau offline)
                </div>
              )}
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-4">
              {deviceTickets.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Tidak ada tiket kerusakan yang tercatat untuk perangkat ini.
                </div>
              ) : (
                deviceTickets.map(t => (
                  <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600">{t.ticketNumber} ({t.category})</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        t.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-slate-700">{t.description}</p>
                    {t.diagnosis && <p className="text-slate-500 italic">Diagnosis: {t.diagnosis}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-48 h-48 mx-auto bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-white shadow-xl">
                <QrCode className="w-28 h-28 text-white mb-2" />
                <span className="text-xs font-mono font-bold">{device.deviceName}</span>
              </div>
              <p className="text-xs text-slate-500">
                Pindai QR code ini menggunakan aplikasi seluler petugas untuk verifikasi inventaris dan akses cepat detail perangkat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
