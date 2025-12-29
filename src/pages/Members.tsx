import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/animations/ScrollReveal';
import { getClubMembers } from '@/lib/firestore';
import { ClubMember } from '@/store/useContentStore';
import { Instagram, Linkedin, Mail, User } from 'lucide-react';

const MembersPage = () => {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await getClubMembers();
        setMembers(data);
      } catch (error) {
        console.error('Error loading members:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMembers();
  }, []);

  return (
    <main className="relative noise-overlay min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm text-primary tracking-widest uppercase mb-4 block">Club Members</span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            MDF <span className="gradient-text">Community</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the talented individuals who make up our vibrant community.
          </p>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members.length > 0 ? (
          <StaggerContainer className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {members.map((member) => (
              <StaggerItem key={member.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="gradient-border p-6 rounded-2xl h-full flex flex-col items-center text-center bg-card/50"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-primary/20 bg-muted/30">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-4">{member.role}</p>

                  <div className="mt-auto flex gap-4 justify-center">
                    {member.socials?.instagram && (
                      <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials?.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials?.email && (
                      <a href={`mailto:${member.socials.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No members found.
          </div>
        )}
      </div>
    </main>
  );
};

export default MembersPage;
