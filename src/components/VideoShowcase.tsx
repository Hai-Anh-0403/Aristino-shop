"use client";

import React, { useRef, useState } from 'react';

// Sample video URL – replace via admin later
const SAMPLE_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_POSTER = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop';

export const VideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className="relative w-full bg-brand-offwhite pt-4 pb-2">
      {/* Padded wrapper to match Aristino layout */}
      <div className="px-10 sm:px-16 lg:px-24">
        {/* Video Container */}
        <div className="relative w-full bg-black" style={{ aspectRatio: '16 / 7' }}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={SAMPLE_VIDEO_URL}
            poster={SAMPLE_POSTER}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onClick={togglePlay}
          />

          {/* Play overlay – shown when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-300 hover:bg-black/40 cursor-pointer group"
              aria-label="Play Video"
            >
              <div className="w-20 h-20 rounded-full border-2 border-white/80 flex items-center justify-center backdrop-blur-sm bg-white/10 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}

          {/* Bottom controls bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
            {/* Left: Play/Pause */}
            <button
              onClick={togglePlay}
              className="pointer-events-auto text-white/80 hover:text-white transition-colors duration-200"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Right: Mute/Unmute */}
            <button
              onClick={toggleMute}
              className="pointer-events-auto text-white/80 hover:text-white transition-colors duration-200"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
