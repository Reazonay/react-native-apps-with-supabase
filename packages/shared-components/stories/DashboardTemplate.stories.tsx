import type { Meta } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { DashboardTemplate, NavigationPills, WorkoutList } from '../src';

const meta: Meta = {
  title: 'Templates/DashboardTemplate',
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#f4efe6' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const WorkoutDashboard = () => (
  <DashboardTemplate
    title="Workout App"
    subtitle="Mobile-Frontend fuer Trainingsplaene, Sessions und Fortschritt."
    navigation={
      <NavigationPills
        items={[
          { key: 'dashboard', label: 'Dashboard', active: true, onPress: () => undefined },
          { key: 'register', label: 'Register', active: false, onPress: () => undefined },
          { key: 'health', label: 'Health', active: false, onPress: () => undefined }
        ]}
      />
    }
  >
    <WorkoutList
      workouts={[
        { id: 'w-001', title: 'Lower Body Strength', durationInMinutes: 45, difficulty: 'Intermediate' },
        { id: 'w-002', title: 'Core Stability Circuit', durationInMinutes: 20, difficulty: 'Beginner' }
      ]}
    />
  </DashboardTemplate>
);