import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, Image, Pressable } from 'react-native';

import {
  DashboardTemplate,
  HealthCard,
  HealthTemplate,
  NavigationPills,
  RegisterCard,
  RegisterSuccessTemplate,
  RegisterTemplate,
  ThemeProvider,
  kineticSemanticTheme,
  HeroSection,
  StatsBentoGrid,
  WorkoutList,
  KineticText,
  KineticButton,
  KineticCard,
  KineticInput,
  KineticBadge,
} from '@workout/shared-components';

import { supabase } from './src/lib/supabase';
import { useAuth } from './src/hooks/useAuth';
import { useWorkouts } from './src/hooks/useWorkouts';
import type { WorkoutSummary } from '@workout/shared-types';

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  emoji: string;
}

// ---------------------------------------------------------------------------
// Pfad-Routing (Web + Native)
// ---------------------------------------------------------------------------

function getCurrentPathname(): string {
  const maybeWindow = globalThis as { window?: { location?: { pathname?: string } } };
  return maybeWindow.window?.location?.pathname ?? '/dashboard';
}

// ---------------------------------------------------------------------------
// Hilfsfunktion: Übungen für Workouts zuordnen
// ---------------------------------------------------------------------------

function getExercisesForWorkout(title: string): Exercise[] {
  const lower = title.toLowerCase();
  if (lower.includes('lower') || lower.includes('legs') || lower.includes('quads') || lower.includes('strength')) {
    return [
      { name: 'Kniebeugen (Squats)', sets: 4, reps: '8-10 Wdh.', rest: '90 Sek.', emoji: '🏋️' },
      { name: 'Rumänisches Kreuzheben', sets: 4, reps: '10 Wdh.', rest: '90 Sek.', emoji: '🦵' },
      { name: 'Ausfallschritte (Lunges)', sets: 3, reps: '12 Wdh. je Bein', rest: '60 Sek.', emoji: '🏃' },
      { name: 'Wadenheben stehend', sets: 3, reps: '15 Wdh.', rest: '45 Sek.', emoji: '👟' },
    ];
  }
  if (lower.includes('core') || lower.includes('stability') || lower.includes('circuit')) {
    return [
      { name: 'Unterarmstütz (Plank)', sets: 3, reps: '60 Sek.', rest: '45 Sek.', emoji: '⏱️' },
      { name: 'Russian Twists', sets: 3, reps: '20 Wdh.', rest: '30 Sek.', emoji: '🔄' },
      { name: 'Beinheben hängend', sets: 3, reps: '12-15 Wdh.', rest: '45 Sek.', emoji: '🤸' },
      { name: 'Bicycle Crunches', sets: 3, reps: '20 Wdh.', rest: '30 Sek.', emoji: '🚴' },
    ];
  }
  if (lower.includes('starter') || lower.includes('beginner') || lower.includes('session')) {
    return [
      { name: 'Körpergewicht Kniebeugen', sets: 3, reps: '12 Wdh.', rest: '60 Sek.', emoji: '🦵' },
      { name: 'Liegestütze (Push-ups)', sets: 3, reps: '10 Wdh.', rest: '60 Sek.', emoji: '💪' },
      { name: 'Glute Bridges', sets: 3, reps: '12 Wdh.', rest: '45 Sek.', emoji: '🍑' },
      { name: 'Plank halten', sets: 3, reps: '30 Sek.', rest: '45 Sek.', emoji: '⏱️' },
    ];
  }
  if (lower.includes('conditioning') || lower.includes('hiit') || lower.includes('block')) {
    return [
      { name: 'Burpees', sets: 4, reps: '10 Wdh.', rest: '45 Sek.', emoji: '💥' },
      { name: 'Kettlebell Swings', sets: 4, reps: '15 Wdh.', rest: '45 Sek.', emoji: '🏋️' },
      { name: 'Mountain Climbers', sets: 4, reps: '30 Sek.', rest: '30 Sek.', emoji: '⛰️' },
      { name: 'Jumping Jacks', sets: 4, reps: '45 Sek.', rest: '30 Sek.', emoji: '⚡' },
    ];
  }
  return [
    { name: 'Liegestütze (Push-ups)', sets: 3, reps: '12 Wdh.', rest: '60 Sek.', emoji: '💪' },
    { name: 'Kniebeugen (Squats)', sets: 3, reps: '15 Wdh.', rest: '60 Sek.', emoji: '🏋️' },
    { name: 'Klimmzüge (Pull-ups)', sets: 3, reps: '8 Wdh.', rest: '60 Sek.', emoji: '🧗' },
    { name: 'Plank halten', sets: 3, reps: '45 Sek.', rest: '45 Sek.', emoji: '⏱️' },
  ];
}

// ---------------------------------------------------------------------------
// Haupt-App-Komponente
// ---------------------------------------------------------------------------

export default function App() {
  const [pathname, setPathnameState] = useState(getCurrentPathname());

  // ---- Splash Screen ----
  const [showSplash, setShowSplash] = useState(true);

  // ---- Login & Admin Bypass ----
  const [isDemoBypass, setIsDemoBypass] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- Selected Workout ----
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSummary | null>(null);

  // ---- Live Workout Simulation ----
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [activeWorkoutTime, setActiveWorkoutTime] = useState(0);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [completedTime, setCompletedTime] = useState('');

  // Timer für Splash Screen (1.5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Timer für aktives Workout
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setActiveWorkoutTime((prev) => prev + 1);
      }, 1000);
    } else {
      setActiveWorkoutTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive]);

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ---- Navigation ----
  const navigateTo = (path: string) => {
    setPathnameState(path);
    const maybeWindow = globalThis as {
      window?: {
        history?: { pushState: (d: unknown, t: string, u?: string | URL | null) => void };
        dispatchEvent?: (e: Event) => boolean;
      };
    };
    if (maybeWindow.window?.history?.pushState) {
      maybeWindow.window.history.pushState({}, '', path);
      maybeWindow.window.dispatchEvent?.(new Event('popstate'));
    }
  };

  useEffect(() => {
    const maybeWindow = globalThis as {
      window?: {
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
    };
    const sync = () => setPathnameState(getCurrentPathname());
    maybeWindow.window?.addEventListener?.('popstate', sync);
    return () => maybeWindow.window?.removeEventListener?.('popstate', sync);
  }, []);

  const isDashboard = pathname === '/dashboard' || pathname === '/';
  const isHealth    = pathname === '/health';
  const isRegister  = pathname === '/register';
  const isSuccess   = pathname === '/register/success';

  // ---- Workouts aus Supabase ----
  const { workouts, loading: workoutsLoading } = useWorkouts();

  // ---- Auth ----
  const auth = useAuth();
  const isLoggedIn = !!auth.userEmail || isDemoBypass;

  // ---- Health Check (Edge Function) ----
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('idle');
  const [healthMessage, setHealthMessage] = useState('Noch kein Check ausgeführt.');

  const edgeFunctionUrl = useMemo(() => {
    const base = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
    return `${base}/functions/v1/client-connection-check`;
  }, []);

  async function runHealthCheck() {
    setHealthStatus('loading');
    setHealthMessage('Supabase Edge Function wird geprüft...');

    try {
      const { data, error } = await supabase.functions.invoke('client-connection-check');

      if (error) {
        setHealthStatus('unhealthy');
        setHealthMessage(`Fehler: ${error.message}`);
        return;
      }

      if (data?.ok) {
        setHealthStatus('healthy');
        setHealthMessage(data.message ?? 'Edge Function ist erreichbar.');
      } else {
        setHealthStatus('unhealthy');
        setHealthMessage('Edge Function hat nicht korrekt geantwortet.');
      }
    } catch (err) {
      setHealthStatus('unhealthy');
      setHealthMessage('Verbindung zur Edge Function fehlgeschlagen.');
    }
  }

  const statusLabel = healthStatus.toUpperCase();
  const statusTone  =
    healthStatus === 'healthy'   ? 'success' :
    healthStatus === 'unhealthy' ? 'error'   : 'warning';

  // ---- Login-Handler ----
  const handleLogin = async () => {
    setLoginError(null);
    if (!loginEmail || !loginPassword) {
      setLoginError('Bitte fülle alle E-Mail und Passwort Felder aus.');
      return;
    }

    // Admin Bypass check
    if (loginEmail.trim().toLowerCase() === 'admin' && loginPassword.trim() === 'admin') {
      setIsDemoBypass(true);
      navigateTo('/dashboard');
      return;
    }

    setIsSubmitting(true);
    const success = await auth.signIn(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (success) {
      navigateTo('/dashboard');
    } else {
      setLoginError(auth.message || 'Anmeldung fehlgeschlagen. Überprüfe deine Daten.');
    }
  };

  // ---- Register-Flow mit Supabase Auth ----
  async function handleRegister(payload: { fullName: string; email: string; password: string }) {
    const success = await auth.signUp(payload.email, payload.password);
    if (success) navigateTo('/register/success');
  }

  // ---- Navigation Pills ----
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', active: isDashboard,              onPress: () => navigateTo('/dashboard') },
    { key: 'register',  label: 'Register',  active: isRegister || isSuccess,  onPress: () => navigateTo('/register') },
    { key: 'health',    label: 'Health',    active: isHealth,                 onPress: () => navigateTo('/health') },
  ];
  const nav = <NavigationPills items={navItems} />;

  // ---- Render Splash Screen ----
  if (showSplash) {
    return (
      <ThemeProvider theme={kineticSemanticTheme}>
        <SafeAreaView style={styles.splashContainer}>
          <View style={styles.splashContent}>
            <Text style={styles.splashLogo}>FORGE</Text>
            <Text style={styles.splashTagline}>PREPARE FOR GREATNESS</Text>
            <ActivityIndicator size="large" color="#ede900" style={styles.splashLoader} />
            <Text style={styles.splashStatus}>CONNECTING TO CORE BACKEND...</Text>
          </View>
          <View style={styles.splashFooter}>
            <Text style={styles.splashFooterText}>POWERED BY SUPABASE</Text>
          </View>
        </SafeAreaView>
      </ThemeProvider>
    );
  }

  // ---- Render Login Screen (wenn nicht eingeloggt) ----
  if (!isLoggedIn && !isRegister && !isSuccess) {
    return (
      <ThemeProvider theme={kineticSemanticTheme}>
        <SafeAreaView style={styles.container}>
          {/* Custom Header */}
          <View style={styles.forgeHeader}>
            <Text style={styles.forgeLogo}>FORGE</Text>
          </View>

          <ScrollView contentContainerStyle={styles.loginContent}>
            <KineticCard variant="outline" style={styles.loginCard}>
              <View style={{ alignItems: 'center', marginBottom: 8 }}>
                <Text style={styles.loginTitle}>WELCOME TO THE FORGE</Text>
                <Text style={styles.loginSubtitle}>Melde dich an, um mit deinem Training zu starten.</Text>
              </View>

              {loginError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>⚠️ {loginError}</Text>
                </View>
              )}

              <View style={{ gap: 16 }}>
                <View style={{ gap: 8 }}>
                  <Text style={styles.inputLabel}>E-MAIL</Text>
                  <KineticInput
                    placeholder="E-Mail eingeben (oder 'admin')"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <Text style={styles.inputLabel}>PASSWORT</Text>
                  <KineticInput
                    placeholder="Passwort eingeben (oder 'admin')"
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <KineticButton
                  label={isSubmitting ? 'Wird angemeldet...' : 'ANMELDEN'}
                  variant="primary"
                  onPress={handleLogin}
                  disabled={isSubmitting}
                  style={styles.loginButton}
                />

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>ODER</Text>
                  <View style={styles.dividerLine} />
                </View>

                <KineticButton
                  label="DEMO-VORSCHAU (ADMIN)"
                  variant="ghost"
                  onPress={() => {
                    setIsDemoBypass(true);
                    navigateTo('/dashboard');
                  }}
                  style={styles.bypassButton}
                />

                <Pressable onPress={() => navigateTo('/register')} style={styles.registerLink}>
                  <Text style={styles.registerLinkText}>Noch kein Konto? Hier registrieren</Text>
                </Pressable>
              </View>
            </KineticCard>
          </ScrollView>
        </SafeAreaView>
      </ThemeProvider>
    );
  }

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
  };

  const handleFinishWorkout = () => {
    setCompletedTime(formatElapsedTime(activeWorkoutTime));
    setIsWorkoutActive(false);
    setShowCompletionPopup(true);
  };

  const selectedExercises = selectedWorkout ? getExercisesForWorkout(selectedWorkout.title) : [];

  // ---- Haupt-Layout ----
  return (
    <ThemeProvider theme={kineticSemanticTheme}>
      <SafeAreaView style={styles.container}>
        {/* Custom FORGE Header */}
        <View style={styles.forgeHeader}>
          <Text style={styles.forgeLogo}>FORGE</Text>
          <View style={styles.headerRight}>
            <Pressable
              onPress={async () => {
                setIsDemoBypass(false);
                setSelectedWorkout(null);
                setIsWorkoutActive(false);
                await auth.signOut();
                navigateTo('/dashboard');
              }}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>LOGOUT 🔓</Text>
            </Pressable>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGmrclPLtGpJ2AcueZbrhjyX9CPEg7CoHY3MN8YR2ynPdYDAhfqqToCZ1kIkacfU-3p6tAF66Ufp2P6DvMdyjOTOQNi4SDNnVxhulbkHqu5GaPXMRuOLVL0zL2TyYl4WS8nBwqTnUeyrMaQs4nEAx3nF5-_ADuqL_LB4xtE3sBafy9MwvDd18N1VtYj1RBKgay1Z3e_uL6PS5fZQEjz0MAG9dBVnP0DiEzl1tqWUPKxw04slAYrEZOuibXcsQeYArwXs2i_30VR50',
              }}
              style={styles.profileImage}
            />
          </View>
        </View>

        {/* Mobile Navigation Row (only if not active in workout) */}
        {!isWorkoutActive && (
          <View style={styles.mobileNavRow}>
            {nav}
          </View>
        )}

        {/* Completion Modal */}
        {showCompletionPopup && (
          <View style={styles.completionOverlay}>
            <KineticCard variant="outline" style={styles.completionCard}>
              <Text style={styles.completionTitle}>🏆 WORKOUT BEENDET!</Text>
              <Text style={styles.completionSubtitle}>Klasse Leistung. Jedes Training bringt dich deinem Ziel näher.</Text>
              
              <View style={styles.completionStats}>
                <Text style={styles.completionStatLabel}>Dauer:</Text>
                <Text style={styles.completionStatValue}>{completedTime}</Text>
              </View>

              <KineticButton
                label="ZURÜCK ZUM DASHBOARD"
                variant="primary"
                onPress={() => {
                  setShowCompletionPopup(false);
                  setSelectedWorkout(null);
                }}
              />
            </KineticCard>
          </View>
        )}

        {/* Active Workout Screen */}
        {isWorkoutActive && selectedWorkout && (
          <View style={styles.activeWorkoutContainer}>
            <View style={styles.activeWorkoutHeader}>
              <Text style={styles.activeWorkoutStatus}>WORKOUT AKTIV ⚡</Text>
              <Text style={styles.activeWorkoutTitle}>{selectedWorkout.title}</Text>
              <Text style={styles.activeWorkoutTimer}>{formatElapsedTime(activeWorkoutTime)}</Text>
            </View>

            <ScrollView style={{ flex: 1, padding: 20 }}>
              <Text style={styles.sectionHeader}>ÜBUNGSLISTE</Text>
              {selectedExercises.map((ex, index) => (
                <View key={index} style={styles.activeExerciseRow}>
                  <Text style={styles.activeExerciseEmoji}>{ex.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activeExerciseName}>{ex.name}</Text>
                    <Text style={styles.activeExerciseDetail}>
                      {ex.sets} Sätze × {ex.reps} (Pause: {ex.rest})
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.activeWorkoutFooter}>
              <Pressable
                onPress={handleFinishWorkout}
                style={styles.finishWorkoutButton}
              >
                <Text style={styles.finishWorkoutButtonText}>TRAINING BEENDEN</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Selected Workout Detail Modal (if not active in workout) */}
        {!isWorkoutActive && selectedWorkout && (
          <View style={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <Pressable onPress={() => setSelectedWorkout(null)} style={styles.backButton}>
                <Text style={styles.backButtonText}>← ZURÜCK</Text>
              </Pressable>
              <Text style={styles.detailTitle}>{selectedWorkout.title}</Text>
              <View style={styles.detailMetaRow}>
                <KineticBadge label={selectedWorkout.difficulty} tone="success" />
                <Text style={styles.detailMetaText}>⏱️ {selectedWorkout.durationInMinutes} MIN.</Text>
              </View>
            </View>

            <ScrollView style={styles.detailContent}>
              <Text style={styles.sectionHeader}>ÜBUNGSPLAN ({selectedExercises.length} Übungen)</Text>
              
              <View style={{ gap: 12, marginBottom: 20 }}>
                {selectedExercises.map((ex, index) => (
                  <View key={index} style={styles.exerciseCard}>
                    <View style={styles.exerciseEmojiBg}>
                      <Text style={{ fontSize: 22 }}>{ex.emoji}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={styles.exerciseName}>{ex.name}</Text>
                      <View style={{ flexDirection: 'row', gap: 12 }}>
                        <Text style={styles.exerciseDetailText}>🔄 {ex.sets} Sätze</Text>
                        <Text style={styles.exerciseDetailText}>🎯 {ex.reps}</Text>
                        <Text style={styles.exerciseDetailText}>⏱️ {ex.rest} Pause</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.detailFooter}>
              <KineticButton
                label="TRAINING STARTEN"
                variant="primary"
                onPress={handleStartWorkout}
                style={styles.startWorkoutButton}
              />
            </View>
          </View>
        )}

        {/* Standard App-Views (Dashboard / Register / Health) */}
        {!isWorkoutActive && !selectedWorkout && (
          <ScrollView contentContainerStyle={styles.content}>

            {isDashboard && (
              <DashboardTemplate
                title=""
                subtitle=""
                navigation={null}
              >
                {workoutsLoading ? (
                  <View style={styles.loader}>
                    <ActivityIndicator size="large" color={kineticSemanticTheme.colors.accent} />
                    <Text style={styles.loaderText}>Workouts werden geladen...</Text>
                  </View>
                ) : (
                  <View style={{ gap: 20 }}>
                    <HeroSection title="Workout App" subtitle="Deine Trainingseinheiten aus Supabase" />
                    <StatsBentoGrid />
                    <View style={{ gap: 16 }}>
                      <Text style={styles.recentWorkoutsHeader}>
                        Recent Workouts
                      </Text>
                      <WorkoutList
                        workouts={workouts}
                        onWorkoutPress={(w) => setSelectedWorkout(w)}
                      />
                    </View>
                  </View>
                )}
              </DashboardTemplate>
            )}

            {isRegister && (
              <RegisterTemplate
                title="Registrieren"
                subtitle="Erstelle dein Workout-Konto mit Supabase Auth."
                navigation={null}
                card={
                  <View style={{ gap: 16 }}>
                    <RegisterCard
                      title="Konto erstellen"
                      description="Registriere dich, um Trainings zu speichern und zu verfolgen."
                      submitLabel={auth.status === 'loading' ? 'Wird registriert...' : 'Registrieren'}
                      onSubmit={handleRegister}
                    />
                    <Pressable onPress={() => navigateTo('/dashboard')} style={{ alignItems: 'center', marginTop: 8 }}>
                      <Text style={{ color: '#ede900', fontWeight: '600', textDecorationLine: 'underline' }}>
                        Bereits ein Konto? Hier anmelden
                      </Text>
                    </Pressable>
                  </View>
                }
              />
            )}

            {isSuccess && (
              <RegisterSuccessTemplate
                title="Registrierung abgeschlossen"
                subtitle={`Willkommen${auth.userEmail ? `, ${auth.userEmail}` : ''}! Dein Konto wurde angelegt.`}
                navigation={null}
                actionLabel="Zum Dashboard"
                onAction={() => navigateTo('/dashboard')}
              />
            )}

            {isHealth && (
              <HealthTemplate
                title="Health Check"
                subtitle="Prüft die Verbindung zur Supabase Edge Function."
                navigation={null}
                card={
                  <HealthCard
                    title="Supabase Edge Function"
                    description="client-connection-check – prüft ob der Supabase-Backend-Aufruf funktioniert."
                    endpoint={edgeFunctionUrl}
                    statusLabel={statusLabel}
                    statusTone={statusTone}
                    message={healthMessage}
                    actionLabel="Health-Check ausführen"
                    onAction={runHealthCheck}
                  />
                }
              />
            )}

          </ScrollView>
        )}
      </SafeAreaView>
    </ThemeProvider>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: kineticSemanticTheme.colors.background,
  },
  content: {
    padding: kineticSemanticTheme.spacing.xl,
    gap: kineticSemanticTheme.spacing.lg,
    paddingTop: 10,
  },
  loader: {
    alignItems: 'center',
    paddingVertical: kineticSemanticTheme.spacing.xl,
    gap: 16,
  },
  loaderText: {
    color: kineticSemanticTheme.colors.textSecondary,
    fontSize: 14,
  },
  forgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#0a0a05',
    borderBottomWidth: 1,
    borderBottomColor: '#222214',
  },
  forgeLogo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
    textShadowColor: 'rgba(237, 233, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#494832',
  },
  mobileNavRow: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: '#0a0a05',
    borderTopWidth: 1,
    borderTopColor: '#222214',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#494832',
    backgroundColor: 'transparent',
  },
  logoutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ede900',
    letterSpacing: 0.5,
  },

  // Splash Screen
  splashContainer: {
    flex: 1,
    backgroundColor: '#0a0a05',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  splashContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  splashLogo: {
    fontSize: 64,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -2,
    textShadowColor: 'rgba(237, 233, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  splashTagline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ede900',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  splashLoader: {
    marginTop: 30,
  },
  splashStatus: {
    fontSize: 10,
    fontWeight: '600',
    color: '#cbc8ab',
    letterSpacing: 1,
    marginTop: 10,
  },
  splashFooter: {
    alignItems: 'center',
  },
  splashFooterText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#494832',
    letterSpacing: 2,
  },

  // Login Screen
  loginContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  loginCard: {
    padding: 24,
    backgroundColor: '#11110a',
    borderColor: '#333322',
    borderWidth: 1,
    borderRadius: 24,
    gap: 20,
    shadowColor: '#ede900',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  loginSubtitle: {
    fontSize: 13,
    color: '#cbc8ab',
    textAlign: 'center',
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#cbc8ab',
    letterSpacing: 1,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#494832',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#494832',
  },
  bypassButton: {
    height: 48,
    borderRadius: 12,
    borderColor: '#ede900',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  registerLinkText: {
    color: '#ede900',
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontSize: 13,
  },

  // Detail Modal Screen
  detailContainer: {
    flex: 1,
    backgroundColor: '#141408',
  },
  detailHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#202013',
    borderBottomWidth: 1,
    borderBottomColor: '#494832',
    gap: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: '#363527',
  },
  backButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  detailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailMetaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbc8ab',
  },
  detailContent: {
    flex: 1,
    padding: 24,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#cbc8ab',
    letterSpacing: 1.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#202013',
    borderColor: '#494832',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  exerciseEmojiBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#363527',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  exerciseDetailText: {
    fontSize: 12,
    color: '#cbc8ab',
    fontWeight: '500',
  },
  detailFooter: {
    padding: 24,
    backgroundColor: '#141408',
    borderTopWidth: 1,
    borderTopColor: '#494832',
  },
  startWorkoutButton: {
    height: 52,
    borderRadius: 16,
  },

  // Active Workout Screen
  activeWorkoutContainer: {
    flex: 1,
    backgroundColor: '#141408',
  },
  activeWorkoutHeader: {
    backgroundColor: '#202013',
    paddingTop: 30,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#494832',
    gap: 8,
  },
  activeWorkoutStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ede900',
    letterSpacing: 2,
  },
  activeWorkoutTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  activeWorkoutTimer: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginTop: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  activeExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#202013',
    borderColor: '#ede900',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  activeExerciseEmoji: {
    fontSize: 24,
  },
  activeExerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  activeExerciseDetail: {
    fontSize: 13,
    color: '#cbc8ab',
    fontWeight: '500',
    marginTop: 2,
  },
  activeWorkoutFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#494832',
    backgroundColor: '#141408',
  },
  finishWorkoutButton: {
    backgroundColor: '#ef4444',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishWorkoutButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Completion Overlay
  completionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 20, 8, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 999,
  },
  completionCard: {
    padding: 30,
    backgroundColor: '#202013',
    borderColor: '#ede900',
    borderWidth: 1.5,
    borderRadius: 24,
    gap: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ede900',
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 14,
    color: '#cbc8ab',
    textAlign: 'center',
    lineHeight: 20,
  },
  completionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#363527',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  completionStatLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbc8ab',
  },
  completionStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },

  recentWorkoutsHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
  },
});