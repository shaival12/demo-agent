import { useState } from 'react';
import { Video, ChevronDown, ChevronUp } from 'lucide-react';

interface AvatarVideoUrlEditorProps {
  avatarName: string;
  customUrl: string;
  onCustomUrlChange: (url: string) => void;
  theme?: 'light' | 'dark';
}

export function AvatarVideoUrlEditor({
  avatarName,
  customUrl,
  onCustomUrlChange,
  theme = 'light',
}: AvatarVideoUrlEditorProps) {
  const [showUrl, setShowUrl] = useState(false);

  const isDark = theme === 'dark';
  const labelClass = isDark ? 'text-slate-200' : 'text-gray-700';
  const inputClass = isDark
    ? 'bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:ring-blue-500'
    : 'border-gray-300';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className={`text-sm font-semibold uppercase tracking-wide ${labelClass}`}>
          <Video className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          Avatar video
        </h2>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className={`text-xs font-medium flex items-center gap-1 rounded-md px-2 py-1 transition-colors ${
            isDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          {showUrl ? (
            <>
              Hide URL <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show URL <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
      {showUrl && (
        <div className="space-y-1.5">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => onCustomUrlChange(e.target.value)}
            placeholder="e.g. https://www.pexels.com/video/... or direct .mp4 link"
            className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:border-transparent ${inputClass}`}
            aria-label={`Custom talking video URL for ${avatarName}`}
          />
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            Overrides default video for {avatarName}. Use a direct video URL (e.g. .mp4) when possible.
          </p>
        </div>
      )}
    </div>
  );
}
