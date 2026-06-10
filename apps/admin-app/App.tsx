import { ApolloClient, ApolloProvider, InMemoryCache, gql, useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import {
  AdminWorkoutGrid,
  DashboardTemplate,
  HealthCard,
  HealthTemplate,
  NavigationPills,
  uiColors,
  uiSpacing,
  ThemeProvider,
  uiSemanticTheme
} from '@workout/shared-components';
import type { WorkoutSummary } from '@workout/shared-types';

const adminPreview: WorkoutSummary[] = [
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
];

const GET_ADMIN_WORKOUTS = gql`
  query AdminWorkouts {
    adminWorkouts {
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

function AdminAppContent() {
  const [pathname, setPathnameState] = useState(getCurrentPathname());
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

  const isHealthPage = pathname === '/health';
  const statusLabel = healthStatus.toUpperCase();
  const statusTone = healthStatus === 'healthy' ? 'success' : healthStatus === 'unhealthy' ? 'error' : 'warning';
  const { data: workoutsData } = useQuery<{ adminWorkouts: WorkoutSummary[] }>(GET_ADMIN_WORKOUTS, {
    fetchPolicy: 'cache-first'
  });
  const adminWorkouts = workoutsData?.adminWorkouts?.length ? workoutsData.adminWorkouts : adminPreview;

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
            <AdminWorkoutGrid workouts={adminWorkouts} />
          </DashboardTemplate>
        ) : (
          <HealthTemplate
            title="Health Page"
            subtitle="Prueft die Erreichbarkeit des GraphQL-Servers vom Admin-Client."
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
                description="Prueft die Erreichbarkeit des GraphQL-Servers vom Admin-Client."
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
    <ThemeProvider theme={uiSemanticTheme}>
      <ApolloProvider client={client}>
        <AdminAppContent />
      </ApolloProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: uiSemanticTheme.colors.background
  },
  content: {
    padding: uiSemanticTheme.spacing.xxl,
    gap: uiSemanticTheme.spacing.xl
  }
});