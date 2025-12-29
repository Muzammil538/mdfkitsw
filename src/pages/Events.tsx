import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Calendar, MapPin, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEvents } from '@/lib/firestore';
import { Event } from '@/store/useContentStore';

const categoryColors = {
  music: 'from-primary to-accent',
  dance: 'from-accent to-secondary',
  arts: 'from-secondary to-primary',
  cultural: 'from-primary via-accent to-secondary',
};

const EventCard = ({ event, onClick }: { event: Event; onClick: () => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className={`gradient-border rounded-2xl overflow-hidden cursor-pointer group ${
        event.featured ? 'md:col-span-2 md:row-span-2 ' : ''
      }`}
    >
      {/* Image or gradient placeholder */}
      <div className={`relative h-48 ${event.featured ? 'md:h-80' : ''} bg-gradient-to-br ${categoryColors[event.category]} opacity-20`}>
        {event.images?.[0] ? (
          <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-card/80" />
        )}
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-background/50 backdrop-blur-sm capitalize">
            {event.category}
          </span>
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end p-6"
        >
          <Button variant="glass" size="sm" className="group/btn">
            View Gallery
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={`font-semibold mb-2 group-hover:gradient-text transition-all ${event.featured ? 'text-2xl' : 'text-lg'}`}>
          {event.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {event.date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {event.location}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const EventModal = ({ event, onClose }: { event: Event; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-auto gradient-border rounded-3xl p-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[event.category]} text-primary-foreground capitalize mb-4`}>
              {event.category}
            </span>
            <h2 className="text-4xl font-bold gradient-text mb-4">{event.title}</h2>
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {event.date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{event.description}</p>

          {/* Gallery */}
          {event.images && event.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.images.map((url, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden"
                >
                  <img src={url} alt={`${event.title} - Image ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No images available for this event.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.category === filter);

  return (
    <main className="relative noise-overlay min-h-screen pt-32 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm text-primary tracking-widest uppercase mb-4 block">Gallery</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Our <span className="gradient-text">Events</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relive the moments that made MDF special. Browse through our collection of 
            cultural events, performances, and artistic showcases.
          </p>
        </ScrollReveal>

        {/* Filter */}
        <ScrollReveal delay={0.2} className="flex flex-wrap justify-center gap-2 mb-12">
          {['all', 'music', 'dance', 'arts', 'cultural'].map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
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
        {!isLoading && events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No events added yet.</p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && events.length > 0 && (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </main>
  );
};

export default EventsPage;
