import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { KineticCard, KineticText } from '../src';

const meta: Meta<typeof KineticCard> = {
  title: 'Atoms/KineticCard',
  component: KineticCard,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#f4efe6' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof KineticCard>;

export const Default: Story = {
  render: () => (
    <KineticCard>
      <KineticText variant="title">Card Title</KineticText>
      <KineticText variant="body" color="textSecondary">
        Card content sits here.
      </KineticText>
    </KineticCard>
  )
};

export const Outline: Story = {
  render: () => (
    <KineticCard variant="outline">
      <KineticText variant="title">Outline Card</KineticText>
      <KineticText variant="body" color="textSecondary">
        Card content sits here.
      </KineticText>
    </KineticCard>
  )
};
