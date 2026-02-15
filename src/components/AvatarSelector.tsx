import { Avatar } from '../types/avatar';
import { User } from 'lucide-react';

interface AvatarSelectorProps {
  avatars: Avatar[];
  selectedAvatarId: string;
  onSelectAvatar: (avatarId: string) => void;
  isSpeaking: boolean;
}

export function AvatarSelector({
  avatars,
  selectedAvatarId,
  onSelectAvatar,
  isSpeaking,
}: AvatarSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Select Avatar
      </h2>
      <div className="grid grid-cols-5 gap-2">
        {avatars.map((avatar) => {
          const isSelected = avatar.id === selectedAvatarId;
          return (
            <button
              key={avatar.id}
              onClick={() => onSelectAvatar(avatar.id)}
              className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-white shadow-lg ring-2 ring-blue-500 scale-105'
                  : 'bg-white/50 hover:bg-white hover:shadow-md'
              }`}
              aria-label={`Select ${avatar.name}`}
              disabled={isSpeaking}
            >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center mb-2 ${
                  isSelected && isSpeaking ? 'animate-pulse' : ''
                }`}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-900">
                {avatar.name}
              </span>
              <span className="text-[10px] text-gray-500">
                {avatar.voiceStyle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
