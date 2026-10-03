import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Plus,
  Video,
  Image as ImageIcon,
  Layers,
  Edit3,
  Trash2,
  PlayCircle,
  MessageSquare,
  CheckCircle,
  FileSpreadsheet,
  User,
  Clock,
  AlertTriangle,
  ArrowRightLeft,
  Tag,
  X,
  Sparkles,
} from 'lucide-react';
import {
  Client,
  MonthlyCalendar,
  CalendarItem,
  MediaFormat,
  Employee,
  PostCategory,
  PriorityLevel,
  ItemStatus,
} from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface AdminClientDetailPageProps {
  client: Client;
  onBack: () => void;
  onUpdateCalendarItem: (item: Partial<CalendarItem>) => void;
  onDeleteCalendarItem: (itemId: number) => void;
  onCreateCalendar?: (
    clientId: number,
    month: string,
    year: number,
    target_creatives: number,
    target_reels: number,
    target_stories: number,
    prefill: boolean
  ) => void | number;
  onPreviewMedia: (type: 'image' | 'reel' | 'carousel', url?: string | null, title?: string) => void;
}

export const AdminClientDetailPage: React.FC<AdminClientDetailPageProps> = ({
  client,
  onBack,
  onUpdateCalendarItem,
  onDeleteCalendarItem,
  onCreateCalendar,
  onPreviewMedia,
}) => {
  const [selectedCalendarId, setSelectedCalendarId] = useState<number>(client.calendars?.[0]?.id || 0);

  // Active Calendar determination
  const activeCalendar: MonthlyCalendar | undefined =
    client.calendars?.find((c) => c.id === selectedCalendarId) || client.calendars?.[0];
  const items: CalendarItem[] = activeCalendar?.items || [];

  const currentMonthName = activeCalendar?.month || 'October';
  const currentYear = activeCalendar?.year || 2026;

  // Dynamic Calendar calculations for ANY month and year
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthIndex = Math.max(0, monthNames.indexOf(currentMonthName));
  const totalDays = new Date(currentYear, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, monthIndex, 1).getDay(); // 0 is Sunday
  const startOffset = (firstDayOfWeek + 6) % 7; // Monday-based offset (0: Monday ... 6: Sunday)
  const monthNumStr = (monthIndex + 1).toString().padStart(2, '0');
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Modal State for Creating a New Month Calendar
  const [isCreateMonthModalOpen, setIsCreateMonthModalOpen] = useState(false);
  const [newMonthName, setNewMonthName] = useState('November');
  const [newMonthYear, setNewMonthYear] = useState(2026);
  const [newTargetReels, setNewTargetReels] = useState(client.target_reels || 20);
  const [newTargetCreatives, setNewTargetCreatives] = useState(client.target_creatives || 15);
  const [newTargetStories, setNewTargetStories] = useState(client.target_stories || 30);
  const [prefillFestivals, setPrefillFestivals] = useState(true);

  // Dual-brand handling (e.g., Nelson Luxe Hospital vs Nelson Hospital)
  const brands = client.brands || [];
  const hasBrands = brands.length > 0;
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>('ALL');

  // Modal State for Planning a Day
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);
  const [modalBrand, setModalBrand] = useState<string>(brands[0] || '');

  // Form Fields
  const [format, setFormat] = useState<MediaFormat>('REEL');
  const [pillar, setPillar] = useState('');
  const [specialDay, setSpecialDay] = useState('');
  const [visualBrief, setVisualBrief] = useState('');
  const [reelScript, setReelScript] = useState('');
  const [caption, setCaption] = useState('');
  const [assignedTo, setAssignedTo] = useState<Employee | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>('11:00 AM');
  const [postCategory, setPostCategory] = useState<PostCategory>('REGULAR');
  const [priority, setPriority] = useState<PriorityLevel>('NORMAL');
  const [rescheduleDay, setRescheduleDay] = useState<number>(1);
  const [alsoCreateSecondSlot, setAlsoCreateSecondSlot] = useState<boolean>(false);

  const getDayItems = (dayNum: number) => {
    const dateStr = `${currentYear}-${monthNumStr}-${dayNum < 10 ? '0' : ''}${dayNum}`;
    const dayItems = items.filter((i) => i.scheduled_date === dateStr);
    if (hasBrands && activeBrandFilter !== 'ALL') {
      return dayItems.filter((i) => i.brand === activeBrandFilter);
    }
    return dayItems;
  };

  const loadItemIntoForm = (item: CalendarItem | null, dayNum?: number) => {
    const activeDay = dayNum ?? selectedDayNum;
    if (item) {
      setEditingItem(item);
      setFormat(item.format);
      setPillar(item.content_pillar || '');
      setSpecialDay(item.special_day || '');
      setVisualBrief(item.visual_brief || '');
      setReelScript(item.reel_bytes_script || '');
      setCaption(item.caption || '');
      setAssignedTo(item.assigned_to || null);
      setScheduledTime(item.scheduled_time || '11:00 AM');
      setPostCategory(item.post_category || 'REGULAR');
      setPriority(item.priority || 'NORMAL');
      const day = parseInt(item.scheduled_date.split('-')[2]);
      setRescheduleDay(day || activeDay);
    } else {
      setEditingItem(null);
      setFormat('REEL');
      setPillar('');
      setSpecialDay('');
      setVisualBrief('');
      setReelScript('');
      setCaption('');
      setAssignedTo(INITIAL_EMPLOYEES.find((e) => e.id === 1600) || null);
      setScheduledTime('11:00 AM');
      setPostCategory('REGULAR');
      setPriority('NORMAL');
      setRescheduleDay(activeDay);
    }
  };

  const handleOpenPlanModal = (
    dayNum: number,
    itemToEdit?: CalendarItem | null,
    isNewSlot?: boolean,
    targetBrand?: string
  ) => {
    setSelectedDayNum(dayNum);
    const dateStr = `${currentYear}-${monthNumStr}-${dayNum < 10 ? '0' : ''}${dayNum}`;

    let brandToUse = targetBrand || itemToEdit?.brand || (activeBrandFilter !== 'ALL' ? activeBrandFilter : brands[0]) || '';
    setModalBrand(brandToUse);
    setAlsoCreateSecondSlot(false);

    if (isNewSlot) {
      loadItemIntoForm(null, dayNum);
      const existing = items.filter((i) => i.scheduled_date === dateStr && (!hasBrands || i.brand === brandToUse));
      if (existing.length > 0) {
        setScheduledTime('06:30 PM');
        setFormat(existing[0].format === 'REEL' ? 'IMAGE' : 'REEL');
      }
    } else {
      let item = itemToEdit;
      if (!item && !hasBrands) {
        item = items.find((i) => i.scheduled_date === dateStr);
      } else if (!item && hasBrands) {
        item = items.find((i) => i.scheduled_date === dateStr && i.brand === brandToUse);
      }
      loadItemIntoForm(item || null, dayNum);
    }

    setIsPlanModalOpen(true);
  };

  const handleSwitchModalBrand = (newBrand: string) => {
    setModalBrand(newBrand);
    const dateStr = `${currentYear}-${monthNumStr}-${selectedDayNum < 10 ? '0' : ''}${selectedDayNum}`;
    const itemForBrand = items.find((i) => i.scheduled_date === dateStr && i.brand === newBrand);
    loadItemIntoForm(itemForBrand || null, selectedDayNum);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDay = rescheduleDay || selectedDayNum;
    const dateStr = `${currentYear}-${monthNumStr}-${finalDay < 10 ? '0' : ''}${finalDay}`;
    const dayIndex = (startOffset + finalDay - 1) % 7;
    const dayName = dayNames[dayIndex];

    const itemData: Partial<CalendarItem> = {
      id: editingItem ? editingItem.id : Date.now(),
      calendar: activeCalendar ? activeCalendar.id : 101,
      sr_no: finalDay,
      scheduled_date: dateStr,
      scheduled_time: scheduledTime,
      day_of_week: dayName,
      special_day: specialDay || null,
      content_pillar: pillar || 'General Post',
      format: format,
      post_category: postCategory,
      priority: priority,
      visual_brief: visualBrief,
      reel_bytes_script: reelScript,
      caption: caption,
      status: editingItem ? editingItem.status : 'READY_FOR_CLIENT',
      media_type: format === 'REEL' ? 'reel' : format === 'CAROUSEL' ? 'carousel' : 'image',
      media_url:
        editingItem?.media_url ||
        (format === 'REEL'
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          : 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'),
      uploaded_asset_url: editingItem?.uploaded_asset_url || null,
      assigned_to: assignedTo,
      brand: hasBrands ? modalBrand : undefined,
    };

    onUpdateCalendarItem(itemData);

    // If user checked "Schedule Both (Reel + Post)", also create the companion deliverable!
    if (!editingItem && alsoCreateSecondSlot) {
      const secondFormat: MediaFormat = format === 'REEL' ? 'IMAGE' : 'REEL';
      const secondItemData: Partial<CalendarItem> = {
        id: Date.now() + 500,
        calendar: activeCalendar ? activeCalendar.id : 101,
        sr_no: finalDay,
        scheduled_date: dateStr,
        scheduled_time: scheduledTime === '11:00 AM' ? '06:30 PM' : '11:00 AM',
        day_of_week: dayName,
        special_day: specialDay || null,
        content_pillar: `${pillar || 'General'} (${secondFormat === 'REEL' ? 'Reel Byte' : 'Graphic'})`,
        format: secondFormat,
        post_category: 'REGULAR',
        priority: priority,
        visual_brief: `Complementary ${secondFormat === 'REEL' ? 'Reel' : 'Post'} for ${pillar || 'General'}`,
        reel_bytes_script: secondFormat === 'REEL' ? (reelScript || `Hook: Insight about ${pillar}`) : null,
        caption: secondFormat !== 'REEL' ? (caption || `Key highlights about ${pillar}.`) : null,
        status: 'READY_FOR_CLIENT',
        media_type: secondFormat === 'REEL' ? 'reel' : 'image',
        media_url:
          secondFormat === 'REEL'
            ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            : 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
        uploaded_asset_url: null,
        assigned_to: assignedTo,
        brand: hasBrands ? modalBrand : undefined,
      };
      onUpdateCalendarItem(secondItemData);
    }

    setIsPlanModalOpen(false);
  };

  const handleCreateMonthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateCalendar) {
      const res = onCreateCalendar(
        client.id,
        newMonthName,
        newMonthYear,
        newTargetCreatives,
        newTargetReels,
        newTargetStories,
        prefillFestivals
      );
      if (typeof res === 'number') {
        setSelectedCalendarId(res);
      }
    }
    setIsCreateMonthModalOpen(false);
  };

  // Filter and sort items day-wise
  const filteredItems = hasBrands && activeBrandFilter !== 'ALL'
    ? items.filter((i) => i.brand === activeBrandFilter)
    : items;
  const sortedItems = [...filteredItems].sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Clients Calendars</span>
          </button>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{client.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {currentMonthName} {currentYear} Schedule
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Click on any day in the visual calendar to add or edit today's plan. Review the day-wise list down below.
          </p>
        </div>

        {/* Deliverable Targets */}
        <div className="flex items-center space-x-4 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Scheduled</span>
            <span className="text-base font-extrabold text-slate-800">{filteredItems.length} Posts</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Target Reels</span>
            <span className="text-base font-extrabold text-purple-700">{client.target_reels}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Target Creatives</span>
            <span className="text-base font-extrabold text-blue-700">{client.target_creatives}</span>
          </div>
        </div>
      </div>

      {/* Month Switcher & Next Month Creator Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-1 whitespace-nowrap">Month:</span>
          <div className="flex items-center space-x-2">
            {client.calendars && client.calendars.length > 0 ? (
              client.calendars.map((cal) => {
                const isSelected = activeCalendar?.id === cal.id;
                return (
                  <button
                    key={cal.id}
                    onClick={() => setSelectedCalendarId(cal.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-400'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{cal.month} {cal.year}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cal.items?.length || 0}
                    </span>
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-slate-400">{currentMonthName} {currentYear}</span>
            )}
          </div>
        </div>

        {onCreateCalendar && (
          <button
            type="button"
            onClick={() => {
              const nextMonthIdx = (monthIndex + 1) % 12;
              const nextYear = nextMonthIdx === 0 ? currentYear + 1 : currentYear;
              setNewMonthName(monthNames[nextMonthIdx]);
              setNewMonthYear(nextYear);
              setIsCreateMonthModalOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-200 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Next Month Calendar</span>
          </button>
        )}
      </div>

      {/* Dual Brand Filter Tabs (for Nelson Luxe vs Nelson Hospital, etc.) */}
      {hasBrands && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">Brand Calendar:</span>
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveBrandFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeBrandFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>All Brands</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
                  {items.length}
                </span>
              </button>
              {brands.map((b) => {
                const count = items.filter((i) => i.brand === b).length;
                const isSelected = activeBrandFilter === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setActiveBrandFilter(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{b}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <span className="text-xs text-slate-400 italic">
            Switch tabs to manage {brands.join(' or ')} on each calendar day
          </span>
        </div>
      )}

      {/* 1. The Main Visual Monthly Calendar Grid with Dots */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Visual Monthly Calendar Grid ({currentMonthName} {currentYear})
            </h2>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span className="text-slate-600 font-medium">🟣 Reel</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-slate-600 font-medium">🔵 Post / Share</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600 font-medium">🟡 Carousel</span>
            </span>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-1 border-b border-slate-100">
          {dayNames.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* The Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells before start */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="min-h-[90px] rounded-xl bg-slate-50/40 border border-transparent" />
          ))}

          {/* Days 1 to totalDays */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dayItems = getDayItems(dayNum);
            const hasItems = dayItems.length > 0;

            return (
              <div
                key={`day-${currentMonthName}-${dayNum}`}
                onClick={() => handleOpenPlanModal(dayNum, null, !hasItems)}
                className={`min-h-[105px] p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer group relative ${
                  hasItems
                    ? 'bg-blue-50/40 border-blue-200 hover:border-blue-500 hover:shadow-md'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50/80'
                }`}
              >
                {/* Top of day cell: Day Number, + button & Dots */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-xs font-bold ${
                        hasItems ? 'text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded-md' : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPlanModal(dayNum, null, true);
                      }}
                      className="w-4 h-4 rounded bg-slate-200/90 hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-bold flex items-center justify-center transition cursor-pointer"
                      title={`Add another Reel / Post to Day ${dayNum}`}
                    >
                      +
                    </button>
                  </div>

                  {/* Dot Representing Day's Post Type */}
                  <div className="flex items-center space-x-1">
                    {hasItems ? (
                      dayItems.map((item, idx) => (
                        <span
                          key={idx}
                          className={`w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-xs ${
                            item.format === 'REEL'
                              ? 'bg-purple-600'
                              : item.format === 'CAROUSEL'
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                          title={`${item.format}: ${item.content_pillar} (${item.scheduled_time || '11:00 AM'})`}
                        />
                      ))
                    ) : (
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-600 font-bold">
                        + Plan
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Details in Cell */}
                <div className="mt-1 flex-1">
                  {hasItems ? (
                    <div className="space-y-1">
                      {dayItems.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPlanModal(dayNum, item, false);
                          }}
                          className="text-left p-1 rounded-md hover:bg-white/80 transition cursor-pointer"
                        >
                          <div className="flex items-center space-x-1 flex-wrap gap-0.5">
                            <span
                              className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                item.format === 'REEL'
                                  ? 'bg-purple-100 text-purple-800'
                                  : item.format === 'CAROUSEL'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.format}
                            </span>
                            {item.post_category === 'EXTRA' && (
                              <span className="inline-block px-1 py-0.2 rounded text-[8px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                                EXTRA
                              </span>
                            )}
                            {item.priority === 'HIGH' && (
                              <span className="inline-block px-1 py-0.2 rounded text-[8px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                                🔴 HIGH
                              </span>
                            )}
                            {item.brand && (
                              <span
                                className={`inline-block px-1 py-0.2 rounded text-[8px] font-extrabold ${
                                  item.brand.includes('Luxe')
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {item.brand.includes('Luxe') ? 'Luxe' : 'Hospital'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium mt-0.5">
                            <span>{item.scheduled_time || '11:00 AM'}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-800 line-clamp-1 mt-0.5 leading-tight">
                            {item.content_pillar}
                          </p>
                          {item.suggestion && (
                            <span className="inline-block px-1 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-bold mt-0.5">
                              ⚠️ Feedback
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-[10px] text-slate-400 font-medium">Click to plan</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Down There: List of Days Wise What We Have to Post Reels or Shares */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Day-Wise Scheduled Posts & Reels ({currentMonthName} {currentYear})
            </h2>
            <p className="text-xs text-slate-500">
              Chronological schedule of daily deliverables, visual directions, and reel scripts.
            </p>
          </div>
          <button
            onClick={() => handleOpenPlanModal(1, null, true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Deliverable Slot</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No posts planned yet. Click on any date on the calendar above to plan content!
            </div>
          ) : (
            sortedItems.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Day & Type */}
                <div className="flex items-start space-x-3 min-w-[200px]">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center font-bold text-slate-800 shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {item.day_of_week.substring(0, 3)}
                    </span>
                    <span className="text-base leading-none">
                      {item.scheduled_date.split('-')[2]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.format === 'REEL'
                            ? 'bg-purple-600'
                            : item.format === 'CAROUSEL'
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          item.format === 'REEL'
                            ? 'bg-purple-100 text-purple-800'
                            : item.format === 'CAROUSEL'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.format === 'REEL' ? 'REEL' : item.format === 'CAROUSEL' ? 'CAROUSEL' : 'POST / SHARE'}
                      </span>
                      {item.post_category === 'EXTRA' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          ⚡ EXTRA
                        </span>
                      )}
                      {item.priority === 'HIGH' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                          🔴 HIGH PRIORITY
                        </span>
                      )}
                      <span className="inline-flex items-center space-x-1 text-[10px] text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.scheduled_time || '11:00 AM'}</span>
                      </span>
                      {item.brand && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            item.brand.includes('Luxe')
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {item.brand}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">{item.content_pillar}</h3>
                    {item.special_day && (
                      <span className="text-[11px] text-indigo-600 font-semibold block">
                        ★ {item.special_day}
                      </span>
                    )}
                  </div>
                </div>

                {/* Brief & Script Details */}
                <div className="flex-1 space-y-1.5 text-xs text-slate-600 max-w-xl">
                  {item.visual_brief && (
                    <div>
                      <span className="font-bold text-slate-700">Visual Direction: </span>
                      <span>{item.visual_brief}</span>
                    </div>
                  )}
                  {item.reel_bytes_script && (
                    <div className="italic bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700">
                      <span className="font-bold not-italic text-purple-700">Reel Script/Hook: </span>
                      "{item.reel_bytes_script}"
                    </div>
                  )}
                  {item.suggestion && (
                    <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-rose-800 flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Client Feedback: </span>
                        <span>{item.suggestion}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions & Status */}
                <div className="flex items-center space-x-3 shrink-0">
                  {/* Assignee Badge */}
                  {item.assigned_to && (
                    <div
                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold"
                      style={{
                        backgroundColor: `${item.assigned_to.avatar_color}20`,
                        borderColor: `${item.assigned_to.avatar_color}60`,
                        color: item.assigned_to.avatar_color,
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-extrabold shrink-0"
                        style={{ backgroundColor: item.assigned_to.avatar_color }}
                      >
                        {item.assigned_to.first_name[0]}{item.assigned_to.last_name[0]}
                      </span>
                      <span>{item.assigned_to.first_name} {item.assigned_to.last_name}</span>
                    </div>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.status === 'CHANGES_REQ'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.status === 'SUBMITTED'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : item.status === 'IN_PROGRESS'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {item.status === 'APPROVED'
                      ? '✓ Approved'
                      : item.status === 'CHANGES_REQ'
                      ? '⚠️ Changes Req'
                      : item.status === 'SUBMITTED'
                      ? '📤 Submitted by Team'
                      : item.status === 'IN_PROGRESS'
                      ? '⏳ In Progress'
                      : 'Ready for Client'}
                  </span>

                  {item.status === 'SUBMITTED' && (
                    <button
                      onClick={() => onUpdateCalendarItem({ ...item, status: 'READY_FOR_CLIENT' })}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1 cursor-pointer"
                      title="Approve deliverable and send to Client Portal"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve for Client</span>
                    </button>
                  )}

                  <button
                    onClick={() => onPreviewMedia(item.media_type, item.uploaded_asset_url || item.media_url, item.content_pillar)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title={item.uploaded_asset_url ? 'Preview Uploaded Creative' : 'Preview Media'}
                  >
                    <PlayCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const day = parseInt(item.scheduled_date.split('-')[2]);
                      handleOpenPlanModal(day, item);
                    }}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Edit Plan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteCalendarItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Post Slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Plan / Edit Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
            {/* Sticky Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  {editingItem ? 'Edit Content Plan' : 'Plan Content For'}: October {selectedDayNum}, 2026
                </h3>
                <p className="text-xs text-slate-400">{client.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="flex-1 flex flex-col min-h-0">
              <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
                {/* Dual-Brand Switcher Tab inside Modal */}
                {hasBrands && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                      <span>Target Hospital Brand</span>
                      <span className="text-[10px] text-slate-400 font-normal">Switch tab to manage both brands for Day {selectedDayNum}</span>
                    </label>
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
                    {brands.map((b) => {
                      const isSelected = modalBrand === b;
                      const dateStr = `2026-10-${selectedDayNum < 10 ? '0' : ''}${selectedDayNum}`;
                      const brandHasPost = items.some((i) => i.scheduled_date === dateStr && i.brand === b);
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleSwitchModalBrand(b)}
                          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>{b}</span>
                          {brandHasPost ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Has post planned" />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-normal">(Empty)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Format Switcher */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Deliverable Format</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('REEL')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 border transition cursor-pointer ${
                      format === 'REEL'
                        ? 'bg-purple-600 text-white border-purple-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Reel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('IMAGE')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 border transition cursor-pointer ${
                      format === 'IMAGE'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Post / Share</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('CAROUSEL')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 border transition cursor-pointer ${
                      format === 'CAROUSEL'
                        ? 'bg-amber-600 text-white border-amber-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Carousel</span>
                  </button>
                </div>
              </div>

              {/* 1-Click Both Formats (Reel + Graphic Post) */}
              {!editingItem && (
                <div className="p-3 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">⚡ Schedule Both (Morning Reel + Evening Post)</span>
                    <span className="text-[10px] text-slate-500">
                      Creates both 11:00 AM Reel & 06:30 PM Graphic Post for Day {selectedDayNum} in 1 click
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAlsoCreateSecondSlot(!alsoCreateSecondSlot)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      alsoCreateSecondSlot
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {alsoCreateSecondSlot ? '✓ Both Active' : '+ Enable Both'}
                  </button>
                </div>
              )}

              {/* Category & Priority Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Post Category</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPostCategory('REGULAR')}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition cursor-pointer ${
                        postCategory === 'REGULAR'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Regular Quota
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostCategory('EXTRA')}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition cursor-pointer ${
                        postCategory === 'EXTRA'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ⚡ Extra / Bonus
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Execution Priority</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['NORMAL', 'MEDIUM', 'HIGH'] as PriorityLevel[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-1.5 px-1.5 rounded-lg font-bold text-[10px] border transition cursor-pointer text-center ${
                          priority === p
                            ? p === 'HIGH'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : p === 'MEDIUM'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-slate-800 text-white border-slate-800 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p === 'HIGH' ? '🔴 High' : p === 'MEDIUM' ? '🟡 Med' : '🟢 Norm'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scheduled Time & Reschedule Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Scheduled Post Time</span>
                  </label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="e.g. 11:00 AM, 06:30 PM"
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="flex space-x-1 mt-1">
                    {['11:00 AM', '02:00 PM', '06:30 PM', '08:00 PM'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setScheduledTime(t)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center space-x-1">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Shift / Reschedule Date</span>
                  </label>
                  <select
                    value={rescheduleDay}
                    onChange={(e) => setRescheduleDay(parseInt(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {Array.from({ length: 31 }).map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        October {idx + 1}, 2026 {idx + 1 === selectedDayNum ? '(Current Day)' : ''}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Quickly move this slot to any other date in October
                  </span>
                </div>
              </div>

              {/* Topic & Special Day */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Content Pillar / Topic</label>
                  <input
                    type="text"
                    required
                    value={pillar}
                    onChange={(e) => setPillar(e.target.value)}
                    placeholder="e.g. Doctor Spotlight, Study Tips"
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Special Occasion (Optional)</label>
                  <input
                    type="text"
                    value={specialDay}
                    onChange={(e) => setSpecialDay(e.target.value)}
                    placeholder="e.g. Gandhi Jayanti"
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Visual Direction / Brief */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Visual Direction / Design Brief</label>
                <textarea
                  rows={2}
                  value={visualBrief}
                  onChange={(e) => setVisualBrief(e.target.value)}
                  placeholder="Explain what visuals, doctors, fonts, or assets the design team should use..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Reel Script or Caption */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {format === 'REEL' ? 'Reel Hook & Video Script' : 'Post Caption & Copy'}
                </label>
                <textarea
                  rows={3}
                  value={format === 'REEL' ? reelScript : caption}
                  onChange={(e) => (format === 'REEL' ? setReelScript(e.target.value) : setCaption(e.target.value))}
                  placeholder={
                    format === 'REEL'
                      ? 'Hook: "Stop doing this..." Scene 1: Doctor speaking. Call to action at the end...'
                      : 'Engaging caption with hashtags...'
                  }
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Assign To */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Assign To (Team Member)</span>
                </label>
                <select
                  value={assignedTo ? assignedTo.id : ''}
                  onChange={(e) => {
                    const emp = INITIAL_EMPLOYEES.find((em) => em.id === Number(e.target.value));
                    setAssignedTo(emp || null);
                  }}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700"
                >
                  <option value="">— Unassigned —</option>
                  {INITIAL_EMPLOYEES.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name} · {emp.designation}
                    </option>
                  ))}
                </select>
                {assignedTo && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    📧 {assignedTo.email_id}
                  </p>
                )}
              </div>
            </div>

            {/* Sticky Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200/70 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                Save Day Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

      {/* 4. Modal for Creating a New Month Calendar */}
      {isCreateMonthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create Next Month Calendar</h3>
                  <p className="text-xs text-slate-500">Plan ahead for {client.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateMonthModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateMonthSubmit} className="p-6 space-y-4 overflow-y-auto">
              {/* Month & Year Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Month
                  </label>
                  <select
                    value={newMonthName}
                    onChange={(e) => setNewMonthName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {monthNames.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={newMonthYear}
                    onChange={(e) => setNewMonthYear(parseInt(e.target.value) || currentYear)}
                    min={2026}
                    max={2030}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Monthly Deliverable Targets */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Deliverable Targets for {newMonthName} {newMonthYear}
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-purple-700 block mb-1">Reels</label>
                    <input
                      type="number"
                      value={newTargetReels}
                      onChange={(e) => setNewTargetReels(parseInt(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded-xl p-2 text-sm text-center font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-blue-700 block mb-1">Creatives</label>
                    <input
                      type="number"
                      value={newTargetCreatives}
                      onChange={(e) => setNewTargetCreatives(parseInt(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded-xl p-2 text-sm text-center font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-amber-700 block mb-1">Stories</label>
                    <input
                      type="number"
                      value={newTargetStories}
                      onChange={(e) => setNewTargetStories(parseInt(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded-xl p-2 text-sm text-center font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Prefill Festivals & Special Days */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="prefillFestivals"
                  checked={prefillFestivals}
                  onChange={(e) => setPrefillFestivals(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="prefillFestivals" className="cursor-pointer">
                  <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-populate Indian Festivals & Important Dates</span>
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-0.5 leading-snug">
                    Automatically seeds major festivals (e.g., Diwali, Bhai Dooj, Guru Nanak Jayanti in Nov; Christmas in Dec) with pre-crafted campaign briefs so your team can hit the ground running.
                  </p>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateMonthModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate {newMonthName} Calendar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
