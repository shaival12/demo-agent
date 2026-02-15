export type AvatarAccent = 'italian' | 'british' | 'australian' | 'german' | 'default';

export interface Avatar {
  id: string;
  name: string;
  voiceStyle: string;
  color: string;
  rate: number;
  pitch: number;
  voiceIndex?: number;
  accent?: AvatarAccent;
  imageUrl?: string;
  /** Animated talking-head GIF shown when this avatar is speaking (lip-sync style) */
  talkingGifUrl?: string;
  /** Real-person talking video (mp4); plays when speaking, overrides talkingGifUrl if set */
  talkingVideoUrl?: string;
  voiceGender?: 'male' | 'female';
  /** Prefer deepest male voice (e.g. Arnold-style commanding) */
  voicePreference?: 'deep';
}

export interface SpeechConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}
