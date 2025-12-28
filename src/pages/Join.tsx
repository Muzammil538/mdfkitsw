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
              { name: 'Music', desc: 'Vocal, Instrumental, Band', color: 'from-primary to-accent' },
              { name: 'Dance', desc: 'Classical, Western, Folk', color: 'from-accent to-secondary' },
              { name: 'Fine Arts', desc: 'Painting, Sketching, Photography', color: 'from-secondary to-primary' },
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
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${category.color} opacity-20 mb-4 group-hover:opacity-40 transition-opacity`} />
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
