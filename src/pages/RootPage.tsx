// App.tsx
import React, { useState } from 'react';
import { getData } from '../services/fetcher';

export default function RootPage(){
  const [videoID, setVideoID] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response: string = await getData(videoID);
        setAudioUrl(response);
    } catch (error) {
      console.error('Error fetching audio URL:', error);
    }
  };

  return (
    <div>
      <h1>YouTube Audio Player</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập ID YouTube"
          value={videoID}
          onChange={(e) => setVideoID(e.target.value)}
        />
        <button type="submit">Phát</button>
      </form>
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
};