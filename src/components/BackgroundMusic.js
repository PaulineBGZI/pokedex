import React, { useRef, useState, useEffect } from "react";
import musicFile from "../assets/Title.mp3";

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.4;
    audio.loop = true;

    const startMusic = () => {
      audio.play().catch(() => {});
      setIsPlaying(true);
      document.removeEventListener("click", startMusic);
    };

    document.addEventListener("click", startMusic);
    return () => document.removeEventListener("click", startMusic);
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      onClick={toggleMusic}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        width: "65px",
        height: "65px",
        borderRadius: "50%",
        background: isPlaying
          ? "radial-gradient(circle at center, #ff0000 50%, white 51%)"
          : "radial-gradient(circle at center, #ccc 50%, white 51%)",
        border: "3px solid #2a75bb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: isPlaying
          ? "0 0 20px rgba(255, 0, 0, 0.8)"
          : "0 0 10px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
        transform: isPlaying ? "rotate(360deg)" : "none",
        animation: isPlaying ? "spin 4s linear infinite" : "none",
      }}
      title={isPlaying ? "Couper la musique" : "Activer la musique"}
    >
      <audio ref={audioRef} src={musicFile} preload="auto" />
      {/* Ligne noire de la Pokéball */}
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "black",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      ></div>
      {/* Cercle central */}
      <div
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: "white",
          border: "3px solid black",
          position: "absolute",
        }}
      ></div>
    </div>
  );
};

export default BackgroundMusic;
