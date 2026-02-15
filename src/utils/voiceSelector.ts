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
    const def = voices.find((v) => v.default);
    if (def) return def;
    // Prefer natural/enhanced voices when no default
    const sorted = [...voices].sort(
      (a, b) => scoreNaturalVoice(b.name) - scoreNaturalVoice(a.name)
    );
    return sorted[0] || voices[0];
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

const MALE_VOICE_PATTERNS =
  /male|daniel|david|alex|fred|paul|ralph|samuel|tom|george|james|mark|nick|bruce|henry|oliver|eddy|aaron|evan|nathan|reed|austin|logan|tyler|mason/i;
const FEMALE_VOICE_PATTERNS =
  /female|samantha|karen|victoria|alice|emma|susan|moira|kate|fiona|ava|zira|veena|tessa|naomi|siri|karen|helen|lucy|sarah|emily|female/i;

/**
 * Prefer voices that sound more natural (Enhanced, Premium, Google, etc.).
 * For celebrity-style or custom voices, use an external TTS API (e.g. ElevenLabs, Play.ht).
 */
const NATURAL_VOICE_PATTERNS = /enhanced|premium|natural|google|quality|eloquent/i;

function scoreNaturalVoice(name: string): number {
  if (NATURAL_VOICE_PATTERNS.test(name)) return 2;
  if (/microsoft|apple/i.test(name)) return 1;
  return 0;
}

export function findVoiceByGender(
  voices: SpeechSynthesisVoice[],
  gender: 'male' | 'female'
): SpeechSynthesisVoice | undefined {
  const includePattern = gender === 'male' ? MALE_VOICE_PATTERNS : FEMALE_VOICE_PATTERNS;
  const excludePattern = gender === 'male' ? FEMALE_VOICE_PATTERNS : MALE_VOICE_PATTERNS;
  let matches = voices.filter(
    (v) => includePattern.test(v.name) && !excludePattern.test(v.name)
  );
  if (matches.length === 0) {
    matches = voices.filter((v) => includePattern.test(v.name));
  }
  if (matches.length === 0 && gender === 'male') {
    // Fallback: use any voice that doesn't sound female (avoids wrong gender)
    const notFemale = voices.filter((v) => !excludePattern.test(v.name));
    if (notFemale.length > 0) {
      notFemale.sort((a, b) => scoreNaturalVoice(b.name) - scoreNaturalVoice(a.name));
      return notFemale[0];
    }
  }
  if (matches.length === 0) return undefined;
  matches.sort((a, b) => scoreNaturalVoice(b.name) - scoreNaturalVoice(a.name));
  return matches[0];
}

export function selectVoiceByGender(
  voices: SpeechSynthesisVoice[],
  gender: 'male' | 'female'
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  return findVoiceByGender(voices, gender) || null;
}
