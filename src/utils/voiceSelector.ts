export function findVoiceByAccent(
  voices: SpeechSynthesisVoice[],
  accent: 'italian' | 'british' | 'australian' | 'default'
): SpeechSynthesisVoice | undefined {
  const accentPatterns: Record<string, RegExp> = {
    italian: /italian|it-IT|it_IT/i,
    british: /british|en-GB|en_GB|uk|england/i,
    australian: /australian|au|en-AU|en_AU|australia/i,
  };

  if (accent === 'default') {
    return voices.find((v) => v.default) || voices[0];
  }

  const pattern = accentPatterns[accent];
  if (!pattern) return voices[0];

  const exactMatch = voices.find((v) => pattern.test(v.name) || pattern.test(v.lang));

  if (exactMatch) return exactMatch;

  const langMatch = voices.find((v) => {
    const lang = v.lang.toLowerCase();
    if (accent === 'italian') return lang.startsWith('it');
    if (accent === 'british') return lang.includes('gb') || lang.includes('en-gb');
    if (accent === 'australian') return lang.includes('au') || lang.includes('en-au');
    return false;
  });

  return langMatch || voices[0];
}

export function selectVoiceByAccent(
  voices: SpeechSynthesisVoice[],
  accent: 'italian' | 'british' | 'australian' | 'default'
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  return findVoiceByAccent(voices, accent) || null;
}

const MALE_VOICE_PATTERNS = /male|daniel|david|alex|fred|paul|ralph|samuel|tom|george|james|mark|nick/i;
const FEMALE_VOICE_PATTERNS = /female|samantha|karen|victoria|alice|emma|susan|moira|kate|fiona|victoria|ava|zira/i;

export function findVoiceByGender(
  voices: SpeechSynthesisVoice[],
  gender: 'male' | 'female'
): SpeechSynthesisVoice | undefined {
  const pattern = gender === 'male' ? MALE_VOICE_PATTERNS : FEMALE_VOICE_PATTERNS;
  return voices.find((v) => pattern.test(v.name));
}

export function selectVoiceByGender(
  voices: SpeechSynthesisVoice[],
  gender: 'male' | 'female'
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  return findVoiceByGender(voices, gender) || null;
}
