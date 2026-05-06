import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { KineticInput } from '../src';

const meta: Meta<typeof KineticInput> = {
  title: 'Atoms/KineticInput',
  component: KineticInput,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#ffffff' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof KineticInput>;

export const Default: Story = {
  args: {
    placeholder: 'max@example.com'
  }
};

export const Error: Story = {
  args: {
    placeholder: 'max@example.com',
    hasError: true
  }
};
