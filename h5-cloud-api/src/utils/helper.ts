export const getFullImageUrl = (url: string) => {
  if (!url) return ''
  // base64 图片直接返回
  if (url.startsWith('data:')) return url
  // 完整 URL 直接返回
  if (url.startsWith('http')) return url
  // 文章封面图片路径处理 (使用 static 目录)
  if (url.startsWith('/uploads/')) {
    return `${process.env.API_URL || 'http://localhost:3000'}/static${url}`
  }
  // 其他图片路径处理
  return url
} 