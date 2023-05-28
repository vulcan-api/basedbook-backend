module.exports = {
  apps: [
    {
      name: 'basedbook-backend',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
