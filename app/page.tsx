"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize } from 'lucide-react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    // Forçar carregamento inicial do duration
    if (video.duration) {
      setDuration(video.duration);
    }

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || duration === 0 || isNaN(duration)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const newTime = (newProgress / 100) * duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    video.currentTime = newTime;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Video Player Container */}
        <div 
          className="relative bg-black rounded-xl overflow-hidden shadow-2xl group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            onClick={togglePlay}
            muted={isMuted}
          >
            <source 
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
              type="video/mp4" 
            />
            <source 
              src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" 
              type="video/mp4" 
            />
            Seu navegador não suporta o elemento de vídeo.
          </video>

          {/* Center Play Button (when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                onClick={togglePlay}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
              >
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </button>
            </div>
          )}

          {/* Controls Bar */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div className="mb-4">
              <div 
                className="w-full h-2 bg-gray-600/50 rounded-full cursor-pointer hover:h-3 transition-all duration-200 group"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative transition-all duration-200"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Media Controls */}
                <button 
                  onClick={() => skipTime(-10)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                  title="Voltar 10s"
                >
                  <SkipBack className="w-6 h-6 text-white" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
                  title={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? 
                    <Pause className="w-6 h-6 text-white" fill="currentColor" /> :
                    <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                  }
                </button>
                
                <button 
                  onClick={() => skipTime(10)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                  title="Avançar 10s"
                >
                  <SkipForward className="w-6 h-6 text-white" />
                </button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                    title={isMuted ? "Ativar som" : "Silenciar"}
                  >
                    {isMuted || volume === 0 ? 
                      <VolumeX className="w-6 h-6 text-white" /> :
                      <Volume2 className="w-6 h-6 text-white" />
                    }
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Fullscreen */}
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                  title="Tela cheia"
                >
                  <Maximize className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Title and Source */}
              <div className="text-right">
                <h2 className="text-white text-xl font-bold mb-1">Douglas o Coelhão</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Panel */}
        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">Reproduzindo Agora</h3>
              <p className="text-gray-300 text-sm">
                Episódio 1 - O mistério sobrenatural continua enquanto Douglas o Coelhão navega através de desafios místicos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
