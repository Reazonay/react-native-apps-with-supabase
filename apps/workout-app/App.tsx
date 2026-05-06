import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import {
  DashboardTemplate,
  HealthCard,
  HealthTemplate,
  NavigationPills,
  RegisterCard,
  RegisterSuccessTemplate,
  RegisterTemplate,
  uiColors,
  uiSpacing,
  WorkoutList
} from '@workout/shared-components';


const upcomingWorkouts = [
  {
    id: 'w-001',
    title: 'Lower Body Strength',
    durationInMinutes: 45,
    difficulty: 'Intermediate'
  },
  {
    id: 'w-002',
    title: 'Core Stability Circuit',
    durationInMinutes: 20,
    difficulty: 'Beginner'
  }
] as const;

type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

function getCurrentPathname(): string {
  const maybeWindow = globalThis as { window?: { location?: { pathname?: string } } };
  return maybeWindow.window?.location?.pathname ?? '/';
}

export default function App() {
  const [pathname, setPathnameState] = useState(getCurrentPathname());

  const navigateTo = (pathname: string) => {
    setPathnameState(pathname);

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
  };
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
      setHealthMessage('EXPO_PUBLIC_SUPABASE_URL fehlt. Bitte in der Workout-App konfigurieren.');
      return;
    }

    if (!supabaseAnonKey) {
      setHealthStatus('unhealthy');
      setHealthMessage('EXPO_PUBLIC_SUPABASE_ANON_KEY fehlt. Bitte in der Workout-App konfigurieren.');
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

  const isDashboardPage = pathname === '/dashboard';
  const isHealthPage = pathname === '/health';
  const isRegisterPage = pathname === '/register';
  const isRegistrationSuccessPage = pathname === '/register/success';

  const statusLabel = healthStatus.toUpperCase();
  const statusTone = healthStatus === 'healthy' ? 'success' : healthStatus === 'unhealthy' ? 'error' : 'warning';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {isDashboardPage ? (
          <DashboardTemplate
            title="Workout App"
            subtitle="Mobile-Frontend fuer Trainingsplaene, Sessions und Fortschritt."
            navigation={
              <NavigationPills
                items={[
                  { key: 'dashboard', label: 'Dashboard', active: isDashboardPage, onPress: () => navigateTo('/dashboard') },
                  {
                    key: 'register',
                    label: 'Register',
                    active: isRegisterPage || isRegistrationSuccessPage,
                    onPress: () => navigateTo('/register')
                  },
                  { key: 'health', label: 'Health', active: isHealthPage, onPress: () => navigateTo('/health') }
                ]}
              />
            }
          >
            <WorkoutList workouts={upcomingWorkouts} />
          </DashboardTemplate>
        ) : isRegisterPage ? (
          <RegisterTemplate
            title="Register"
            subtitle="Erstelle dein Workout-Konto."
            navigation={
              <NavigationPills
                items={[
                  { key: 'dashboard', label: 'Dashboard', active: isDashboardPage, onPress: () => navigateTo('/dashboard') },
                  {
                    key: 'register',
                    label: 'Register',
                    active: isRegisterPage || isRegistrationSuccessPage,
                    onPress: () => navigateTo('/register')
                  },
                  { key: 'health', label: 'Health', active: isHealthPage, onPress: () => navigateTo('/health') }
                ]}
              />
            }
            card={
              <RegisterCard
                title="Konto erstellen"
                description="Registriere dich, um Trainingsplaene zu speichern."
                submitLabel="Registrieren"
                onSubmit={() => navigateTo('/register/success')}
              />
            }
          />
        ) : isRegistrationSuccessPage ? (
          <RegisterSuccessTemplate
            title="Registrierung abgeschlossen"
            subtitle="Dein Konto wurde angelegt. Du kannst jetzt loslegen."
            navigation={
              <NavigationPills
                items={[
                  { key: 'dashboard', label: 'Dashboard', active: isDashboardPage, onPress: () => navigateTo('/dashboard') },
                  {
                    key: 'register',
                    label: 'Register',
                    active: isRegisterPage || isRegistrationSuccessPage,
                    onPress: () => navigateTo('/register')
                  },
                  { key: 'health', label: 'Health', active: isHealthPage, onPress: () => navigateTo('/health') }
                ]}
              />
            }
            actionLabel="Zum Dashboard"
            onAction={() => navigateTo('/dashboard')}
          />
        ) : (
          <HealthTemplate
            title="Health Page"
            subtitle="Prueft die Erreichbarkeit der Supabase Edge Function vom Workout-Client."
            navigation={
              <NavigationPills
                items={[
                  { key: 'dashboard', label: 'Dashboard', active: isDashboardPage, onPress: () => navigateTo('/dashboard') },
                  {
                    key: 'register',
                    label: 'Register',
                    active: isRegisterPage || isRegistrationSuccessPage,
                    onPress: () => navigateTo('/register')
                  },
                  { key: 'health', label: 'Health', active: isHealthPage, onPress: () => navigateTo('/health') }
                ]}
              />
            }
            card={
              <HealthCard
                title="Health Page"
                description="Prueft die Erreichbarkeit der Supabase Edge Function vom Workout-Client."
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
    backgroundColor: uiColors.backgroundWorkout
  },
  content: {
    padding: uiSpacing.xl,
    gap: uiSpacing.lg
  }
});