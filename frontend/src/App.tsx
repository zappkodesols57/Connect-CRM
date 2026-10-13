import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { TeamLoginPage } from './pages/TeamLoginPage';
import { ClientLoginPage } from './pages/ClientLoginPage';
import { LandingHubPage } from './pages/LandingHubPage';
import { AdminSidebar } from './components/AdminSidebar';
import { ClientSidebar } from './components/ClientSidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminClientsOverview } from './components/AdminClientsOverview';
import { AdminClientDetailPage } from './components/AdminClientDetailPage';
import { AdminClientsDirectoryView } from './components/AdminClientsDirectoryView';
import { AdminRevisionsView } from './components/AdminRevisionsView';
import { AdminTeamView } from './components/AdminTeamView';
import { ClientCalendarView } from './components/ClientCalendarView';
import { ClientReelsView } from './components/ClientReelsView';
import { ClientFeedbackView } from './components/ClientFeedbackView';
import { CreateClientModal } from './components/CreateClientModal';
import { MediaModal } from './components/MediaModal';
import { TeamPortalView } from './components/TeamPortalView';
import { ExcelImportModal } from './components/ExcelImportModal';
import { InternalChatDrawer } from './components/InternalChatDrawer';
import { SocialGrowthModal } from './components/SocialGrowthModal';
import { ShootScheduleModal } from './components/ShootScheduleModal';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import {
  INITIAL_CLIENTS,
  INITIAL_EMPLOYEES,
  INITIAL_ADHOC_TASKS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_SOCIAL_TRACKERS,
  INITIAL_SHOOT_SCHEDULES,
} from './data/mockData';
import {
  Client,
  CalendarItem,
  Employee,
  AdHocTask,
  MonthlyCalendar,
  MediaFormat,
  ChatMessage,
  SocialMediaTracker,
  ShootSchedule,
} from './types';

interface AuthSession {
  role: 'admin' | 'client' | 'team';
  client?: Client;
  employee?: Employee;
  name: string;
}

const MainApp: React.FC = () => {
  const navigate = useNavigate();

  // Master clients state initialized with realistic data imported from Oct Calender 2026.xlsx
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);

  // Agency Employees state with dynamic role and permission management
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  // Authentication session
  const [auth, setAuth] = useState<AuthSession | null>(null);

  // Admin Navigation States — default lands on analytics dashboard
  const [adminTab, setAdminTab] = useState<'dashboard' | 'calendars' | 'clients' | 'revisions' | 'team'>('dashboard');
  const [adminSelectedClient, setAdminSelectedClient] = useState<Client | null>(null);

  // Client Navigation States
  const [clientTab, setClientTab] = useState<'calendar' | 'reels' | 'feedback'>('calendar');

  // Modals
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<{
    isOpen: boolean;
    type: 'image' | 'reel' | 'carousel';
    url?: string | null;
    title: string;
  }>({
    isOpen: false,
    type: 'image',
    url: null,
    title: '',
  });

  // Operational & Ad-hoc Tasks State
  const [adHocTasks, setAdHocTasks] = useState<AdHocTask[]>(INITIAL_ADHOC_TASKS);

  // Internal Agency Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialClient, setChatInitialClient] = useState<string>('ALL');

  // Client Follower Growth State
  const [socialTrackers, setSocialTrackers] = useState<SocialMediaTracker[]>(INITIAL_SOCIAL_TRACKERS);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  // Production Shoots State
  const [shootSchedules, setShootSchedules] = useState<ShootSchedule[]>(INITIAL_SHOOT_SCHEDULES);
  const [isShootModalOpen, setIsShootModalOpen] = useState(false);

  // Excel Calendar Import State
  const [isExcelImportOpen, setIsExcelImportOpen] = useState(false);
  const [excelImportClientId, setExcelImportClientId] = useState<number | null>(null);

  // Login handler
  const handleLogin = (loginData: {
    role: 'admin' | 'client' | 'team';
    name: string;
    clientId?: number;
    employeeId?: number;
  }) => {
    if (loginData.role === 'admin') {
      setAuth({
        role: 'admin',
        name: 'Tushar (Agency Director)',
      });
      setAdminTab('dashboard');
      setAdminSelectedClient(null);
      navigate('/admin');
    } else if (loginData.role === 'client') {
      const targetClient =
        clients.find((c) => c.id === loginData.clientId) || clients[0];
      setAuth({
        role: 'client',
        client: targetClient,
        name: targetClient.name,
      });
      setClientTab('calendar');
      navigate('/client');
    } else {
      const emp =
        employees.find((e) => e.id === loginData.employeeId) || employees[1];
      setAuth({
        role: 'team',
        employee: emp,
        name: `${emp.first_name} ${emp.last_name}`,
      });
      navigate('/team');
    }
  };

  const handleSignOut = () => {
    const prevRole = auth?.role;
    setAuth(null);
    if (prevRole === 'admin') navigate('/admin/login');
    else if (prevRole === 'team') navigate('/team/login');
    else if (prevRole === 'client') navigate('/client/login');
    else navigate('/');
  };

  // Handler when Admin or Team updates or creates a post across any monthly calendar
  const handleUpdateCalendarItem = (updatedItem: Partial<CalendarItem>) => {
    setClients((prevClients) =>
      prevClients.map((c) => {
        if (!c.calendars || c.calendars.length === 0) return c;

        let itemFound = false;
        const updatedCalendars = c.calendars.map((cal) => {
          const existingItems = cal.items ? [...cal.items] : [];
          const index = existingItems.findIndex((i) => i.id === updatedItem.id);

          if (index >= 0) {
            itemFound = true;
            const newItems = existingItems.map((item, idx) =>
              idx === index ? ({ ...item, ...updatedItem } as CalendarItem) : item
            );
            return {
              ...cal,
              items: newItems,
              total_items: newItems.length,
            };
          } else if (updatedItem.calendar === cal.id) {
            itemFound = true;
            const newItems = [...existingItems, updatedItem as CalendarItem];
            return {
              ...cal,
              items: newItems,
              total_items: newItems.length,
            };
          }
          return cal;
        });

        if (!itemFound && adminSelectedClient && adminSelectedClient.id === c.id) {
          const firstCal = updatedCalendars[0];
          const newItems = [...(firstCal.items || []), updatedItem as CalendarItem];
          updatedCalendars[0] = { ...firstCal, items: newItems, total_items: newItems.length };
        }

        const updatedClient = {
          ...c,
          calendars: updatedCalendars,
        };
        if (adminSelectedClient && adminSelectedClient.id === c.id) {
          setAdminSelectedClient(updatedClient);
        }
        if (auth?.role === 'client' && auth.client?.id === c.id) {
          setAuth({ ...auth, client: updatedClient });
        }
        return updatedClient;
      })
    );
  };

  const handleUpdateAdHocTask = (updatedTask: AdHocTask) => {
    setAdHocTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleCreateAdHocTask = (newTask: Omit<AdHocTask, 'id' | 'created_at'>) => {
    const created: AdHocTask = {
      ...newTask,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
    };
    setAdHocTasks((prev) => [created, ...prev]);
  };

  // Handler when Admin deletes a post slot
  const handleDeleteCalendarItem = (itemId: number) => {
    if (!adminSelectedClient) return;

    setClients((prevClients) =>
      prevClients.map((c) => {
        if (c.id !== adminSelectedClient.id) return c;

        const updatedCalendars = (c.calendars || []).map((cal) => {
          const newItems = (cal.items || []).filter((i) => i.id !== itemId);
          return {
            ...cal,
            items: newItems,
            total_items: newItems.length,
          };
        });

        const updatedClient = {
          ...c,
          calendars: updatedCalendars,
        };

        setAdminSelectedClient(updatedClient);

        if (auth?.role === 'client' && auth.client?.id === c.id) {
          setAuth({ ...auth, client: updatedClient });
        }

        return updatedClient;
      })
    );
  };

  // Handler when Client approves an item
  const handleApproveItem = (itemId: number) => {
    if (!auth?.client) return;
    const clientId = auth.client.id;

    setClients((prevClients) =>
      prevClients.map((c) => {
        if (c.id !== clientId) return c;

        const updatedCalendars = (c.calendars || []).map((cal) => {
          const newItems = (cal.items || []).map((i) =>
            i.id === itemId ? { ...i, status: 'APPROVED' as const } : i
          );
          return {
            ...cal,
            items: newItems,
            approved_items: newItems.filter((i) => i.status === 'APPROVED').length,
          };
        });

        const updatedClient = {
          ...c,
          calendars: updatedCalendars,
        };

        setAuth((prev) => (prev ? { ...prev, client: updatedClient } : null));

        if (adminSelectedClient && adminSelectedClient.id === c.id) {
          setAdminSelectedClient(updatedClient);
        }

        return updatedClient;
      })
    );
  };

  // Handler when Client suggests changes
  const handleSuggestItem = (itemId: number, feedback: string) => {
    if (!auth?.client) return;
    const clientId = auth.client.id;

    setClients((prevClients) =>
      prevClients.map((c) => {
        if (c.id !== clientId) return c;

        const updatedCalendars = (c.calendars || []).map((cal) => {
          const newItems = (cal.items || []).map((i) =>
            i.id === itemId
              ? { ...i, status: 'CHANGES_REQ' as const, suggestion: feedback }
              : i
          );
          return {
            ...cal,
            items: newItems,
          };
        });

        const updatedClient = {
          ...c,
          calendars: updatedCalendars,
        };

        setAuth((prev) => (prev ? { ...prev, client: updatedClient } : null));

        if (adminSelectedClient && adminSelectedClient.id === c.id) {
          setAdminSelectedClient(updatedClient);
        }

        return updatedClient;
      })
    );
  };

  // Handler when user imports an Excel calendar (.xlsx)
  const handleImportExcelCalendar = (data: {
    clientId: number;
    month: string;
    year: number;
    items: CalendarItem[];
  }) => {
    const newCalId = Date.now();
    const stampedItems = data.items.map((it, idx) => ({
      ...it,
      id: newCalId + idx + 1,
      calendar: newCalId,
    }));

    const newCalendar: MonthlyCalendar = {
      id: newCalId,
      client: data.clientId,
      month: data.month,
      year: data.year,
      title: `${data.month} ${data.year} Content Schedule`,
      status: 'PLANNING',
      target_creatives: stampedItems.filter((i) => i.format === 'IMAGE' || i.format === 'CAROUSEL').length,
      target_reels: stampedItems.filter((i) => i.format === 'REEL').length,
      target_stories: stampedItems.filter((i) => i.format === 'STORY').length || 30,
      total_items: stampedItems.length,
      approved_items: stampedItems.filter((i) => i.status === 'APPROVED').length,
      items: stampedItems,
    };

    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== data.clientId) return c;
        const existingIndex = (c.calendars || []).findIndex(
          (cal) => cal.month.toLowerCase() === data.month.toLowerCase() && cal.year === data.year
        );
        let updatedCalendars: MonthlyCalendar[];
        if (existingIndex >= 0) {
          updatedCalendars = (c.calendars || []).map((cal, idx) => (idx === existingIndex ? newCalendar : cal));
        } else {
          updatedCalendars = [...(c.calendars || []), newCalendar];
        }
        const updatedC = { ...c, calendars: updatedCalendars };
        if (adminSelectedClient?.id === c.id) setAdminSelectedClient(updatedC);
        return updatedC;
      })
    );
    alert(`🎉 Successfully imported ${stampedItems.length} deliverables into ${data.month} ${data.year} calendar!`);
  };

  // Handler for internal team chat messages
  const handleSendMessage = (msg: Omit<ChatMessage, 'id' | 'created_at'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: Date.now(),
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  // Handlers for client social media follower growth tracking
  const handleUpdateTracker = (updated: SocialMediaTracker) => {
    setSocialTrackers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleAddTracker = (newTracker: Omit<SocialMediaTracker, 'id' | 'last_updated'>) => {
    const created: SocialMediaTracker = {
      ...newTracker,
      id: Date.now(),
      last_updated: 'Just now',
    };
    setSocialTrackers((prev) => [created, ...prev]);
  };

  // Handler for on-site shoot schedules and crew assignment
  const handleAddShoot = (shoot: Omit<ShootSchedule, 'id' | 'created_at'>) => {
    const created: ShootSchedule = {
      ...shoot,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
    };
    setShootSchedules((prev) => [created, ...prev]);
  };

  // Handler for Admin toggling manager/task assignment access for an employee
  const handleToggleManagerAccess = (employeeId: number) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        const newIsManager = !(emp.is_manager || emp.can_assign_tasks);
        const updated: Employee = {
          ...emp,
          is_manager: newIsManager,
          can_assign_tasks: newIsManager,
        };
        // Also update live session if this employee is currently logged in
        if (auth?.role === 'team' && auth.employee?.id === employeeId) {
          setAuth((prevAuth) => (prevAuth ? { ...prevAuth, employee: updated } : null));
        }
        return updated;
      })
    );
  };

  // Helper to determine active user identity and role for internal chat drawer
  const getCurrentChatUser = () => {
    if (auth?.role === 'admin') {
      return {
        id: 9999,
        name: auth.name || 'Tushar (Agency Director)',
        role: 'ADMIN' as const,
        avatar_color: 'bg-emerald-600',
      };
    }
    if (auth?.role === 'team' && auth.employee) {
      const isMgr = Boolean(
        auth.employee.can_assign_tasks ??
        auth.employee.is_manager ??
        auth.employee.designation?.toLowerCase().includes('manager')
      );
      return {
        id: auth.employee.id,
        name: `${auth.employee.first_name} ${auth.employee.last_name}`,
        role: isMgr ? ('MANAGER' as const) : ('EMPLOYEE' as const),
        avatar_color: 'bg-indigo-600',
      };
    }
    return {
      id: 9999,
      name: 'Tushar (Admin)',
      role: 'ADMIN' as const,
      avatar_color: 'bg-emerald-600',
    };
  };

  // Handler to add a new client
  const handleAddClient = async (data: {
    name: string;
    slug: string;
    code: string;
    target_creatives: number;
    target_reels: number;
    target_stories: number;
    industry?: string;
    special_notes?: string;
  }) => {
    const newId = Date.now();
    const newClient: Client = {
      id: newId,
      name: data.name,
      slug: data.slug || data.code.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      code: data.code,
      primary_color: '#2563EB',
      industry: data.industry || 'Healthcare & Services',
      target_creatives: data.target_creatives,
      target_reels: data.target_reels,
      target_stories: data.target_stories,
      special_notes: data.special_notes,
      calendars: [
        {
          id: newId + 1,
          client: newId,
          month: 'October',
          year: 2026,
          title: `${data.name} - October 2026 Content Schedule`,
          status: 'PLANNING',
          target_creatives: data.target_creatives,
          target_reels: data.target_reels,
          target_stories: data.target_stories,
          total_items: 1,
          approved_items: 0,
          items: [
            {
              id: newId + 2,
              calendar: newId + 1,
              sr_no: 1,
              scheduled_date: '2026-10-01',
              scheduled_time: '11:00 AM',
              day_of_week: 'Thursday',
              special_day: 'Launch Campaign',
              content_pillar: 'Brand Introduction',
              format: 'REEL',
              visual_brief: `Welcome reel highlighting core services of ${data.name}.`,
              reel_bytes_script: `Hook: "Introducing ${data.name} — your partner in success..."`,
              caption: `We are thrilled to officially launch with ${data.name}! Follow for more updates.`,
              status: 'READY_FOR_CLIENT',
              media_type: 'reel',
              media_url:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              suggestion: null,
            },
          ],
        },
      ],
    };

    setClients([newClient, ...clients]);
    setAdminSelectedClient(newClient);
    setAdminTab('calendars');
    setIsAddClientOpen(false);
    alert(`🎉 Client "${newClient.name}" created with October 2026 schedule!`);
  };

  // Handler to create a new monthly calendar (e.g. November 2026, December 2026)
  const handleCreateMonthlyCalendar = (
    clientId: number,
    month: string,
    year: number,
    target_creatives: number,
    target_reels: number,
    target_stories: number,
    prefill: boolean
  ) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const mIdx = Math.max(0, monthNames.indexOf(month));
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const firstDay = (new Date(year, mIdx, 1).getDay() + 6) % 7; // Monday-based offset
    const monthStr = (mIdx + 1).toString().padStart(2, '0');

    const newCalId = Date.now();
    const initialItems: CalendarItem[] = [];

    // Pre-fill special days map for popular months
    const specialDaysMap: Record<string, Record<number, { special: string; pillar: string; fmt: MediaFormat }>> = {
      'November': {
        1: { special: 'Diwali Dhanteras', pillar: 'Festival Campaign', fmt: 'CAROUSEL' },
        2: { special: 'Naraka Chaturdashi / Choti Diwali', pillar: 'Festival Wishes', fmt: 'IMAGE' },
        3: { special: 'Lakshmi Pujan / Diwali Main Day', pillar: 'Diwali Mega Reel', fmt: 'REEL' },
        4: { special: 'Govardhan Puja / New Year', pillar: 'Festive Offer', fmt: 'IMAGE' },
        5: { special: 'Bhai Dooj', pillar: 'Family & Trust', fmt: 'REEL' },
        14: { special: "Children's Day", pillar: 'Youth & Future Focus', fmt: 'REEL' },
        24: { special: 'Guru Nanak Jayanti', pillar: 'Inspirational Value', fmt: 'IMAGE' },
        27: { special: 'Black Friday Campaign', pillar: 'Special Promotion', fmt: 'CAROUSEL' },
      },
      'December': {
        1: { special: 'World AIDS Day', pillar: 'Healthcare Awareness', fmt: 'CAROUSEL' },
        4: { special: 'Navy Day', pillar: 'National Pride', fmt: 'IMAGE' },
        24: { special: 'Christmas Eve', pillar: 'Holiday Wishes', fmt: 'IMAGE' },
        25: { special: 'Merry Christmas', pillar: 'Festive Cheer Reel', fmt: 'REEL' },
        31: { special: "New Year's Eve", pillar: 'Year In Review & Thank You', fmt: 'REEL' },
      },
      'January': {
        1: { special: 'Happy New Year 2027', pillar: 'New Year Vision & Goals', fmt: 'REEL' },
        14: { special: 'Makar Sankranti / Pongal', pillar: 'Festive Celebration', fmt: 'IMAGE' },
        26: { special: 'Republic Day', pillar: 'Patriotic Pride Reel', fmt: 'REEL' },
      },
    };

    if (prefill && specialDaysMap[month]) {
      const monthSpecials = specialDaysMap[month];
      let sr = 1;
      for (const [dayStr, spec] of Object.entries(monthSpecials)) {
        const dayNum = parseInt(dayStr);
        const dayIndex = (firstDay + dayNum - 1) % 7;
        const dateStr = `${year}-${monthStr}-${dayNum < 10 ? '0' : ''}${dayNum}`;
        initialItems.push({
          id: newCalId + sr,
          calendar: newCalId,
          sr_no: sr,
          scheduled_date: dateStr,
          scheduled_time: '11:00 AM',
          day_of_week: dayNames[dayIndex],
          special_day: spec.special,
          content_pillar: spec.pillar,
          format: spec.fmt,
          post_category: 'REGULAR',
          priority: 'HIGH',
          visual_brief: `Branded ${spec.special} visual creative highlighting core client value proposition.`,
          reel_bytes_script: spec.fmt === 'REEL' ? `Hook: Celebrate ${spec.special} with purpose and excellence...` : null,
          caption: `Wishing everyone peace, joy, and prosperity this ${spec.special}! #${month}${year}`,
          status: 'READY_FOR_CLIENT',
          media_type: spec.fmt === 'REEL' ? 'reel' : spec.fmt === 'CAROUSEL' ? 'carousel' : 'image',
          media_url:
            spec.fmt === 'REEL'
              ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
              : 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
          uploaded_asset_url: null,
          assigned_to: INITIAL_EMPLOYEES[1],
        });
        sr++;
      }
    }

    const targetClientObj = clients.find((c) => c.id === clientId);
    const newCalendar: MonthlyCalendar = {
      id: newCalId,
      client: clientId,
      month: month,
      year: year,
      title: `${targetClientObj?.name || 'Client'} - ${month} ${year} Schedule`,
      status: 'PLANNING',
      target_creatives: target_creatives,
      target_reels: target_reels,
      target_stories: target_stories,
      total_items: initialItems.length,
      approved_items: 0,
      items: initialItems,
    };

    setClients((prevClients) =>
      prevClients.map((c) => {
        if (c.id !== clientId) return c;
        const updatedCalendars = [...(c.calendars || []), newCalendar];
        const updatedClient = {
          ...c,
          calendars: updatedCalendars,
        };
        if (adminSelectedClient && adminSelectedClient.id === c.id) {
          setAdminSelectedClient(updatedClient);
        }
        if (auth?.role === 'client' && auth.client?.id === c.id) {
          setAuth({ ...auth, client: updatedClient });
        }
        return updatedClient;
      })
    );

    return newCalId;
  };

  // Handler for Exporting Excel (.csv)
  const handleExportExcel = () => {
    const activeC = adminSelectedClient || clients[0];
    const items = activeC.calendars?.[0]?.items || [];

    const headers = [
      'Sr. No.',
      'Date',
      'Time',
      'Day',
      'Special Day',
      'Content Pillar',
      'Format',
      'Brand',
      'Category',
      'Priority',
      'Visual Brief',
      'Reel Script / Caption',
      'Status',
    ];

    const rows = items.map((i) => [
      i.sr_no,
      i.scheduled_date,
      i.scheduled_time || '11:00 AM',
      i.day_of_week,
      `"${i.special_day || '—'}"`,
      `"${i.content_pillar}"`,
      i.format,
      `"${i.brand || ''}"`,
      i.post_category || 'REGULAR',
      i.priority || 'NORMAL',
      `"${(i.visual_brief || '').replace(/"/g, '""')}"`,
      `"${(i.reel_bytes_script || i.caption || '').replace(/"/g, '""')}"`,
      i.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeC.name}_October_2026_Schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Excel Spreadsheet Exported!\n\nDownloaded "${activeC.name}_October_2026_Schedule.csv" formatted for agency handover.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full font-sans antialiased text-slate-900">
      <Routes>
        {/* Public Legal Pages for Meta/API Review */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        {/* Landing Hub */}
        <Route path="/" element={<LandingHubPage clients={clients} employees={employees} />} />

        {/* Dedicated Login Routes */}
        <Route
          path="/admin/login"
          element={<AdminLoginPage onLogin={(name) => handleLogin({ role: 'admin', name })} />}
        />
        <Route
          path="/team/login"
          element={
            <TeamLoginPage
              onLogin={(emp) =>
                handleLogin({
                  role: 'team',
                  name: `${emp.first_name} ${emp.last_name}`,
                  employeeId: emp.id,
                })
              }
            />
          }
        />
        <Route
          path="/client/login"
          element={
            <ClientLoginPage
              clients={clients}
              onLogin={(c) =>
                handleLogin({
                  role: 'client',
                  name: c.name,
                  clientId: c.id,
                })
              }
            />
          }
        />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Dedicated Admin Portal Route */}
        <Route
          path="/admin/*"
          element={
            auth?.role === 'admin' ? (
              <div className="flex-1 flex min-h-screen">
                <AdminSidebar
                  activeTab={adminTab}
                  onSelectTab={setAdminTab}
                  clients={clients}
                  selectedClient={adminSelectedClient}
                  onSelectClient={setAdminSelectedClient}
                  onOpenAddClient={() => setIsAddClientOpen(true)}
                  onOpenPlanPost={() => {
                    if (!adminSelectedClient) {
                      setAdminSelectedClient(clients[0]);
                    }
                  }}
                  onExportExcel={handleExportExcel}
                  onSignOut={handleSignOut}
                  teamCount={employees.length}
                  onOpenChat={() => {
                    setChatInitialClient('ALL');
                    setIsChatOpen(true);
                  }}
                  onOpenShoots={() => setIsShootModalOpen(true)}
                  onOpenGrowth={() => setIsSocialModalOpen(true)}
                />

                <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50">
                  {adminTab === 'dashboard' && (
                    <AdminDashboard
                      clients={clients}
                      employees={employees}
                      onOpenClient={(client) => {
                        setAdminSelectedClient(client);
                        setAdminTab('calendars');
                      }}
                    />
                  )}

                  {adminTab === 'calendars' && (
                    <>
                      {!adminSelectedClient ? (
                        <AdminClientsOverview
                          clients={clients}
                          onSelectClient={(client) => setAdminSelectedClient(client)}
                        />
                      ) : (
                        <AdminClientDetailPage
                          client={adminSelectedClient}
                          onBack={() => setAdminSelectedClient(null)}
                          onUpdateCalendarItem={handleUpdateCalendarItem}
                          onDeleteCalendarItem={handleDeleteCalendarItem}
                          onCreateCalendar={handleCreateMonthlyCalendar}
                          onPreviewMedia={(type, url, title) =>
                            setMediaPreview({ isOpen: true, type, url, title: title || 'Media Preview' })
                          }
                          onOpenExcelImport={(clientId) => {
                            setExcelImportClientId(clientId);
                            setIsExcelImportOpen(true);
                          }}
                          onOpenChat={(clientName) => {
                            setChatInitialClient(clientName);
                            setIsChatOpen(true);
                          }}
                        />
                      )}
                    </>
                  )}

                  {adminTab === 'clients' && (
                    <AdminClientsDirectoryView
                      clients={clients}
                      onSelectClient={(c) => {
                        setAdminSelectedClient(c);
                        setAdminTab('calendars');
                      }}
                      onOpenAddClient={() => setIsAddClientOpen(true)}
                    />
                  )}

                  {adminTab === 'revisions' && (
                    <AdminRevisionsView
                      clients={clients}
                      onOpenClientCalendar={(c) => {
                        setAdminSelectedClient(c);
                        setAdminTab('calendars');
                      }}
                    />
                  )}

                  {adminTab === 'team' && (
                    <AdminTeamView
                      employees={employees}
                      clients={clients}
                      onFilterEmployeeTasks={() => {
                        setAdminTab('calendars');
                      }}
                      onToggleManagerAccess={handleToggleManagerAccess}
                    />
                  )}
                </main>
              </div>
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Dedicated Team Portal Route */}
        <Route
          path="/team/*"
          element={
            auth?.role === 'team' && auth.employee ? (
              <TeamPortalView
                currentEmployee={auth.employee}
                employees={employees}
                clients={clients}
                adHocTasks={adHocTasks}
                onUpdateCalendarItem={handleUpdateCalendarItem}
                onUpdateAdHocTask={handleUpdateAdHocTask}
                onCreateAdHocTask={handleCreateAdHocTask}
                onPreviewMedia={(type, url, title) =>
                  setMediaPreview({ isOpen: true, type, url, title: title || 'Media Preview' })
                }
                onSignOut={handleSignOut}
                onOpenChat={(clientName) => {
                  setChatInitialClient(clientName || 'ALL');
                  setIsChatOpen(true);
                }}
                onOpenShoots={() => setIsShootModalOpen(true)}
                onOpenGrowth={() => setIsSocialModalOpen(true)}
              />
            ) : (
              <Navigate to="/team/login" replace />
            )
          }
        />

        {/* Dedicated Client Portal Route */}
        <Route
          path="/client/*"
          element={
            auth?.role === 'client' && auth.client ? (
              <div className="flex-1 flex min-h-screen">
                <ClientSidebar
                  client={auth.client}
                  activeTab={clientTab}
                  onSelectTab={setClientTab}
                  onSignOut={handleSignOut}
                />

                <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50">
                  {clientTab === 'calendar' && (
                    <ClientCalendarView
                      client={auth.client}
                      onApproveItem={handleApproveItem}
                      onSuggestItem={handleSuggestItem}
                    />
                  )}

                  {clientTab === 'reels' && (
                    <ClientReelsView
                      client={auth.client}
                      onPreviewReel={(item) =>
                        setMediaPreview({
                          isOpen: true,
                          type: 'reel',
                          url: item.media_url,
                          title: item.content_pillar,
                        })
                      }
                    />
                  )}

                  {clientTab === 'feedback' && (
                    <ClientFeedbackView
                      client={auth.client}
                      onOpenItem={() => setClientTab('calendar')}
                    />
                  )}
                </main>
              </div>
            ) : (
              <Navigate to="/client/login" replace />
            )
          }
        />

        {/* Fallback to Landing Hub */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Shared Modals */}
      <CreateClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onSubmit={handleAddClient}
      />

      <MediaModal
        isOpen={mediaPreview.isOpen}
        onClose={() => setMediaPreview({ ...mediaPreview, isOpen: false })}
        mediaType={mediaPreview.type}
        mediaUrl={mediaPreview.url}
        title={mediaPreview.title}
      />

      <InternalChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUser={getCurrentChatUser()}
        clients={clients}
        chatMessages={chatMessages}
        onSendMessage={handleSendMessage}
        initialClientFilter={chatInitialClient}
      />

      <SocialGrowthModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        trackers={socialTrackers}
        clients={clients}
        onUpdateTracker={handleUpdateTracker}
        onAddTracker={handleAddTracker}
        canEdit={auth?.role === 'admin' || Boolean(auth?.employee?.is_manager)}
      />

      <ShootScheduleModal
        isOpen={isShootModalOpen}
        onClose={() => setIsShootModalOpen(false)}
        shoots={shootSchedules}
        clients={clients}
        onAddShoot={handleAddShoot}
        canSchedule={auth?.role === 'admin' || Boolean(auth?.employee?.is_manager)}
      />

      <ExcelImportModal
        isOpen={isExcelImportOpen}
        onClose={() => setIsExcelImportOpen(false)}
        activeClient={
          excelImportClientId
            ? clients.find((c) => c.id === excelImportClientId)
            : adminSelectedClient
        }
        clients={clients}
        onImportCalendar={handleImportExcelCalendar}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
};

export default App;
