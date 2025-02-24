// 学历映射
export const educationMap: Record<string, string> = {
  'PRIMARY': '小学',
  'JUNIOR': '初中',
  'HIGH': '高中',
  'COLLEGE': '大专',
  'BACHELOR': '本科',
  'MASTER': '硕士',
  'DOCTOR': '博士',
  'OTHER': '其他'
}

// 子女计划映射
export const childrenPlanMap: Record<string, string> = {
  'WANT': '想要孩子',
  'NOT_WANT': '不想要孩子',
  'ALREADY_HAVE': '已有孩子',
  'DEPENDS': '看情况',
  'NONE': '不要孩子',
  'BOTH': '一起要孩子',
  'SEPARATE': '孩子各自解决',
  'NEGOTIATE': '商议'
}

// 领证要求映射
export const marriageCertMap: Record<string, string> = {
  'WANT': '要领证',
  'DONT_WANT': '不领证',
  'NEGOTIATE': '商议'
}

// 婚史映射
export const marriageHistoryMap: Record<string, string> = {
  'NO': '未婚',
  'DIVORCED': '离异',
  'WIDOWED': '丧偶',
  'OTHER': '其他'
}

// 房车情况映射
export const houseCarMap: Record<string, string> = {
  'BOTH': '有房有车',
  'HOUSE_ONLY': '有房无车',
  'CAR_ONLY': '有车无房',
  'NEITHER': '暂无房车',
  'SHARE': '与父母同住',
  'RENT': '租房'
}

// 获取映射值的工具函数
export const getMappedValue = (map: Record<string, string>, key?: string): string => {
  if (!key) return ''
  return map[key] || key
} 