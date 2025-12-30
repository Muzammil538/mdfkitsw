import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music, Users, Palette, Star, CheckCircle } from 'lucide-react';

const benefits = [
  { icon: Music, text: 'Access to music studio and instruments' },
  { icon: Users, text: 'Network with 500+ creative minds' },
  { icon: Palette, text: 'Free workshops and masterclasses' },
  { icon: Star, text: 'Perform at major college events' },
];

const JoinPage = () => {
  return (
    <main className="relative noise-overlay min-h-screen pt-32 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-conic from-primary/10 via-accent/5 to-secondary/10 blur-3xl opacity-50"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm text-primary tracking-widest uppercase mb-4 block">Become a Member</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Join <span className="gradient-text">MDF</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to unleash your creativity? Join the most vibrant arts community at KITS Warangal 
            and be part of something extraordinary.
          </p>
        </ScrollReveal>

        {/* Benefits Section */}
        <ScrollReveal delay={0.2} className="max-w-4xl mx-auto mb-20">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="gradient-border rounded-3xl p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">Why Join MDF?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Categories */}
        <ScrollReveal delay={0.3} className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Choose Your Path</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Music', desc: 'Vocal, Instrumental, Band', color: 'from-primary to-accent', sv: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] object-center lucide lucide-music4-icon lucide-music-4"><path d="M9 18V5l12-2v13"/><path d="m9 9 12-2"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
              { name: 'Dance', desc: 'Classical, Western, Folk', color: 'from-accent to-secondary', sv:<img className='w-[50%] h-[50%] object-center' src="https://img.icons8.com/ios-filled/50/dancing.png" alt="dancing"/> },
              { name: 'Fine Arts', desc: 'Painting, Sketching, Photography', color: 'from-secondary to-primary', sv:<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] object-center lucide lucide-palette-icon lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg> },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="gradient-border rounded-2xl p-6 text-center group cursor-pointer"
              >
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${category.color} opacity-80 mb-4 group-hover:opacity-40 transition-opacity flex items-center justify-center`} >{category.sv}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:gradient-text transition-all">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">{category.desc}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.4}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="gradient-border rounded-3xl p-12 text-center max-w-2xl mx-auto"
          >
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to <span className="gradient-text">Begin</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Fill out our registration form to become a member. We'll reach out to you with next steps.
            </p>
            <Button variant="gradient" size="xl" className="group">
              Register Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </ScrollReveal>
      </div>
    </main>
  );
};

export default JoinPage;
