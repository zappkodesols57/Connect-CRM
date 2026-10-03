import React, { useState } from 'react';
import { X, MessageSquarePlus } from 'lucide-react';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  onSubmit: (itemId: number, feedback: string) => Promise<void>;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
  isOpen,
  onClose,
  itemId,
  onSubmit,
}) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !itemId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setLoading(true);
    try {
      await onSubmit(itemId, feedback);
      setFeedback('');
      onClose();
    } catch (err) {
      alert('Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <MessageSquarePlus className="w-4 h-4 text-blue-600" />
            <span>Request Changes for Post #{itemId}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Feedback Category</label>
            <div className="grid grid-cols-3 gap-2">
              <label className="border border-slate-200 p-2 rounded-lg text-center cursor-pointer hover:bg-slate-50 flex flex-col items-center">
                <input type="radio" name="suggCat" defaultChecked className="text-blue-600" />
                <span className="mt-1 font-medium">Visual Design</span>
              </label>
              <label className="border border-slate-200 p-2 rounded-lg text-center cursor-pointer hover:bg-slate-50 flex flex-col items-center">
                <input type="radio" name="suggCat" className="text-blue-600" />
                <span className="mt-1 font-medium">Script / Caption</span>
              </label>
              <label className="border border-slate-200 p-2 rounded-lg text-center cursor-pointer hover:bg-slate-50 flex flex-col items-center">
                <input type="radio" name="suggCat" className="text-blue-600" />
                <span className="mt-1 font-medium">Date Shift</span>
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Detailed Change Request</label>
            <textarea
              required
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Please update the doctor's qualification to MD Pediatrics in slide 2..."
              className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              {loading ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
