module.exports = {
  apps: [
    {
      name: 'basedbook-backend',
      script: './dist/src/main.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
