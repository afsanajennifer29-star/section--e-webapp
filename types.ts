
export enum ViewMode {
  ENTERTAINMENT = 'entertainment',
  STUDY = 'study'
}

export type DramaCategory = 
  | 'K-Drama' 
  | 'C-Drama' 
  | 'J-Drama' 
  | 'Filipino' 
  | 'Thai' 
  | 'Anime' 
  | 'Hollywood' 
  | 'Movies' 
  | 'Variety' 
  | 'Reality' 
  | 'Documentary';

export interface SubtitleTrack {
  id: string;
  label: string;
  lang: string;
}

export interface ContentItem {
  id: string;
  title: string;
  category: DramaCategory;
  thumbnail: string;
  rating: number;
  isVIP: boolean;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  description: string;
  releaseYear: number;
  subtitles?: SubtitleTrack[];
  trailerUrl?: string;
  videoUrl?: string;
  actors?: string[];
  progress?: number; // Simulated viewing progress for "Continue Watching"
}

export interface DownloadRecord {
  contentId: string;
  downloadDate: number;
  expiryDate: number;
  progress: number;
  status: 'downloading' | 'completed' | 'expired';
  sizeMB: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  videoEmbeds?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface StudyVideo {
  id: string;
  title: string;
  subject: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

export interface StudyGuide {
  id: string;
  title: string;
  subject: string;
  content: string;
}

export interface Comment {
  id: string;
  contentId: string;
  userName: string;
  text: string;
  timestamp: number;
  avatar: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string | 'All';
  icon: string;
  memberCount: number;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  status: 'online' | 'offline';
}
