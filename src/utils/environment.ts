// 检测当前运行环境的工具函数
export const isWechatBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('micromessenger') !== -1
} 