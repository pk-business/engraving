import React, { createContext, useContext, useState } from 'react';

type AnnouncementContextType = {
  message: string;
  announce: (msg: string) => void;
};

const AnnouncementContext = createContext<AnnouncementContextType>({
  message: '',
  announce: () => {},
});

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');

  const announce = (msg: string) => {
    // Clear then set to ensure screen readers notice repeated messages
    setMessage('');
    window.setTimeout(() => setMessage(msg), 100);
  };

  return (
    <AnnouncementContext.Provider value={{ message, announce }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncement = () => useContext(AnnouncementContext);

export default AnnouncementContext;
