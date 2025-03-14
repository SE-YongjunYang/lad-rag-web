<script setup>
import { ref, onMounted } from 'vue'
import LogDetailDialog from '@/components/LogDetailDialog.vue'
import { fetchLogList, deleteLogById } from '@/api/log'
import { useUserStore } from '@/stores'

const searchForm = ref({
  timestampRange: [],
  level: '',
  content: ''
})

const logList = ref([])
const currentLog = ref(null)
const detailVisible = ref(false)

const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

const userStore = useUserStore()

// 检查权限
const hasPermission = (permission) => {
  return userStore.hasPermission(permission)
}

// 获取日志列表
const fetchLogs = async () => {
//   const params = {
//     ...searchForm.value,
//     startTime: searchForm.value.timestampRange[0],
//     endTime: searchForm.value.timestampRange[1],
//     page: pagination.value.current,
//     size: pagination.value.size
//   }
//   const res = await fetchLogList(params)
//   logList.value = res.data.list
//   pagination.value.total = res.data.total
    console.log("获取日志列表" + searchForm.value)
}

// 搜索
const handleSearch = () => {
  pagination.value.current = 1
  fetchLogs()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    timestampRange: [],
    level: '',
    content: ''
  }
  handleSearch()
}

// 查看详情
const viewDetail = (log) => {
  currentLog.value = log
  detailVisible.value = true
}

// 删除日志
const deleteLog = (id) => {
//   ElMessageBox.confirm('确认删除该日志？', '提示', {
//     type: 'warning'
//   }).then(async () => {
//     await deleteLogById(id)
//     fetchLogs()
//   })
    console.log("删除日志" + id)
}

onMounted(() => {
  fetchLogs()
})
</script>

<template>
    <div class="bgl-container">
      <!-- 搜索栏 -->
      <el-form :model="searchForm" class="search-form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="searchForm.timestampRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日志级别">
              <el-select v-model="searchForm.level" placeholder="请选择">
                  <el-option label="DEBUG" value="DEBUG" />
                <el-option label="INFO" value="INFO" />
                <el-option label="WARN" value="WARN" />
                <el-option label="ERROR" value="ERROR" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日志内容">
              <el-input v-model="searchForm.content" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
  
      <!-- 日志表格 -->
      <el-table :data="logList" stripe>
        <el-table-column prop="label" label="Label" />
        <el-table-column prop="timestamp" label="时间" />
        <el-table-column prop="node" label="节点" />
        <el-table-column prop="level" label="级别" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="eventId" label="事件ID" />
        <el-table-column prop="eventTemplate" label="事件模板" show-overflow-tooltip />
        <el-table-column prop="host" label="主机" />
        <el-table-column label="操作" width="150">
          <!-- 权限判断 -->
          <template #default="{ row }">
            <el-button 
            type="text" 
            @click="viewDetail(row)"
            v-if="hasPermission('data.BGL.r')">
            查看
            </el-button>
            <el-button 
            type="text"
            v-if="hasPermission('data.BGL.w')"
            @click="editLog(row)">
            编辑
            </el-button>
            <el-button 
            type="text"
            v-if="hasPermission('data.BGL.w')"
            @click="deleteLog(row.id)">
            删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        @current-change="fetchLogs"
      />
  
      <!-- 日志详情弹窗 -->
      <LogDetailDialog v-model="detailVisible" :log="currentLog" />
    </div>
  </template>
  
  <style scoped>
  .search-form {
    margin-bottom: 20px;
  }
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  </style>