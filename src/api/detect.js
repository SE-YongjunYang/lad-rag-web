import request from '@/utils/request'


export const getDetectionConfigsService = () => {
    return request.get('/detection')
}


export const getDetectionConfigService = (id) => {
    return request.get('/detection/' + id)
}

// 修改
export const updateDetectionConfigService = (detectionConfig) => {
    return request.put('/detection', {
        logName: detectionConfig.logName,
        timeUnit: detectionConfig.timeUnit,
        timeInterval: detectionConfig.timeInterval, 
        detectHistory: parseInt(detectionConfig.detectHistory),
        isTrain: parseInt(detectionConfig.isTrain)
    })
}

// 新增
export const addDetectionConfigService = (detectionConfig) => {
    return request.post('/detection', {
        logName: detectionConfig.logName,
        timeUnit: detectionConfig.timeUnit,
        timeInterval: detectionConfig.timeInterval, 
        detectHistory: parseInt(detectionConfig.detectHistory),
        isTrain: parseInt(detectionConfig.isTrain)
    })
}

// 删除
export const deleteDetectionConfigService = (id) => {
    return request.delete('/detection/' + id)
}

// 切换启用状态
export const switchDetectionStatusService = (id, status) => {
    return request.post('/detection/' + id + '/' + status)
}