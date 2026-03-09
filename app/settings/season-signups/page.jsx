'use client';

/**
 * @file Season Signups management page for admin
 * @module app/settings/season-signups/page
 */

import { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Search, Loader2, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

export default function SeasonSignupsPage() {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [signupToDelete, setSignupToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get Basic Auth header
  const getAuthHeader = () => {
    const username = sessionStorage.getItem('settings_username');
    const password = sessionStorage.getItem('settings_password');
    if (username && password) {
      return 'Basic ' + btoa(`${username}:${password}`);
    }
    return null;
  };

  // Fetch signups
  const fetchSignups = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/season-signups', {
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
          sessionStorage.removeItem('settings_authenticated');
          sessionStorage.removeItem('settings_username');
          sessionStorage.removeItem('settings_password');
        } else {
          setError(data.message || data.error || 'Failed to load signups');
        }
        return;
      }

      setSignups(data.signups || []);
    } catch (error) {
      console.error('Error fetching signups:', error);
      setError('Failed to load signups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem('settings_authenticated');
    if (authStatus === 'true') {
      fetchSignups();
    }
  }, []);

  // Handle delete
  const handleDeleteClick = (signup) => {
    setSignupToDelete(signup);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!signupToDelete) return;

    try {
      setDeleting(true);
      setError('');
      
      const response = await fetch(`/api/season-signups/${signupToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
          sessionStorage.removeItem('settings_authenticated');
        } else {
          setError(data.message || data.error || 'Failed to delete signup');
        }
        return;
      }

      setSuccess('Signup deleted successfully!');
      setDeleteDialogOpen(false);
      setSignupToDelete(null);
      await fetchSignups();
    } catch (error) {
      console.error('Error deleting signup:', error);
      setError('Failed to delete signup. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter signups based on search term
  const filteredSignups = signups.filter(signup => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const seasonCharName = signup.seasonCharacterName || signup.season3CharacterName || '';
    const seasonGoal = signup.seasonGoal || signup.season3Goal || '';
    return (
      signup.currentCharacterName?.toLowerCase().includes(search) ||
      seasonCharName.toLowerCase().includes(search) ||
      signup.characterClass?.toLowerCase().includes(search) ||
      signup.mainSpec?.toLowerCase().includes(search) ||
      seasonGoal.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Season Signups Management
        </h2>
        <Button
          variant="outline"
          onClick={fetchSignups}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 relative">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6" 
            onClick={() => setError('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {success && (
        <div className="mb-4 relative">
          <Alert className="border-green-500 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300" 
            onClick={() => setSuccess('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="bg-card text-card-foreground p-4 mb-6 rounded-lg border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by character name, class, spec, or goal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Current Character</TableHead>
                <TableHead>Season Character</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Main Spec</TableHead>
                <TableHead>Season Goal</TableHead>
                <TableHead>Signed Up</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSignups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {searchTerm ? 'No signups match your search.' : 'No signups found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSignups.map((signup) => {
                  const goal = signup.seasonGoal || signup.season3Goal || '';
                  const goalVariant = goal === 'CE' ? 'destructive' : goal === 'AOTC' ? 'default' : 'secondary';
                  
                  return (
                    <TableRow key={signup._id}>
                      <TableCell>{signup.currentCharacterName || '-'}</TableCell>
                      <TableCell>
                        {signup.seasonCharacterName || signup.season3CharacterName || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {signup.characterClass || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>{signup.mainSpec || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={goalVariant}>
                          {goal || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {signup.timestamp 
                          ? new Date(signup.timestamp).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteClick(signup)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete signup</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {filteredSignups.length > 0 && (
          <div className="p-4 border-t text-sm text-muted-foreground">
            Showing {filteredSignups.length} of {signups.length} signup{signups.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteDialogOpen(false);
            setSignupToDelete(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Signup</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the signup for{' '}
              <strong className="text-foreground">
                {signupToDelete?.seasonCharacterName || signupToDelete?.season3CharacterName || signupToDelete?.currentCharacterName}
              </strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSignupToDelete(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
