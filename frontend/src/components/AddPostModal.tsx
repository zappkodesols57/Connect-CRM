import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { CalendarItem, MediaFormat } from '../types';

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendarId: number;
  existingCount: number;
  onSubmit: (data: Partial<CalendarItem>) => Promise<void>;
}

export const AddPostModal: React.FC<AddPostModalProps> = ({
  isOpen,
  onClose,
  calendarId,
  existingCount,
  onSubmit,
}) => {
  const [date, setDate] = useState('2026-10-06');
  const [format, setFormat] = useState<MediaFormat>('REEL');
  const [specialDay, setSpecialDay] = useState('');
  const [pillar, setPillar] = useState('Doctor Branding');
  const [visualBrief, setVisualBrief] = useState('');
  const [reelScript, setReelScript] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(date);
    const dayName = days[d.getDay()] || 'Day';

    try {
      await onSubmit({
        calendar: calendarId,
        sr_no: existingCount + 1,
        scheduled_date: date,
        day_of_week: dayName,
        special_day: specialDay || null,
        content_pillar: pillar,
        format,
        visual_brief: visualBrief,
        reel_bytes_script: reelScript,
        caption,
        status: 'DRAFT',
        media_type: format === 'REEL' ? 'reel' : (format === 'CAROUSEL' ? 'carousel' : 'image'),
        media_url:
          format === 'REEL'
            ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            : 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      });
      onClose();
    } catch (err) {
      alert('Error adding post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Add Daily Post Slot (Native CRM Builder)</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Media Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as MediaFormat)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="REEL">REEL (Vertical Video 9:16)</option>
                <option value="IMAGE">IMAGE (Static Post 1:1)</option>
                <option value="CAROUSEL">CAROUSEL (Multi-Slide)</option>
                <option value="STORY">STORY (Daily Update)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Special Event / Day</label>
              <input
                type="text"
                value={specialDay}
                onChange={(e) => setSpecialDay(e.target.value)}
                placeholder="e.g. Indian Air Force Day"
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Content Pillar</label>
              <input
                type="text"
                required
                value={pillar}
                onChange={(e) => setPillar(e.target.value)}
                placeholder="e.g. Doctor Branding, Student Tips"
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Visual Direction / Brief</label>
            <input
              type="text"
              value={visualBrief}
              onChange={(e) => setVisualBrief(e.target.value)}
              placeholder="e.g. Doctor speaking directly on camera in consultation room"
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Script / Reel Bytes (Hook - Body - CTA)
            </label>
            <textarea
              rows={2}
              value={reelScript}
              onChange={(e) => setReelScript(e.target.value)}
              placeholder="e.g. Hook: What should you do when you notice an unusual symptom? Body: 3 steps..."
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Caption & Hashtags</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Early detection saves lives. Schedule your checkup today. #HealthFirst"
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow transition"
            >
              {loading ? 'Saving...' : 'Save to Calendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
