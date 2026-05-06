import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { KineticBadge } from '../src';

const meta: Meta<typeof KineticBadge> = {
  title: 'Atoms/StatusPill',
  component: KineticBadge,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#ffffff' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof KineticBadge>;

export const Loading: Story = {
  args: {
    label: 'LOADING',
    tone: 'warning'
  }
};

export const Healthy: Story = {
  args: {
    label: 'HEALTHY',
    tone: 'success'
  }
};

export const Unhealthy: Story = {
  args: {
    label: 'UNHEALTHY',
    tone: 'error'
  }
};
