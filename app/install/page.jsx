'use client';

/**
 * @file Installation page for setting up the application
 * @module app/install/page
 */

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Warning } from '@mui/icons-material';
import CharacterCard from './components/CharacterCard';

const steps = ['App Settings', 'Fetching Guild Data', 'Admin Account'];

export default function InstallPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [defaults, setDefaults] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const [hasGuildData, setHasGuildData] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Reset Dialog State
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetCredentials, setResetCredentials] = useState({ username: '', password: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetInfo, setResetInfo] = useState(null);
  
  // Guild Fetching State
  const [fetchingGuild, setFetchingGuild] = useState(false);
  const [fetchProgress, setFetchProgress] = useState('');
  const [newCharacters, setNewCharacters] = useState([]);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  
  // Socket.IO ref
  const socketRef = useRef(null);
  
  // App Settings Form State
  const [appSettings, setAppSettings] = useState({
    API_BATTLENET_KEY: '',
    API_BATTLENET_SECRET: '',
    GUILD_NAME: '',
    GUILD_REALM: '',
    REGION: 'eu',
    API_PARAM_REQUIREMENTGS: 'namespace=profile-eu&locale=en_US',
    LEVEL_REQUIREMENT: 80,
    GUILD_RANK_REQUIREMENT: [0,1,2,3,4,5,6,7,8,9,10],
    ITEM_LEVEL_REQUIREMENT: 440,
    MIN_CHECK_CAP: 640,
    MAX_CHECK_CAP: 720,
    MIN_TIER_ITEMLEVEL: 640,
    ENCHANTABLE_PIECES: ['WRIST', 'LEGS', 'FEET', 'CHEST', 'MAIN_HAND', 'FINGER_1', 'FINGER_2'],
    MAIN_RANKS: [0,1,2,3,4,5,6,7],
    ALT_RANKS: [8,9,10],
    TANKS: ['Blood', 'Vengeance', 'Guardian', 'Brewmaster', 'Protection'],
    HEALERS: ['Preservation', 'Mistweaver', 'Holy', 'Discipline', 'Restoration'],
    DIFFICULTY: ['Mythic', 'Heroic', 'Normal'],
    SEASON_START_DATE: '2025-08-01',
    CURRENT_RAID: 'Manaforge Omega',
    CURRENT_MPLUS_SEASON: 15,
    GUILLD_RANKS: [
      'Guild Lead',
      'Officer',
      'Officer Alt',
      'Cunt',
      'Muppet',
      'Raider',
      'Trial Raider',
      'Member',
      'Alt',
      'New Recruit'
    ],
    CURRENT_SEASON_TIER_SETS: [
      'Hollow Sentinel\'s Wake ',
      'Charhound\'s Vicious Hunt',
      'Ornaments of the Mother Eagle',
      'Spellweaver\'s Immaculate Design',
      'Midnight Herald\'s Pledge',
      'Augur\'s Ephemeral Plumage ',
      'Crash of Fallen Storms',
      'Vows of the Lucent Battalion',
      'Eulogy to a Dying Star ',
      'Shroud of the Sudden Eclipse',
      'Howls of Channeled Fury ',
      'Inquisitor\'s Feast of Madness',
      'Chains of the Living Weapon'
    ]
  });

  // Admin Form State
  const [adminSettings, setAdminSettings] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Check installation status on mount
  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem('install_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    checkInstallStatus();
    
    // Cleanup socket connection on unmount
    return () => {
      if (socketRef.current) {
        console.log('🔌 Disconnecting Socket.IO on unmount');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const checkInstallStatus = async () => {
    try {
      setCheckingStatus(true);
      const response = await fetch('/api/install');
      const data = await response.json();

      if (data.installed) {
        setIsInstalled(true);
        const adminExists = data.hasAdmin || false;
        setHasAdmin(adminExists);
        setHasGuildData(data.hasGuildData || false);
        
        // If admin exists but user is not authenticated, require login
        if (adminExists && !isAuthenticated) {
          // Don't show install interface until authenticated
        }
        // Show info that settings exist, but allow overwrite
        if (data.currentSettings) {
          // Pre-fill form with current settings (except sensitive data)
          setAppSettings(prev => ({
            ...prev,
            ...data.currentSettings,
            // Don't pre-fill API keys for security
            API_BATTLENET_KEY: '',
            API_BATTLENET_SECRET: '',
          }));
        }
        
        // Auto-advance to suggested step if settings already exist
        if (data.suggestedStep !== undefined && data.suggestedStep > 0) {
          setActiveStep(data.suggestedStep);
        }
      } else {
        setIsInstalled(false);
        setHasAdmin(data.hasAdmin || false);
        setHasGuildData(data.hasGuildData || false);
      }

      if (data.defaults) {
        setDefaults(data.defaults);
        // Merge defaults with current state if not already installed
        if (!data.installed) {
          setAppSettings(prev => ({
            ...prev,
            ...data.defaults,
            // Don't override sensitive fields if they're not in defaults
            API_BATTLENET_KEY: prev.API_BATTLENET_KEY || '',
            API_BATTLENET_SECRET: prev.API_BATTLENET_SECRET || '',
          }));
        }
      }

      // Set initial step based on installation status
      if (data.suggestedStep !== undefined) {
        setActiveStep(data.suggestedStep);
      } else if (data.hasAdmin && !data.installed) {
        setActiveStep(1);
      }
    } catch (error) {
      console.error('Error checking install status:', error);
      setError('Failed to check installation status');
    } finally {
      setCheckingStatus(false);
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  const handleAppSettingsChange = (field, value) => {
    setAppSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdminSettingsChange = (field, value) => {
    setAdminSettings(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleAppSettingsSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submit - isInstalled:', isInstalled, 'hasAdmin:', hasAdmin);
    
    // If already installed AND admin exists, show confirmation dialog
    // If admin doesn't exist, allow overwriting without confirmation (installation incomplete)
    if (isInstalled && hasAdmin) {
      console.log('Showing overwrite dialog - installation complete');
      setShowOverwriteDialog(true);
      return;
    }
    
    // If installed but no admin, OR not installed at all, proceed with overwrite flag
    const shouldOverwrite = isInstalled && !hasAdmin;
    console.log('Submitting with overwrite:', shouldOverwrite);
    await submitAppSettings(shouldOverwrite);
  };

  const submitAppSettings = async (overwrite = false) => {
    console.log('\n=== SUBMIT APP SETTINGS ===');
    console.log('overwrite:', overwrite);
    console.log('isInstalled:', isInstalled);
    console.log('hasAdmin:', hasAdmin);
    console.log('==========================\n');
    
    setLoading(true);
    setError('');
    setSuccess('');
    setValidationResult(null);

    try {
      const response = await fetch('/api/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...appSettings,
          overwrite: overwrite
        }),
      });

      const data = await response.json();
      
      console.log('\n=== RESPONSE ===');
      console.log('Status:', response.status);
      console.log('OK:', response.ok);
      console.log('Data:', data);
      console.log('================\n');

      if (!response.ok) {
        // Check if overwrite is required
        // If requiresOverwrite is true BUT admin doesn't exist, this is a bug - just retry with overwrite
        if (data.requiresOverwrite) {
          console.log('⚠️ Got requiresOverwrite. hasAdmin:', hasAdmin);
          
          if (!hasAdmin) {
            // Installation incomplete - retry with overwrite flag
            console.log('🔄 Retrying with overwrite=true...');
            setLoading(false);
            await submitAppSettings(true);
            return;
          } else {
            // Installation complete - show confirmation dialog
            console.log('📋 Showing overwrite confirmation dialog');
            setShowOverwriteDialog(true);
            setLoading(false);
            return;
          }
        }
        
        // Set detailed error information
        const errorMessage = data.message || data.error || 'Failed to save settings';
        setError(errorMessage);
        
        // Store detailed error information for display
        setErrorDetails({
          error: data.error || 'UNKNOWN_ERROR',
          message: errorMessage,
          details: data.details || errorMessage,
          suggestion: data.suggestion || 'Please check your settings and try again.',
          validation: data.validation
        });
        
        if (data.errors) {
          setPasswordErrors(data.errors);
        }
        
        // Clear success and validation
        setSuccess('');
        setValidationResult(null);
        setLoading(false);
        return;
      }

      setSuccess(overwrite ? 'App settings updated successfully!' : 'App settings saved successfully!');
      setValidationResult({
        isValid: true,
        guildMembers: data.validation?.guildMembers
      });
      
      // Clear any previous errors
      setError('');
      setErrorDetails(null);
      
      // Update installed state
      setIsInstalled(true);
      
      // Start fetching guild data
      setTotalMembers(data.validation?.guildMembers || 0);
      setFetchingGuild(true);
      setActiveStep(1);
      await fetchGuildData();
    } catch (error) {
      console.error('Error saving app settings:', error);
      setError('Failed to save settings. Please try again.');
      setErrorDetails({
        error: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: error.message || 'Failed to connect to the server.',
        suggestion: 'Please check your internet connection and try again.'
      });
      setSuccess('');
      setValidationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuildData = async () => {
    try {
      setFetchProgress('Starting guild data fetch...');
      setError('');
      setErrorDetails(null);
      
      // Start the guild update
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      // Connect to Socket.IO for real-time updates
      if (!socketRef.current) {
        console.log('🔌 Connecting to Socket.IO:', API_BASE_URL);
        socketRef.current = io(API_BASE_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
        });
        
        socketRef.current.on('connect', () => {
          console.log('✅ Socket.IO connected');
        });
        
        socketRef.current.on('disconnect', () => {
          console.log('❌ Socket.IO disconnected');
        });
        
        socketRef.current.on('error', (error) => {
          console.error('Socket.IO error:', error);
        });
      }
      
      const updateResponse = await fetch(`${API_BASE_URL}/api/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataTypes: ['raid', 'mplus', 'pvp'] }),
      });

      const updateData = await updateResponse.json();
      
      if (!updateResponse.ok && updateResponse.status !== 409) {
        const errorMessage = updateData.message || 'Failed to start guild update';
        setError(errorMessage);
        setErrorDetails({
          error: 'GUILD_FETCH_ERROR',
          message: errorMessage,
          details: updateData.error || errorMessage,
          suggestion: 'Please check your API credentials and guild settings. You can go back to step 1 to update your configuration.'
        });
        setFetchingGuild(false);
        setFetchProgress('');
        
        // Disconnect socket on error
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        return;
      }

      const processId = updateData.processId;
      console.log('📝 Guild update started, process ID:', processId);
      setFetchProgress(`Processing guild members... (0/${totalMembers})`);
      
      // Listen for Socket.IO progress updates
      socketRef.current.on('guild-update-progress', (progressData) => {
        console.log('📊 Progress update:', progressData);
        
        const { type, data } = progressData;
        
        switch (type) {
          case 'auth':
            setFetchProgress('Authenticating with Battle.net API...');
            break;
            
          case 'guild-fetch':
            setFetchProgress(`Fetching guild roster... (${data.message || ''})`);
            break;
            
          case 'character-warning':
            // Show warning but continue processing
            console.warn('⚠️  Character warning:', data.message);
            // Don't show error to user, just log it - process continues
            break;
            
          case 'member-processing':
            if (data.current && data.total) {
              setTotalProcessed(data.current);
              const percent = Math.round((data.current / data.total) * 100);
              setFetchProgress(`Processing ${data.character || 'members'}... (${data.current}/${data.total} - ${percent}%)`);
              
              // Add character to display if available
              if (data.character) {
                const [name, realm] = data.character.split('-');
                // Fetch character data to show in card
                fetch(`${API_BASE_URL}/api/fetch/${realm}/${name}?dataTypes=raid,mplus,pvp`)
                  .then(res => res.json())
                  .then(charData => {
                    if (charData.success && charData.character) {
                      const transformedChar = {
                        name: charData.character.name,
                        server: charData.character.server,
                        class: charData.character.metaData?.class || 'Unknown',
                        spec: charData.character.metaData?.spec || 'Unknown',
                        itemLevel: charData.character.itemlevel?.equiped || 0,
                        mplus: charData.character.mplus?.current_mythic_rating?.rating || 0,
                        pvp: charData.character.pvp?.rating || 0,
                        media: charData.character.media,
                        metaData: charData.character.metaData,
                      };
                      setNewCharacters(prev => {
                        const exists = prev.some(c => c.name === transformedChar.name && c.server === transformedChar.server);
                        if (exists) return prev;
                        return [transformedChar, ...prev].slice(0, 3);
                      });
                    }
                  })
                  .catch(err => console.error('Error fetching character:', err));
              }
            }
            break;
            
          case 'final-processing':
            setFetchProgress('Final processing of guild data...');
            break;
            
          case 'statistics':
            setFetchProgress('Generating statistics...');
            break;
            
          case 'complete':
            setFetchProgress(`Complete! Processed ${data.total || totalMembers} members.`);
            setFetchingGuild(false);
            
            // Disconnect socket
            if (socketRef.current) {
              socketRef.current.disconnect();
              socketRef.current = null;
            }
            
            // Move to admin step after a delay
            setTimeout(() => {
              setActiveStep(2);
            }, 2000);
            break;
            
          case 'error':
            const errorMsg = data.message || 'An error occurred during guild fetch';
            setError(errorMsg);
            setErrorDetails({
              error: 'GUILD_FETCH_ERROR',
              message: errorMsg,
              details: data.error || errorMsg,
              suggestion: 'Please check your settings and try again.'
            });
            setFetchingGuild(false);
            
            // Disconnect socket
            if (socketRef.current) {
              socketRef.current.disconnect();
              socketRef.current = null;
            }
            break;
            
          default:
            if (data.message) {
              setFetchProgress(data.message);
            }
        }
      });

      // Poll for status updates
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`${API_BASE_URL}/api/status`);
          const statusData = await statusResponse.json();

          if (statusData.processes && statusData.processes[processId]) {
            const process = statusData.processes[processId];
            
            // Update progress
            if (process.current) {
              setTotalProcessed(process.current);
              setFetchProgress(`Processing ${process.character || 'members'}... (${process.current}/${totalMembers})`);
            }

            // Check for new characters
            if (process.type === 'member-processing' && process.character) {
              // Fetch the character data to show in cards
              try {
                const [realm, name] = process.character.split('-');
                const charResponse = await fetch(`${API_BASE_URL}/api/fetch/${realm}/${name}?dataTypes=raid,mplus,pvp`);
                if (charResponse.ok) {
                  const charData = await charResponse.json();
                  if (charData.success && charData.character) {
                    // Transform character data to match expected format
                    const transformedChar = {
                      name: charData.character.name,
                      server: charData.character.server,
                      class: charData.character.metaData?.class || 'Unknown',
                      spec: charData.character.metaData?.spec || 'Unknown',
                      itemLevel: charData.character.itemlevel?.equiped || charData.character.itemLevel || 0,
                      mplus: charData.character.mplus?.current_mythic_rating?.rating || charData.character.mplus || 0,
                      pvp: charData.character.pvp?.rating || charData.character.pvp || 0,
                      media: charData.character.media,
                      metaData: charData.character.metaData,
                    };
                    setNewCharacters(prev => {
                      // Avoid duplicates
                      const exists = prev.some(c => c.name === transformedChar.name && c.server === transformedChar.server);
                      if (exists) return prev;
                      const updated = [transformedChar, ...prev].slice(0, 3);
                      return updated;
                    });
                  }
                }
              } catch (err) {
                console.error('Error fetching character data:', err);
              }
            }

            // Check if complete
            if (process.type === 'complete' || process.status === 'completed') {
              clearInterval(pollInterval);
              setFetchProgress(`Complete! Processed ${totalMembers} members.`);
              setFetchingGuild(false);
              
              // Move to admin step after a delay
              setTimeout(() => {
                setActiveStep(2);
              }, 2000);
            }
          } else if (statusData.processes && Object.keys(statusData.processes).length === 0) {
            // Process completed
            clearInterval(pollInterval);
            setFetchProgress(`Complete! Processed ${totalMembers} members.`);
            setFetchingGuild(false);
            
            setTimeout(() => {
              setActiveStep(2);
            }, 2000);
          }
        } catch (err) {
          console.error('Error polling status:', err);
        }
      }, 2000); // Poll every 2 seconds

      // Timeout after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (fetchingGuild) {
          setFetchProgress('Fetch completed (timeout).');
          setFetchingGuild(false);
          setActiveStep(2);
        }
      }, 600000);
    } catch (error) {
      console.error('Error fetching guild data:', error);
      const errorMessage = error.message || 'Failed to fetch guild data';
      setError(errorMessage);
      setErrorDetails({
        error: 'GUILD_FETCH_ERROR',
        message: errorMessage,
        details: error.message || 'An error occurred while fetching guild data.',
        suggestion: 'Please check your API credentials and guild settings. You can go back to step 1 to update your configuration and try again.'
      });
      setFetchingGuild(false);
      setFetchProgress('');
      // Don't auto-advance on error - let user fix the issue
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (adminSettings.password !== adminSettings.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    const errors = validatePassword(adminSettings.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/install/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: adminSettings.username,
          password: adminSettings.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to create admin account');
        if (data.errors) {
          setPasswordErrors(data.errors);
        }
        return;
      }

      setSuccess('Admin account created successfully! Installation complete.');
      
      // Set authenticated state since admin was just created
      sessionStorage.setItem('install_authenticated', 'true');
      setIsAuthenticated(true);
      
      // Redirect to home page after a delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error creating admin account:', error);
      setError('Failed to create admin account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      // Store authentication state
      sessionStorage.setItem('install_authenticated', 'true');
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
    sessionStorage.removeItem('install_authenticated');
    setIsAuthenticated(false);
    setLoginCredentials({ username: '', password: '' });
    setLoginError('');
  };

  const handleOpenResetDialog = async () => {
    setShowResetDialog(true);
    setResetError('');
    setResetSuccess('');
    
    // Fetch reset info
    try {
      const response = await fetch('/api/reset/info');
      const data = await response.json();
      if (data.success) {
        setResetInfo(data.info);
      }
    } catch (error) {
      console.error('Error fetching reset info:', error);
    }
  };

  const handleResetDatabase = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');

    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetCredentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setResetError(data.message || data.error || 'Failed to reset database');
        return;
      }

      setResetSuccess(`Database reset successful! ${data.results.summary.droppedCount} collections dropped.`);
      
      // Clear form
      setResetCredentials({ username: '', password: '' });
      
      // Close dialog after a delay and refresh installation status
      setTimeout(() => {
        setShowResetDialog(false);
        setResetSuccess('');
        // Refresh the page to show fresh installation state
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Error resetting database:', error);
      setResetError('Failed to reset database. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
       
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={activeStep === 1 ? 0 : 3} 
          sx={{ 
            p: 4,
            borderRadius: 3,
            background: activeStep === 1 ? 'transparent' : undefined,
            boxShadow: activeStep === 1 ? 'none' : undefined,
          }}
        >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {hasAdmin && !isAuthenticated ? 'Admin Login' : 'Application Installation'}
          </Typography>
          {hasAdmin && isAuthenticated && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                size="small"
              >
                Logout
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleOpenResetDialog}
                size="small"
              >
                Reset Database
              </Button>
            </Box>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          {hasAdmin && !isAuthenticated 
            ? 'Please login with your admin credentials to access the installation page'
            : 'Configure your World of Warcraft guild audit application'}
        </Typography>

        {/* Only show stepper and alerts when authenticated or no admin exists */}
        {(!hasAdmin || isAuthenticated) && (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {(!hasAdmin || isAuthenticated) && isInstalled && activeStep === 0 && !hasAdmin && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              ⚠️ Installation Incomplete - You Can Update Settings
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Settings exist but the admin account was not created. This means installation was interrupted.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
              ✓ You can update your settings below without any confirmation. Just click "Save Settings & Validate" to continue.
            </Typography>
          </Alert>
        )}

        {(!hasAdmin || isAuthenticated) && isInstalled && activeStep === 0 && hasAdmin && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            icon={<Warning />}
            action={
              <Button
                color="error"
                size="small"
                variant="outlined"
                onClick={handleOpenResetDialog}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Reset Database
              </Button>
            }
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Application Already Installed
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Settings already exist in the database. You can overwrite them with new values below.
              This will replace all existing configuration including API keys.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
              Need a fresh start? Click "Reset Database" to wipe all data collections and admin account while preserving your app settings.
            </Typography>
          </Alert>
        )}

        {(!hasAdmin || isAuthenticated) && error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }} 
            onClose={() => {
              setError('');
              setErrorDetails(null);
            }}
            icon={<ErrorIcon />}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              {error}
            </Typography>
            {errorDetails && (
              <Box sx={{ mt: 1 }}>
                {errorDetails.details && errorDetails.details !== error && (
                  <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.9)' }}>
                    {errorDetails.details}
                  </Typography>
                )}
                {errorDetails.suggestion && (
                  <Box 
                    sx={{ 
                      mt: 1.5, 
                      p: 1.5, 
                      bgcolor: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: 1,
                      borderLeft: '3px solid #ffd700'
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#ffd700' }}>
                      💡 Suggestion:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {errorDetails.suggestion}
                    </Typography>
                  </Box>
                )}
                {errorDetails.error === 'GUILD_NOT_FOUND' && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      Common issues:
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Guild name and realm name are case-sensitive</li>
                        <li>Use the guild name slug (lowercase, spaces replaced with hyphens)</li>
                        <li>Use the realm slug (lowercase, spaces replaced with hyphens)</li>
                        <li>Verify the guild exists on the specified realm and region</li>
                      </ul>
                    </Typography>
                  </Box>
                )}
                {errorDetails.error === 'AUTH_ERROR' && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      How to fix:
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Verify your Battle.net API Client ID is correct</li>
                        <li>Verify your Battle.net API Client Secret is correct</li>
                        <li>Check that your API key hasn't expired or been revoked</li>
                        <li>Ensure you copied the full Client ID and Secret without extra spaces</li>
                      </ul>
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Alert>
        )}

        {(!hasAdmin || isAuthenticated) && success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Overwrite Confirmation Dialog */}
          <Dialog
          open={showOverwriteDialog}
          onClose={() => {
            setShowOverwriteDialog(false);
          }}
          aria-labelledby="overwrite-dialog-title"
          aria-describedby="overwrite-dialog-description"
        >
          <DialogTitle id="overwrite-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            Overwrite Existing Settings?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="overwrite-dialog-description">
              <Typography variant="body1" sx={{ mb: 2 }}>
                The application has already been installed with existing settings. Overwriting will:
              </Typography>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Replace all current configuration settings</li>
                <li>Update Battle.net API credentials</li>
                <li>Update guild information and requirements</li>
                <li>Clear the configuration cache</li>
              </ul>
              <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
                This action cannot be undone. Are you sure you want to continue?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setShowOverwriteDialog(false);
              }}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setShowOverwriteDialog(false);
                await submitAppSettings(true);
              }}
              color="warning"
              variant="contained"
              autoFocus
            >
              Overwrite Settings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reset Database Dialog */}
        <Dialog
          open={showResetDialog}
          onClose={() => {
            if (!resetLoading) {
              setShowResetDialog(false);
              setResetError('');
              setResetSuccess('');
              setResetCredentials({ username: '', password: '' });
            }
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            Reset Database
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: 'error.main' }}>
                ⚠️ DANGER: This action will permanently delete all data!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                This will wipe all guild data, member information, season stats, and error logs from the database.
              </Typography>
              {resetInfo && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(255, 0, 0, 0.1)', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Collections to be deleted:
                  </Typography>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {resetInfo.collectionsToReset.map((collection) => (
                      <li key={collection}>
                        <Typography variant="body2" component="span">
                          {collection} ({resetInfo.counts[collection] || 0} documents)
                        </Typography>
                      </li>
                    ))}
                  </ul>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: 'success.main' }}>
                    ✓ Preserved: {resetInfo.collectionsToPreserve.join(', ')}
                  </Typography>
                </Box>
              )}
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                ✓ Preserved: App Settings & Configuration
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                ✗ Admin account will also be deleted
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                After reset, you will need to recreate your admin account and can then re-run the installation process to fetch fresh guild data.
              </Typography>
            </DialogContentText>

            {resetError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setResetError('')}>
                {resetError}
              </Alert>
            )}

            {resetSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {resetSuccess}
              </Alert>
            )}

            {!resetSuccess && (
              <form onSubmit={handleResetDatabase}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: 'error.main' }}>
                  Enter admin credentials to confirm:
                </Typography>
                <TextField
                  fullWidth
                  label="Admin Username"
                  value={resetCredentials.username}
                  onChange={(e) => setResetCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                  disabled={resetLoading}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Admin Password"
                  type="password"
                  value={resetCredentials.password}
                  onChange={(e) => setResetCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={resetLoading}
                />
              </form>
            )}
          </DialogContent>
          <DialogActions>
            {!resetSuccess && (
              <>
                <Button 
                  onClick={() => {
                    setShowResetDialog(false);
                    setResetError('');
                    setResetCredentials({ username: '', password: '' });
                  }}
                  disabled={resetLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResetDatabase}
                  color="error"
                  variant="contained"
                  disabled={resetLoading || !resetCredentials.username || !resetCredentials.password}
                  startIcon={resetLoading ? <CircularProgress size={20} /> : null}
                >
                  {resetLoading ? 'Resetting...' : 'Reset Database'}
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* Login Form - Show when admin exists but user is not authenticated */}
        {hasAdmin && !isAuthenticated && (
          <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Admin Login Required
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This page is protected. Please enter your admin credentials to continue.
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
        )}

        {/* Installation Interface - Show only when no admin exists OR user is authenticated */}
        {(!hasAdmin || isAuthenticated) && activeStep === 0 && (
          <form onSubmit={handleAppSettingsSubmit}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Battle.net API Configuration
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Battle.net API Key"
                  type="password"
                  value={appSettings.API_BATTLENET_KEY}
                  onChange={(e) => handleAppSettingsChange('API_BATTLENET_KEY', e.target.value)}
                  required
                  helperText="Your Battle.net API Client ID"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Battle.net API Secret"
                  type="password"
                  value={appSettings.API_BATTLENET_SECRET}
                  onChange={(e) => handleAppSettingsChange('API_BATTLENET_SECRET', e.target.value)}
                  required
                  helperText="Your Battle.net API Client Secret"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guild Name"
                  value={appSettings.GUILD_NAME}
                  onChange={(e) => handleAppSettingsChange('GUILD_NAME', e.target.value)}
                  required
                  helperText="Guild name slug (e.g., time-and-tide)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guild Realm"
                  value={appSettings.GUILD_REALM}
                  onChange={(e) => handleAppSettingsChange('GUILD_REALM', e.target.value)}
                  required
                  helperText="Realm slug (e.g., ravencrest)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={appSettings.REGION}
                    label="Region"
                    onChange={(e) => handleAppSettingsChange('REGION', e.target.value)}
                    required
                  >
                    <MenuItem value="eu">Europe (EU)</MenuItem>
                    <MenuItem value="us">United States (US)</MenuItem>
                    <MenuItem value="kr">Korea (KR)</MenuItem>
                    <MenuItem value="tw">Taiwan (TW)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="API Parameters"
                  value={appSettings.API_PARAM_REQUIREMENTGS}
                  onChange={(e) => handleAppSettingsChange('API_PARAM_REQUIREMENTGS', e.target.value)}
                  required
                  helperText="e.g., namespace=profile-eu&locale=en_US"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Guild Configuration
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Level Requirement"
                  value={appSettings.LEVEL_REQUIREMENT}
                  onChange={(e) => handleAppSettingsChange('LEVEL_REQUIREMENT', parseInt(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Item Level Requirement"
                  value={appSettings.ITEM_LEVEL_REQUIREMENT}
                  onChange={(e) => handleAppSettingsChange('ITEM_LEVEL_REQUIREMENT', parseInt(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Check Cap"
                  value={appSettings.MIN_CHECK_CAP}
                  onChange={(e) => handleAppSettingsChange('MIN_CHECK_CAP', parseInt(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Check Cap"
                  value={appSettings.MAX_CHECK_CAP}
                  onChange={(e) => handleAppSettingsChange('MAX_CHECK_CAP', parseInt(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Tier Item Level"
                  value={appSettings.MIN_TIER_ITEMLEVEL}
                  onChange={(e) => handleAppSettingsChange('MIN_TIER_ITEMLEVEL', parseInt(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Season Start Date"
                  type="date"
                  value={appSettings.SEASON_START_DATE}
                  onChange={(e) => handleAppSettingsChange('SEASON_START_DATE', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Raid"
                  value={appSettings.CURRENT_RAID}
                  onChange={(e) => handleAppSettingsChange('CURRENT_RAID', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Current M+ Season"
                  value={appSettings.CURRENT_MPLUS_SEASON}
                  onChange={(e) => handleAppSettingsChange('CURRENT_MPLUS_SEASON', parseInt(e.target.value))}
                  required
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Advanced Configuration
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Guild Rank Requirement"
                  value={Array.isArray(appSettings.GUILD_RANK_REQUIREMENT) ? appSettings.GUILD_RANK_REQUIREMENT.join(',') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                    handleAppSettingsChange('GUILD_RANK_REQUIREMENT', values);
                  }}
                  helperText="Comma-separated guild rank IDs (e.g., 0,1,2,3,4,5,6,7,8,9,10)"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Main Ranks"
                  value={Array.isArray(appSettings.MAIN_RANKS) ? appSettings.MAIN_RANKS.join(',') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                    handleAppSettingsChange('MAIN_RANKS', values);
                  }}
                  helperText="Comma-separated rank IDs considered as mains (e.g., 0,1,2,3,4,5,6,7)"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alt Ranks"
                  value={Array.isArray(appSettings.ALT_RANKS) ? appSettings.ALT_RANKS.join(',') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                    handleAppSettingsChange('ALT_RANKS', values);
                  }}
                  helperText="Comma-separated rank IDs considered as alts (e.g., 8,9,10)"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tank Specializations"
                  value={Array.isArray(appSettings.TANKS) ? appSettings.TANKS.join(', ') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('TANKS', values);
                  }}
                  helperText="Comma-separated tank spec names (e.g., Blood, Vengeance, Guardian, Brewmaster, Protection)"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Healer Specializations"
                  value={Array.isArray(appSettings.HEALERS) ? appSettings.HEALERS.join(', ') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('HEALERS', values);
                  }}
                  helperText="Comma-separated healer spec names (e.g., Preservation, Mistweaver, Holy, Discipline, Restoration)"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Enchantable Pieces"
                  value={Array.isArray(appSettings.ENCHANTABLE_PIECES) ? appSettings.ENCHANTABLE_PIECES.join(', ') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('ENCHANTABLE_PIECES', values);
                  }}
                  helperText="Comma-separated slot names (e.g., WRIST, LEGS, FEET, CHEST, MAIN_HAND, FINGER_1, FINGER_2)"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Difficulty Modes"
                  value={Array.isArray(appSettings.DIFFICULTY) ? appSettings.DIFFICULTY.join(', ') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('DIFFICULTY', values);
                  }}
                  helperText="Comma-separated difficulty names (e.g., Mythic, Heroic, Normal)"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Guild Rank Names"
                  value={Array.isArray(appSettings.GUILLD_RANKS) ? appSettings.GUILLD_RANKS.join(',\n') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(/[,\n]/).map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('GUILLD_RANKS', values);
                  }}
                  helperText="One rank name per line or comma-separated (e.g., Guild Lead, Officer, Member, Alt)"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Current Season Tier Sets"
                  value={Array.isArray(appSettings.CURRENT_SEASON_TIER_SETS) ? appSettings.CURRENT_SEASON_TIER_SETS.join(',\n') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(/[,\n]/).map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('CURRENT_SEASON_TIER_SETS', values);
                  }}
                  helperText="One tier set name per line or comma-separated"
                  required
                />
              </Grid>
            </Grid>

            {validationResult && validationResult.isValid && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle />
                  <Typography>
                    API credentials validated successfully! Found {validationResult.guildMembers} guild members.
                  </Typography>
                </Box>
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              {isInstalled && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    // Skip to next step - check what the next step should be
                    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
                    fetch(`${API_BASE_URL}/api/install`)
                      .then(res => res.json())
                      .then(data => {
                        if (data.suggestedStep !== undefined) {
                          setActiveStep(data.suggestedStep);
                        } else if (data.hasGuildData && !data.hasAdmin) {
                          setActiveStep(2); // Skip to admin
                        } else if (!data.hasGuildData) {
                          setActiveStep(1); // Go to guild fetch
                        } else {
                          setActiveStep(2); // Default to admin
                        }
                      })
                      .catch(err => {
                        console.error('Error checking status:', err);
                        // Default to step 1 if check fails
                        setActiveStep(1);
                      });
                  }}
                >
                  Skip to Next Step
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Validating & Saving...' : isInstalled ? 'Update Settings & Validate' : 'Save Settings & Validate'}
              </Button>
            </Box>
          </form>
        )}

        {activeStep === 1 && (
          <Box>
            {/* Skip button at top */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setActiveStep(2);
                }}
                sx={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                Skip Guild Fetch
              </Button>
            </Box>
            
            <Box
              sx={{
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {/* Header */}
              <Typography
                variant="h3"
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                Fetching Guild Data
              </Typography>

              {/* Alerts and Errors */}
              {error && activeStep === 1 && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setActiveStep(0);
                        setError('');
                        setErrorDetails(null);
                      }}
                    >
                      Go Back to Fix
                    </Button>
                  }
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {error}
                  </Typography>
                  {errorDetails && errorDetails.suggestion && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {errorDetails.suggestion}
                    </Typography>
                  )}
                </Alert>
              )}

              {!fetchingGuild && !fetchProgress && (
                <Box sx={{ mb: 2 }}>
                  {hasGuildData && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Guild data already exists in the database. You can skip this step or fetch fresh data.
                    </Alert>
                  )}
                  <Button
                    variant="contained"
                    onClick={fetchGuildData}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  >
                    Start Guild Fetch
                  </Button>
                  <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                    {hasGuildData 
                      ? 'Guild data exists. Click to fetch fresh data, or skip to proceed to admin account creation.'
                      : 'Click the button above to start fetching guild data, or skip this step to proceed to admin account creation.'}
                  </Typography>
                </Box>
              )}

              {/* Progress Indicator - Top */}
              {(fetchingGuild || fetchProgress) && (
                <Box
                  sx={{
                    width: '100%',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 600,
                      }}
                    >
                      {fetchProgress || 'Initializing...'}
                    </Typography>
                    {totalMembers > 0 && (
                      <Typography variant="body1" sx={{ color: '#FFD700', fontWeight: 600, fontSize: '1.1rem' }}>
                        {totalProcessed} / {totalMembers}
                      </Typography>
                    )}
                  </Box>
                  
                  {totalMembers > 0 && (
                    <Box
                      sx={{
                        width: '100%',
                        height: 12,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 6,
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(totalProcessed / totalMembers) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #00D4FF 0%, #FFD700 100%)',
                          transition: 'width 0.3s ease',
                          boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {/* Character Cards - Bottom */}
              {(fetchingGuild || newCharacters.length > 0) && (
                <Box
                  sx={{
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    Recently Processed Characters
                  </Typography>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      width: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    {newCharacters.length > 0 ? (
                      newCharacters.slice(-10).map((character, index) => (
                        <CharacterCard
                          key={`${character.name}-${character.server}-${index}`}
                          character={character}
                          index={index}
                          total={newCharacters.slice(-10).length}
                        />
                      ))
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 200,
                          color: '#666',
                        }}
                      >
                        <Typography variant="body1">
                          Characters will appear here as they are processed...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {(!hasAdmin || isAuthenticated) && activeStep === 2 && (
          <form onSubmit={handleAdminSubmit}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Create Admin Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create an admin account to manage the application. Password must be at least 12 characters with uppercase, lowercase, numbers, and special characters.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={adminSettings.username}
                  onChange={(e) => handleAdminSettingsChange('username', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={adminSettings.password}
                  onChange={(e) => handleAdminSettingsChange('password', e.target.value)}
                  required
                  error={passwordErrors.length > 0}
                  helperText={passwordErrors.length > 0 ? passwordErrors[0] : 'Minimum 12 characters with uppercase, lowercase, numbers, and special characters'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={adminSettings.confirmPassword}
                  onChange={(e) => handleAdminSettingsChange('confirmPassword', e.target.value)}
                  required
                  error={adminSettings.password !== adminSettings.confirmPassword && adminSettings.confirmPassword.length > 0}
                  helperText={adminSettings.password !== adminSettings.confirmPassword && adminSettings.confirmPassword.length > 0 ? 'Passwords do not match' : ''}
                />
              </Grid>
              {passwordErrors.length > 0 && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <Typography variant="body2" component="div">
                      Password requirements not met:
                      <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                        {passwordErrors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </Typography>
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(0)}
                    sx={{ mr: 2 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Creating...' : 'Create Admin Account'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
        </Paper>
      </Container>
    </Box>
  );
}

