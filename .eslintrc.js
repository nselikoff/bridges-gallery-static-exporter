module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "some-other-config-you-use", "prettier"],

  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};
