import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { KineticText } from '../src';

const meta: Meta<typeof KineticText> = {
  title: 'Atoms/KineticText',
  component: KineticText,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#ffffff' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof KineticText>;

export const HeadingXL: Story = {
  args: {
    variant: 'headingXL',
    children: 'Workout App'
  }
};

export const Subheading: Story = {
  args: {
    variant: 'subheading',
    color: 'textSecondary',
    children: 'Mobile-Frontend fuer Trainingsplaene.'
  }
};

export const LabelCaps: Story = {
  args: {
    variant: 'labelCaps',
    color: 'textMuted',
    children: 'Status'
  }
};
