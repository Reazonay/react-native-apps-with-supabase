import type { Meta } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { HealthCard, HealthTemplate, NavigationPills } from '../src';

const meta: Meta = {
  title: 'Templates/HealthTemplate',
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#f4efe6' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const WorkoutHealth = () => (
  <HealthTemplate
    title="Health Page"
    subtitle="Prueft die Erreichbarkeit der Supabase Edge Function vom Client."
    navigation={
      <NavigationPills
        items={[
          { key: 'dashboard', label: 'Dashboard', active: false, onPress: () => undefined },
          { key: 'register', label: 'Register', active: false, onPress: () => undefined },
          { key: 'health', label: 'Health', active: true, onPress: () => undefined }
        ]}
      />
    }
    card={
      <HealthCard
        title="Health Page"
        description="Prueft die Erreichbarkeit der Supabase Edge Function vom Client."
        endpoint="Nicht konfiguriert"
        statusLabel="LOADING"
        statusTone="warning"
        message="Verbindung wird geprueft..."
        actionLabel="Health-Check ausfuehren"
        onAction={() => undefined}
      />
    }
  />
);