import '@umijs/max/typings';

declare global {
  const API_URL: string;
  const APP_ENV: string;
  const APP_NAME: string;
  const TABLE_SIZE: 'small' | 'middle' | 'large';
  const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

  namespace ACCESS {
    type Check = Record<string, boolean>;
  }
}
