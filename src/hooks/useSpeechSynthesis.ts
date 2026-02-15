import { useState, useEffect, useRef } from 'react';
import { SpeechConfig } from '../types/avatar';

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const parseInstructions = (instructions: string, baseConfig: SpeechConfig): SpeechConfig => {
    const config = { ...baseConfig };
    const lower = instructions.toLowerCase();

    if (lower.includes('slow')) {
      config.rate = Math.max(0.5, config.rate - 0.3);
    } else if (lower.includes('fast') || lower.includes('quick')) {
      config.rate = Math.min(2.0, config.rate + 0.3);
    }

    if (lower.includes('high') || lower.includes('energetic')) {
      config.pitch = Math.min(2.0, config.pitch + 0.2);
    } else if (lower.includes('deep') || lower.includes('low') || lower.includes('calm')) {
      config.pitch = Math.max(0.5, config.pitch - 0.2);
    }

    if (lower.includes('quiet') || lower.includes('soft')) {
      config.volume = Math.max(0.3, config.volume - 0.3);
    } else if (lower.includes('loud') || lower.includes('confident')) {
      config.volume = Math.min(1.0, config.volume + 0.2);
    }

    return config;
  };

  const speak = (text: string, config: SpeechConfig, instructions: string = '') => {
    if (!text.trim()) return;

    window.speechSynthesis.cancel();

    const finalConfig = instructions
      ? parseInstructions(instructions, config)
      : config;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = finalConfig.rate;
    utterance.pitch = finalConfig.pitch;
    utterance.volume = finalConfig.volume;

    if (finalConfig.voice && voices.length > 0) {
      utterance.voice = finalConfig.voice;
    } else if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return {
    voices,
    isSpeaking,
    isPaused,
    speak,
    pause,
    resume,
    stop,
  };
}
