import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { KineticBadge } from '../src';

const meta: Meta<typeof KineticBadge> = {
  title: 'Atoms/KineticBadge',
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

export const Success: Story = {
  args: {
    label: 'Intermediate',
    tone: 'success'
  }
};

export const Neutral: Story = {
  args: {
    label: 'Idle',
    tone: 'neutral'
  }
};

export const Warning: Story = {
  args: {
    label: 'Loading',
    tone: 'warning'
  }
};

export const Error: Story = {
  args: {
    label: 'Unhealthy',
    tone: 'error'
  }
};
