export type MediaFormat = 'IMAGE' | 'REEL' | 'CAROUSEL' | 'STORY';
export type ItemStatus =
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'INTERNAL_APPROVED'
  | 'READY_FOR_CLIENT'
  | 'CHANGES_REQ'
  | 'APPROVED'
  | 'PUBLISHED';
export type CalendarStatus = 'PLANNING' | 'SHARED' | 'APPROVED' | 'LOCKED';
export type PostCategory = 'REGULAR' | 'EXTRA';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'NORMAL';

export interface CalendarItemNote {
  id: number;
  author: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  text: string;
  created_at: string;
}

export interface CalendarItem {
  id: number;
  calendar: number;
  sr_no: number;
  scheduled_date: string;
  scheduled_time?: string | null;
  day_of_week: string;
  special_day?: string | null;
  content_pillar: string;
  format: MediaFormat;
  visual_brief?: string | null;
  reel_bytes_script?: string | null;
  caption?: string | null;
  hashtags?: string | null;
  status: ItemStatus;
  post_category?: PostCategory;
  priority?: PriorityLevel;
  media_type: 'image' | 'reel' | 'carousel';
  media_url?: string | null;
  uploaded_asset_url?: string | null;
  reference_url?: string | null;
  internal_notes?: string | null;
  team_notes?: CalendarItemNote[];
  suggestion?: string | null;
  assigned_to?: Employee | null;
  brand?: string | null;
}

export interface Employee {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email_id: string;
  team_group: string;
  mobile_number: string;
  designation: string;
  avatar_color?: string;
  is_manager?: boolean;
}

export interface MonthlyCalendar {
  id: number;
  client: number;
  month: string;
  year: number;
  title: string;
  status: CalendarStatus;
  target_creatives: number;
  target_reels: number;
  target_stories: number;
  items?: CalendarItem[];
  total_items?: number;
  approved_items?: number;
}

export interface Client {
  id: number;
  name: string;
  slug: string;
  code: string;
  logo_url?: string | null;
  primary_color: string;
  industry?: string;
  target_creatives: number;
  target_reels: number;
  target_stories: number;
  special_notes?: string | null;
  brands?: string[];
  calendars?: MonthlyCalendar[];
  active_calendar?: {
    id: number;
    month: string;
    year: number;
    status: CalendarStatus;
    total_items: number;
    approved_items: number;
    target_creatives: number;
    target_reels: number;
  } | null;
}

export interface AdHocTask {
  id: number;
  title: string;
  description?: string;
  client_id?: number;
  client_name?: string;
  assigned_to: Employee;
  assigned_by: string;
  due_date: string;
  priority: PriorityLevel;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  reference_url?: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  sender_id?: number;
  sender_name: string;
  sender_role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  avatar_color?: string;
  client_id?: number;
  client_name?: string;
  task_id?: number;
  item_id?: number;
  message: string;
  created_at: string;
}

export interface SocialMediaTracker {
  id: number;
  client_id: number;
  client_name: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'LINKEDIN' | 'YOUTUBE';
  handle: string;
  month: string;
  year: number;
  starting_followers: number;
  current_followers: number;
  target_followers?: number;
  assigned_to: Employee;
  last_updated: string;
}

export interface ShootSchedule {
  id: number;
  client_id: number;
  client_name: string;
  shoot_date: string;
  shoot_time: string;
  location: string;
  brief: string;
  assigned_crew: Employee[];
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  reminder_note?: string;
  created_at: string;
}
