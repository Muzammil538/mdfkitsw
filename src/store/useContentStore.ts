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

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: 'music' | 'dance' | 'arts' | 'cultural';
  featured: boolean;
  images: string[];
  order: number;
}

interface ContentState {
  faculty: FacultyMember[];
  students: StudentMember[];
  events: Event[];
  isLoading: boolean;
  setFaculty: (faculty: FacultyMember[]) => void;
  setStudents: (students: StudentMember[]) => void;
  setEvents: (events: Event[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  faculty: [],
  students: [],
  events: [],
  isLoading: true,
  setFaculty: (faculty) => set({ faculty }),
  setStudents: (students) => set({ students }),
  setEvents: (events) => set({ events }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
