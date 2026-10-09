import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle2, Clock, AlertOctagon, X, Search } from 'lucide-react';
import { FaultTicket, Device } from '../types';

interface TicketsProps {
  tickets: FaultTicket[];
  devices: Device[];
  onAddTicket: (ticket: FaultTicket) => void;
  onUpdateTicket: (ticket: FaultTicket) => void;
}

export const Tickets: React.FC<TicketsProps> = ({ tickets, devices, onAddTicket, onUpdateTicket }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<FaultTicket | null>(null);

  const [newForm, setNewForm] = useState({
    deviceId: devices[0]?.id || '',
    category: 'Hardware' as FaultTicket['category'],
    priority: 'Sedang' as FaultTicket['priority'],
    description: '',
    reporter: 'Ahmad Fauzi (Guru TIK)',
  });

  const filteredTickets = tickets.filter(t =>
    t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dev = devices.find(d => d.id === newForm.deviceId);
    const id = `tkt-${Date.now()}`;
    const ticketNumber = `TKT-2026-${String(tickets.length + 1).padStart(3, '0')}`;
    const created: FaultTicket = {
      id,
      ticketNumber,
      deviceId: newForm.deviceId,
      deviceName: dev?.deviceName || 'PC-01',
      reportedAt: new Date().toISOString(),
      reporter: newForm.reporter,
      category: newForm.category,
      priority: newForm.priority,
      description: newForm.description,
      status: 'Baru',
    };
    onAddTicket(created);
    setShowAddModal(false);
    setNewForm({
      deviceId: devices[0]?.id || '',
      category: 'Hardware',
      priority: 'Sedang',
      description: '',
      reporter: 'Ahmad Fauzi (Guru TIK)',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manajemen Laporan Kerusakan & Tiket Perbaikan</h2>
          <p className="text-xs text-slate-500">
            Pencatatan tiket gangguan perangkat, diagnosis teknisi, suku cadang, dan status perbaikan.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tiket Kerusakan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nomor tiket, nama PC, keluhan..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map(t => (
          <div
            key={t.id}
            onClick={() => setSelectedTicket(t)}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-blue-600 font-mono">{t.ticketNumber}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  t.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                  t.status === 'Dalam Perbaikan' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {t.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{t.deviceName} — <span className="text-slate-600 font-normal">{t.category}</span></h3>
              <p className="text-xs text-slate-600 line-clamp-2">{t.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{t.reporter}</span>
              <span className="font-semibold text-slate-700">{new Date(t.reportedAt).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Buat Tiket Kerusakan Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Perangkat</label>
                <select
                  value={newForm.deviceId}
                  onChange={e => setNewForm({...newForm, deviceId: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.deviceName} ({d.inventoryNumber})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Kategori</label>
                  <select
                    value={newForm.category}
                    onChange={e => setNewForm({...newForm, category: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Jaringan">Jaringan</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Keyboard/Mouse">Keyboard/Mouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Prioritas</label>
                  <select
                    value={newForm.priority}
                    onChange={e => setNewForm({...newForm, priority: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Kritis">Kritis</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Deskripsi Masalah</label>
                <textarea
                  rows={3}
                  value={newForm.description}
                  onChange={e => setNewForm({...newForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Jelaskan kendala kerusakan secara detail..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20"
                >
                  Kirim Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Detail / Update Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedTicket.ticketNumber} — {selectedTicket.deviceName}</h3>
                <p className="text-xs text-slate-500">{selectedTicket.category} | Pelapor: {selectedTicket.reporter}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-700 mb-1">Keluhan:</p>
                <p className="text-slate-600">{selectedTicket.description}</p>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Status Penanganan</label>
                <select
                  value={selectedTicket.status}
                  onChange={e => setSelectedTicket({...selectedTicket, status: e.target.value as any})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Baru">Baru</option>
                  <option value="Sedang Diperiksa">Sedang Diperiksa</option>
                  <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                  <option value="Menunggu Suku Cadang">Menunggu Suku Cadang</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Tidak Dapat Diperbaiki">Tidak Dapat Diperbaiki</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Diagnosis Teknisi</label>
                <input
                  type="text"
                  value={selectedTicket.diagnosis || ''}
                  onChange={e => setSelectedTicket({...selectedTicket, diagnosis: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Hasil pemeriksaan teknisi..."
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Tindakan Perbaikan</label>
                <input
                  type="text"
                  value={selectedTicket.actionTaken || ''}
                  onChange={e => setSelectedTicket({...selectedTicket, actionTaken: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Tindakan yang telah dilakukan..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-slate-600 font-semibold text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onUpdateTicket(selectedTicket);
                  setSelectedTicket(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20"
              >
                Simpan Perubahan Tiket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
