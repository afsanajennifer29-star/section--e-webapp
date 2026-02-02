
import { ContentItem, SubtitleTrack, StudyVideo, StudyGuide, StudyGroup, Friend } from './types';

const COMMON_SUBS: SubtitleTrack[] = [
  { id: 'en', label: 'English', lang: 'en' },
  { id: 'zh', label: 'Chinese', lang: 'zh' },
  { id: 'ko', label: 'Korean', lang: 'ko' },
  { id: 'tl', label: 'Tagalog', lang: 'tl' }
];

export const MOCK_CONTENT: ContentItem[] = [
  // K-DRAMA
  {
    id: 'k-1',
    title: 'Alchemy of Souls',
    category: 'K-Drama',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.9,
    isVIP: true,
    description: 'A powerful sorceress in a blind woman\'s body encounters a man from a prestigious family.',
    releaseYear: 2022,
    subtitles: COMMON_SUBS,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'k-2',
    title: 'Vincenzo',
    category: 'K-Drama',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.8,
    isVIP: false,
    description: 'A Korean-Italian mafia lawyer gives a conglomerate a taste of its own medicine.',
    releaseYear: 2021
  },
  {
    id: 'k-3',
    title: 'Squid Game 2',
    category: 'K-Drama',
    status: 'Upcoming',
    thumbnail: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.7,
    isVIP: true,
    description: 'The global phenomenon returns with new games and higher stakes.',
    releaseYear: 2025
  },

  // C-DRAMA
  {
    id: 'c-1',
    title: 'The Untamed',
    category: 'C-Drama',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.9,
    isVIP: false,
    description: 'Soulmate cultivators uncover secrets from a tragic past.',
    releaseYear: 2019
  },
  {
    id: 'c-2',
    title: 'Hidden Love',
    category: 'C-Drama',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.8,
    isVIP: true,
    description: 'A sweet romance spanning years of friendship and hidden feelings.',
    releaseYear: 2023
  },

  // FILIPINO
  {
    id: 'f-1',
    title: 'Ang Mutya ng Section E',
    category: 'Filipino',
    status: 'Ongoing',
    thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 5.0,
    isVIP: false,
    description: 'High school drama about the mysterious Mutya and her class.',
    releaseYear: 2024,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: 'f-2',
    title: 'Dalisay',
    category: 'Filipino',
    status: 'Upcoming',
    thumbnail: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.5,
    isVIP: true,
    description: 'A legendary tale of heroism in the heart of the Philippines.',
    releaseYear: 2025
  },

  // J-DRAMA
  {
    id: 'j-1',
    title: 'Alice in Borderland',
    category: 'J-Drama',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.7,
    isVIP: true,
    description: 'Forced to play dangerous games in a deserted Tokyo.',
    releaseYear: 2020
  },
  {
    id: 'j-2',
    title: 'First Love',
    category: 'J-Drama',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.9,
    isVIP: false,
    description: 'A cross-generational love story inspired by Hikaru Utada\'s songs.',
    releaseYear: 2022
  },

  // THAI
  {
    id: 't-1',
    title: 'Girl from Nowhere',
    category: 'Thai',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.8,
    isVIP: false,
    description: 'A mysterious girl transfers to schools, exposing lies.',
    releaseYear: 2018
  },

  // ANIME
  {
    id: 'a-1',
    title: 'Demon Slayer',
    category: 'Anime',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.9,
    isVIP: false,
    description: 'Avenging his family and saving his sister from a demonic fate.',
    releaseYear: 2019
  },
  {
    id: 'a-2',
    title: 'Solo Leveling',
    category: 'Anime',
    status: 'Ongoing',
    thumbnail: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.9,
    isVIP: true,
    description: 'The world\'s weakest hunter gets a chance at ultimate power.',
    releaseYear: 2024
  },

  // HOLLYWOOD
  {
    id: 'h-1',
    title: 'The Last of Us',
    category: 'Hollywood',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1613679074971-91ea29d83097?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.9,
    isVIP: true,
    description: 'A survival journey across a pandemic-stricken America.',
    releaseYear: 2023
  },
  {
    id: 'h-2',
    title: 'Stranger Things',
    category: 'Hollywood',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.8,
    isVIP: false,
    description: 'Supernatural mysteries in small-town Indiana.',
    releaseYear: 2016
  },

  // VARIETY & REALITY
  {
    id: 'v-1',
    title: 'Running Man',
    category: 'Variety',
    status: 'Ongoing',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400&h=600',
    rating: 4.9,
    isVIP: false,
    description: 'Cast members complete missions for the ultimate victory.',
    releaseYear: 2010
  }
];

export const MOCK_STUDY_VIDEOS: StudyVideo[] = [
  {
    id: 'sv1',
    title: 'Introduction to Computer Science',
    subject: 'Computer Science',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400&h=225',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '12:45'
  }
];

export const MOCK_STUDY_GUIDES: StudyGuide[] = [
  {
    id: 'sg1',
    title: 'Algorithm Design Basics',
    subject: 'Computer Science',
    content: 'An algorithm is a finite sequence of well-defined instructions.'
  }
];

export const MOCK_STUDY_GROUPS: StudyGroup[] = [
  { id: 'all', name: 'Global Study Lounge', subject: 'All', icon: 'fa-earth-americas', memberCount: 1240 }
];

export const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'StudyBuddy_99', avatar: 'https://picsum.photos/seed/buddy/100', status: 'online' }
];
