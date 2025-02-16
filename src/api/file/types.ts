export interface FileInfo {
  id: number
  userId: number
  filename: string
  originalName: string
  mimeType: string
  size: number
  path: string
  url: string
  created_at: string
  updated_at: string
}

export interface UploadResponse {
  fileId: number
  url: string
}

export interface FileUploadConfig {
  maxSize: number
  allowedTypes: string[]
  uploadPath: string
} 