
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthProps {
  onAccountCreated?: () => void;
}

export const Auth = ({ onAccountCreated }: AuthProps) => {
  const [isSignUp, setIsSignUp] = useState(true); // Default to sign up for new approved users
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let error;
      if (isSignUp) {
        ({ error } = await signUp(email, password, name));
      } else {
        ({ error } = await signIn(email, password));
      }

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: isSignUp ? "Account created!" : "Welcome back!",
          description: isSignUp ? "Please check your email to verify your account." : "You've been signed in successfully."
        });
        
        // Call the callback when account is successfully created
        if (onAccountCreated) {
          onAccountCreated();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={onAccountCreated ? "" : "min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center p-6"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-8 shadow-sm">
          {!onAccountCreated && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-orange-900 mb-2">
                Orange Chowk
              </h1>
              <p className="text-orange-700">
                {isSignUp ? "Join the creative community" : "Welcome back to the community"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <Label htmlFor="name" className="text-orange-800">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/50 border-orange-200 focus:border-orange-500"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="text-orange-800">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 border-orange-200 focus:border-orange-500"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-orange-800">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/50 border-orange-200 focus:border-orange-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          {!onAccountCreated && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
