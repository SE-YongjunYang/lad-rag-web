<script setup>
const detailVisible = defineModel()
</script>

<template>
  <el-dialog v-model="detailVisible" title="日志详情" width="600px">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Label">{{ log.label }}</el-descriptions-item>
      <el-descriptions-item label="时间">{{ log.timestamp }}</el-descriptions-item>
      <el-descriptions-item label="节点">{{ log.node }}</el-descriptions-item>
      <el-descriptions-item label="级别">{{ log.level }}</el-descriptions-item>
      <el-descriptions-item label="内容">{{ log.content }}</el-descriptions-item>
      <el-descriptions-item label="事件ID">{{ log.eventId }}</el-descriptions-item>
      <el-descriptions-item label="事件模板">{{ log.eventTemplate }}</el-descriptions-item>
      <el-descriptions-item label="主机">{{ log.host }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
