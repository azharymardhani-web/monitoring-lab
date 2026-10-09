import React, { useState, useEffect } from 'react';
import { Bell, Shield, User, Clock, RefreshCw, ChevronDown } from 'lucide-react';
import { SystemUser } from '../types';

interface HeaderProps {
  currentUser: SystemUser;
  users: SystemUser[];
  onSwitchUser: (user: SystemUser) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onResetData: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  onSwitchUser,
  unreadCount,
  onOpenNotifications,
  onResetData,
  onOpenLogin,
  onLogout,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
      {/* Left: Lab status info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Lab Komputer 1 Aktif (32 PC)</span>
        </div>
        <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(currentTime)} | {formatTime(currentTime)} WIB</span>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center space-x-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={() => setShowResetConfirm(true)}
          title="Reset & Muat Ulang Data Demo"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1 text-xs font-medium border border-slate-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset Data</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          title="Pusat Notifikasi"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2.5 p-1.5 pl-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all text-left"
          >
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] font-medium text-blue-600">{currentUser.role}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akses & Keamanan Web</p>
                  <p className="text-[11px] text-slate-400">Login dengan password akun</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenLogin();
                  }}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700"
                >
                  Login / Ganti
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className={`px-4 py-2.5 flex items-center justify-between ${
                      u.id === currentUser.id ? 'bg-blue-50/70 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{u.name}</p>
                      <p className="text-[11px] text-blue-600 font-medium">{u.role}</p>
                    </div>
                    {u.id === currentUser.id && (
                      <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">Aktif</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  className="w-full py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors"
                >
                  Keluar (Logout)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Reset & Muat Ulang Data?</h3>
            <p className="text-sm text-slate-600">
              Tindakan ini akan mengembalikan seluruh data inventaris ke 32 PC default MTs Negeri 14 Jakarta beserta tiket dan log demo.
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
                Ya, Reset Sistem
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
