import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { FormField } from '../src';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#ffffff' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'E-Mail',
    value: '',
    placeholder: 'max@example.com',
    onChangeText: () => undefined
  }
};

export const Error: Story = {
  args: {
    label: 'E-Mail',
    value: 'max',
    placeholder: 'max@example.com',
    helperText: 'Bitte eine gueltige E-Mail eingeben.',
    hasError: true,
    onChangeText: () => undefined
  }
};
