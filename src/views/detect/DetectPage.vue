<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { 
  getDetectionConfigsService,
  addDetectionConfigService,
  updateDetectionConfigService,
  deleteDetectionConfigService,
  switchDetectionStatusService 
} from '@/api/detect';
import { getLogNamesService } from '@/api/log';

// 响应式数据
const detectionConfigs = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const currentConfig = ref({});
const isEditing = ref(false);
const logNames = ref([]);

const defaultConfig = {
  logName: '',
  timeUnit: 'HOUR',
  timeInterval: 5,
  isTrain: 0,
  detectHistory: 0,
  enabled: 0
};

const timeRange = ref({
  DAY: { min: 1, max: 30, step: 1 },
  HOUR: { min: 1, max: 23, step: 1 },
  MINUTE: { min: 5, max: 30, step: 5 },
});

// 表单引用
const configFormRef = ref(null);

// 获取异常检测配置列表
const fetchDetectionConfigs = async () => {
  try {
    const res = await getDetectionConfigsService();
    detectionConfigs.value = res.data;
  } catch (error) {
    ElMessage.error('获取异常检测配置失败');
  }
};

onMounted(() => {
  fetchDetectionConfigs();
});

// 打开新增对话框
const handleAdd = async () => {
  const { data } = await getLogNamesService();
  logNames.value = data;

  dialogTitle.value = '新增异常检测设置';
  currentConfig.value = { ...defaultConfig };
  isEditing.value = false;
  dialogVisible.value = true;
};

// 打开编辑对话框
const handleEdit = async (row) => {
  const { data } = await getLogNamesService();
  logNames.value = data;
  
  dialogTitle.value = '编辑异常检测设置';
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
      await updateDetectionConfigService(currentConfig.value);
      ElMessage.success('更新成功');
    } else {
      await addDetectionConfigService(currentConfig.value);
      ElMessage.success('添加成功');
    }
    
    dialogVisible.value = false;
    fetchDetectionConfigs();
  } catch (error) {
    ElMessage.error(isEditing.value ? '更新失败' : '添加失败');
  }
};

// 删除配置
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除此异常检测设置吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await deleteDetectionConfigService(id);
    ElMessage.success('删除成功');
    fetchDetectionConfigs();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 切换启用状态
const toggleStatus = async (config) => {
  try {
    await switchDetectionStatusService(config.id, config.enabled);
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
      <h2>异常检测设置管理</h2>
      <el-button type="primary" @click="handleAdd">新增异常检测设置</el-button>
    </div>

    <el-table :data="detectionConfigs" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="日志集" prop="logName" />
      <el-table-column label="时间间隔">
        <template #default="{ row }">
          {{ row.timeInterval }} {{ 
            row.timeUnit === 'DAY' ? '天' : 
            row.timeUnit === 'HOUR' ? '小时' : '分钟'
          }}
        </template>
      </el-table-column>
      <el-table-column label="检测历史日志">
        <template #default="{ row }">
          {{ row.detectHistory === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="启用状态" width="100">
        <template #default="{ row }">
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
          <el-button :disabled="row.enabled === 1" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button :disabled="row.enabled === 1" size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form 
        :model="currentConfig" 
        ref="configFormRef" 
        label-width="120px"
      >
        <el-form-item label="日志集" prop="logName" required>
          <el-select v-model="currentConfig.logName" style="width:100%">
            <el-option v-for="name in logNames" :key="name" :label="name" :value="name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间间隔" required>
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
        
        <el-form-item label="训练模型">
          <el-switch
            v-model="currentConfig.isTrain"
            :active-value=1
            :inactive-value=0
          />
        </el-form-item>
        <el-form-item label="检测历史日志">
          <el-switch
            v-model="currentConfig.detectHistory"
            :active-value=1
            :inactive-value=0
          />
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>