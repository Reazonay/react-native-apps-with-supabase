import type { Meta } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { AdminWorkoutGrid } from '../src';

const meta: Meta = {
  title: 'Organisms/AdminWorkoutGrid',
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#fffaf2' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const Default = () => (
  <AdminWorkoutGrid
    workouts={[
      { id: 'plan-001', title: 'Starter Strength Plan', durationInMinutes: 30, difficulty: 'Beginner' },
      { id: 'plan-002', title: 'Performance Split', durationInMinutes: 55, difficulty: 'Advanced' }
    ]}
  />
);