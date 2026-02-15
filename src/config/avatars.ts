import { Avatar } from '../types/avatar';

export const avatars: Avatar[] = [
  {
    id: 'sarah',
    name: 'Sarah',
    voiceStyle: 'Warm',
    color: 'from-rose-400 to-pink-500',
    rate: 1.0,
    pitch: 1.1,
    voiceIndex: 0,
    accent: 'default',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'emma',
    name: 'Emma',
    voiceStyle: 'Confident',
    color: 'from-emerald-400 to-teal-500',
    rate: 0.95,
    pitch: 1.0,
    voiceIndex: 1,
    accent: 'british',
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'james',
    name: 'James',
    voiceStyle: 'Executive',
    color: 'from-blue-400 to-indigo-500',
    rate: 0.9,
    pitch: 0.9,
    voiceIndex: 2,
    accent: 'default',
    voiceGender: 'male',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];
