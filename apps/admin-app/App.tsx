import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import {
  AdminWorkoutGrid,
  DashboardTemplate,
  HealthCard,
  HealthTemplate,
  NavigationPills,
  uiColors,
  uiSpacing
} from '@workout/shared-components';

const adminPreview = [
  {
    id: 'plan-001',
    title: 'Starter Strength Plan',
    durationInMinutes: 30,
    difficulty: 'Beginner'
  },
  {
    id: 'plan-002',
    title: 'Performance Split',
    durationInMinutes: 55,
    difficulty: 'Advanced'
  }
] as const;

type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

function getCurrentPathname(): string {
  const maybeWindow = globalThis as { window?: { location?: { pathname?: string } } };
  return maybeWindow.window?.location?.pathname ?? '/';
}

function setPathname(pathname: string): void {
  const maybeWindow = globalThis as {
    window?: {
      history?: { pushState: (data: unknown, title: string, url?: string | URL | null) => void };
      dispatchEvent?: (event: Event) => boolean;
    };
  };

  if (!maybeWindow.window?.history?.pushState || !maybeWindow.window.dispatchEvent) {
    return;
  }

  maybeWindow.window.history.pushState({}, '', pathname);
  maybeWindow.window.dispatchEvent(new Event('popstate'));
}

export default function App() {
  const [pathname, setPathnameState] = useState(getCurrentPathname());
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('idle');
  const [healthMessage, setHealthMessage] = useState('Noch kein Check ausgefuehrt.');

  const healthEndpoint = useMemo(() => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      return null;
    }

    return `${supabaseUrl}/functions/v1/client-connection-check`;
  }, []);
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    const maybeWindow = globalThis as {
      window?: {
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
    };

    const syncPath = () => setPathnameState(getCurrentPathname());

    maybeWindow.window?.addEventListener?.('popstate', syncPath);

    return () => {
      maybeWindow.window?.removeEventListener?.('popstate', syncPath);
    };
  }, []);

  async function runHealthCheck() {
    if (!healthEndpoint) {
      setHealthStatus('unhealthy');
      setHealthMessage('EXPO_PUBLIC_SUPABASE_URL fehlt. Bitte in der Admin-App konfigurieren.');
      return;
    }

    if (!supabaseAnonKey) {
      setHealthStatus('unhealthy');
      setHealthMessage('EXPO_PUBLIC_SUPABASE_ANON_KEY fehlt. Bitte in der Admin-App konfigurieren.');
      return;
    }

    try {
      setHealthStatus('loading');
      setHealthMessage('Verbindung wird geprueft...');

      const response = await fetch(healthEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      });

      const text = await response.text();
      const payload = (() => {
        try {
          return JSON.parse(text) as { ok?: boolean; message?: string; error?: string };
        } catch {
          return null;
        }
      })();

      if (!response.ok || !payload?.ok) {
        setHealthStatus('unhealthy');
        setHealthMessage(payload?.error ?? `Health-Check fehlgeschlagen (HTTP ${response.status}).`);
        return;
      }

      setHealthStatus('healthy');
      setHealthMessage(payload?.message ?? 'Verbindung zur Edge Function ist gesund.');
    } catch {
      setHealthStatus('unhealthy');
      setHealthMessage('Verbindung konnte nicht hergestellt werden.');
    }
  }

  const isHealthPage = pathname === '/health';
  const statusLabel = healthStatus.toUpperCase();
  const statusTone = healthStatus === 'healthy' ? 'success' : healthStatus === 'unhealthy' ? 'error' : 'warning';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {!isHealthPage ? (
          <DashboardTemplate
            title="Admin App"
            subtitle="Web-Frontend fuer Planung, Kuration und Verwaltung von Workout-Inhalten."
            navigation={
              <NavigationPills
                items={[
                  { key: 'dashboard', label: 'Dashboard', active: !isHealthPage, onPress: () => setPathname('/') },
                  { key: 'health', label: 'Health', active: isHealthPage, onPress: () => setPathname('/health') }
                ]}
              />
            }
          >
            <AdminWorkoutGrid workouts={adminPreview} />
          </DashboardTemplate>
        ) : (
          <HealthTemplate
            title="Health Page"
            subtitle="Prueft die Erreichbarkeit der Supabase Edge Function vom Admin-Client."
            navigation={
              <NavigationPills
                items={[
                  { key: 'dashboard', label: 'Dashboard', active: !isHealthPage, onPress: () => setPathname('/') },
                  { key: 'health', label: 'Health', active: isHealthPage, onPress: () => setPathname('/health') }
                ]}
              />
            }
            card={
              <HealthCard
                title="Health Page"
                description="Prueft die Erreichbarkeit der Supabase Edge Function vom Admin-Client."
                endpoint={healthEndpoint ?? 'Nicht konfiguriert'}
                statusLabel={statusLabel}
                statusTone={statusTone}
                message={healthMessage}
                actionLabel="Health-Check ausfuehren"
                onAction={runHealthCheck}
              />
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: uiColors.backgroundAdmin
  },
  content: {
    padding: uiSpacing.xxl,
    gap: uiSpacing.xl
  }
});