import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  script: string;
  instructions: string;
  onScriptChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
  onSpeak: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReplay: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  theme?: 'light' | 'dark';
  /** Live speech position for subtitle-style highlighting */
  spokenText?: string;
  currentCharIndex?: number | null;
}

const textareaBase =
  'w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none border';

export function ControlPanel({
  script,
  instructions,
  onScriptChange,
  onInstructionsChange,
  onSpeak,
  onPause,
  onResume,
  onStop,
  onReplay,
  isSpeaking,
  isPaused,
  theme = 'light',
  spokenText,
  currentCharIndex,
}: ControlPanelProps) {
  const canSpeak = script.trim().length > 0 && !isSpeaking;
  const textareaClass =
    theme === 'dark'
      ? `${textareaBase} border-slate-600 bg-slate-100 text-gray-900 placeholder:text-gray-500`
      : `${textareaBase} border-gray-300`;

  const subtitleSource = (spokenText && spokenText.length > 0 ? spokenText : script) || '';

  let before = '';
  let highlighted = '';
  let after = '';

  if (subtitleSource && typeof currentCharIndex === 'number' && currentCharIndex >= 0) {
    const index = Math.min(currentCharIndex, subtitleSource.length - 1);

    type Range = { start: number; end: number };
    const ranges: Range[] = [];
    let start = 0;

    for (let i = 0; i < subtitleSource.length; i += 1) {
      const ch = subtitleSource[i];
      const isLastChar = i === subtitleSource.length - 1;
      if (ch === '.' || ch === '!' || ch === '?' || isLastChar) {
        let end = isLastChar ? i + 1 : i + 1;
        // Include trailing spaces in the current sentence
        while (end < subtitleSource.length && subtitleSource[end] === ' ') {
          end += 1;
        }
        ranges.push({ start, end });
        start = end;
      }
    }

    const currentRange =
      ranges.find((r) => index >= r.start && index < r.end) || ranges[ranges.length - 1];

    if (currentRange) {
      before = subtitleSource.slice(0, currentRange.start);
      highlighted = subtitleSource.slice(currentRange.start, currentRange.end);
      after = subtitleSource.slice(currentRange.end);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={isPaused ? onResume : isSpeaking ? onPause : onSpeak}
          disabled={!canSpeak && !isSpeaking}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            canSpeak || isSpeaking
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-label={isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Speak'}
        >
          {isSpeaking ? (
            isPaused ? (
              <>
                <Play className="w-5 h-5" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            )
          ) : (
            <>
              <Play className="w-5 h-5" />
              Speak
            </>
          )}
        </button>

        <button
          onClick={onStop}
          disabled={!isSpeaking}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isSpeaking
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Stop"
        >
          <Square className="w-5 h-5" />
        </button>

        <button
          onClick={onReplay}
          disabled={!script.trim() || isSpeaking}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            script.trim() && !isSpeaking
              ? 'bg-gray-700 hover:bg-gray-800 text-white shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Replay"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label
          htmlFor="script"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Script / What to say
        </label>
        <textarea
          id="script"
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          placeholder="Type what the avatar should say…"
          rows={6}
          className={textareaClass}
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>{script.length} characters</span>
          {subtitleSource && isSpeaking && highlighted && (
            <span className="text-blue-600 font-medium">Showing live sentence highlight</span>
          )}
        </div>

        {subtitleSource && highlighted && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Subtitle preview
            </div>
            <div
              className={`text-sm leading-relaxed rounded-lg border px-3 py-2 whitespace-pre-wrap ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-slate-100'
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            >
              <span>{before}</span>
              <span
                className={
                  theme === 'dark'
                    ? 'bg-yellow-400/40 rounded px-0.5'
                    : 'bg-yellow-200 rounded px-0.5'
                }
              >
                {highlighted}
              </span>
              <span>{after}</span>
            </div>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="instructions"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Instructions / Persona
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          placeholder="E.g., 'Speak like a friendly sales engineer' or 'Slow pace, confident tone, short pauses after sentences'"
          rows={4}
          className={textareaClass}
        />
      </div>
    </div>
  );
}
