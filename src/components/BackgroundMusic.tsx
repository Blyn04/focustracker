import React, { useState, useRef } from "react";
import "../styles/BackgroundMusic.css";

interface BackgroundMusicProps {
  src: string; 
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-music-container">
      <audio ref={audioRef} loop src={src} />
      <button className="bg-music-btn" onClick={togglePlay}>
        {isPlaying ? "⏸ Pause Music" : "▶️ Play Music"}
      </button>
    </div>
  );
};

export default BackgroundMusic;
