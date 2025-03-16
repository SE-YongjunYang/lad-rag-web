<script setup>
import { ref } from 'vue';
import axios from 'axios';
// import { onMounted } from 'vue';
import { getAlarmConfigService, updateAlarmConfigService } from '@/api/alarm';

// 响应式数据
const isEditing = ref(false);
const originalConfig = ref({});
const config = ref({
  triggerType: 1,
  timeUnit: 'HOUR',
  timeInterval: 1,
  level: 'ERROR',
  threshold: 5,
  email: 'admin@example.com',
});
const timeRange = ref({
  DAY: { min: 1, max: 30, step: 1 },
  HOUR: { min: 1, max: 23, step: 1 },
  MINUTE: { min: 5, max: 30, step: 5 },
});

const rules = {
  threshold: [
    { required: true, message: '请输入阈值', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮件地址', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮件地址',
      trigger: 'blur'
    }
  ],
};
// 表单引用
const configRef = ref(null);

// 请求获取config
const getAlarmConfig = async () => {
  const res = await getAlarmConfigService()
  // console.log(res)
  const { triggerType, timeUnit, timeInterval, level, threshold, email } = res.data
  config.value.triggerType = triggerType
  config.value.timeUnit = timeUnit
  config.value.timeInterval = timeInterval
  config.value.level = level
  config.value.threshold = threshold
  config.value.email = email
}
getAlarmConfig()

// 方法
const startEdit = () => {
  isEditing.value = true;
  originalConfig.value = JSON.parse(JSON.stringify(config.value)); // 深拷贝
};

const saveConfig = async () => {
  const valid = await configRef.value.validate()
  if (valid) {
    // 比较 config 和 originalConfig 的值
    const isConfigChanged = JSON.stringify(config.value) !== JSON.stringify(originalConfig.value);
    
    if (!isConfigChanged) {
      isEditing.value = false;
      return;
    }

    await updateAlarmConfigService(config.value)
    isEditing.value = false;
  } else {
    ElMessage.error('请检查表单输入是否正确')
  }
}

const cancelEdit = () => {
  Object.assign(config, originalConfig.value);
  isEditing.value = false;
};
</script>

<template>
    <div>
      <!-- 告警条件设置 -->
      <el-form :model="config" :rules="rules" ref="configRef" label-width="120px" :disabled="!isEditing">
        <el-form-item label="触发类型">
          <el-radio-group v-model="config.triggerType">
            <el-radio :value="1">异常模板数量</el-radio>
            <el-radio :value="2">含异常模板日志数量</el-radio>
            <el-radio :value="3">最低Level等级</el-radio>
          </el-radio-group>
        </el-form-item>
  
        <el-form-item label="时间间隔">
          <el-select v-model="config.timeUnit" style="width:100px" :disabled="!isEditing">
            <el-option label="天" value="DAY"></el-option>
            <el-option label="小时" value="HOUR"></el-option>
            <el-option label="分钟" value="MINUTE"></el-option>
          </el-select>
          <el-input-number
            v-model="config.timeInterval"
            :min="timeRange[config.timeUnit].min"
            :max="timeRange[config.timeUnit].max"
            :step="timeRange[config.timeUnit].step || 1"
          />
        </el-form-item>
  
        <el-form-item label="最低Level等级" v-if="config.triggerType === 3" :disabled="!isEditing">
          <el-select v-model="config.level" style="width:100px">
            <el-option label="WARNING" value="WARNING"></el-option>
            <el-option label="ERROR" value="ERROR"></el-option>
            <el-option label="SEVERE" value="SEVERE"></el-option>
            <el-option label="FATAL" value="FATAL"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="阈值" prop="threshold">
          <el-input-number 
          v-model="config.threshold" 
          :disabled="!isEditing" 
          :min="5"
          style="width: fit-content;"></el-input-number>
        </el-form-item>
  
        <el-form-item label="邮件地址" prop="email">
          <el-input v-model="config.email" :disabled="!isEditing" style="width: fit-content;"></el-input>
        </el-form-item>
      </el-form>
  
      <!-- 操作按钮 -->
      <div style="margin-left: 50px;">
        <el-button v-if="!isEditing" @click="startEdit">修改设置</el-button>
        <div v-else>
          <el-button type="primary" @click="saveConfig">确认</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </div>
      </div>
    </div>
  </template>

  
  <style scoped>
  /* 样式可以根据需要添加 */
  </style>