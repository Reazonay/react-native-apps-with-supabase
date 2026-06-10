import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from '../src/organisms/HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Organisms/HeroSection',
  component: HeroSection,
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  args: {
    title: 'Forge Performance',
    subtitle: 'Dein Elite-Trainingstracker',
  },
};
