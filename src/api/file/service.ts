import request from '../request'
import type { FileInfo, UploadResponse, FileUploadConfig } from './types'
import type { ApiResponse } from '../types'

export const uploadFile = (file: File, type: string = 'common') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  return request.post<ApiResponse<UploadResponse>>('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getFileInfo = (fileId: number) =>
  request.get<ApiResponse<FileInfo>>(`/file/${fileId}`)

export const deleteFile = (fileId: number) =>
  request.delete<ApiResponse<void>>(`/file/${fileId}`)

export const getUploadConfig = () =>
  request.get<ApiResponse<FileUploadConfig>>('/file/config') 