import request from '@/utils/request'


export const getAlarmConfigsService = () => {
    return request.get('/alarm')
}


export const getAlarmConfigService = (id) => {
    return request.get('/alarm/' + id)
}

// 修改
export const updateAlarmConfigService = (alarmConfig) => {
    return request.put('/alarm', {
        triggerType: alarmConfig.triggerType,
        timeUnit: alarmConfig.timeUnit,
        timeInterval: alarmConfig.timeInterval, 
        level: alarmConfig.level,
        threshold: parseInt(alarmConfig.threshold),
        email: alarmConfig.email,
        logName: alarmConfig.logName
    })
}

// 新增
export const addAlarmConfigService = (alarmConfig) => {
    return request.post('/alarm', {
        triggerType: alarmConfig.triggerType,
        timeUnit: alarmConfig.timeUnit,
        timeInterval: alarmConfig.timeInterval, 
        level: alarmConfig.level,
        threshold: parseInt(alarmConfig.threshold),
        email: alarmConfig.email,
        logName: alarmConfig.logName
    })
}

// 删除
export const deleteAlarmConfigService = (id) => {
    return request.delete('/alarm/' + id)
}

// 切换启用状态
export const switchStatusService = (id, status) => {
    return request.post('/alarm/' + id + '/' + status)
}
