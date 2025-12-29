import { create } from 'zustand';

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  role: string;
  image?: string;
  email?: string;
  order: number;
}

export interface StudentMember {
  id: string;
  name: string;
  role: string;
  department: string;
  tier: number;
  image?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
  order: number;
}

export interface ClubMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
  order: number;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  url: string;
  order: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: 'music' | 'dance' | 'arts' | 'cultural';
  featured: boolean;
  isUpcoming?: boolean;
  liveLink?: string;
  images: string[];
  order: number;
}

interface ContentState {
  faculty: FacultyMember[];
  students: StudentMember[];
  clubMembers: ClubMember[];
  events: Event[];
  reports: Report[];
  isLoading: boolean;
  setFaculty: (faculty: FacultyMember[]) => void;
  setStudents: (students: StudentMember[]) => void;
  setClubMembers: (members: ClubMember[]) => void;
  setEvents: (events: Event[]) => void;
  setReports: (reports: Report[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  faculty: [],
  students: [],
  clubMembers: [],
  events: [],
  reports: [],
  isLoading: true,
  setFaculty: (faculty) => set({ faculty }),
  setStudents: (students) => set({ students }),
  setClubMembers: (clubMembers) => set({ clubMembers }),
  setEvents: (events) => set({ events }),
  setReports: (reports) => set({ reports }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
