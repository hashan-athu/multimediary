'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetchApi('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      // the API returns JWT in the Authorization header
      const token = response.headers.get('Authorization')?.replace('Bearer ', '');
      const userData = await response.json();

      if (token) {
        login(token, userData);
        toast.success('Welcome back to the Cinematic Admin');
      } else {
        throw new Error('Token missing from response headers');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Background cinematic blur effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-teal-900/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-md p-4">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-600/20 p-3 rounded-full mb-4">
            <Film className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Multimediary</h1>
          <p className="text-zinc-400">Cinematic Admin Dashboard</p>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the admin portal.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-teal-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-teal-500"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-500 text-white transition-colors"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
