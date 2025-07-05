import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ApplicationResponse {
  id: string;
  name: string;
  email: string;
  city: string | null;
  profession: string | null;
  past_events: Json | null;
  motivation: string;
  community_meaning: string;
  collaboration_story: string;
  current_projects: string;
  contribution_plans: string;
  evaluation_score: number | null;
  evaluation_feedback: string | null;
  evaluation_breakdown: any | null;
  ai_detected: boolean | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export const useApplications = () => {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('application_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected', evaluationData?: any) => {
    try {
      const updateData: any = { status };
      
      if (evaluationData) {
        updateData.evaluation_score = evaluationData.score;
        updateData.evaluation_feedback = evaluationData.feedback;
        updateData.evaluation_breakdown = evaluationData.breakdown;
        updateData.ai_detected = evaluationData.aiDetected;
      }

      const { error } = await supabase
        .from('application_responses')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Application updated",
        description: `Application has been ${status}.`
      });

      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
    }
  };

  const getApplicationByEmail = async (email: string): Promise<ApplicationResponse | null> => {
    try {
      const { data, error } = await supabase
        .from('application_responses')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data || null;
    } catch (error) {
      console.error('Error fetching application by email:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchApplications();

    // Set up real-time subscription
    const channel = supabase
      .channel('application-responses-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'application_responses'
      }, () => {
        fetchApplications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    applications,
    loading,
    updateApplicationStatus,
    getApplicationByEmail,
    refetch: fetchApplications
  };
};