
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

const mockEvents = [
  {
    id: 1,
    title: 'Creative Minds Meetup',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&object=cover',
    location: 'Mumbai'
  },
  {
    id: 2,
    title: 'Design Thinking Workshop',
    date: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&object=cover',
    location: 'Delhi'
  }
];

export const EventsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-orange-900 mb-4">Your Event History</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {mockEvents.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden border border-orange-100/30 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="text-orange-900 font-semibold mb-2">{event.title}</h3>
                <div className="flex items-center gap-2 text-orange-700 text-sm">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-orange-700 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
