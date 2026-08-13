export interface Menfess {
  id?: string;
  from_name: string;
  from_username: string;
  to_name: string;
  to_username: string;
  message: string;
  is_anonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  created_at?: any; // Firestore Timestamp
  updated_at?: any;
}
