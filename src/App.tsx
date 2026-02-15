import { useState } from 'react';
import { AvatarSelector } from './components/AvatarSelector';
import { ControlPanel } from './components/ControlPanel';
import { VideoPlayer } from './components/VideoPlayer';
import { avatars } from './config/avatars';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { selectVoiceByAccent, selectVoiceByGender } from './utils/voiceSelector';

function App() {
  const [selectedAvatarId, setSelectedAvatarId] = useState(avatars[0].id);
  const [script, setScript] = useState('');
  const [instructions, setInstructions] = useState('');

  const { voices, isSpeaking, isPaused, speak, pause, resume, stop } = useSpeechSynthesis();

  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId) || avatars[0];

  const handleSpeak = () => {
    const genderVoice =
      selectedAvatar.voiceGender && selectVoiceByGender(voices, selectedAvatar.voiceGender);
    const accentVoice = selectVoiceByAccent(voices, selectedAvatar.accent ?? 'default');
    const voice =
      genderVoice || accentVoice || voices[selectedAvatar.voiceIndex ?? 0] || voices[0];
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
                Demo Agent
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Select an avatar, write your script, and watch it come to life
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
            <aside className="w-full lg:w-1/4 flex flex-col gap-6 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <AvatarSelector
                  avatars={avatars}
                  selectedAvatarId={selectedAvatarId}
                  onSelectAvatar={setSelectedAvatarId}
                  isSpeaking={isSpeaking}
                />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
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
                />
              </div>
            </aside>

            <section className="flex-1 overflow-hidden">
              <VideoPlayer
                selectedAvatar={selectedAvatar}
                isSpeaking={isSpeaking}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
