import request from '../request'
import type { SystemConfig, AppConfig } from './types'
import type { ApiResponse } from '../types'

export const getSystemConfig = () =>
  request.get<ApiResponse<SystemConfig>>('/config/system')

export const getAppConfig = () =>
  request.get<ApiResponse<AppConfig>>('/config/app')

export const updateSystemConfig = (data: Partial<SystemConfig>) =>
  request.put<ApiResponse<SystemConfig>>('/config/system', data)

export const updateAppConfig = (data: Partial<AppConfig>) =>
  request.put<ApiResponse<AppConfig>>('/config/app', data) 