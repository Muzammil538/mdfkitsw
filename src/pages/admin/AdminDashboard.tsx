import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getFaculty, getStudents, getEvents } from '@/lib/firestore';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  LogOut, 
  Settings,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';

const AdminDashboard = () => {
  const { isLoading, isAdmin } = useAdminGuard();
  const [stats, setStats] = useState({ faculty: 0, students: 0, events: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [faculty, students, events] = await Promise.all([
          getFaculty(),
          getStudents(),
          getEvents(),
        ]);
        setStats({
          faculty: faculty.length,
          students: students.length,
          events: events.length,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const menuItems = [
    {
      title: 'Faculty',
      description: 'Manage faculty coordinators',
      icon: Users,
      path: '/admin/faculty',
      count: stats.faculty,
      color: 'from-primary to-accent',
    },
    {
      title: 'Students',
      description: 'Manage student body members',
      icon: GraduationCap,
      path: '/admin/students',
      count: stats.students,
      color: 'from-accent to-secondary',
    },
    {
      title: 'Events',
      description: 'Manage events and gallery',
      icon: Calendar,
      path: '/admin/events',
      count: stats.events,
      color: 'from-secondary to-primary',
    },
  ];

  return (
    <main className="relative noise-overlay min-h-screen pt-8 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-1/2 h-1/2 bg-secondary/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage MDF content</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={item.path}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="gradient-border rounded-2xl p-6 h-full group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} opacity-20 flex items-center justify-center`}>
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-4xl font-bold gradient-text">{item.count}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1 group-hover:gradient-text transition-all">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex items-center text-sm text-primary">
                    Manage
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gradient-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/faculty">
              <Button variant="glass" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Add Faculty
              </Button>
            </Link>
            <Link to="/admin/students">
              <Button variant="glass" className="w-full justify-start">
                <GraduationCap className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </Link>
            <Link to="/admin/events">
              <Button variant="glass" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </Link>
            <Button variant="glass" className="w-full justify-start" disabled>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default AdminDashboard;
