module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
  globals: {
    API_URL: true,
    APP_ENV: true,
    APP_NAME: true,
    TABLE_SIZE: true,
    REACT_APP_ENV: true,
    page: true,
  },
};
