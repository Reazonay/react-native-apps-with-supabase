import type { Meta } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { HealthCard } from '../src';

const meta: Meta = {
  title: 'Organisms/HealthCard',
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#f4efe6' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const Loading = () => (
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
);