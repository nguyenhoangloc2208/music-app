// App.tsx
import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3001/download', {
        params: { url },
      });
      setAudioUrl(response.data);
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
          placeholder="Nhập URL YouTube"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
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

export default App;
