const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  // 🔥 GitHub Pages 必加
  publicPath: process.env.NODE_ENV === 'production'
    ? '/你的-repo-名稱/'
    : '/',
});
