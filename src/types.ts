export interface AshtavinayakTemple {
  id: string;
  order: number;
  name: string;
  marathiName: string;
  deity: string;
  location: string;
  district: string;
  trunkDirection: 'Left' | 'Right';
  legend: string;
  history: string;
  significance: string;
  festival: string;
  howToReach: string;
  coordinates: { lat: number; lng: number };
  image: string;
  colorTone: string;
}

export interface BirthStoryChapter {
  id: string;
  chapterNumber: number;
  title: string;
  marathiTitle: string;
  summary: string;
  content: string[];
  spiritualMeaning: string;
  sacredQuote: string;
}

export interface GaneshaSymbol {
  id: string;
  name: string;
  sanskritName: string;
  representation: string;
  description: string;
  iconType: string;
}

export interface Mantra108 {
  number: number;
  mantra: string;
  transliteration: string;
  meaning: string;
  divineAttribute: string;
}

export interface AartiItem {
  id: string;
  title: string;
  marathiTitle: string;
  author: string;
  deity: string;
  context: string;
  devanagariLyrics: string[];
  englishLyrics: string[];
  meaning: string[];
  audioUrl?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type ActiveTab =
  | 'home'
  | 'darshan'
  | 'birth-story'
  | 'ashtavinayak'
  | 'mantra-108'
  | 'aartis'
  | 'quiz'
  | 'dhol-tasha'
  | 'blessing-card';
