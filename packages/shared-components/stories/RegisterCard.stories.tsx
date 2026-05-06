import type { Meta } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { RegisterCard } from '../src';

const meta: Meta = {
  title: 'Organisms/RegisterCard',
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#f4efe6' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const Default = () => (
  <RegisterCard
    title="Konto erstellen"
    description="Registriere dich, um Trainingsplaene zu speichern."
    submitLabel="Registrieren"
    onSubmit={() => undefined}
  />
);
