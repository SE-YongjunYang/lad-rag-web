import request from '@/utils/request'
import { encodeStr } from '@/utils/encryptUtils';
// 添加
export const userAddService = ({ userName, password }) => {
  password = encodeStr(password)
  return request.post('/user', { userName, password })
}

// 用户登录
export const userLoginService = ({ userName, password }) => {
  password = encodeStr(password)
  return request.post('/user/login', { userName, password })
}

// 退出登录
export const userLogoutService = () => {
  return request.get('/user/logout')
}

// 修改密码
export const userUpdatePassService = ({ userName, oldPassword, newPassword }) => {
  oldPassword = encodeStr(oldPassword)
  newPassword = encodeStr(newPassword)
  return request.put('/user/password', { userName, oldPassword, newPassword })
}

// // 获取用户信息
// export const userGetInfoService = (id) => {
//   return request.get('/user/' + id)
// }


// 删除用户
export const userDeleteService = (id) => {
  return request.delete('/user/' + id)
}

  // 获取普通用户列表
export const userListService = () => {
  return request.get('/user/list')
}

// // 设置用户权限
// export const userSetAuthService = ({ userId, permissionIds }) => {
//   return request.put('/user/permission', { userId, permissionIds })
// }

// // 查询所有权限
// export const getAllPermissionService = () => {
//   return request.get('/permission/list')
// }
// // 修改用户信息
// export const userUpdateInfoService = ({ id, nickname, email }) => {
//   return request.put('/my/userinfo', { id, nickname, email })
// }

// // 上传头像
// export const userUploadAvatarService = (avatar) => {
//   request.patch('/my/update/avatar', { avatar })
// }

// // 修改密码
// export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) => {
//   return request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
// }