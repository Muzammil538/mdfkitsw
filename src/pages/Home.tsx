import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Music, Palette, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollReveal, { StaggerContainer, StaggerItem, Parallax } from '@/components/animations/ScrollReveal';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-hero-gradient" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary/10 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-secondary/10 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full bg-accent/10 blur-[100px]"
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">KITS Warangal's Premier Arts Club</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
        >
          <span className="gradient-text text-glow">Music. Dance.</span>
          <br />
          <span className="text-foreground">Fine Arts.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
        >
          Where creativity meets passion. Join a community of talented artists, musicians, 
          and dancers shaping the cultural landscape of KITS Warangal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/join">
            <Button variant="glow" size="xl" className="group">
              <span className="relative z-10">Join MDF</span>
              <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="glass" size="xl">
              Explore Events
            </Button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [1, 0, 1], y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};


const LogoSection = () => {
  const logos = [
    {
      src: './KITSW.png',
      alt: 'KITS Warangal Logo',
    },
    {
      src: './sac.png',
      alt: 'SAC KITS Warangal Logo',
    },
    {
      src: './MDF.png',
      alt: 'MDF KITS Warangal Logo',
    },
  ]
  return (
    <section className="py-12 border-b border-border/10 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 text-center">
        {/* <p className="text-sm text-muted-foreground mb-8 uppercase tracking-widest">In Association With</p> */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-10 md:gap-20">
          {logos.map((i,key) => (
            <motion.div 
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: key * 0.1 }}
              viewport={{ once: true }}
              className="h-40 w-40 bg-muted/20 rounded-lg flex items-center justify-center border border-border/50 hover:border-primary/30 transition-colors"
            >
              <img src={i.src} alt={i.alt} className="w-full h-full object-contain object-center"/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const features = [
    {
      icon: Music,
      title: 'Music',
      description: 'From classical to contemporary, our musicians create symphonies that resonate through the campus.',
    },
    {
      icon: Users,
      title: 'Dance',
      description: 'Express yourself through movement. Classical, folk, western – we embrace all dance forms.',
    },
    {
      icon: Palette,
      title: 'Fine Arts',
      description: 'Unleash your creativity with painting, sketching, photography, and visual storytelling.',
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-20">
          <span className="text-sm text-primary tracking-widest uppercase mb-4 block">About Us</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            The Heart of <span className="gradient-text">Creativity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            MDF Club has been the cornerstone of artistic expression at KITS Warangal, 
            nurturing talents and creating unforgettable cultural experiences.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="gradient-border p-8 rounded-2xl h-full"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { value: '500+', label: 'Active Members' },
    { value: '50+', label: 'Events Hosted' },
    { value: '15+', label: 'Years of Legacy' },
    { value: '100+', label: 'Awards Won' },
  ];

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container mx-auto px-6">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StaggerItem key={index} className="text-center">
              <Parallax speed={0.2}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  <span className="text-5xl md:text-6xl font-bold gradient-text">{stat.value}</span>
                  <p className="text-muted-foreground mt-2 text-sm tracking-widest uppercase">{stat.label}</p>
                </motion.div>
              </Parallax>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-conic from-primary/20 via-accent/10 to-secondary/20 blur-3xl opacity-30"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="gradient-border rounded-3xl p-12 md:p-20 text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready to <span className="gradient-text">Create</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Join MDF and become part of a legacy that celebrates art, culture, and creativity.
            </p>
            <Link to="/join">
              <Button variant="gradient" size="xl" className="group">
                Become a Member
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold gradient-text">MDF</span>
            <span className="text-sm text-muted-foreground">KITS Warangal</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/student-body" className="hover:text-foreground transition-colors">Team</Link>
            <Link to="/events" className="hover:text-foreground transition-colors">Events</Link>
            <Link to="/faculty" className="hover:text-foreground transition-colors">Faculty</Link>
            <Link to="/join" className="hover:text-foreground transition-colors">Join</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MDF Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const HomePage = () => {
  return (
    <main className="relative noise-overlay">
      <HeroSection />
      <LogoSection />
      <AboutSection />
      {/* <StatsSection /> */}
      <CTASection />
      <Footer />
    </main>
  );
};

export default HomePage;
