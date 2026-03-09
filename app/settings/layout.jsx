'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Settings,
  Bug,
  UserPlus,
  UserCheck,
  Users,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

export default function SettingsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem('settings_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/install/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginCredentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || data.error || 'Login failed');
        return;
      }

      // Store authentication state and credentials
      sessionStorage.setItem('settings_authenticated', 'true');
      sessionStorage.setItem('settings_username', loginCredentials.username);
      sessionStorage.setItem('settings_password', loginCredentials.password);
      setIsAuthenticated(true);
      setLoginError('');
      setLoginCredentials({ username: '', password: '' });
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('Failed to login. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('settings_authenticated');
    sessionStorage.removeItem('settings_username');
    sessionStorage.removeItem('settings_password');
    setIsAuthenticated(false);
    router.push('/settings');
  };

  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container max-w-md mx-auto py-12 px-4">
        <div className="bg-card text-card-foreground shadow-sm rounded-lg border p-6">
          <h1 className="text-2xl font-semibold leading-none tracking-tight text-center mb-2">
            Admin Login Required
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            This page requires admin authentication. Please enter your credentials to continue.
          </p>

          {loginError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={loginCredentials.username}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
                disabled={loginLoading}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
                disabled={loginLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginLoading || !loginCredentials.username || !loginCredentials.password}
            >
              {loginLoading && <Spinner className="mr-2 h-4 w-4" />}
              {loginLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { name: 'App Settings', href: '/settings', icon: Settings },
    { name: 'Join Page', href: '/settings/join', icon: UserPlus },
    { name: 'Errors', href: '/settings/errors', icon: Bug },
    { name: 'Season Signups', href: '/settings/season-signups', icon: UserCheck },
    { name: 'Roster Builder', href: '/settings/roster-builder', icon: Users },
  ];

  const isTabActive = (href) => {
    if (href === '/settings') {
      return pathname === '/settings';
    }
    if (href === '/settings/errors') {
      return pathname?.startsWith('/settings/errors');
    }
    return pathname === href;
  };

  return (
    <div className="container max-w-screen-2xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          size="sm"
        >
          Logout
        </Button>
      </div>

      <div className="border-b border-border mb-6 overflow-x-auto pb-px">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = isTabActive(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center
                  ${isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </div>
  );
}
