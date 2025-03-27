<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { getAlarmConfigService,
  getAlarmConfigsService,
  addAlarmConfigService,
  updateAlarmConfigService,
  deleteAlarmConfigService,
  switchStatusService } from '@/api/alarm';
import { getLogNamesService } from '@/api/log';

/* // 响应式数据
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
  config.value = { ...originalConfig.value };
  isEditing.value = false;
}; */

// 响应式数据
const alarmConfigs = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const currentConfig = ref({});
const isEditing = ref(false);
const logNames = ref([]);


const defaultConfig = {
  triggerType: 1,
  timeUnit: 'HOUR',
  timeInterval: 5,
  level: 'ERROR',
  threshold: 5,
  email: 'admin@example.com',
  enabled: 0,
  logName: ''
};

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
const configFormRef = ref(null);

// 获取告警配置列表
const fetchAlarmConfigs = async () => {
  try {
    const res = await getAlarmConfigsService();
    alarmConfigs.value = res.data;
  } catch (error) {
    ElMessage.error('获取告警配置失败');
  }
};

onMounted(() => {
  fetchAlarmConfigs();
});

// 打开新增对话框
const handleAdd = async () => {
  const { data } = await getLogNamesService();
  logNames.value = data;

  dialogTitle.value = '新增告警设置';
  currentConfig.value = { ...defaultConfig };
  isEditing.value = false;
  dialogVisible.value = true;
};

// 打开编辑对话框
const handleEdit = async (row) => {
  const { data } = await getLogNamesService();
  logNames.value = data;
  
  dialogTitle.value = '编辑告警设置';
  currentConfig.value = JSON.parse(JSON.stringify(row));
  isEditing.value = true;
  dialogVisible.value = true;
};

// 保存配置
const handleSubmit = async () => {
  try {
    const valid = await configFormRef.value.validate();
    if (!valid) return;
    
    if (isEditing.value) {
      // 比较 config 和 originalConfig 的值
      const isConfigChanged = JSON.stringify(currentConfig.value) !== JSON.stringify(originalConfig.value);
      
      // 如果没有变化，则不需要更新
      if (!isConfigChanged) {
        dialogVisible.value = false;
        return;
      }
      
      await updateAlarmConfigService(currentConfig.value);
      ElMessage.success('更新成功');
    } else {
      await addAlarmConfigService(currentConfig.value);
      ElMessage.success('添加成功');
    }
    
    dialogVisible.value = false;
    fetchAlarmConfigs();
  } catch (error) {
    ElMessage.error(isEditing.value ? '更新失败' : '添加失败');
  }
};

// 删除配置
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除此告警设置吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await deleteAlarmConfigService(id);
    ElMessage.success('删除成功');
    fetchAlarmConfigs();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 切换启用状态
const toggleStatus = async (config) => {
  try {
    await switchStatusService(config.id, config.enabled);
    ElMessage.success(config.enabled === 1 ? '已启用' : '已停用');
  } catch (error) {
    ElMessage.error('操作失败');
    config.enabled = config.enabled === 1 ? 0 : 1;
  }
};
</script>

<template>
 <div>
    <div class="header">
      <h2>告警设置管理</h2>
      <el-button type="primary" @click="handleAdd">新增告警设置</el-button>
    </div>

    <el-table :data="alarmConfigs" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" >
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="日志集" prop="logName" />
      <el-table-column label="触发类型">
        <template #default="{ row }">
          {{ 
            row.triggerType === 1 ? '异常模板数量' : 
            row.triggerType === 2 ? '含异常模板日志数量' : '最低Level等级'
          }}
        </template>
      </el-table-column>
      <el-table-column label="时间间隔">
        <template #default="{ row }">
          {{ row.timeInterval }} {{ 
            row.timeUnit === 'DAY' ? '天' : 
            row.timeUnit === 'HOUR' ? '小时' : '分钟'
          }}
        </template>
      </el-table-column>
      <el-table-column label="最低Level" prop="level" v-if="alarmConfigs.some(c => c.triggerType === 3)" />
      <el-table-column label="阈值" prop="threshold" />
      <el-table-column label="邮件地址" prop="email" width="300"/>
      <el-table-column label="启用状态" width="100">
        <template #default="{ row }">
          <!-- v-model包括了@change, 因此不能一起使用，否则会切换两次 -->
          <el-switch
            v-model="row.enabled"
            @change="toggleStatus(row)"
            :active-value=1
            :inactive-value=0
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form 
        :model="currentConfig" 
        :rules="rules" 
        ref="configFormRef" 
        label-width="120px"
      >
        <el-form-item label="日志集">
          <el-select v-model="currentConfig.logName" style="width:100%">
            <el-option v-for="name in logNames" :key="name" :label="name" :value="name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="触发类型">
          <el-radio-group v-model="currentConfig.triggerType">
            <el-radio :value="1">异常模板数量</el-radio>
            <el-radio :value="2">含异常模板日志数量</el-radio>
            <el-radio :value="3">最低Level等级</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="时间间隔">
          <el-select v-model="currentConfig.timeUnit" style="width:100px">
            <el-option label="天" value="DAY"></el-option>
            <el-option label="小时" value="HOUR"></el-option>
            <el-option label="分钟" value="MINUTE"></el-option>
          </el-select>
          <el-input-number
            v-model="currentConfig.timeInterval"
            :min="timeRange[currentConfig.timeUnit].min"
            :max="timeRange[currentConfig.timeUnit].max"
            :step="timeRange[currentConfig.timeUnit].step || 1"
          />
        </el-form-item>

        <el-form-item 
          label="最低Level等级" 
          v-if="currentConfig.triggerType === 3"
        >
          <el-select v-model="currentConfig.level" style="width:100px">
            <el-option label="WARNING" value="WARNING"></el-option>
            <el-option label="ERROR" value="ERROR"></el-option>
            <el-option label="SEVERE" value="SEVERE"></el-option>
            <el-option label="FATAL" value="FATAL"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="阈值" prop="threshold">
          <el-input-number 
            v-model="currentConfig.threshold" 
            :min="5"
            style="width: fit-content;"
          />
        </el-form-item>

        <el-form-item label="邮件地址" prop="email">
          <el-input v-model="currentConfig.email" style="width: fit-content;" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 样式可以根据需要添加 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>