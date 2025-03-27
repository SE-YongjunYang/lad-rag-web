import request from '@/utils/request'

// export const fetchLogList = (params) => {
//   return request({
//     url: '/logs/bgl',
//     method: 'get',
//     params
//   })
// }

// export const deleteLogById = (id) => {
//   return request({
//     url: `/logs/bgl/${id}`,
//     method: 'delete'
//   })
// }

export const getLogNamesService = () => {
  return request.get('/logs')
}