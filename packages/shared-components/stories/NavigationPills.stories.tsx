import type { Meta } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';

import { NavigationPills } from '../src';

const meta: Meta = {
  title: 'Molecules/NavigationPills',
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#ffffff' }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const Default = () => {
  const [active, setActive] = useState('Dashboard');
  const items = ['Dashboard', 'Register', 'Health'];

  return (
    <View>
      <NavigationPills
        items={items.map((label) => ({
          key: label,
          label,
          active: active === label,
          onPress: () => setActive(label)
        }))}
      />
    </View>
  );
};
