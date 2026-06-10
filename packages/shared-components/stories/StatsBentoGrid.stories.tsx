import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatsBentoGrid } from '../src/organisms/StatsBentoGrid';

const meta: Meta<typeof StatsBentoGrid> = {
  title: 'Organisms/StatsBentoGrid',
  component: StatsBentoGrid,
};

export default meta;
type Story = StoryObj<typeof StatsBentoGrid>;

export const Default: Story = {
  args: {},
};
