import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider, kineticSemanticTheme } from '../src/themeContext';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      // Create a mock phone frame style
      const phoneStyle = {
        width: '390px',
        height: '844px',
        backgroundColor: '#0a0a05',
        borderRadius: '50px',
        boxShadow: '0 0 0 12px #222, 0 0 0 14px #333, 0 30px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        margin: '20px auto',
      };
      
      const notchStyle = {
        position: 'absolute' as const,
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: '30px',
        backgroundColor: '#000',
        borderRadius: '20px',
        zIndex: 10,
      };

      const screenStyle = {
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'auto',
      };

      return React.createElement(
        'div',
        { style: phoneStyle },
        React.createElement('div', { style: notchStyle }),
        React.createElement(
          'div',
          { style: screenStyle },
          React.createElement(
            ThemeProvider,
            { theme: kineticSemanticTheme },
            React.createElement(Story)
          )
        )
      );
    }
  ]
};

export default preview;