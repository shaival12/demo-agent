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
    voiceGender: 'female',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    talkingVideoUrl:
      'https://videos.pexels.com/video-files/5442623/5442623-hd_1920_1080_25fps.mp4',
  },
  {
    id: 'james',
    name: 'James',
    voiceStyle: 'Executive',
    color: 'from-blue-400 to-indigo-500',
    rate: 0.9,
    pitch: 0.9,
    voiceIndex: 1,
    accent: 'default',
    voiceGender: 'male',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    talkingVideoUrl:
      'https://videos.pexels.com/video-files/5439086/5439086-hd_1920_1080_25fps.mp4',
  },
];
