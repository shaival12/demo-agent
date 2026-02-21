import { useRef, useEffect } from 'react';
import { Avatar } from '../types/avatar';
import { User } from 'lucide-react';

function AvatarTalkingVideo({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
    return () => {
      video?.pause();
    };
  }, [src]);
  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
      aria-label={alt}
    />
  );
}

interface AvatarSelectorProps {
  avatars: Avatar[];
  selectedAvatarId: string;
  onSelectAvatar: (avatarId: string) => void;
  isSpeaking: boolean;
  /** Override talking video URL for the selected avatar (e.g. from custom URL field) */
  effectiveTalkingVideoUrl?: string;
}

export function AvatarSelector({
  avatars,
  selectedAvatarId,
  onSelectAvatar,
  isSpeaking,
  effectiveTalkingVideoUrl,
}: AvatarSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Select Avatar
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {avatars.map((avatar) => {
          const isSelected = avatar.id === selectedAvatarId;
          const showTalking = isSelected && isSpeaking;
          const talkingVideoUrl =
            isSelected && effectiveTalkingVideoUrl
              ? effectiveTalkingVideoUrl
              : avatar.talkingVideoUrl;
          const talkingMedia = talkingVideoUrl || avatar.talkingGifUrl;
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
                className={`w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br ${avatar.color} flex items-center justify-center mb-2 ring-2 ring-white/50 ${
                  showTalking ? 'animate-pulse' : ''
                }`}
              >
                {showTalking && talkingMedia ? (
                  talkingVideoUrl ? (
                    <AvatarTalkingVideo
                      src={talkingVideoUrl}
                      alt={`${avatar.name} talking`}
                    />
                  ) : (
                    <img
                      src={avatar.talkingGifUrl}
                      alt={`${avatar.name} talking`}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : avatar.imageUrl ? (
                  <img
                    src={avatar.imageUrl}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-white" />
                )}
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
