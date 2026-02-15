import { useState, useRef, useEffect } from 'react';
import { Upload, Link, Video } from 'lucide-react';
import type { Avatar } from '../types/avatar';

function AvatarTalkingVideo({
  src,
  alt,
  isPlaying,
}: {
  src: string;
  alt: string;
  isPlaying: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.play().catch(() => {});
    else video.pause();
  }, [isPlaying]);
  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
      aria-label={alt}
    />
  );
}

interface VideoPlayerProps {
  selectedAvatar?: Avatar | null;
  isSpeaking?: boolean;
}

export function VideoPlayer({ selectedAvatar, isSpeaking }: VideoPlayerProps) {
  const [videoSource, setVideoSource] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [sourceType, setSourceType] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSource(url);
      setSourceType('upload');
    }
  };

  const handleUrlSubmit = () => {
    if (videoUrl.trim()) {
      setVideoSource(videoUrl.trim());
      setSourceType('url');
    }
  };

  const clearVideo = () => {
    if (sourceType === 'upload' && videoSource) {
      URL.revokeObjectURL(videoSource);
    }
    setVideoSource('');
    setVideoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 border-b border-slate-600">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Video className="w-5 h-5" />
          Video Workspace
        </h2>
      </div>

      <div className="flex-1 flex flex-col">
        {!videoSource ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            {selectedAvatar &&
            (selectedAvatar.imageUrl ||
              selectedAvatar.talkingVideoUrl ||
              selectedAvatar.talkingGifUrl) ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 ring-4 ring-white shadow-2xl">
                  {isSpeaking &&
                  (selectedAvatar.talkingVideoUrl ||
                    selectedAvatar.talkingGifUrl) ? (
                    selectedAvatar.talkingVideoUrl ? (
                      <AvatarTalkingVideo
                        src={selectedAvatar.talkingVideoUrl}
                        alt={`${selectedAvatar.name} talking`}
                        isPlaying={isSpeaking}
                      />
                    ) : (
                      <img
                        src={selectedAvatar.talkingGifUrl}
                        alt={`${selectedAvatar.name} talking`}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : selectedAvatar.imageUrl ? (
                    <img
                      src={selectedAvatar.imageUrl}
                      alt={selectedAvatar.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <p className="text-sm font-medium text-gray-600">
                  {selectedAvatar.name}
                  {isSpeaking ? ' is speaking...' : ''}
                </p>
              </div>
            ) : null}
            <div className="w-full max-w-md space-y-6 mt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Video className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Add a Video
                </h3>
                <p className="text-sm text-gray-500">
                  Upload a video file or provide a URL to get started
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Video File
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Choose video file
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        placeholder="https://example.com/video.mp4"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleUrlSubmit}
                      disabled={!videoUrl.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Load
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black flex items-center justify-center p-4">
              <video
                ref={videoRef}
                src={videoSource}
                controls
                className="max-w-full max-h-full rounded-lg shadow-2xl"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={clearVideo}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove Video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
