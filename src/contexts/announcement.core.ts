import { createContext, useContext } from 'react';

export type AnnouncementContextType = {
  message: string;
  announce: (msg: string) => void;
};

export const AnnouncementContext = createContext<AnnouncementContextType>({
  message: '',
  announce: () => {},
});

export const useAnnouncement = () => useContext(AnnouncementContext);
