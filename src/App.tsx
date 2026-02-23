import { useState } from 'react';
import { Film } from 'lucide-react';
import { AvatarSelector } from './components/AvatarSelector';
import { AvatarVideoUrlEditor } from './components/AvatarVideoUrlEditor';
import { ControlPanel } from './components/ControlPanel';
import { VideoPlayer } from './components/VideoPlayer';
import { avatars } from './config/avatars';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import {
  selectVoiceByAccent,
  selectVoiceByGender,
  selectVoiceDeepMale,
} from './utils/voiceSelector';

type Theme = 'light' | 'dark';

function App() {
  const [selectedAvatarId, setSelectedAvatarId] = useState(avatars[0].id);
  const [script, setScript] = useState('');
  const [instructions, setInstructions] = useState('');
  const [theme, setTheme] = useState<Theme>('light');
  const [cinematic, setCinematic] = useState(false);
  const [customTalkingVideoUrls, setCustomTalkingVideoUrls] = useState<Record<string, string>>({});

  const {
    voices,
    isSpeaking,
    isPaused,
    currentCharIndex,
    spokenText,
    speak,
    pause,
    resume,
    stop,
  } = useSpeechSynthesis();

  const effectiveTheme: Theme = cinematic ? 'dark' : theme;

  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId) || avatars[0];
  const effectiveTalkingVideoUrl =
    customTalkingVideoUrls[selectedAvatarId]?.trim() || selectedAvatar.talkingVideoUrl;

  const setCustomTalkingVideoUrl = (avatarId: string, url: string) => {
    setCustomTalkingVideoUrls((prev) => (url.trim() ? { ...prev, [avatarId]: url } : { ...prev, [avatarId]: '' }));
  };

  const handleSpeak = () => {
    const deepMaleVoice =
      selectedAvatar.voicePreference === 'deep' && selectVoiceDeepMale(voices);
    const genderVoice =
      selectedAvatar.voiceGender && selectVoiceByGender(voices, selectedAvatar.voiceGender);
    const accentVoice = selectVoiceByAccent(voices, selectedAvatar.accent ?? 'default');
    const voice =
      deepMaleVoice ||
      genderVoice ||
      accentVoice ||
      voices[selectedAvatar.voiceIndex ?? 0] ||
      voices[0];
    speak(
      script,
      {
        rate: selectedAvatar.rate,
        pitch: selectedAvatar.pitch,
        volume: 1.0,
        voice,
      },
      instructions
    );
  };

  const handleReplay = () => {
    stop();
    setTimeout(() => handleSpeak(), 100);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        effectiveTheme === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900'
      }`}
    >
      <div className="h-screen flex flex-col">
        <header
          className={`transition-all duration-300 ${
            cinematic ? 'pointer-events-none' : ''
          } ${
            effectiveTheme === 'dark'
              ? 'bg-gradient-to-r from-slate-800 to-slate-950 border-b border-slate-900 shadow-sm backdrop-blur'
              : 'bg-white border-b border-gray-200 shadow-sm'
          }`}
        >
          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1
                className={
                  effectiveTheme === 'dark'
                    ? 'text-2xl font-bold text-slate-50'
                    : 'text-2xl font-bold text-gray-900'
                }
              >
                Demo Agent
              </h1>
              <p
                className={
                  effectiveTheme === 'dark'
                    ? 'text-sm text-slate-400 mt-1'
                    : 'text-sm text-gray-600 mt-1'
                }
              >
                Select an avatar, write your script, and watch it come to life
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  effectiveTheme === 'dark'
                    ? 'text-sm font-medium text-slate-300'
                    : 'text-sm font-medium text-gray-600'
                }
              >
                Theme
              </span>
              <button
                type="button"
                onClick={() => setCinematic((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  cinematic
                    ? effectiveTheme === 'dark'
                      ? 'bg-amber-600/80 text-white'
                      : 'bg-amber-500 text-white'
                    : effectiveTheme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Film className="w-4 h-4" />
                Cinematic
              </button>
              <div
                className={
                  effectiveTheme === 'dark'
                    ? 'flex rounded-lg border border-slate-700 overflow-hidden bg-slate-900/80'
                    : 'flex rounded-lg border border-gray-200 overflow-hidden bg-gray-50'
                }
              >
                {(['light', 'dark'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTheme(option)}
                    className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                      theme === option
                        ? theme === 'dark'
                          ? 'bg-slate-800 text-slate-50 shadow-sm'
                          : 'bg-white text-gray-900 shadow-sm'
                        : theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden min-h-0">
          <div className="h-full flex flex-col lg:flex-row gap-6 p-6 min-h-0">
            <aside
              className={`w-full lg:w-1/4 flex flex-col gap-6 min-h-0 min-w-0 transition-all duration-300 ${
                cinematic ? 'pointer-events-none' : ''
              }`}
            >
              {/* Avatar section: never scrolls, always visible */}
              <div
                className={`flex-shrink-0 ${
                  effectiveTheme === 'dark'
                    ? 'bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg p-6'
                    : 'bg-white rounded-2xl shadow-lg p-6'
                }`}
              >
                <AvatarSelector
                  avatars={avatars}
                  selectedAvatarId={selectedAvatarId}
                  onSelectAvatar={setSelectedAvatarId}
                  isSpeaking={isSpeaking}
                  effectiveTalkingVideoUrl={effectiveTalkingVideoUrl}
                />
                <div
                  className={`mt-4 pt-4 border-t ${
                    effectiveTheme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                  }`}
                >
                  <AvatarVideoUrlEditor
                    avatarName={selectedAvatar.name}
                    customUrl={customTalkingVideoUrls[selectedAvatarId] ?? ''}
                    onCustomUrlChange={(url) => setCustomTalkingVideoUrl(selectedAvatarId, url)}
                    theme={effectiveTheme}
                  />
                </div>
              </div>

              {/* Script / controls: only this part scrolls */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div
                  className={
                    effectiveTheme === 'dark'
                      ? 'bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg p-6'
                      : 'bg-white rounded-2xl shadow-lg p-6'
                  }
                >
                  <ControlPanel
                  script={script}
                  instructions={instructions}
                  onScriptChange={setScript}
                  onInstructionsChange={setInstructions}
                  onSpeak={handleSpeak}
                  onPause={pause}
                  onResume={resume}
                  onStop={stop}
                  onReplay={handleReplay}
                  isSpeaking={isSpeaking}
                  isPaused={isPaused}
                  theme={effectiveTheme}
                  spokenText={spokenText}
                  currentCharIndex={currentCharIndex}
                />
                </div>
              </div>
            </aside>

            <section className="flex-1 overflow-hidden relative">
              {cinematic && (
                <button
                  type="button"
                  onClick={() => setCinematic(false)}
                  className="absolute top-3 right-3 z-20 px-4 py-2 rounded-lg text-sm font-medium bg-black/70 text-white hover:bg-black/90 shadow-lg transition-colors"
                >
                  Exit cinematic
                </button>
              )}
              <VideoPlayer
                selectedAvatar={selectedAvatar}
                isSpeaking={isSpeaking}
                theme={effectiveTheme}
                effectiveTalkingVideoUrl={effectiveTalkingVideoUrl}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
