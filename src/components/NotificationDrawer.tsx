import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { SystemNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllAsRead: () => void;
  onToggleRead: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onToggleRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'alert':
        return <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-base">Pusat Notifikasi & Peringatan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white text-xs">
          <span className="text-slate-500 font-medium">
            {notifications.filter(n => !n.read).length} belum dibaca
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Tandai Semua Dibaca
          </button>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Tidak ada notifikasi saat ini.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onToggleRead(notif.id)}
                className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 flex items-start space-x-3 ${
                  !notif.read ? 'bg-blue-50/40' : ''
                }`}
              >
                {getIcon(notif.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
