import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
      toast.success('Login successful');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts
  const demoAccounts = [
    { email: 'admin@restaubar.com', password: 'admin123', role: 'Admin' },
    { email: 'pos@restaubar.com', password: 'pos123', role: 'POS' },
    { email: 'waiter@restaubar.com', password: 'waiter123', role: 'Waiter' },
  ];

  const setDemoAccount = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">🍽️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">RestauBar</h1>
              <p className="text-sm text-slate-400">Management System</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 dark:bg-slate-800">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaubar.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Demo Accounts:</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => setDemoAccount(account.email, account.password)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary/20 transition-colors text-sm"
                >
                  <div className="font-medium text-foreground">{account.role}</div>
                  <div className="text-xs text-muted-foreground">{account.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Production-ready RestauBar Management System
        </p>
      </div>
    </div>
  );
}
