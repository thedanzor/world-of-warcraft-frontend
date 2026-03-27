'use client';

/**
 * @file Database upgrade / migration page
 * @module app/upgrade/page
 *
 * Admin-authenticated page to inspect and run database migrations.
 * Useful after code updates that add new fields or rename config keys.
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Play,
  PlayCircle,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

function getAuthHeader(username, password) {
  return 'Basic ' + btoa(`${username}:${password}`);
}

export default function UpgradePage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [migrations, setMigrations] = useState(null);
  const [summary, setSummary] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState('');

  const [runningId, setRunningId] = useState(null);
  const [runAllLoading, setRunAllLoading] = useState(false);
  const [results, setResults] = useState({});

  // Restore session credentials
  useEffect(() => {
    const stored = sessionStorage.getItem('upgrade_credentials');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCredentials(parsed);
        setIsAuthenticated(true);
      } catch {
        sessionStorage.removeItem('upgrade_credentials');
      }
    }
  }, []);

  const fetchStatus = useCallback(async (creds = credentials) => {
    setStatusLoading(true);
    setStatusError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/upgrade/status`, {
        headers: { Authorization: getAuthHeader(creds.username, creds.password) },
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusError(data.message || 'Failed to load upgrade status');
        if (res.status === 401) setIsAuthenticated(false);
        return;
      }
      setMigrations(data.migrations);
      setSummary(data.summary);
    } catch (err) {
      setStatusError('Network error — is the backend running?');
    } finally {
      setStatusLoading(false);
    }
  }, [credentials]);

  useEffect(() => {
    if (isAuthenticated) fetchStatus();
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/upgrade/status`, {
        headers: { Authorization: getAuthHeader(credentials.username, credentials.password) },
      });
      if (res.status === 401) {
        setLoginError('Invalid username or password');
        return;
      }
      if (!res.ok) {
        setLoginError('Failed to authenticate — check backend connection');
        return;
      }
      const data = await res.json();
      sessionStorage.setItem('upgrade_credentials', JSON.stringify(credentials));
      setIsAuthenticated(true);
      setMigrations(data.migrations);
      setSummary(data.summary);
    } catch {
      setLoginError('Network error — is the backend running?');
    } finally {
      setLoginLoading(false);
    }
  };

  const runMigration = async (migrationId) => {
    setRunningId(migrationId);
    setResults((prev) => ({ ...prev, [migrationId]: null }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/upgrade/run/${migrationId}`, {
        method: 'POST',
        headers: { Authorization: getAuthHeader(credentials.username, credentials.password) },
      });
      const data = await res.json();
      setResults((prev) => ({ ...prev, [migrationId]: data }));
      // Refresh status after running
      await fetchStatus();
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [migrationId]: { success: false, message: 'Network error' },
      }));
    } finally {
      setRunningId(null);
    }
  };

  const runAll = async () => {
    setRunAllLoading(true);
    setResults({});
    try {
      const res = await fetch(`${API_BASE_URL}/api/upgrade/run-all`, {
        method: 'POST',
        headers: { Authorization: getAuthHeader(credentials.username, credentials.password) },
      });
      const data = await res.json();
      if (data.results) {
        const byId = {};
        data.results.forEach((r) => { byId[r.id] = r; });
        setResults(byId);
      }
      await fetchStatus();
    } catch (err) {
      setStatusError('Network error running migrations');
    } finally {
      setRunAllLoading(false);
    }
  };

  /* ── Login screen ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-xl bg-muted border border-border">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Database Upgrade</h1>
            <p className="text-sm text-muted-foreground">Admin credentials required</p>
          </div>

          {loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4 p-6 rounded-xl border border-border bg-card shadow-sm">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={credentials.username}
                onChange={(e) => setCredentials((p) => ({ ...p, username: e.target.value }))}
                autoFocus
                required
                disabled={loginLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))}
                required
                disabled={loginLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginLoading || !credentials.username || !credentials.password}
            >
              {loginLoading ? <Spinner className="mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              {loginLoading ? 'Verifying…' : 'Continue'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Main upgrade UI ── */
  const pendingMigrations = migrations?.filter((m) => m.needed) ?? [];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Upgrade</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Inspect and apply database migrations after code updates.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStatus()}
            disabled={statusLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${statusLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem('upgrade_credentials');
              setIsAuthenticated(false);
              setCredentials({ username: '', password: '' });
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {statusError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{statusError}</AlertDescription>
        </Alert>
      )}

      {/* Summary bar */}
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Migrations', value: summary.total, color: 'text-foreground' },
            {
              label: 'Pending',
              value: summary.pending,
              color: summary.pending > 0 ? 'text-amber-400' : 'text-muted-foreground',
            },
            {
              label: 'Up to Date',
              value: summary.upToDate,
              color: summary.upToDate === summary.total ? 'text-green-500' : 'text-muted-foreground',
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-4 text-center shadow-sm"
            >
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Run All button */}
      {pendingMigrations.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div>
            <p className="font-semibold text-amber-400 text-sm">
              {pendingMigrations.length} migration{pendingMigrations.length > 1 ? 's' : ''} pending
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Run all to bring the database up to date
            </p>
          </div>
          <Button
            onClick={runAll}
            disabled={runAllLoading || runningId !== null}
            className="shrink-0"
          >
            {runAllLoading ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            {runAllLoading ? 'Running…' : 'Run All Pending'}
          </Button>
        </div>
      )}

      {summary?.pending === 0 && !statusLoading && migrations && (
        <Alert className="border-green-500/30 bg-green-500/5 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Database is up to date</AlertTitle>
          <AlertDescription className="text-green-500/80">
            All migrations have been applied. No action required.
          </AlertDescription>
        </Alert>
      )}

      {/* Migration cards */}
      {statusLoading && !migrations && (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      {migrations && (
        <div className="space-y-4">
          {migrations.map((migration) => {
            const result = results[migration.id];
            const isRunning = runningId === migration.id;

            return (
              <div
                key={migration.id}
                className={`rounded-xl border bg-card shadow-sm overflow-hidden ${
                  migration.error
                    ? 'border-destructive/40'
                    : migration.needed
                    ? 'border-amber-500/40'
                    : 'border-border/50'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{migration.name}</h3>
                        {migration.error ? (
                          <Badge variant="destructive" className="text-xs">Check failed</Badge>
                        ) : migration.needed ? (
                          <Badge className="text-xs bg-amber-500/15 text-amber-400 border-amber-500/30">
                            Pending
                          </Badge>
                        ) : (
                          <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                            Up to date
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {migration.description}
                      </p>
                      {migration.reason && (
                        <p className="text-xs flex items-start gap-1.5 mt-1.5">
                          <Info className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
                          <span className={migration.needed ? 'text-amber-400/80' : 'text-muted-foreground'}>
                            {migration.reason}
                          </span>
                        </p>
                      )}
                    </div>
                    {migration.needed && !migration.error && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        onClick={() => runMigration(migration.id)}
                        disabled={isRunning || runAllLoading}
                      >
                        {isRunning ? (
                          <Spinner className="mr-1.5 h-3.5 w-3.5" />
                        ) : (
                          <Play className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        {isRunning ? 'Running…' : 'Run'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Result panel */}
                {result && (
                  <div
                    className={`border-t px-5 py-3 text-xs flex items-start gap-2 ${
                      result.success
                        ? 'border-green-500/20 bg-green-500/5 text-green-400'
                        : 'border-destructive/20 bg-destructive/5 text-destructive'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    )}
                    <span>
                      {result.message}
                      {result.background && (
                        <span className="text-muted-foreground ml-1">
                          — running in background
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-muted-foreground text-center pb-4">
        Migrations are idempotent — safe to run multiple times. Background jobs can be monitored on the{' '}
        <a href="/install" className="underline hover:text-foreground">install page</a>.
      </p>
    </div>
  );
}
