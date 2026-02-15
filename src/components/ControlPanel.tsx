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
}

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
}: ControlPanelProps) {
  const canSpeak = script.trim().length > 0 && !isSpeaking;

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
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="mt-1 text-xs text-gray-500 text-right">
          {script.length} characters
        </div>
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
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
