import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { FacultyMember, StudentMember, Event } from '@/store/useContentStore';

// Helper to check if Firestore is available
const checkDb = () => {
  if (!db) {
    console.warn('Firestore is not configured');
    return false;
  }
  return true;
};

// Faculty operations
export const getFaculty = async (): Promise<FacultyMember[]> => {
  if (!checkDb()) return [];
  const q = query(collection(db!, 'faculty'), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FacultyMember[];
};

export const addFaculty = async (data: Omit<FacultyMember, 'id'>): Promise<string> => {
  if (!checkDb()) throw new Error('Firestore not configured');
  const docRef = await addDoc(collection(db!, 'faculty'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateFaculty = async (id: string, data: Partial<FacultyMember>): Promise<void> => {
  if (!checkDb()) throw new Error('Firestore not configured');
  const docRef = doc(db!, 'faculty', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteFaculty = async (id: string): Promise<void> => {
  if (!checkDb()) throw new Error('Firestore not configured');
  await deleteDoc(doc(db!, 'faculty', id));
};

// Student operations
export const getStudents = async (): Promise<StudentMember[]> => {
  if (!checkDb()) return [];
  const q = query(collection(db!, 'students'), orderBy('tier', 'asc'), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as StudentMember[];
};

export const addStudent = async (data: Omit<StudentMember, 'id'>): Promise<string> => {
  if (!checkDb()) throw new Error('Firestore not configured');
  const docRef = await addDoc(collection(db!, 'students'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateStudent = async (id: string, data: Partial<StudentMember>): Promise<void> => {
  if (!checkDb()) throw new Error('Firestore not configured');
  const docRef = doc(db!, 'students', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteStudent = async (id: string): Promise<void> => {
  if (!checkDb()) throw new Error('Firestore not configured');
  await deleteDoc(doc(db!, 'students', id));
};

// Event operations
export const getEvents = async (): Promise<Event[]> => {
  if (!checkDb()) return [];
  const q = query(collection(db!, 'events'), orderBy('order', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[];
};

export const addEvent = async (data: Omit<Event, 'id'>): Promise<string> => {
  if (!checkDb()) throw new Error('Firestore not configured');
  const docRef = await addDoc(collection(db!, 'events'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateEvent = async (id: string, data: Partial<Event>): Promise<void> => {
  if (!checkDb()) throw new Error('Firestore not configured');
  const docRef = doc(db!, 'events', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteEvent = async (id: string): Promise<void> => {
  if (!checkDb()) throw new Error('Firestore not configured');
  await deleteDoc(doc(db!, 'events', id));
};
