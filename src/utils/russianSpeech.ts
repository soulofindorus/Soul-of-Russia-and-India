/**
 * Russian pronunciation helper using Web Speech API (with safe stress-mark stripping).
 */

export function stripRussianStressMarks(text: string): string {
  // Removes Unicode combining acute accent (\u0301) so speech engines pronounce smoothly
  return text.replace(/\u0301/g, '');
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

export function hasRussianVoice(): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some((v) => v.lang.toLowerCase().startsWith('ru'));
}

export function stopRussianSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export function speakRussian(
  rawText: string,
  options?: {
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (msg: string) => void;
  }
): void {
  if (!isSpeechSynthesisSupported()) {
    options?.onError?.('Audio synthesis is not supported in this browser.');
    return;
  }

  const cleanText = stripRussianStressMarks(rawText).trim();
  if (!cleanText) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const russianVoice =
      voices.find((v) => v.lang.toLowerCase() === 'ru-ru') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('ru'));
    if (russianVoice) {
      utterance.voice = russianVoice;
    }

    utterance.onstart = () => options?.onStart?.();
    utterance.onend = () => options?.onEnd?.();
    utterance.onerror = () => options?.onEnd?.();

    window.speechSynthesis.speak(utterance);
  } catch {
    options?.onError?.('Unable to start browser speech playback.');
  }
}
