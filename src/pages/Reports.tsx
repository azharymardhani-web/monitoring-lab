import React, { useState } from 'react';
import { FileText, Download, Printer, Filter } from 'lucide-react';
import { Device, FaultTicket, MaintenanceRecord } from '../types';
import { StorageService } from '../services/storage';

interface ReportsProps {
  devices: Device[];
  tickets: FaultTicket[];
  maintenance: MaintenanceRecord[];
}

export const Reports: React.FC<ReportsProps> = ({ devices, tickets, maintenance }) => {
  const [reportType, setReportType] = useState('inventory');
  const settings = StorageService.getSettings();

  const reportOptions = [
    { id: 'inventory', title: '1. Laporan Inventaris Seluruh PC (32 Unit)' },
    { id: 'condition', title: '2. Laporan Kondisi PC Saat Ini' },
    { id: 'offline', title: '3. Laporan PC Offline / Tidak Terhubung' },
    { id: 'inspection', title: '4. Laporan PC Memerlukan Pemeriksaan' },
    { id: 'tickets', title: '5. Riwayat Kerusakan & Tiket' },
    { id: 'maintenance', title: '6. Realisasi Pemeliharaan (Maintenance)' },
    { id: 'monthly', title: '7. Rekap Kondisi Laboratorium Bulanan' },
  ];

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up terblokir oleh browser. Harap izinkan pop-up untuk mencetak.');
      return;
    }

    let tableContent = '';
    if (reportType === 'inventory') {
      tableContent = `
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama PC</th>
              <th>No. Inventaris</th>
              <th>Model Perangkat</th>
              <th>Serial Number</th>
              <th>IP Address</th>
              <th>Kondisi</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${devices.map((d, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><b>${d.deviceName}</b></td>
                <td>${d.inventoryNumber}</td>
                <td>${d.brandModel}</td>
                <td>${d.serialNumber}</td>
                <td>${d.ipAddress}</td>
                <td><b>${d.status}</b></td>
                <td>${d.notes || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (reportType === 'condition') {
      tableContent = `
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama PC</th>
              <th>Status Kesehatan</th>
              <th>Koneksi</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${devices.map((d, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><b>${d.deviceName}</b></td>
                <td><b>${d.status}</b></td>
                <td>${d.connectionStatus}</td>
                <td>${d.notes || 'Normal'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (reportType === 'tickets') {
      tableContent = `
        <table>
          <thead>
            <tr>
              <th>No Tiket</th>
              <th>Perangkat</th>
              <th>Kategori</th>
              <th>Keluhan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map(t => `
              <tr>
                <td><b>${t.ticketNumber}</b></td>
                <td>${t.deviceName}</td>
                <td>${t.category}</td>
                <td>${t.description}</td>
                <td><b>${t.status}</b></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      tableContent = `
        <table>
          <thead>
            <tr>
              <th>Perangkat</th>
              <th>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${devices.map(d => `
              <tr>
                <td><b>${d.deviceName} (${d.inventoryNumber})</b></td>
                <td><b>${d.status}</b></td>
                <td>${d.notes || 'Normal'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    const html = `
      <!doctype html>
      <html lang="id">
        <head>
          <meta charset="utf-8">
          <title>Laporan Resmi - MTs Negeri 14 Jakarta</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            h3, h4 { margin: 2px 0; }
            p { font-size: 12px; margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; font-size: 12px; }
            .sig-box { text-align: center; width: 200px; }
            .sig-name { margin-top: 70px; font-weight: bold; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
            <h4>MADRASAH TSANAWIYAH NEGERI 14 JAKARTA</h4>
            <p>LABORATORIUM KOMPUTER 1 — LAPORAN REKAPITULASI RESMI</p>
            <p>Tanggal Cetak: ${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' })}</p>
          </div>
          ${tableContent}
          <div class="signatures">
            <div class="sig-box">
              <p>Mengetahui,<br>Kepala Laboratorium Komputer</p>
              <div class="sig-name">${settings.labHeadName}</div>
            </div>
            <div class="sig-box">
              <p>Jakarta, ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}<br>Teknisi Laboratorium</p>
              <div class="sig-name">${settings.technicianName}</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header (Hidden on print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Laporan & Ekspor Data Laboratorium</h2>
          <p className="text-xs text-slate-500">
            Pilih jenis laporan untuk dicetak atau diunduh dalam format tabel resmi sekolah.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors shadow-lg shadow-blue-600/20"
            title="Simpan laporan sebagai PDF atau cetak"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-xl text-xs flex items-center justify-between print:hidden">
        <span>💡 Tips Cetak PDF: Klik tombol "Cetak / Simpan PDF", lalu pilih <b>"Save as PDF" / "Simpan sebagai PDF"</b> pada opsi Tujuan/Printer di dialog cetak browser Anda.</span>
      </div>

      {/* Filter Selector (Hidden on print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 print:hidden">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pilih Jenis Laporan:</label>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="w-full sm:w-96 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            {reportOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 print:shadow-none print:border-none print:p-0">
        <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
          <h3 className="font-black text-slate-900 text-lg uppercase tracking-wider">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
          <h4 className="font-bold text-slate-900 text-base uppercase">MADRASAH TSANAWIYAH NEGERI 14 JAKARTA</h4>
          <p className="text-xs text-slate-600">LABORATORIUM KOMPUTER 1 — LAPORAN REKAPITULASI RESMI</p>
          <p className="text-[11px] text-slate-500 font-mono">Dicetak pada: {new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' })}</p>
        </div>

        {/* Report Content */}
        <div className="overflow-x-auto">
          {reportType === 'inventory' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">No</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Nama PC</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">No. Inventaris</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Model Perangkat</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Serial Number</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">IP Address</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Kondisi</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d, i) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 border border-slate-300 text-center font-medium">{i + 1}</td>
                    <td className="px-3 py-2 border border-slate-300 font-bold">{d.deviceName}</td>
                    <td className="px-3 py-2 border border-slate-300 font-mono">{d.inventoryNumber}</td>
                    <td className="px-3 py-2 border border-slate-300">{d.brandModel}</td>
                    <td className="px-3 py-2 border border-slate-300 font-mono">{d.serialNumber}</td>
                    <td className="px-3 py-2 border border-slate-300 font-mono">{d.ipAddress}</td>
                    <td className="px-3 py-2 border border-slate-300 font-bold capitalize">{d.status}</td>
                    <td className="px-3 py-2 border border-slate-300">{d.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'condition' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">No</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Nama PC</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Status Kesehatan</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Koneksi</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d, i) => (
                  <tr key={d.id}>
                    <td className="px-3 py-2 border border-slate-300 text-center">{i + 1}</td>
                    <td className="px-3 py-2 border border-slate-300 font-bold">{d.deviceName}</td>
                    <td className="px-3 py-2 border border-slate-300 font-bold capitalize">{d.status}</td>
                    <td className="px-3 py-2 border border-slate-300 capitalize">{d.connectionStatus}</td>
                    <td className="px-3 py-2 border border-slate-300">{d.notes || 'Normal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'tickets' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">No Tiket</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Perangkat</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Kategori</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Keluhan</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="px-3 py-2 border border-slate-300 font-mono font-bold">{t.ticketNumber}</td>
                    <td className="px-3 py-2 border border-slate-300">{t.deviceName}</td>
                    <td className="px-3 py-2 border border-slate-300">{t.category}</td>
                    <td className="px-3 py-2 border border-slate-300">{t.description}</td>
                    <td className="px-3 py-2 border border-slate-300 font-bold">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType !== 'inventory' && reportType !== 'condition' && reportType !== 'tickets' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Perangkat</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Status</th>
                  <th className="px-3 py-2.5 border border-slate-300 font-bold">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(d => (
                  <tr key={d.id}>
                    <td className="px-3 py-2 border border-slate-300 font-bold">{d.deviceName} ({d.inventoryNumber})</td>
                    <td className="px-3 py-2 border border-slate-300 font-bold">{d.status}</td>
                    <td className="px-3 py-2 border border-slate-300">{d.notes || 'Normal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Signature Box for Official Report */}
        <div className="pt-12 flex justify-between text-xs text-slate-800 page-break-inside-avoid">
          <div className="text-center space-y-16">
            <p>Mengetahui,<br/>Kepala Laboratorium Komputer</p>
            <p className="font-bold underline">{settings.labHeadName}</p>
          </div>
          <div className="text-center space-y-16">
            <p>Jakarta, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}<br/>Teknisi Laboratorium</p>
            <p className="font-bold underline">{settings.technicianName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
