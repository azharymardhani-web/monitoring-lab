import React, { useState } from 'react';
import { CalendarCheck, Plus, CheckSquare, Square, Wrench, X } from 'lucide-react';
import { MaintenanceRecord } from '../types';

interface MaintenanceProps {
  maintenance: MaintenanceRecord[];
  onAddMaintenance: (record: MaintenanceRecord) => void;
  onUpdateMaintenance: (record: MaintenanceRecord) => void;
}

export const Maintenance: React.FC<MaintenanceProps> = ({ maintenance, onAddMaintenance, onUpdateMaintenance }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

  const [newForm, setNewForm] = useState({
    title: 'Pemeliharaan Rutin Lab Komputer 1',
    category: 'Rutins Bulanan' as MaintenanceRecord['category'],
    technician: 'Budi Santoso',
    notes: 'Pemeriksaan rutin perangkat keras dan kebersihan fisik lab.',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `maint-${Date.now()}`;
    const created: MaintenanceRecord = {
      id,
      title: newForm.title,
      date: new Date().toISOString().split('T')[0],
      technician: newForm.technician,
      category: newForm.category,
      targetDevices: ['all'],
      completedDevices: [],
      notes: newForm.notes,
      status: 'Dijadwalkan',
      checklist: [
        { item: 'Pembersihan debu kipas & casing', checked: false },
        { item: 'Pengecekan tegangan stop kontak & kabel power', checked: false },
        { item: 'Scan antivirus & update definisi', checked: false },
        { item: 'Pemeriksaan switch hub & kabel LAN', checked: false },
      ],
    };
    onAddMaintenance(created);
    setShowAddModal(false);
  };

  const toggleChecklist = (record: MaintenanceRecord, index: number) => {
    const updatedChecklist = [...record.checklist];
    updatedChecklist[index].checked = !updatedChecklist[index].checked;
    onUpdateMaintenance({ ...record, checklist: updatedChecklist });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Jadwal & Pemeliharaan Preventif (Maintenance)</h2>
          <p className="text-xs text-slate-500">
            Pemeriksaan berkala hardware, pembersihan fisik, pengecekan kelistrikan, dan pembaruan perangkat lunak.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Jadwal Pemeliharaan</span>
        </button>
      </div>

      {/* Maintenance List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {maintenance.map(rec => (
          <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 font-mono">{rec.date}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  rec.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                  rec.status === 'Berlangsung' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {rec.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{rec.title}</h3>
              <p className="text-xs text-slate-600">{rec.notes}</p>
              <p className="text-xs text-slate-400 font-medium">Teknisi: {rec.technician}</p>
            </div>

            {/* Checklist */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Checklist Pemeliharaan:</p>
              {rec.checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklist(rec, idx)}
                  className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-700 hover:text-slate-900"
                >
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={item.checked ? 'line-through text-slate-400' : ''}>{item.item}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  const newStatus = rec.status === 'Selesai' ? 'Berlangsung' : 'Selesai';
                  onUpdateMaintenance({ ...rec, status: newStatus });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  rec.status === 'Selesai' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
                }`}
              >
                {rec.status === 'Selesai' ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Maintenance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Buat Jadwal Pemeliharaan Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Judul Pemeliharaan</label>
                <input
                  type="text"
                  value={newForm.title}
                  onChange={e => setNewForm({...newForm, title: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Kategori</label>
                <select
                  value={newForm.category}
                  onChange={e => setNewForm({...newForm, category: e.target.value as any})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Rutins Bulanan">Rutin Bulanan</option>
                  <option value="Pembersihan Fisik">Pembersihan Fisik</option>
                  <option value="Update Software">Update Software</option>
                  <option value="Kabel & Jaringan">Kabel & Jaringan</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Teknisi Penanggung Jawab</label>
                <input
                  type="text"
                  value={newForm.technician}
                  onChange={e => setNewForm({...newForm, technician: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Catatan</label>
                <textarea
                  rows={3}
                  value={newForm.notes}
                  onChange={e => setNewForm({...newForm, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
