export type MenfessStatus = 'pending' | 'approved' | 'rejected';

export interface Menfess {
  id?: string;
  from_name?: string;
  from_username?: string;
  to_name: string;
  to_username?: string;
  message: string;
  is_anonymous: boolean;
  status: MenfessStatus;
  admin_note?: string;
  created_at?: any; // Firestore Timestamp
  updated_at?: any;
}

export interface CardTheme {
  id: string;
  name: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  secondaryTextColor: string;
  accentColor: string;
  borderColor: string;
}

export interface AIModerationResult {
  isSafe: boolean;
  category: 'safe' | 'hate_speech' | 'harassment' | 'spam' | 'inappropriate';
  explanation: string;
  suggestedAction: 'approved' | 'rejected' | 'pending';
  polishedMessage?: string;
}
