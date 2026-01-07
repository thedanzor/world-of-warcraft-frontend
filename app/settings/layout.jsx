/**
 * @file Layout for settings pages - requires authentication
 * @module app/settings/layout
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  BugReport as BugReportIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  HowToReg as HowToRegIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import Link from 'next/link';

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Admin Login Required
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            This page requires admin authentication. Please enter your credentials to continue.
          </Typography>

          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLoginError('')}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={loginCredentials.username}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                  disabled={loginLoading}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={loginLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loginLoading || !loginCredentials.username || !loginCredentials.password}
                  startIcon={loginLoading ? <CircularProgress size={20} /> : null}
                >
                  {loginLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    );
  }

  // Show settings interface when authenticated
  const currentTab = pathname === '/settings' ? 0 
    : pathname === '/settings/join' ? 1 
    : pathname?.startsWith('/settings/errors') ? 2 
    : pathname === '/settings/season-signups' ? 3 
    : pathname === '/settings/roster-builder' ? 4 
    : 0;

  return (
    <Container maxWidth="xxl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        <Button
          variant="outlined"
          onClick={handleLogout}
          size="small"
        >
          Logout
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab}>
          <Tab
            label="App Settings"
            icon={<SettingsIcon />}
            iconPosition="start"
            component={Link}
            href="/settings"
            value={0}
          />
          <Tab
            label="Join Page"
            icon={<PersonAddIcon />}
            iconPosition="start"
            component={Link}
            href="/settings/join"
            value={1}
          />
          <Tab
            label="Errors"
            icon={<BugReportIcon />}
            iconPosition="start"
            component={Link}
            href="/settings/errors"
            value={2}
          />
          <Tab
            label="Season Signups"
            icon={<HowToRegIcon />}
            iconPosition="start"
            component={Link}
            href="/settings/season-signups"
            value={3}
          />
          <Tab
            label="Roster Builder"
            icon={<GroupIcon />}
            iconPosition="start"
            component={Link}
            href="/settings/roster-builder"
            value={4}
          />
        </Tabs>
      </Box>

      {children}
    </Container>
  );
}

