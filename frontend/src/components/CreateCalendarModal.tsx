import React, { useState } from 'react';
import { X, CalendarPlus } from 'lucide-react';
import { Client } from '../types';

interface CreateCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeClient: Client | null;
  onSubmit: (data: {
    client_id: number;
    month: string;
    year: number;
    target_creatives: number;
    target_reels: number;
    target_stories: number;
    brief?: string;
  }) => Promise<void>;
}

export const CreateCalendarModal: React.FC<CreateCalendarModalProps> = ({
  isOpen,
  onClose,
  activeClient,
  onSubmit,
}) => {
  const [month, setMonth] = useState('October');
  const [year, setYear] = useState(2026);
  const [targetCreatives, setTargetCreatives] = useState(activeClient?.target_creatives || 30);
  const [targetReels, setTargetReels] = useState(activeClient?.target_reels || 20);
  const [targetStories, setTargetStories] = useState(activeClient?.target_stories || 30);
  const [brief, setBrief] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !activeClient) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        client_id: activeClient.id,
        month,
        year,
        target_creatives: targetCreatives,
        target_reels: targetReels,
        target_stories: targetStories,
        brief,
      });
      onClose();
    } catch (err) {
      alert('Error creating calendar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <CalendarPlus className="w-4 h-4 text-blue-600" />
            <span>Create Monthly Calendar for {activeClient.name}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2026)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Creatives Target</label>
              <input
                type="number"
                value={targetCreatives}
                onChange={(e) => setTargetCreatives(parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Reels Target</label>
              <input
                type="number"
                value={targetReels}
                onChange={(e) => setTargetReels(parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Stories Target</label>
              <input
                type="number"
                value={targetStories}
                onChange={(e) => setTargetStories(parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Monthly Content Focus / Special Requirements
            </label>
            <textarea
              rows={2}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="e.g. Focus on Breast Cancer Awareness, Gandhi Jayanti, Bumper Offer..."
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              {loading ? 'Initializing...' : 'Generate Calendar Grid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
