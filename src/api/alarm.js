import request from '@/utils/request'

// 添加
export const getAlarmConfigService = () => {
    return request.get('/alarm')
}

// 修改
export const updateAlarmConfigService = (alarmConfig) => {
    return request.put('/alarm', {
        triggerType: alarmConfig.triggerType,
        timeUnit: alarmConfig.timeUnit,
        timeInterval: alarmConfig.timeInterval, 
        level: alarmConfig.level,
        threshold: parseInt(alarmConfig.threshold),
        email: alarmConfig.email
    })
}
