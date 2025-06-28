
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const pastEventsData = [
  {
    id: 'creative-minds-mumbai',
    title: 'Creative Minds Meetup',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&object=cover',
    location: 'Mumbai'
  },
  {
    id: 'design-thinking-delhi',
    title: 'Design Thinking Workshop',
    date: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&object=cover',
    location: 'Delhi'
  },
  {
    id: 'storytelling-bangalore',
    title: 'Visual Storytelling Summit',
    date: '2024-02-05',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&object=cover',
    location: 'Bangalore'
  },
  {
    id: 'brand-identity-mumbai',
    title: 'Brand Identity Bootcamp',
    date: '2024-02-18',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&object=cover',
    location: 'Mumbai'
  },
  {
    id: 'photography-chennai',
    title: 'Street Photography Walk',
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&object=cover',
    location: 'Chennai'
  },
  {
    id: 'ux-research-pune',
    title: 'UX Research Masterclass',
    date: '2024-03-25',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&object=cover',
    location: 'Pune'
  }
];

interface EventsSectionProps {
  userData?: any;
}

export const EventsSection = ({ userData }: EventsSectionProps) => {
  // Get attended events from user data
  const attendedEventIds = userData?.pastEvents || [];
  const attendedEvents = pastEventsData.filter(event => 
    attendedEventIds.includes(event.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {attendedEvents.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-orange-900 mb-4">Your Past Events</h2>
          <p className="text-orange-700 text-sm mb-6">
            Welcome back! Here are the Orange Chowk events you've attended:
          </p>
          
          <Carousel className="w-full">
            <CarouselContent>
              {attendedEvents.map((event) => (
                <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden border border-orange-100/30 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        Attended ✓
                      </div>
                    </div>
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
                </CarouselItem>
              ))}
            </CarouselContent>
            {attendedEvents.length > 3 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </Card>
      )}

      <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-orange-900 mb-4">
          {attendedEvents.length > 0 ? 'Other Events You Might Like' : 'Recommended Events'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {pastEventsData.filter(event => !attendedEventIds.includes(event.id)).slice(0, 4).map((event) => (
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
