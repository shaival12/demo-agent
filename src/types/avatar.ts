export interface Avatar {
  id: string;
  name: string;
  voiceStyle: string;
  color: string;
  rate: number;
  pitch: number;
  voiceIndex?: number;
}

export interface SpeechConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}
