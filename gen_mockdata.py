#!/usr/bin/env python3
"""Generate mockData.ts from the October 2026 Excel calendar."""
import openpyxl, json, sys, os
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

REEL_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
IMG_URL  = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'

_iid = 20000
_cid = 300
_pid = 20

def new_iid():
    global _iid; _iid += 1; return _iid
def new_cid():
    global _cid; _cid += 1; return _cid
def new_pid():
    global _pid; _pid += 1; return _pid

def jsv(v):
    """Python value -> TS literal string or null."""
    if v is None: return 'null'
    s = str(v).strip()
    if not s or s.lower() in ('none', 'nan', 'null', '-'): return 'null'
    return json.dumps(s, ensure_ascii=False)

def map_fmt(t):
    if not t: return 'IMAGE'
    u = str(t).upper()
    if 'REEL' in u: return 'REEL'
    if any(x in u for x in ['CARO', 'CROUS', 'CRUSE', 'SLIDE']): return 'CAROUSEL'
    return 'IMAGE'

def map_status(s):
    if not s: return 'READY_FOR_CLIENT'
    if 'DONE' in str(s).upper(): return 'APPROVED'
    return 'READY_FOR_CLIENT'

def fmt_date(d):
    if isinstance(d, datetime): return d.strftime('%Y-%m-%d')
    return None

def murl(fmt): return REEL_URL if fmt == 'REEL' else IMG_URL
def mtype(fmt):
    if fmt == 'REEL': return 'reel'
    if fmt == 'CAROUSEL': return 'carousel'
    return 'image'

def pillar_or_default(p):
    v = jsv(p)
    return v if v != 'null' else '"General"'

def make_item(cal, sr, date, day, special, pillar, fmt, visual, content, status, brand=None, item_idx=0):
    iid = new_iid()
    b = f'\n        brand: {jsv(brand)},' if brand is not None else ''
    reel_s = jsv(content) if fmt == 'REEL' else 'null'
    cap    = jsv(content) if fmt != 'REEL' else 'null'

    # Realistic Scheduled Time slots
    time_choices = ['11:00 AM', '01:30 PM', '05:00 PM', '07:30 PM', '08:30 PM']
    time_val = time_choices[item_idx % len(time_choices)]

    # Category: Regular vs Extra
    cat_val = 'EXTRA' if (item_idx % 8 == 0) else 'REGULAR'

    # Priority level
    prio_val = 'HIGH' if (special or item_idx % 6 == 0) else ('MEDIUM' if (item_idx % 3 == 0) else 'NORMAL')

    # Team members:
    # 0: Shreya Thakur (Manager)
    # 1: Gaurav Bhingare (Jr. Video Editor)
    # 2: Achal Ragit (Graphic Designer)
    # 3: Rohan Katre (Graphic Designer)
    # 4: Prachi Pantawane (Digital Marketing Exec)
    # 5: Achal Wankhede (SEO Exec)
    # 6: Diksha Bisen (Intern Digital Marketing)
    # 7: Prerna Yewle (Intern eCommerce / Planner)
    if fmt == 'REEL':
        emp_idx = 1 if (item_idx % 3 != 0) else 7
    elif fmt == 'CAROUSEL':
        emp_idx = 2 if (item_idx % 2 == 0) else 3
    else:
        emp_pool = [2, 3, 4, 6, 7]
        emp_idx = emp_pool[item_idx % len(emp_pool)]

    asset_val = jsv(murl(fmt)) if status == 'APPROVED' else 'null'

    return (
        f'      {{\n'
        f'        id: {iid},\n'
        f'        calendar: {cal},\n'
        f'        sr_no: {sr},\n'
        f'        scheduled_date: {jsv(date)},\n'
        f'        scheduled_time: {jsv(time_val)},\n'
        f'        day_of_week: {jsv(str(day)) if day else chr(34)+"Unknown"+chr(34)},\n'
        f'        special_day: {jsv(special)},\n'
        f'        content_pillar: {pillar_or_default(pillar)},\n'
        f'        format: \'{fmt}\',\n'
        f'        post_category: \'{cat_val}\',\n'
        f'        priority: \'{prio_val}\',\n'
        f'        visual_brief: {jsv(visual)},\n'
        f'        reel_bytes_script: {reel_s},\n'
        f'        caption: {cap},\n'
        f'        status: \'{status}\',\n'
        f'        media_type: \'{mtype(fmt)}\',\n'
        f'        media_url: {jsv(murl(fmt))},\n'
        f'        uploaded_asset_url: {asset_val},\n'
        f'        suggestion: null,{b}\n'
        f'        assigned_to: INITIAL_EMPLOYEES[{emp_idx}],\n'
        f'      }}'
    )

def find_data_start(ws):
    for i, row in enumerate(ws.iter_rows(max_row=35, values_only=True), 1):
        if row and row[0] and 'sr' in str(row[0]).lower():
            return i + 1
    return 20

def process_standard(ws, data_start, cal):
    items, sr = [], 0
    for row in ws.iter_rows(min_row=data_start, values_only=True):
        if len(row) < 6: continue
        d = fmt_date(row[1])
        if not d or not d.startswith('2026-10'): continue
        day    = row[2]
        special= row[3]
        pillar = row[4]
        typ    = row[5]
        content= row[6] if len(row) > 6 else None
        visual = row[7] if len(row) > 7 else None
        stat   = row[8] if len(row) > 8 else None
        fmt = map_fmt(typ)
        if not typ and not content: continue
        sr += 1
        items.append(make_item(cal, sr, d, day, special, pillar, fmt, visual, content, map_status(stat), None, sr))
    return items

def process_nelson(ws, data_start, cal):
    items, sr1, sr2 = [], 0, 0
    for row in ws.iter_rows(min_row=data_start, values_only=True):
        if len(row) < 9: continue
        d = fmt_date(row[1])
        if not d or not d.startswith('2026-10'): continue
        day = row[2]; special = row[3]

        # Nelson Luxe cols: 4=pillar, 5=topic, 6=type, 7=visual, 8=content, 9=status
        l_p  = row[4]; l_tp = row[5]; l_fmt= row[6]
        l_v  = row[7]; l_c  = row[8]
        l_s  = row[9] if len(row) > 9 else None

        # Nelson Hospital cols: 11=type, 12=pillar, 13=topic, 14=visual, 15=content, 16=status
        h_fmt= row[11] if len(row) > 11 else None
        h_p  = row[12] if len(row) > 12 else None
        h_tp = row[13] if len(row) > 13 else None
        h_v  = row[14] if len(row) > 14 else None
        h_c  = row[15] if len(row) > 15 else None
        h_s  = row[16] if len(row) > 16 else None

        if l_fmt or l_c:
            sr1 += 1
            fmt = map_fmt(l_fmt)
            p   = str(l_p or l_tp or 'General').strip()
            items.append(make_item(cal, sr1, d, day, special, p, fmt, l_v, l_c, map_status(l_s), 'Nelson Luxe Hospital', sr1))

        if h_fmt or h_c:
            sr2 += 1
            fmt = map_fmt(h_fmt)
            p   = str(h_p or h_tp or 'General').strip()
            items.append(make_item(cal, sr2, d, day, special, p, fmt, h_v, h_c, map_status(h_s), 'Nelson Hospital', sr2 + 100))
    return items

# (sheet_name, CRM name, slug, code, color, industry, t_creatives, t_reels, t_stories, dual_brand)
CONFIGS = [
    ('Neuro',              'Central Brain & Spine Hospital', 'neuro',        'NEURO',    '#7C3AED', 'Healthcare & Neurology',    20, 10, 30, False),
    ('nelson',             'Nelson',                        'nelson',        'NELSON',   '#2563EB', 'Healthcare & Maternity',    30, 20, 30, True ),
    ('OCC KCR',            'OCC KCR',                       'occ-kcr',       'OCC',      '#EA580C', 'Transport & Cab Services',  15,  8, 30, False),
    ('commerce',           'Prerna Commerce College',       'commerce',      'PRERNA',   '#059669', 'Education (Commerce)',       20, 10, 30, False),
    ('Kohinoor TEZ',       'Kohinoor TEZ',                  'kohinoor',      'KOHINOOR', '#D97706', 'Education (Study Notes)',    15, 10, 30, False),
    ('MBA',                'Prerna MBA',                    'mba',           'MBA',      '#9333EA', 'Higher Education',           20, 10, 30, False),
    ('Convent',            'Prerna Convent',                'convent',       'CONVENT',  '#0891B2', 'School Education',           20, 10, 30, False),
    ('international',      'Prerna International',          'international', 'INTL',     '#4F46E5', 'International Education',    20, 10, 30, False),
    ('zappkode solution ', 'Zappkode Solutions',            'zappkode',      'ZS',       '#1D4ED8', 'IT & Tech Agency',           20, 10, 30, False),
    ('zappcode academy',   'Zappkode Academy',              'zappacademy',   'ZA',       '#6D28D9', 'EdTech',                     20, 10, 30, False),
    ('Vibetara ',          'Vibetara',                      'vibetara',      'VIBE',     '#DB2777', 'Lifestyle & Fashion',        20, 10, 30, False),
]

wb = openpyxl.load_workbook(r'F:\Oct Calender 2026.xlsx')

EMPLOYEES_BLOCK = """export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1634, user_id: "922614612", first_name: "Shreya", last_name: "Thakur", email_id: "shreya.thakur@zappcode.in", team_group: "Social Media Team", mobile_number: "922614612", designation: "Digital Marketing Manager", avatar_color: "bg-indigo-600" },
  { id: 1600, user_id: "9834998359", first_name: "Gaurav", last_name: "Bhingare", email_id: "gaurav.bhingare@zappcode.in", team_group: "Social Media Team", mobile_number: "9834998359", designation: "Jr. Video Editor", avatar_color: "bg-purple-600" },
  { id: 1597, user_id: "7447682328", first_name: "Achal", last_name: "Ragit", email_id: "aachal.ragit@zappcode.in", team_group: "Social Media Team", mobile_number: "7447682328", designation: "Graphic Designer", avatar_color: "bg-pink-600" },
  { id: 1617, user_id: "9322621335", first_name: "Rohan", last_name: "Katre", email_id: "rohankatre90@gmail.com", team_group: "Social Media Team", mobile_number: "9322621335", designation: "Graphic Designer", avatar_color: "bg-blue-600" },
  { id: 1598, user_id: "7517061696", first_name: "Prachi", last_name: "Pantawane", email_id: "prachi.pantawane@zappcode.in", team_group: "Social Media Team", mobile_number: "7517061696", designation: "Digital Marketing Executive", avatar_color: "bg-teal-600" },
  { id: 1594, user_id: "8668988901", first_name: "Achal", last_name: "Wankhede", email_id: "achal.wankhede@zappcode.in", team_group: "Social Media Team", mobile_number: "8668988901", designation: "SEO Exceutive", avatar_color: "bg-amber-600" },
  { id: 1629, user_id: "8805841001", first_name: "Diksha", last_name: "Bisen", email_id: "bisendiksha97@gmail.com", team_group: "Social Media Team", mobile_number: "8805841001", designation: "Intern Digital Marketing", avatar_color: "bg-emerald-600" },
  { id: 1623, user_id: "9325053129", first_name: "Prerna", last_name: "Yewle", email_id: "prernayewle091@gmail.com", team_group: "Social Media Team", mobile_number: "9325053129", designation: "Intern eCommerce Management", avatar_color: "bg-cyan-600" },
];

export const INITIAL_ADHOC_TASKS: AdHocTask[] = [
  {
    id: 9001,
    title: "Hospital Shoot & Doctor Byte Coverage",
    description: "Visit Nelson Luxe Hospital OPD at 2:00 PM to record 3 reel bytes with Dr. Ananya for Pink October breast cancer awareness.",
    client_id: 21,
    client_name: "Nelson",
    assigned_to: INITIAL_EMPLOYEES[1],
    assigned_by: "Shreya Thakur (Manager)",
    due_date: "2026-10-05",
    priority: "HIGH",
    status: "IN_PROGRESS",
    created_at: "2026-10-01",
  },
  {
    id: 9002,
    title: "Diwali Promo Banners & Print Specs",
    description: "Design 3 horizontal Diwali discount banners for Kohinoor Tez retail stores and website header.",
    client_id: 24,
    client_name: "Kohinoor TEZ",
    assigned_to: INITIAL_EMPLOYEES[2],
    assigned_by: "Shreya Thakur (Manager)",
    due_date: "2026-10-12",
    priority: "HIGH",
    status: "TODO",
    created_at: "2026-10-02",
  },
  {
    id: 9003,
    title: "Instagram Bio, Highlights & Story Revamp",
    description: "Update highlight icons for Central Brain & Spine Hospital (Services, Doctors, Testimonials, Facilities).",
    client_id: 20,
    client_name: "Central Brain & Spine Hospital",
    assigned_to: INITIAL_EMPLOYEES[3],
    assigned_by: "Shreya Thakur (Manager)",
    due_date: "2026-10-08",
    priority: "MEDIUM",
    status: "DONE",
    created_at: "2026-10-01",
  },
  {
    id: 9004,
    title: "Hashtag Strategy & Competitor Benchmark",
    description: "Audit top 5 competitor college Instagram profiles in Nagpur and compile 30 high-engagement hashtags for admissions.",
    client_id: 23,
    client_name: "Prerna Commerce College",
    assigned_to: INITIAL_EMPLOYEES[4],
    assigned_by: "Shreya Thakur (Manager)",
    due_date: "2026-10-10",
    priority: "NORMAL",
    status: "IN_PROGRESS",
    created_at: "2026-10-03",
  },
  {
    id: 9005,
    title: "EdTech Course Reel Scriptwriting (Python & AI Batch)",
    description: "Write 4 conversational hooks for Zappkode Academy upcoming full-stack development masterclass.",
    client_id: 29,
    client_name: "Zappkode Academy",
    assigned_to: INITIAL_EMPLOYEES[7],
    assigned_by: "Shreya Thakur (Manager)",
    due_date: "2026-10-07",
    priority: "HIGH",
    status: "TODO",
    created_at: "2026-10-02",
  },
];
"""

clients_out = []
for (sheet, name, slug, code, color, industry, tc, tr, ts, dual) in CONFIGS:
    if sheet not in wb.sheetnames:
        print(f'// WARNING: sheet not found: {sheet!r}', file=sys.stderr)
        continue
    ws  = wb[sheet]
    pid = new_pid()
    cid = new_cid()
    ds  = find_data_start(ws)
    items = process_nelson(ws, ds, cid) if dual else process_standard(ws, ds, cid)
    print(f'// {name}: {len(items)} items extracted', file=sys.stderr)
    items_ts = ',\n'.join(items)
    brands_prop = '\n    brands: ["Nelson Luxe Hospital", "Nelson Hospital"],' if dual else ''

    clients_out.append(
        f'  {{\n'
        f'    id: {pid},\n'
        f'    name: {jsv(name)},\n'
        f'    slug: {jsv(slug)},\n'
        f'    code: {jsv(code)},\n'
        f'    primary_color: {jsv(color)},\n'
        f'    industry: {jsv(industry)},\n'
        f'    target_creatives: {tc},\n'
        f'    target_reels: {tr},\n'
        f'    target_stories: {ts},\n'
        f'    special_notes: null,{brands_prop}\n'
        f'    calendars: [{{\n'
        f'      id: {cid},\n'
        f'      client: {pid},\n'
        f'      month: "October",\n'
        f'      year: 2026,\n'
        f'      title: {jsv(name + " - October 2026 Calendar")},\n'
        f'      status: "SHARED",\n'
        f'      target_creatives: {tc},\n'
        f'      target_reels: {tr},\n'
        f'      target_stories: {ts},\n'
        f'      items: [\n'
        f'{items_ts}\n'
        f'      ],\n'
        f'    }}],\n'
        f'  }}'
    )

content = (
    "import { Client, Employee, AdHocTask } from '../types';\n\n"
    + EMPLOYEES_BLOCK + "\n"
    + "export const INITIAL_CLIENTS: Client[] = [\n"
    + ',\n'.join(clients_out)
    + "\n];\n"
)

dest = r'F:\zkconnect\frontend\src\data\mockData.ts'
with open(dest, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully generated {dest} with {len(clients_out)} clients and INITIAL_ADHOC_TASKS!")
