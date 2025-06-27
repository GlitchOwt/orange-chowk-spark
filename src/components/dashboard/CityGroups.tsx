
import { motion } from 'framer-motion';
import { Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CityGroupsProps {
  selectedCityGroups: string[];
}

export const CityGroups = ({ selectedCityGroups }: CityGroupsProps) => {
  const { toast } = useToast();

  const handleJoinWhatsApp = (city: string) => {
    toast({
      title: "WhatsApp group link sent!",
      description: `Check your email for the ${city} Creatives WhatsApp group link.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-orange-900 mb-4">City Groups</h2>
        <p className="text-orange-700 mb-6">You can join up to 2 city groups at a time.</p>
        
        <div className="space-y-4">
          {selectedCityGroups.map((city) => (
            <div key={city} className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-100/30 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-orange-900 font-semibold">{city} Creatives</h3>
                  <p className="text-orange-700 text-sm">Active community group</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleJoinWhatsApp(city)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Join WhatsApp
              </Button>
            </div>
          ))}
          
          <div className="text-center py-4">
            <p className="text-orange-700 text-sm">
              Want to switch groups? Contact us to make changes.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
