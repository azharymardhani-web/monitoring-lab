import { Device, FaultTicket, MaintenanceRecord, SystemNotification, SystemUser, SystemSettings } from '../types';

export const initialSettings: SystemSettings = {
  institutionName: 'MTs Negeri 14 Jakarta',
  labName: 'Laboratorium Komputer 1',
  totalPositions: 32,
  columns: 8,
  rows: 4,
  cpuThreshold: 85,
  ramThreshold: 90,
  diskThreshold: 90,
  offlineTimeoutMinutes: 5,
  heartbeatIntervalSeconds: 30,
  autoSimulation: true,
  labHeadName: 'Dr. H. Supriyadi, M.Pd.',
  technicianName: 'Budi Santoso, S.Kom.',
};

// Generate 32 seed PCs strictly following the 8x4 zigzag layout:
// Baris 1 (Right to Left): PC-8, PC-7, PC-6, PC-5, PC-4, PC-3, PC-2, PC-1 (col 1..8)
// Baris 2 (Left to Right): PC-9, PC-10, PC-11, PC-12, PC-13, PC-14, PC-15, PC-16 (col 1..8)
// Baris 3 (Right to Left): PC-24, PC-23, PC-22, PC-21, PC-20, PC-19, PC-18, PC-17 (col 1..8)
// Baris 4 (Left to Right): PC-25, PC-26, PC-27, PC-28, PC-29, PC-30, PC-31, PC-32 (col 1..8)
export function generateSeedDevices(): Device[] {
  const devices: Device[] = [];
  const now = new Date().toISOString();

  for (let i = 1; i <= 32; i++) {
    let row = 1;
    let col = 1;

    if (i >= 1 && i <= 8) {
      row = 1;
      col = 9 - i; // PC-1 is col 8, PC-8 is col 1
    } else if (i >= 9 && i <= 16) {
      row = 2;
      col = i - 8; // PC-9 is col 1, PC-16 is col 8
    } else if (i >= 17 && i <= 24) {
      row = 3;
      col = 25 - i; // PC-17 is col 8, PC-24 is col 1
    } else if (i >= 25 && i <= 32) {
      row = 4;
      col = i - 24; // PC-25 is col 1, PC-32 is col 8
    }

    const deviceName = `PC-${i < 10 ? '0' + i : i}`;
    const inventoryNumber = `INV/2026/LAB/${i < 10 ? '00' + i : i < 100 ? '0' + i : i}`;
    const serialNumber = `SN-MTN14-${2026}${i < 10 ? '00' + i : i}`;
    
    // Mix status for realistic demo dashboard
    let status: Device['status'] = 'normal';
    let connectionStatus: Device['connectionStatus'] = 'online';
    if (i === 3 || i === 14) {
      status = 'needs_inspection';
    } else if (i === 7) {
      status = 'critical';
      connectionStatus = 'offline';
    } else if (i === 22) {
      status = 'maintenance';
    } else if (i === 31 || i === 32) {
      connectionStatus = 'not_connected';
    }

    devices.push({
      id: `dev-${i}`,
      deviceName,
      inventoryNumber,
      room: 'Laboratorium Komputer 1',
      row,
      column: col,
      positionIndex: i,
      brandModel: i % 2 === 0 ? 'Lenovo ThinkCentre M720q' : 'HP ProDesk 400 G6',
      serialNumber,
      processor: i % 2 === 0 ? 'Intel Core i5-9400T @ 1.80GHz' : 'Intel Core i5-10500 @ 3.10GHz',
      ramCapacity: i % 3 === 0 ? '16 GB DDR4' : '8 GB DDR4',
      storageType: 'SSD NVMe',
      storageCapacity: i % 4 === 0 ? '512 GB' : '256 GB',
      os: 'Windows 11 Pro 64-bit (22H2)',
      hostname: `LAB-MTN14-${i < 10 ? '0' + i : i}`,
      ipAddress: `192.168.1.${100 + i}`,
      macAddress: `70:85:c2:${(10 + i).toString(16)}:2a:${(40 + i).toString(16)}`,
      acquisitionDate: '2025-01-10',
      physicalCondition: status === 'critical' ? 'Sedang' : 'Baik',
      mouseCondition: status === 'needs_inspection' ? 'Ringan' : 'Baik',
      keyboardCondition: status === 'maintenance' ? 'Sedang' : 'Baik',
      softwareCondition: status === 'needs_inspection' ? 'Perlu Update' : 'Normal',
      status,
      connectionStatus,
      notes: status === 'critical' ? 'Power supply sering restart sendiri' : status === 'needs_inspection' ? 'Kipas agak berisik' : 'Kondisi prima',
      createdAt: now,
      updatedAt: now,
    });
  }

  // Add Server devices (outside client PC mapping)
  devices.push({
    id: 'srv-01',
    deviceName: 'SRV-01 (Server Utama Exambrowser)',
    inventoryNumber: 'INV/2026/SRV/001',
    room: 'Ruang Server Lab 1',
    row: 0,
    column: 0,
    positionIndex: 0,
    brandModel: 'Dell PowerEdge T440 Tower Server',
    serialNumber: 'SN-DELL-SRV-9831',
    processor: 'Intel Xeon E-2236 @ 3.40GHz (6 Cores)',
    ramCapacity: '32 GB ECC DDR4',
    storageType: 'SSD Enterprise RAID 1',
    storageCapacity: '1 TB',
    os: 'Ubuntu Server 22.04 LTS / Proktor v14',
    hostname: 'LAB1-SRV-MAIN',
    ipAddress: '192.168.1.10',
    macAddress: '00:1a:2b:3c:4d:5e',
    acquisitionDate: '2024-06-15',
    physicalCondition: 'Baik',
    softwareCondition: 'Normal',
    status: 'normal',
    connectionStatus: 'online',
    isServer: true,
    serverRole: 'Server Utama (Exambrowser)',
    notes: 'Server utama asesmen nasional & CBT sekolah',
    createdAt: now,
    updatedAt: now,
  });

  devices.push({
    id: 'srv-02',
    deviceName: 'SRV-02 (Server Proktor Cadangan)',
    inventoryNumber: 'INV/2026/SRV/002',
    room: 'Ruang Server Lab 1',
    row: 0,
    column: 0,
    positionIndex: 0,
    brandModel: 'HP ProLiant ML350 Gen10',
    serialNumber: 'SN-HP-SRV-4421',
    processor: 'Intel Xeon Silver 4210R',
    ramCapacity: '32 GB ECC DDR4',
    storageType: 'SSD Enterprise',
    storageCapacity: '512 GB',
    os: 'Windows Server 2022 Datacenter',
    hostname: 'LAB1-SRV-PROCTOR',
    ipAddress: '192.168.1.11',
    macAddress: '00:1a:2b:3c:4d:5f',
    acquisitionDate: '2024-06-15',
    physicalCondition: 'Baik',
    softwareCondition: 'Normal',
    status: 'normal',
    connectionStatus: 'online',
    isServer: true,
    serverRole: 'Server Proktor',
    notes: 'Server proktor cadangan / sinkronisasi data',
    createdAt: now,
    updatedAt: now,
  });

  return devices;
}

export const initialTickets: FaultTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-2026-001',
    deviceId: 'dev-7',
    deviceName: 'PC-07',
    reportedAt: '2026-10-06T08:30:00Z',
    reporter: 'Azhary Mardhani (Guru Informatika)',
    category: 'Hardware',
    priority: 'Kritis',
    description: 'PC mati total dan tidak bisa dinyalakan, tercium bau hangus ringan pada PSU.',
    technician: 'Azhary Mardhani (Teknisi)',
    status: 'Dalam Perbaikan',
    diagnosis: 'Power supply Unit (PSU) mengalami konsleting.',
    actionTaken: 'Menunggu penggantian komponen PSU baru.',
    spareParts: 'PSU 300W TFX',
    repairCost: 350000,
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TKT-2026-002',
    deviceId: 'dev-3',
    deviceName: 'PC-03',
    reportedAt: '2026-10-07T10:15:00Z',
    reporter: 'Azhary Mardhani (Operator)',
    category: 'Software',
    priority: 'Sedang',
    description: 'Aplikasi Exam Browser gagal konek ke server ujian karena versi usang.',
    technician: 'Azhary Mardhani (Teknisi)',
    status: 'Sedang Diperiksa',
    diagnosis: 'Versi Exambrowser v12 perlu di-update ke v14.',
  },
  {
    id: 'tkt-3',
    ticketNumber: 'TKT-2026-003',
    deviceId: 'dev-22',
    deviceName: 'PC-22',
    reportedAt: '2026-10-05T13:00:00Z',
    reporter: 'Azhary Mardhani (Guru Informatika)',
    category: 'Jaringan',
    priority: 'Rendah',
    description: 'Koneksi LAN sering putus-nyambung saat praktikum.',
    technician: 'Budi Santoso (Teknisi)',
    status: 'Selesai',
    diagnosis: 'Kabel RJ45 crimping longgar.',
    actionTaken: 'Melakukan re-crimping konektor RJ45 dan testing ping lancar.',
    spareParts: 'Konektor RJ45',
    repairCost: 5000,
    completedAt: '2026-10-05T15:30:00Z',
  }
];

export const initialMaintenance: MaintenanceRecord[] = [
  {
    id: 'maint-1',
    title: 'Pemeliharaan Bulanan Lab Komputer 1 - Oktober 2026',
    date: '2026-10-01',
    technician: 'Azhary Mardhani',
    category: 'Rutins Bulanan',
    targetDevices: ['all'],
    completedDevices: ['dev-1', 'dev-2', 'dev-3', 'dev-4', 'dev-5'],
    notes: 'Pembersihan debu heatsink CPU dan pengecekan kabel kelistrikan.',
    status: 'Berlangsung',
    checklist: [
      { item: 'Pembersihan debu kipas & casing', checked: true },
      { item: 'Pengecekan tegangan stop kontak', checked: true },
      { item: 'Scan antivirus & pembersihan temporary files', checked: false },
      { item: 'Pemeriksaan kabel LAN dan Switch Hub', checked: true },
    ]
  },
  {
    id: 'maint-2',
    title: 'Update Sistem Operasi & Patch Keamanan',
    date: '2026-09-25',
    technician: 'Azhary Mardhani',
    category: 'Update Software',
    targetDevices: ['all'],
    completedDevices: ['all'],
    notes: 'Update Windows 11 dan aplikasi pendukung asesmen nasional.',
    status: 'Selesai',
    checklist: [
      { item: 'Update Windows Defender definitions', checked: true },
      { item: 'Instalasi update browser ujian', checked: true },
      { item: 'Defragmentasi drive C:', checked: true },
    ]
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'PC Offline Terdeteksi',
    message: 'PC-07 (192.168.1.107) tidak mengirimkan heartbeat selama lebih dari 10 menit.',
    type: 'alert',
    timestamp: '2026-10-08T20:15:00Z',
    read: false,
    deviceId: 'dev-7',
    actionRequired: true,
  },
  {
    id: 'notif-2',
    title: 'Peringatan Penggunaan RAM Tinggi',
    message: 'PC-14 menggunakan RAM sebesar 92%, melebihi ambang batas 90%.',
    type: 'warning',
    timestamp: '2026-10-08T19:40:00Z',
    read: false,
    deviceId: 'dev-14',
    actionRequired: false,
  },
  {
    id: 'notif-3',
    title: 'Tiket Kerusakan Baru',
    message: 'Tiket #TKT-2026-001 dibuat untuk PC-07 kategori Hardware.',
    type: 'info',
    timestamp: '2026-10-06T08:30:00Z',
    read: true,
    deviceId: 'dev-7',
  },
];

export const initialUsers: SystemUser[] = [
  {
    id: 'usr-1',
    name: 'Sugeng Rachyudi, S.Pd.',
    email: 'kepala.lab@mtsn14jkt.sch.id',
    role: 'Kepala Laboratorium',
    status: 'Aktif',
    lastLogin: '2026-10-08T18:00:00Z',
    password: 'kepala123',
  },
  {
    id: 'usr-2',
    name: 'Azhary Mardhani, S.Kom.',
    email: 'teknisi@mtsn14jkt.sch.id',
    role: 'Teknisi',
    status: 'Aktif',
    lastLogin: '2026-10-08T21:05:00Z',
    password: 'teknisi123',
  },
  {
    id: 'usr-3',
    name: 'Azhary Mardhani, S.Kom.',
    email: 'guru.tik@mtsn14jkt.sch.id',
    role: 'Operator/Guru',
    status: 'Aktif',
    lastLogin: '2026-10-07T14:20:00Z',
    password: 'operator123',
  },
  {
    id: 'usr-4',
    name: 'Super Administrator',
    email: 'admin@mtsn14jkt.sch.id',
    role: 'Super Admin',
    status: 'Aktif',
    lastLogin: '2026-10-08T21:10:00Z',
    password: 'admin123',
  },
];
