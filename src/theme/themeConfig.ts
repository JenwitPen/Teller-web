import type { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#3e71e8',
    colorInfo: '#3e71e8',
    colorWarning: '#E59A42',
    
    colorTextBase: '#1C2862',
    colorBgLayout: '#FFFFFF',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Button: {
      colorPrimary: '#3e71e8',
      algorithm: true,
    },
    Input: {
      activeBorderColor: '#3e71e8',
      hoverBorderColor: '#3e71e8',
    },
  },
};
