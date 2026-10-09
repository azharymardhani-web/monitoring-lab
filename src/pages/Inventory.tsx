import React, { useState } from 'react';
import { Monitor, Plus, Search, Filter, Download, QrCode, Trash2, Edit, X } from 'lucide-react';
import { Device } from '../types';

interface InventoryProps {
  devices: Device[];
  onAddDevice: (device: Device) => void;
  onUpdateDevice: (device: Device) => void;
  onDeleteDevice: (id: string) => void;
  onSelectDevice: (device: Device) => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  devices,
  onAddDevice,
  onUpdateDevice,
  onDeleteDevice,
  onSelectDevice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [deviceTypeTab, setDeviceTypeTab] = useState<'client' | 'server' | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    deviceName: `PC-${devices.length + 1}`,
    inventoryNumber: `INV/2026/LAB/${devices.length + 1}`,
    room: 'Laboratorium Komputer 1',
    row: 1,
    column: 1,
    positionIndex: devices.length + 1,
    brandModel: 'Lenovo ThinkCentre M720q',
    serialNumber: `SN-${Math.floor(Math.random() * 90000000 + 10000000)}`,
    processor: 'Intel Core i5-9400T',
    ramCapacity: '8 GB DDR4',
    storageType: 'SSD',
    storageCapacity: '256 GB',
    os: 'Windows 11 Pro',
    hostname: `LAB-MTN14-${devices.length + 1}`,
    ipAddress: `192.168.1.${100 + devices.length + 1}`,
    macAddress: '70:85:c2:34:56:79',
    acquisitionDate: '2025-01-15',
    physicalCondition: 'Baik',
    softwareCondition: 'Normal',
    status: 'normal',
    connectionStatus: 'online',
  });

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.inventoryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.ipAddress.includes(searchTerm);
    const matchesCondition = conditionFilter === 'all' || d.status === conditionFilter;
    const matchesType = deviceTypeTab === 'all' ? true : deviceTypeTab === 'server' ? d.isServer : !d.isServer;
    return matchesSearch && matchesCondition && matchesType;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `dev-${Date.now()}`;
    const now = new Date().toISOString();
    const created: Device = {
      id,
      deviceName: newDevice.deviceName || 'PC-NEW',
      inventoryNumber: newDevice.inventoryNumber || 'INV/2026/NEW',
      room: newDevice.room || 'Laboratorium Komputer 1',
      row: Number(newDevice.row) || 1,
      column: Number(newDevice.column) || 1,
      positionIndex: Number(newDevice.positionIndex) || 1,
      brandModel: newDevice.brandModel || 'Lenovo',
      serialNumber: newDevice.serialNumber || 'SN-0000',
      processor: newDevice.processor || 'Intel Core i5',
      ramCapacity: newDevice.ramCapacity || '8 GB',
      storageType: newDevice.storageType || 'SSD',
      storageCapacity: newDevice.storageCapacity || '256 GB',
      os: newDevice.os || 'Windows 11',
      hostname: newDevice.hostname || 'PC',
      ipAddress: newDevice.ipAddress || '192.168.1.200',
      macAddress: newDevice.macAddress || '70:85:c2:00:00:00',
      acquisitionDate: newDevice.acquisitionDate || '2025-01-01',
      physicalCondition: newDevice.physicalCondition || 'Baik',
      softwareCondition: newDevice.softwareCondition || 'Normal',
      status: newDevice.status || 'normal',
      connectionStatus: newDevice.connectionStatus || 'online',
      isServer: newDevice.isServer || false,
      serverRole: newDevice.serverRole,
      notes: newDevice.notes || '',
      createdAt: now,
      updatedAt: now,
    };
    onAddDevice(created);
    setShowAddModal(false);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Nama PC', 'No Inventaris', 'Model', 'Serial Number', 'IP Address', 'Status', 'Catatan'];
    const rows = filteredDevices.map(d => [
      d.id,
      d.deviceName,
      d.inventoryNumber,
      d.brandModel,
      d.serialNumber,
      d.ipAddress,
      d.status,
      `"${d.notes?.replace(/"/g, '""') || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inventaris_lab_pc_mtsn14.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manajemen Inventaris Perangkat Komputer</h2>
          <p className="text-xs text-slate-500">
            Daftar lengkap perangkat keras, spesifikasi, nomor inventaris, dan kondisi fisik laboratorium.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Perangkat</span>
          </button>
        </div>
      </div>

      {/* Device Type Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-xs w-fit">
        <button
          onClick={() => setDeviceTypeTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            deviceTypeTab === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua Perangkat ({devices.length})
        </button>
        <button
          onClick={() => setDeviceTypeTab('client')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            deviceTypeTab === 'client' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          PC Client ({devices.filter(d => !d.isServer).length})
        </button>
        <button
          onClick={() => setDeviceTypeTab('server')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            deviceTypeTab === 'server' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Komputer Server ({devices.filter(d => d.isServer).length})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nomor inventaris, serial, IP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={conditionFilter}
          onChange={e => setConditionFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="all">Semua Kondisi</option>
          <option value="normal">Normal</option>
          <option value="needs_inspection">Perlu Pemeriksaan</option>
          <option value="critical">Bermasalah</option>
          <option value="maintenance">Dalam Perbaikan</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3">Perangkat</th>
                <th className="px-6 py-3">No. Inventaris</th>
                <th className="px-6 py-3">Model & Prosesor</th>
                <th className="px-6 py-3">RAM / Storage</th>
                <th className="px-6 py-3">Serial Number</th>
                <th className="px-6 py-3">IP Address</th>
                <th className="px-6 py-3">Kondisi</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDevices.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      <span>{d.deviceName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{d.inventoryNumber}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{d.brandModel}</p>
                    <p className="text-[11px] text-slate-500">{d.processor}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{d.ramCapacity}</p>
                    <p className="text-[11px] text-slate-500">{d.storageType} {d.storageCapacity}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">{d.serialNumber}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{d.ipAddress}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      d.status === 'normal' ? 'bg-emerald-100 text-emerald-800' :
                      d.status === 'needs_inspection' ? 'bg-amber-100 text-amber-800' :
                      d.status === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => onSelectDevice(d)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => onDeleteDevice(d.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Tambah Perangkat Komputer Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Tipe Perangkat</label>
                  <select
                    value={newDevice.isServer ? 'server' : 'client'}
                    onChange={e => {
                      const isServer = e.target.value === 'server';
                      setNewDevice({ ...newDevice, isServer, serverRole: isServer ? 'Server Lokal' : undefined });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="client">Client PC</option>
                    <option value="server">Komputer Server</option>
                  </select>
                </div>
                {newDevice.isServer && (
                  <div>
                    <label className="block text-slate-500 mb-1">Peran Server</label>
                    <select
                      value={newDevice.serverRole || 'Server Lokal'}
                      onChange={e => setNewDevice({ ...newDevice, serverRole: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Server Utama (Exambrowser)">Server Utama (Exambrowser)</option>
                      <option value="Server Proktor">Server Proktor</option>
                      <option value="Server Lokal">Server Lokal</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-slate-500 mb-1">Nama Perangkat</label>
                  <input
                    type="text"
                    value={newDevice.deviceName || ''}
                    onChange={e => setNewDevice({ ...newDevice, deviceName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Nomor Inventaris</label>
                  <input
                    type="text"
                    value={newDevice.inventoryNumber || ''}
                    onChange={e => setNewDevice({...newDevice, inventoryNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Model / Merek</label>
                  <input
                    type="text"
                    value={newDevice.brandModel || ''}
                    onChange={e => setNewDevice({...newDevice, brandModel: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={newDevice.serialNumber || ''}
                    onChange={e => setNewDevice({...newDevice, serialNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Prosesor (CPU)</label>
                  <input
                    type="text"
                    value={newDevice.processor || ''}
                    onChange={e => setNewDevice({...newDevice, processor: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Kapasitas RAM</label>
                  <input
                    type="text"
                    value={newDevice.ramCapacity || ''}
                    onChange={e => setNewDevice({...newDevice, ramCapacity: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Penyimpanan (Storage)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newDevice.storageType || ''}
                      onChange={e => setNewDevice({...newDevice, storageType: e.target.value})}
                      className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      placeholder="SSD / HDD"
                      required
                    />
                    <input
                      type="text"
                      value={newDevice.storageCapacity || ''}
                      onChange={e => setNewDevice({...newDevice, storageCapacity: e.target.value})}
                      className="w-2/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      placeholder="256 GB"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">IP Address</label>
                  <input
                    type="text"
                    value={newDevice.ipAddress || ''}
                    onChange={e => setNewDevice({...newDevice, ipAddress: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                {!newDevice.isServer && (
                  <div>
                    <label className="block text-slate-500 mb-1">Posisi Index (1-32)</label>
                    <input
                      type="number"
                      min="1"
                      max="32"
                      value={newDevice.positionIndex || ''}
                      onChange={e => setNewDevice({...newDevice, positionIndex: e.target.value === '' ? undefined : Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      placeholder="Masukkan angka..."
                      required
                    />
                  </div>
                )}
                <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 mb-1">Sistem Operasi (OS)</label>
                    <input
                      type="text"
                      value={newDevice.os || ''}
                      onChange={e => setNewDevice({...newDevice, os: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      placeholder="Contoh: Windows 11 Pro"
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 mb-1">Catatan</label>
                  <input
                    type="text"
                    value={newDevice.notes || ''}
                    onChange={e => setNewDevice({...newDevice, notes: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20"
                >
                  Simpan Perangkat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
