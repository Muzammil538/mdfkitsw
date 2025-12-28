import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { getStudents } from '@/lib/firestore';
import { StudentMember } from '@/store/useContentStore';

const tierLabels: Record<number, string> = {
  1: 'President',
  2: 'Vice President & PRO',
  3: 'Joint Secretaries',
  4: 'Core Team',
};

const MemberCard = ({ member, index }: { member: StudentMember; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      viewport={{ once: false, margin: '-50px' }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="gradient-border rounded-2xl p-6 relative group"
    >
      {/* Glow effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl -z-10"
      />

      {/* Avatar */}
      <div className="relative mb-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center overflow-hidden">
          {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold gradient-text">
              {member.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary/20 text-xs text-primary font-medium">
          {member.department}
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{member.role}</p>

        {/* Socials */}
        {member.socials && (
          <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {member.socials.instagram && (
              <a href={member.socials.instagram} className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {member.socials.linkedin && (
              <a href={member.socials.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.socials.email && (
              <a href={`mailto:${member.socials.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface TierData {
  tier: number;
  title: string;
  members: StudentMember[];
}

const TierSection = ({ tierData }: { tierData: TierData }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  const gridCols = tierData.members.length === 1 
    ? 'grid-cols-1 max-w-sm mx-auto' 
    : tierData.members.length === 2 
      ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
      : tierData.members.length === 3
        ? 'grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="mb-24"
    >
      {/* Tier Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-4">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Tier {tierData.tier}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold gradient-text">{tierData.title}</h2>
      </motion.div>

      {/* Members Grid */}
      <div className={`grid ${gridCols} gap-6`}>
        {tierData.members.map((member, index) => (
          <MemberCard key={member.id} member={member} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

const StudentBodyPage = () => {
  const [students, setStudents] = useState<StudentMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStudents();
  }, []);

  // Group students by tier
  const studentHierarchy: TierData[] = Object.entries(tierLabels).map(([tier, title]) => ({
    tier: Number(tier),
    title,
    members: students.filter(s => s.tier === Number(tier)).sort((a, b) => a.order - b.order),
  })).filter(t => t.members.length > 0);

  return (
    <main className="relative noise-overlay min-h-screen pt-32 pb-20">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-1/2 h-1/2 bg-secondary/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <span className="text-sm text-primary tracking-widest uppercase mb-4 block">Meet The Team</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Student <span className="gradient-text">Body</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The passionate individuals who lead and drive MDF's vision, 
            organizing events and nurturing artistic talents across campus.
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
        {!isLoading && students.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No student members added yet.</p>
          </div>
        )}

        {/* Hierarchy Sections */}
        {!isLoading && studentHierarchy.map((tierData) => (
          <TierSection key={tierData.tier} tierData={tierData} />
        ))}
      </div>
    </main>
  );
};

export default StudentBodyPage;
