export type AvatarAccent = 'italian' | 'british' | 'australian' | 'default';

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
  voiceGender?: 'male' | 'female';
}

export interface SpeechConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}
