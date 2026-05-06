import type { Meta } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { NavigationPills, RegisterSuccessTemplate } from '../src';

const meta: Meta = {
  title: 'Templates/RegisterSuccessTemplate',
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#f4efe6' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const WorkoutRegisterSuccess = () => (
  <RegisterSuccessTemplate
    title="Registrierung abgeschlossen"
    subtitle="Dein Konto wurde angelegt. Du kannst jetzt loslegen."
    navigation={
      <NavigationPills
        items={[
          { key: 'dashboard', label: 'Dashboard', active: false, onPress: () => undefined },
          { key: 'register', label: 'Register', active: true, onPress: () => undefined },
          { key: 'health', label: 'Health', active: false, onPress: () => undefined }
        ]}
      />
    }
    actionLabel="Zum Dashboard"
    onAction={() => undefined}
  />
);
