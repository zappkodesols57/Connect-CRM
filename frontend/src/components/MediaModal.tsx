import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: 'image' | 'reel' | 'carousel';
  mediaUrl?: string | null;
  title: string;
}

export const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  mediaType,
  mediaUrl,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-bold text-slate-800">{title || 'Media Preview'}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Cloud Storage Stream (S3 / R2)
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[360px]">
          {mediaType === 'reel' ? (
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-2xl bg-black border border-slate-800">
              <video
                controls
                autoPlay
                className="w-full aspect-[9/16] object-cover"
                src={mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
              >
                Your browser does not support video playback.
              </video>
              <div className="p-2 bg-slate-900/90 text-center text-xs text-slate-300">
                <span className="flex items-center justify-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4K Vertical Reel • Zero Google Drive login needed</span>
                </span>
              </div>
            </div>
          ) : mediaType === 'carousel' ? (
            <div className="w-full max-w-md bg-slate-900 rounded-xl p-4 text-center text-white border border-slate-800">
              <div className="h-64 rounded-lg bg-gradient-to-br from-indigo-900 to-purple-950 flex flex-col items-center justify-center p-6 border border-indigo-700/50">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Multi-Slide Carousel • Slide 1 of 5
                </span>
                <h4 className="text-base font-bold mt-2">
                  "Breast cancer only happens after 50? Myth Busted."
                </h4>
                <p className="text-xs text-slate-300 mt-2">
                  Age alone should never be the reason to ignore subtle changes.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 text-xs px-2">
                <button
                  onClick={() => alert('Slide 1 of 5')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  Previous
                </button>
                <span className="text-slate-400">Slide 1 / 5</span>
                <button
                  onClick={() => alert('Next Slide 2: When to Consult a Specialist')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white font-medium"
                >
                  Next Slide
                </button>
              </div>
            </div>
          ) : (
            <img
              src={mediaUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'}
              alt="Creative"
              className="max-h-[380px] rounded-lg object-contain shadow-2xl"
            />
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>Instant scrubbing • Byte-range HTTP 206 streaming</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
