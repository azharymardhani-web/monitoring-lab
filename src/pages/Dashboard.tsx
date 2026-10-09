import React from 'react';
import { 
  Monitor, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Wrench, 
  WifiOff, 
  Activity,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { Device, DeviceMetric, FaultTicket, SystemNotification } from '../types';

interface DashboardProps {
  devices: Device[];
  metrics: Record<string, DeviceMetric>;
  tickets: FaultTicket[];
  notifications: SystemNotification[];
  onNavigate: (tab: string) => void;
  onSelectDevice: (device: Device) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  devices,
  metrics,
  tickets,
  notifications,
  onNavigate,
  onSelectDevice,
}) => {
  const total = devices.length;
  const online = devices.filter(d => d.connectionStatus === 'online').length;
  const offline = devices.filter(d => d.connectionStatus === 'offline').length;
  const normal = devices.filter(d => d.status === 'normal').length;
  const needsInspection = devices.filter(d => d.status === 'needs_inspection').length;
  const critical = devices.filter(d => d.status === 'critical').length;
  const maintenance = devices.filter(d => d.status === 'maintenance').length;
  const notConnected = devices.filter(d => d.connectionStatus === 'not_connected').length;

  const activeTickets = tickets.filter(t => t.status !== 'Selesai');
  const recentNotifications = notifications.slice(0, 5);

  const stats = [
    { label: 'Total PC Terdaftar', value: total, icon: Monitor, color: 'bg-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'PC Online', value: online, icon: CheckCircle2, color: 'bg-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'PC Offline', value: offline, icon: WifiOff, color: 'bg-slate-600', text: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Kondisi Normal', value: normal, icon: CheckCircle2, color: 'bg-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Perlu Pemeriksaan', value: needsInspection, icon: AlertTriangle, color: 'bg-amber-600', text: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'PC Bermasalah', value: critical, icon: AlertOctagon, color: 'bg-rose-600', text: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Dalam Perbaikan', value: maintenance, icon: Wrench, color: 'bg-purple-600', text: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Belum Terhubung Agent', value: notConnected, icon: Activity, color: 'bg-slate-500', text: 'text-slate-500', bg: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider bg-blue-600/40 px-3 py-1 rounded-full font-bold border border-blue-400/30">
            MTs Negeri 14 Jakarta
          </span>
          <h2 className="text-2xl font-black mt-2">LAB PC MONITORING SYSTEM</h2>
          <p className="text-sm text-blue-200 mt-1">
            Sistem pemantauan kondisi perangkat, inventaris, dan manajemen tiket pemeliharaan laboratorium komputer secara real-time.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => onNavigate('map')}
            className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center space-x-2"
          >
            <span>Buka Peta Lab (8×4)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center font-bold`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid section: Problems & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical / Inspection Devices */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Perangkat Perlu Perhatian / Bermasalah</span>
            </h3>
            <button
              onClick={() => onNavigate('monitoring')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-72">
            {devices.filter(d => d.status !== 'normal').length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Semua perangkat dalam kondisi normal.</p>
            ) : (
              devices.filter(d => d.status !== 'normal').map(d => (
                <div
                  key={d.id}
                  onClick={() => onSelectDevice(d)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                      {d.deviceName.replace('PC-', '')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{d.deviceName} ({d.inventoryNumber})</p>
                      <p className="text-[11px] text-slate-500">{d.notes || d.brandModel}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                    d.status === 'critical' ? 'bg-rose-100 text-rose-800' :
                    d.status === 'needs_inspection' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {d.status === 'critical' ? 'Bermasalah' : d.status === 'needs_inspection' ? 'Perlu Cek' : 'Perbaikan'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>Tiket Kerusakan Aktif</span>
            </h3>
            <button
              onClick={() => onNavigate('tickets')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Kelola Tiket
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-72">
            {activeTickets.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Tidak ada tiket kerusakan aktif.</p>
            ) : (
              activeTickets.map(t => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600">{t.ticketNumber} — {t.deviceName}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">{t.status}</span>
                  </div>
                  <p className="text-xs text-slate-700 truncate">{t.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
