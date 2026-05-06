import type { Meta } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { NavigationPills, RegisterCard, RegisterTemplate } from '../src';

const meta: Meta = {
  title: 'Templates/RegisterTemplate',
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#f4efe6' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const WorkoutRegister = () => (
  <RegisterTemplate
    title="Register"
    subtitle="Erstelle dein Workout-Konto."
    navigation={
      <NavigationPills
        items={[
          { key: 'dashboard', label: 'Dashboard', active: false, onPress: () => undefined },
          { key: 'register', label: 'Register', active: true, onPress: () => undefined },
          { key: 'health', label: 'Health', active: false, onPress: () => undefined }
        ]}
      />
    }
    card={
      <RegisterCard
        title="Konto erstellen"
        description="Registriere dich, um Trainingsplaene zu speichern."
        submitLabel="Registrieren"
        onSubmit={() => undefined}
      />
    }
  />
);
