import React, { useState } from 'react';
import { X, FileSpreadsheet, Upload, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Client, CalendarItem, MediaFormat, ItemStatus } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeClient?: Client | null;
  clients: Client[];
  onImportCalendar: (data: {
    clientId: number;
    month: string;
    year: number;
    items: CalendarItem[];
  }) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  activeClient,
  clients,
  onImportCalendar,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<number>(activeClient?.id || clients[0]?.id || 1);
  const [targetMonth, setTargetMonth] = useState<string>('November');
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [fileName, setFileName] = useState<string>('');
  const [parsedItems, setParsedItems] = useState<CalendarItem[]>([]);
  const [parsingError, setParsingError] = useState<string>('');
  const [previewSheetName, setPreviewSheetName] = useState<string>('');

  if (!isOpen) return null;

  const currentClient = clients.find((c) => c.id === selectedClientId) || activeClient || clients[0];

  const mapFormat = (val: any): MediaFormat => {
    if (!val) return 'IMAGE';
    const s = String(val).toUpperCase();
    if (s.includes('REEL')) return 'REEL';
    if (s.includes('CARO') || s.includes('SLIDE')) return 'CAROUSEL';
    if (s.includes('STORY')) return 'STORY';
    return 'IMAGE';
  };

  const mapStatus = (val: any): ItemStatus => {
    if (!val) return 'READY_FOR_CLIENT';
    const s = String(val).toUpperCase();
    if (s.includes('DONE') || s.includes('APPROV')) return 'APPROVED';
    if (s.includes('PROGRESS')) return 'IN_PROGRESS';
    return 'READY_FOR_CLIENT';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParsingError('');
    setParsedItems([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          setParsingError('No worksheets found in this Excel spreadsheet.');
          return;
        }

        // Try to match sheet by client name/slug, or fallback to first sheet
        let matchedSheet = workbook.SheetNames[0];
        const clientSlug = currentClient.slug.toLowerCase();
        const clientName = currentClient.name.toLowerCase();

        for (const name of workbook.SheetNames) {
          const lower = name.toLowerCase();
          if (lower.includes(clientSlug) || lower.includes('nelson') || lower.includes(clientName)) {
            matchedSheet = name;
            break;
          }
        }

        setPreviewSheetName(matchedSheet);
        const worksheet = workbook.Sheets[matchedSheet];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawJson.length < 2) {
          setParsingError('The spreadsheet contains too few rows.');
          return;
        }

        // Find header row or first data row
        let headerRowIdx = 0;
        for (let i = 0; i < Math.min(25, rawJson.length); i++) {
          const row = rawJson[i];
          if (Array.isArray(row) && row.some((cell) => String(cell).toLowerCase().includes('sr') || String(cell).toLowerCase().includes('date'))) {
            headerRowIdx = i;
            break;
          }
        }

        const dataRows = rawJson.slice(headerRowIdx + 1);
        const items: CalendarItem[] = [];
        let sr = 1;

        dataRows.forEach((row, idx) => {
          if (!row || row.length < 3) return;

          // Attempt to extract fields
          // Common structure: [sr_no, date, day, special_day, pillar, format, content/topic, visual, status]
          const rawDate = row[1];
          let dateStr = '';
          if (rawDate instanceof Date) {
            dateStr = rawDate.toISOString().split('T')[0];
          } else if (typeof rawDate === 'number') {
            // Excel serial date number
            const jsDate = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
            dateStr = jsDate.toISOString().split('T')[0];
          } else if (rawDate) {
            dateStr = String(rawDate).trim();
          }

          // If date isn't formatted YYYY-MM-DD, try to build one
          if (!dateStr || !dateStr.includes('-')) {
            const dayNum = String(idx + 1).padStart(2, '0');
            const mNum = targetMonth === 'November' ? '11' : (targetMonth === 'December' ? '12' : '10');
            dateStr = `${targetYear}-${mNum}-${dayNum}`;
          }

          const dayOfWeek = row[2] ? String(row[2]).trim() : 'Scheduled Day';
          const specialDay = row[3] ? String(row[3]).trim() : null;
          const pillar = row[4] ? String(row[4]).trim() : 'General Branding';
          const formatVal = mapFormat(row[5] || row[4]);
          const contentVal = row[6] ? String(row[6]).trim() : (row[5] ? String(row[5]).trim() : '');
          const visualVal = row[7] ? String(row[7]).trim() : null;
          const statusVal = mapStatus(row[8] || row[7]);

          const assignedEmp = INITIAL_EMPLOYEES[idx % INITIAL_EMPLOYEES.length];

          items.push({
            id: Date.now() + sr,
            calendar: 0, // Will be set on import
            sr_no: sr,
            scheduled_date: dateStr,
            scheduled_time: '11:00 AM',
            day_of_week: dayOfWeek,
            special_day: specialDay,
            content_pillar: pillar,
            format: formatVal,
            visual_brief: visualVal || `Visual asset for ${currentClient.name} ${pillar}`,
            reel_bytes_script: formatVal === 'REEL' ? contentVal : null,
            caption: formatVal !== 'REEL' ? contentVal : null,
            status: statusVal,
            post_category: 'REGULAR',
            priority: specialDay ? 'HIGH' : 'NORMAL',
            media_type: formatVal === 'REEL' ? 'reel' : (formatVal === 'CAROUSEL' ? 'carousel' : 'image'),
            media_url: formatVal === 'REEL'
              ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
              : 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
            assigned_to: assignedEmp,
          });
          sr++;
        });

        if (items.length === 0) {
          setParsingError('Could not parse any valid rows. Please check sheet layout.');
        } else {
          setParsedItems(items);
        }
      } catch (err: any) {
        setParsingError(`Failed to parse file: ${err.message || 'Unknown error'}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = () => {
    if (parsedItems.length === 0) return;
    onImportCalendar({
      clientId: selectedClientId,
      month: targetMonth,
      year: targetYear,
      items: parsedItems,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Import Social Media Calendar from Excel</h3>
              <p className="text-xs text-emerald-100">Directly ingest .xlsx schedule into client portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Target Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Client Account</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Schedule Month</label>
              <select
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="November">November</option>
                <option value="December">December</option>
                <option value="October">October</option>
                <option value="January">January</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Year</label>
              <input
                type="number"
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value) || 2026)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 rounded-2xl p-6 text-center transition group cursor-pointer relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">
                {fileName ? fileName : 'Click to select or drag your team Excel sheet (.xlsx)'}
              </p>
              <p className="text-[11px] text-slate-500 max-w-md">
                Automatically parses columns for Reels, Carousels, Topics, Captions, Dates, and Content Pillars.
              </p>
            </div>
          </div>

          {parsingError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parsingError}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">
                    Parsed {parsedItems.length} Deliverables from sheet "{previewSheetName}"
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                    {parsedItems.filter((i) => i.format === 'REEL').length} Reels
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                    {parsedItems.filter((i) => i.format === 'IMAGE').length} Images
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                    {parsedItems.filter((i) => i.format === 'CAROUSEL').length} Carousels
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                    <tr>
                      <th className="p-2 border-b">#</th>
                      <th className="p-2 border-b">Date</th>
                      <th className="p-2 border-b">Format</th>
                      <th className="p-2 border-b">Pillar</th>
                      <th className="p-2 border-b">Brief / Content</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedItems.slice(0, 15).map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono font-bold text-slate-500">{it.sr_no}</td>
                        <td className="p-2 font-semibold text-slate-700">{it.scheduled_date}</td>
                        <td className="p-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              it.format === 'REEL'
                                ? 'bg-purple-100 text-purple-700'
                                : it.format === 'CAROUSEL'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {it.format}
                          </span>
                        </td>
                        <td className="p-2 text-slate-600">{it.content_pillar}</td>
                        <td className="p-2 text-slate-500 truncate max-w-xs">
                          {it.reel_bytes_script || it.caption || it.visual_brief || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedItems.length > 15 && (
                <p className="text-[10px] text-slate-400 text-center">
                  + {parsedItems.length - 15} more rows parsed successfully
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Will create/populate {targetMonth} {targetYear} calendar for <strong>{currentClient.name}</strong>
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition text-xs"
            >
              Cancel
            </button>
            <button
              disabled={parsedItems.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Import {parsedItems.length} Deliverables Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
