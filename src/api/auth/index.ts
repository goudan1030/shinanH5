export * from './types'

export * from './service'

import {
  sendCode,
  loginWithPhone,
  loginWithPassword,
  setupUser,
  getCurrentUser,
  checkLoginStatus,
  updateUser
} from './service'

export const authApi = {
  sendCode,
  loginWithPhone,
  loginWithPassword,
  setupUser,
  getCurrentUser,
  checkLoginStatus,
  updateUser
}

export default authApi 