module.exports = {
  apps: [
    {
      name: 'mylog-nest',
      script: 'dist/main.js', // 入口路径
      // instances: '1', // 根据需求设置实例数量
      // exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // env: {
      //   NODE_ENV: 'production',
      // },
    },
  ],
};
