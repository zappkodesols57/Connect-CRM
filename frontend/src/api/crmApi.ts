import { Client, MonthlyCalendar, CalendarItem } from '../types';

const API_BASE = '/api';

export const crmApi = {
  // Clients
  async getClients(): Promise<Client[]> {
    const res = await fetch(`${API_BASE}/clients/`);
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },

  async getClientBySlug(slug: string): Promise<Client> {
    const res = await fetch(`${API_BASE}/clients/by-slug/${slug}/`);
    if (!res.ok) throw new Error('Failed to fetch client by slug');
    return res.json();
  },

  async createClient(data: {
    name: string;
    slug: string;
    code: string;
    target_creatives: number;
    target_reels: number;
    target_stories: number;
    industry?: string;
    special_notes?: string;
  }): Promise<Client> {
    const res = await fetch(`${API_BASE}/clients/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create client');
    return res.json();
  },

  // Calendars
  async getCalendar(id: number): Promise<MonthlyCalendar> {
    const res = await fetch(`${API_BASE}/calendars/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch calendar');
    return res.json();
  },

  async createCalendarForClient(data: {
    client_id: number;
    month: string;
    year: number;
    target_creatives: number;
    target_reels: number;
    target_stories: number;
    brief?: string;
  }): Promise<MonthlyCalendar> {
    const res = await fetch(`${API_BASE}/calendars/create-for-client/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create calendar');
    return res.json();
  },

  // Items
  async addCalendarItem(data: Partial<CalendarItem>): Promise<CalendarItem> {
    const res = await fetch(`${API_BASE}/items/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add calendar item');
    return res.json();
  },

  async deleteCalendarItem(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/items/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete item');
  },

  async suggestItem(id: number, feedback: string): Promise<CalendarItem> {
    const res = await fetch(`${API_BASE}/items/${id}/suggest/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback }),
    });
    if (!res.ok) throw new Error('Failed to submit suggestion');
    return res.json();
  },

  async approveItem(id: number): Promise<CalendarItem> {
    const res = await fetch(`${API_BASE}/items/${id}/approve/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to approve item');
    return res.json();
  },

  async approveAllItems(calendarId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/items/approve-all/${calendarId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to approve all items');
  },

  // Export to Excel Download URL
  getExportExcelUrl(calendarId: number): string {
    return `${API_BASE}/calendars/${calendarId}/export-excel/`;
  }
};
