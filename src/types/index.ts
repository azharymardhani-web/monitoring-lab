export type DeviceCondition = 'normal' | 'needs_inspection' | 'critical' | 'maintenance';
export type ConnectionStatus = 'online' | 'offline' | 'not_connected';

export interface Device {
  id: string; // e.g., 'dev-01'
  deviceName: string; // e.g., 'LAB-PC-01'
  inventoryNumber: string; // e.g., 'INV/2026/LAB/001'
  room: string; // e.g., 'Lab Komputer 1'
  row: number; // 1 to 4
  column: number; // 1 to 8
  positionIndex: number; // 1 to 32
  brandModel: string; // e.g., 'Lenovo ThinkCentre M720q'
  serialNumber: string; // e.g., 'SN-883920192'
  processor: string; // e.g., 'Intel Core i5-9400T'
  ramCapacity: string; // e.g., '8 GB DDR4'
  storageType: string; // e.g., 'SSD NVMe'
  storageCapacity: string; // e.g., '256 GB'
  os: string; // e.g., 'Windows 11 Pro 64-bit'
  hostname: string; // e.g., 'LABPC-01'
  ipAddress: string; // e.g., '192.168.1.101'
  macAddress: string; // e.g., '70:85:c2:34:56:78'
  acquisitionDate: string; // e.g., '2025-01-15'
  physicalCondition: 'Baik' | 'Ringan' | 'Sedang' | 'Rusak Berat';
  mouseCondition: 'Baik' | 'Ringan' | 'Sedang' | 'Rusak Berat';
  keyboardCondition: 'Baik' | 'Ringan' | 'Sedang' | 'Rusak Berat';
  softwareCondition: 'Normal' | 'Perlu Update' | 'Corrupt';
  status: DeviceCondition;
  connectionStatus: ConnectionStatus;
  photoUrl?: string;
  notes?: string;
  isServer?: boolean;
  serverRole?: 'Server Utama (Exambrowser)' | 'Server Proktor' | 'Server Lokal';
  createdAt: string;
  updatedAt: string;
}

export interface DeviceMetric {
  deviceId: string;
  timestamp: string;
  cpuUsage: number; // percentage 0-100
  memoryUsage: number; // percentage 0-100
  diskUsage: number; // percentage 0-100
  diskFreeGB: number;
  temperature?: number; // Celsius
  uptimeSeconds?: number;
  agentVersion: string;
  lastHeartbeat: string;
}

export type TicketCategory = 'Hardware' | 'Software' | 'Sistem Operasi' | 'Jaringan' | 'Monitor' | 'Keyboard/Mouse' | 'RAM' | 'Penyimpanan' | 'Kelistrikan' | 'Lainnya';
export type TicketPriority = 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
export type TicketStatus = 'Baru' | 'Sedang Diperiksa' | 'Dalam Perbaikan' | 'Menunggu Suku Cadang' | 'Selesai' | 'Tidak Dapat Diperbaiki';

export interface FaultTicket {
  id: string;
  ticketNumber: string; // e.g., 'TKT-2026-001'
  deviceId: string;
  deviceName: string;
  reportedAt: string;
  reporter: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  photoUrl?: string;
  technician?: string;
  status: TicketStatus;
  diagnosis?: string;
  actionTaken?: string;
  spareParts?: string;
  repairCost?: number;
  completedAt?: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  scheduleId?: string;
  title: string;
  date: string;
  technician: string;
  category: 'Rutins Bulanan' | 'Pembersihan Fisik' | 'Update Software' | 'Kabel & Jaringan' | 'Kelistrikan';
  targetDevices: string[]; // 'all' or device IDs
  completedDevices: string[];
  notes: string;
  status: 'Dijadwalkan' | 'Berlangsung' | 'Selesai';
  checklist: {
    item: string;
    checked: boolean;
  }[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  deviceId?: string;
  actionRequired?: boolean;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Kepala Laboratorium' | 'Teknisi' | 'Operator/Guru';
  status: 'Aktif' | 'Nonaktif';
  lastLogin: string;
  password?: string;
}

export interface SystemSettings {
  institutionName: string;
  labName: string;
  totalPositions: number;
  columns: number;
  rows: number;
  cpuThreshold: number; // e.g., 85%
  ramThreshold: number; // e.g., 90%
  diskThreshold: number; // e.g., 90%
  offlineTimeoutMinutes: number; // e.g., 5 mins
  heartbeatIntervalSeconds: number; // e.g., 30 secs
  autoSimulation: boolean;
  labHeadName: string;
  technicianName: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}
