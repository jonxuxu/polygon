export interface Transcription {
  original: string;
  translatedText: string;
  detectedSourceLanguage: string;
  color: string;
  time: number;
  image?: any;
}
