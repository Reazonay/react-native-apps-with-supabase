import React from 'react';

import { WorkoutCard } from '../src';

const meta = {
  title: 'Molecules/WorkoutCard',
  component: WorkoutCard,
  args: {
    title: 'Full Body Session',
    durationInMinutes: 40,
    difficulty: 'Intermediate'
  },
  parameters: {
    layout: 'centered'
  }
};

export default meta;

export const Default = {};

export const Beginner = {
  args: {
    title: 'Mobility Warmup',
    durationInMinutes: 15,
    difficulty: 'Beginner'
  }
};

export const Advanced = {
  args: {
    title: 'Athlete Conditioning',
    durationInMinutes: 60,
    difficulty: 'Advanced'
  }
};