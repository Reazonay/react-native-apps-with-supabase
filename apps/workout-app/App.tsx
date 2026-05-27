import { ApolloClient, ApolloProvider, InMemoryCache, gql, useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

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
import type { WorkoutSummary } from '@workout/shared-types';


const upcomingWorkouts: WorkoutSummary[] = [
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
];

const GET_UPCOMING_WORKOUTS = gql`
  query UpcomingWorkouts {
    upcomingWorkouts {
      id
      title
      durationInMinutes
      difficulty
    }
  }
`;

type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

function getCurrentPathname(): string {
  const maybeWindow = globalThis as { window?: { location?: { pathname?: string } } };
  return maybeWindow.window?.location?.pathname ?? '/';
}

const graphqlUrl = process.env.EXPO_PUBLIC_GRAPHQL_URL;

function getGraphqlUrl() {
  if (graphqlUrl) {
    return graphqlUrl;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/graphql';
  }

  return 'http://localhost:4000/graphql';
}

function WorkoutAppContent() {
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

  const healthEndpoint = useMemo(() => getGraphqlUrl(), []);

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
    try {
      setHealthStatus('loading');
      setHealthMessage('GraphQL wird geprueft...');

      const response = await fetch(healthEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: 'query ServiceStatus { serviceStatus { ok message } }'
        })
      });

      const payload = (await response.json()) as {
        data?: { serviceStatus?: { ok?: boolean; message?: string } };
        errors?: Array<{ message?: string }>;
      };

      if (!response.ok || !payload.data?.serviceStatus?.ok) {
        setHealthStatus('unhealthy');
        setHealthMessage(payload.errors?.[0]?.message ?? `Health-Check fehlgeschlagen (HTTP ${response.status}).`);
        return;
      }

      setHealthStatus('healthy');
      setHealthMessage(payload.data.serviceStatus.message ?? 'GraphQL ist erreichbar.');
    } catch {
      setHealthStatus('unhealthy');
      setHealthMessage('GraphQL konnte nicht erreicht werden.');
    }
  }

  const isDashboardPage = pathname === '/dashboard';
  const isHealthPage = pathname === '/health';
  const isRegisterPage = pathname === '/register';
  const isRegistrationSuccessPage = pathname === '/register/success';

  const statusLabel = healthStatus.toUpperCase();
  const statusTone = healthStatus === 'healthy' ? 'success' : healthStatus === 'unhealthy' ? 'error' : 'warning';
  const { data: workoutsData } = useQuery<{ upcomingWorkouts: WorkoutSummary[] }>(GET_UPCOMING_WORKOUTS, {
    fetchPolicy: 'cache-first'
  });
  const workouts = workoutsData?.upcomingWorkouts?.length ? workoutsData.upcomingWorkouts : upcomingWorkouts;

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
            <WorkoutList workouts={workouts} />
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
            subtitle="Prueft die Erreichbarkeit des GraphQL-Servers vom Workout-Client."
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
                description="Prueft die Erreichbarkeit des GraphQL-Servers vom Workout-Client."
                endpoint={healthEndpoint}
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

export default function App() {
  const client = useMemo(() => {
    return new ApolloClient({
      uri: getGraphqlUrl(),
      cache: new InMemoryCache()
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      <WorkoutAppContent />
    </ApolloProvider>
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