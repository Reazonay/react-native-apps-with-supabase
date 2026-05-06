import type { Meta } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { WorkoutList } from '../src';

const meta: Meta = {
  title: 'Organisms/WorkoutList',
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
  <WorkoutList
    workouts={[
      { id: 'w-001', title: 'Lower Body Strength', durationInMinutes: 45, difficulty: 'Intermediate' },
      { id: 'w-002', title: 'Core Stability Circuit', durationInMinutes: 20, difficulty: 'Beginner' }
    ]}
  />
);