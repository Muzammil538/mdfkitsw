import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

export const useAdminGuard = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, setUser, setIsLoading, setIsAdmin } = useAuthStore();

  useEffect(() => {
    // If Firebase is not configured, redirect to login
    if (!auth || !db) {
      setIsLoading(false);
      setIsAdmin(false);
      navigate('/admin/login');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Check if user is admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            navigate('/admin/login');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          navigate('/admin/login');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        navigate('/admin/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, setUser, setIsLoading, setIsAdmin]);

  return { user, isLoading, isAdmin };
};
