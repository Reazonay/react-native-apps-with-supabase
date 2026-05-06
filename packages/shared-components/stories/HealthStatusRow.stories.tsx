import type { Meta } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { HealthStatusRow } from '../src';

const meta: Meta = {
  title: 'Molecules/HealthStatusRow',
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#ffffff' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const Loading = () => (
  <View>
    <HealthStatusRow status="LOADING" tone="warning" />
  </View>
);
