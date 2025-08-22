import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  studentName: string;
  school: string;
  date: string;
  isActive: boolean;
}

interface AnnouncementContextType {
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'isActive'>) => void;
  toggleAnnouncementStatus: (id: number) => void;
  deleteAnnouncement: (id: number) => void;
  getActiveAnnouncements: () => Announcement[];
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};

interface AnnouncementProviderProps {
  children: ReactNode;
}

export const AnnouncementProvider: React.FC<AnnouncementProviderProps> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
          {
        id: 1,
        title: "Lily passed her first English test!",
        content: "We're so proud of Lily from Sunshine Kindergarten! She scored 95% on her first English vocabulary test. Her hard work and dedication are truly inspiring.",
        studentName: "Lily",
        school: "Sunshine Kindergarten",
        date: "2024-01-15",
        isActive: true
      },
      {
        id: 2,
        title: "Tommy's reading progress amazes everyone!",
        content: "Tommy has improved his reading skills dramatically! He can now read simple English books independently. His confidence has grown so much.",
        studentName: "Tommy",
        school: "Rainbow Learning Center",
        date: "2024-01-14",
        isActive: true
      },
      {
        id: 3,
        title: "Emma leads her first English conversation!",
        content: "Emma took the lead in today's English conversation class! She helped other students with pronunciation and showed great leadership skills.",
        studentName: "Emma",
        school: "Hope Valley School",
        date: "2024-01-13",
        isActive: true
      }
  ]);

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date' | 'isActive'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      isActive: true
    };
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const toggleAnnouncementStatus = (id: number) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, isActive: !announcement.isActive }
        : announcement
    ));
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
  };

  const getActiveAnnouncements = () => {
    return announcements.filter(announcement => announcement.isActive);
  };

  const value: AnnouncementContextType = {
    announcements,
    addAnnouncement,
    toggleAnnouncementStatus,
    deleteAnnouncement,
    getActiveAnnouncements
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};
