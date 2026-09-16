// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

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
  antd: {},
  request: {},
  access: {},
  headScripts: [{ src: '/scripts/loading.js', async: true }],
  presets: ['umi-presets-pro'],
  mfsu: {
    strategy: 'normal',
  },
  esbuildMinifyIIFE: true,
  requestRecord: {},
});
