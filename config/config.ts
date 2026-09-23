// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
import { antdTheme, brand } from './theme';

const { REACT_APP_API, REACT_APP_ENV = 'dev', REACT_APP_NAME } = process.env;

export default defineConfig({
  define: {
    API_URL: REACT_APP_API || 'http://127.0.0.1:3000',
    APP_ENV: REACT_APP_ENV,
    APP_NAME: REACT_APP_NAME || 'false',
    TABLE_SIZE: 'small',
    REACT_APP_ENV,
  },
  hash: true,
  routes,
  theme: {
    'root-entry-name': 'variable',
  },
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],
  fastRefresh: true,
  model: {},
  initialState: {},
  layout: {
    locale: true,
    ...defaultSettings,
  },
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  locale: {
    default: 'vi-VN',
    antd: true,
    baseNavigator: false,
  },
  antd: {
    theme: antdTheme,
  },
  request: {},
  access: {},
  title: 'Nenkin - Hệ thống quản trị',
  favicons: ['/favicon.svg'],
  metas: [
    { name: 'theme-color', content: brand.primary },
    {
      name: 'description',
      content: 'Hệ thống quản trị hồ sơ Nenkin: người lao động, người đại diện và thủ tục hoàn tiền bảo hiểm hưu trí Nhật Bản.',
    },
  ],
  // Font chu cho toan he thong; neu may chu khong ra duoc internet thi tu dong
  // roi ve font he thong khai bao trong `fontFamily` (config/theme.ts).
  links: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    },
  ],
  headScripts: [{ src: '/scripts/loading.js', async: true }],
  presets: ['umi-presets-pro'],
  mfsu: {
    strategy: 'normal',
  },
  esbuildMinifyIIFE: true,
  requestRecord: {},
});
