import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { KineticButton } from '../src';

const meta: Meta<typeof KineticButton> = {
  title: 'Atoms/KineticButton',
  component: KineticButton,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#ffffff', gap: 12 }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof KineticButton>;

export const Primary: Story = {
  args: {
    label: 'Health-Check ausfuehren',
    variant: 'primary'
  }
};

export const Ghost: Story = {
  args: {
    label: 'Register',
    variant: 'ghost'
  }
};

export const Pill: Story = {
  args: {
    label: 'Dashboard',
    variant: 'pill'
  }
};
