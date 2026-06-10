import { ImageBackground, StyleSheet, View } from 'react-native';

import { KineticText } from '../atoms';
import { useTheme } from '../themeContext';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <ImageBackground
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Wv2K4xio2f-I6uirIkDSI7pyxYPzxhoMqPRnlT9vVuApResTMDmDWP7iKiI28Zbl-YHypnFI5X6x3N8oaI8BVZjtBC9Zb5Y0DKT2khQqVTbEugp47XL73BXEi-j6qBPtNPccaBRtAluZkFBUm_we2WGzOhYGae2_D7mS2obZLZ3Mpl9MJ3blLQNh-a3cfMRcwLy6TQPLgb74yiTmewJLwc7vPIe1m2EOtzqJksgT37joRj43LN93bw4hWtHJR_YGjTHwLHwR2jU',
        }}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        {/* Dark overlay for readability */}
        <View style={styles.overlay} />

        <View style={styles.textContainer}>
          <KineticText variant="headingXL" style={{ color: theme.colors.accent, textTransform: 'uppercase', letterSpacing: -0.5 }}>
            {title}
          </KineticText>
          <KineticText variant="subheading" style={{ color: '#ffffff', fontWeight: '500' }}>
            {subtitle}
          </KineticText>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 20, 8, 0.45)', // dark transparent mask
  },
  textContainer: {
    padding: 24,
    gap: 4,
    zIndex: 10,
  },
});
