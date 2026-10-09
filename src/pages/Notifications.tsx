import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, AlertOctagon, Check } from 'lucide-react';
import { SystemNotification } from '../types';

interface NotificationsProps {
  notifications: SystemNotification[];
  onMarkAllAsRead: () => void;
  onToggleRead: (id: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onMarkAllAsRead,
  onToggleRead,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pusat Notifikasi & Peringatan Sistem</h2>
          <p className="text-xs text-slate-500">
            Riwayat peringatan otomatis offline, CPU tinggi, RAM berlebih, dan pemberitahuan penting laboratorium.
          </p>
        </div>
        <button
          onClick={onMarkAllAsRead}
          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>Tandai Semua Sudah Dibaca</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada notifikasi saat ini.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => onToggleRead(n.id)}
              className={`p-5 flex items-start space-x-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                !n.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="mt-0.5">
                {n.type === 'alert' && <AlertOctagon className="w-6 h-6 text-rose-500" />}
                {n.type === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-500" />}
                {n.type === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                {n.type === 'info' && <Info className="w-6 h-6 text-blue-500" />}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                    {n.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(n.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
