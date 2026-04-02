import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Activity } from 'lucide-react';

export function AuthScreens({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // If registration was successful, log them in automatically
      if (!isLogin) {
        const loginRes = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const loginData = await loginRes.json();
        if (loginData.token) {
          setToken(loginData.token);
        } else {
          setIsLogin(true); // fall back to login screen
        }
      } else {
        if (data.token) {
          setToken(data.token);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
      <Card className="w-full max-w-sm shadow-lg border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="text-center pb-2 mt-2">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            {isLogin ? 'Enter your credentials to access the dashboard' : 'Sign up to start managing your campaigns'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {error && (
              <div className="p-3 text-sm font-medium bg-rose-50 text-rose-500 border border-rose-200 rounded-lg dark:bg-rose-500/10 dark:border-rose-500/20 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Username</label>
              <input 
                type="text" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm" 
                placeholder="admin"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm" 
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 mt-2"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
            
            <p className="text-center text-sm text-slate-500 mt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? 'Register here' : 'Log in instead'}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
