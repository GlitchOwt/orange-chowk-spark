
import { motion } from 'framer-motion';
import { Users, ExternalLink, Globe } from 'lucide-react';
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

  const handleJoinPanIndia = () => {
    toast({
      title: "PAN India group link sent!",
      description: "Check your email for the PAN India Creatives WhatsApp group link.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-orange-900 mb-4">Groups</h2>
        <p className="text-orange-700 mb-6">Connect with creatives in your city and across India.</p>
        
        <div className="space-y-4">
          {/* PAN India Group */}
          <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 backdrop-blur-sm rounded-lg p-4 border border-orange-200/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-orange-900 font-semibold">PAN India Creatives</h3>
                <p className="text-orange-700 text-sm">Connect with creatives across India</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleJoinPanIndia}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Join WhatsApp
            </Button>
          </div>

          {/* City Groups */}
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
              Want to switch city groups? Contact us to make changes.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
