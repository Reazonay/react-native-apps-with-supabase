import { View, useWindowDimensions } from 'react-native';

import { KineticCard, KineticText } from '../atoms';
import { useTheme } from '../themeContext';

export function StatsBentoGrid() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const cardStyle: { flex: number | undefined; minWidth: any } = {
    flex: isMobile ? undefined : 1,
    minWidth: isMobile ? '100%' : 200,
  };

  const isDark = theme.colors.background === '#141408';

  return (
    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: theme.spacing.md, width: '100%' }}>
      {/* Weekly Progress */}
      <View style={cardStyle}>
        <KineticCard variant="outline" gap={8}>
          <KineticText variant="labelCaps" color="textSecondary" style={{ letterSpacing: 1.5, fontSize: 11 }}>
            Weekly Progress
          </KineticText>
          <View style={{ marginTop: 4 }}>
            <KineticText variant="headingXL" style={{ color: theme.colors.accent, fontWeight: '800' }}>
              85%
            </KineticText>
            {/* Progress Bar Container */}
            <View style={{ width: '100%', height: 6, backgroundColor: isDark ? '#363527' : '#e5e7eb', borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
              <View style={{ width: '85%', height: '100%', backgroundColor: theme.colors.accent, borderRadius: 3 }} />
            </View>
          </View>
        </KineticCard>
      </View>

      {/* Active Streak */}
      <View style={cardStyle}>
        <KineticCard variant="outline" gap={8}>
          <KineticText variant="labelCaps" color="textSecondary" style={{ letterSpacing: 1.5, fontSize: 11 }}>
            Active Streak
          </KineticText>
          <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <KineticText variant="headingXL" style={{ fontWeight: '800', color: theme.colors.textPrimary }}>
              12 Days
            </KineticText>
            <KineticText style={{ fontSize: 24 }}>🔥</KineticText>
          </View>
        </KineticCard>
      </View>

      {/* Next Session */}
      <View style={cardStyle}>
        <KineticCard variant="outline" gap={8}>
          <KineticText variant="labelCaps" color="textSecondary" style={{ letterSpacing: 1.5, fontSize: 11 }}>
            Next Session
          </KineticText>
          <View style={{ marginTop: 4 }}>
            <KineticText variant="title" style={{ color: theme.colors.accent, fontWeight: '700' }}>
              Heavy Push Day
            </KineticText>
            <KineticText variant="body" color="textSecondary" style={{ fontSize: 12, marginTop: 2 }}>
              Tomorrow, 08:00 AM
            </KineticText>
          </View>
        </KineticCard>
      </View>
    </View>
  );
}
