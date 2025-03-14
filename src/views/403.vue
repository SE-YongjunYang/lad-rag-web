<!-- src/views/403.vue -->
<template>
    <div class="container">
      <el-result
        icon="error"
        title="403 无权限"
        sub-title="抱歉，您没有权限访问此页面"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        </template>
      </el-result>
    </div>
  </template>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  </style>