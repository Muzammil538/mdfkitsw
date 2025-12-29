import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Mail } from 'lucide-react';
import { getFaculty } from '@/lib/firestore';
import { FacultyMember } from '@/store/useContentStore';

const FacultyCard = ({ member, index }: { member: FacultyMember; index: number }) => {
  const isWide = ['principal', 'president'].some(d => member.designation?.toLowerCase().includes(d));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={`gradient-border rounded-2xl p-8 group ${isWide ? 'md:col-span-2 lg:col-span-4 flex flex-col md:flex-row items-center gap-8' : ''
        }`}
    >
      {/* Avatar */}
      <div className={`relative ${isWide ? 'shrink-0' : 'mb-6'}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`${isWide ? 'w-48 h-48' : 'w-32 h-32'} mx-auto rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center overflow-hidden`}
        >
          {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold gradient-text">
              {member.name.split(' ').slice(-1)[0][0]}
            </span>
          )}
        </motion.div>

        {/* Role badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium whitespace-nowrap">
          {member.role}
        </div>
      </div>

      {/* Info */}
      <div className={isWide ? 'text-left flex-1' : 'text-center'}>
        <h3 className={`font-semibold mb-1 group-hover:gradient-text transition-all ${isWide ? 'text-3xl' : 'text-xl'}`}>
          {member.name}
        </h3>
        <p className={`text-primary mb-1 ${isWide ? 'text-xl' : 'text-sm'}`}>{member.designation}</p>
        <p className="text-sm text-muted-foreground mb-4">{member.department}</p>

        {isWide && (
          <p className="text-muted-foreground mb-4 max-w-2xl">
            Leading with vision and dedication to foster a creative environment for all students.
          </p>
        )}

        {/* Email */}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            {member.email}
          </a>
        )}
      </div>
    </motion.div>
  );
};

const FacultyPage = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const data = await getFaculty();
        setFaculty(data);
      } catch (error) {
        console.error('Error loading faculty:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFaculty();
  }, []);

  return (
    <main className="relative noise-overlay min-h-screen pt-32 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-1/2 h-1/2 bg-accent/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/3 right-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <span className="text-sm text-primary tracking-widest uppercase mb-4 block">Guidance</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Faculty <span className="gradient-text">Coordinators</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our dedicated faculty members who guide and support MDF's artistic endeavors,
            ensuring students reach their creative potential.
          </p>
        </ScrollReveal>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && faculty.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No faculty members added yet.</p>
          </div>
        )}

        {/* Faculty Grid */}
        {!isLoading && faculty.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {faculty.map((member, index) => (
              <FacultyCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default FacultyPage;
