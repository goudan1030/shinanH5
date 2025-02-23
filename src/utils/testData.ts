// 测试数据
export const TEST_PHONES = ['13800138000', '13900139000']

// 模拟已存在的用户数据
export const TEST_USERS = {
  '13800138000': {
    id: 1,
    phone: '13800138000',
    username: 'test_user',
    isNewUser: false  // 将测试用户设为已存在用户
  },
  '13900139000': {
    id: 2,
    phone: '13900139000',
    username: 'test_user2',
    isNewUser: true  // 将此测试用户设为新用户
  }
}

export const TEST_CODES = {
  '13800138000': {
    valid: '123456',  // 正确的验证码
    invalid: '111111'  // 错误的验证码
  },
  '13900139000': {
    valid: '666666',  // 正确的验证码
    invalid: '000000'  // 错误的验证码
  }
}

// 检查是否是测试手机号
export const isTestPhone = (phone: string): boolean => {
  return TEST_PHONES.includes(phone)
}

// 验证测试验证码
export const verifyTestCode = (phone: string, code: string): boolean => {
  if (!isTestPhone(phone)) return false
  return code === TEST_CODES[phone].valid
}

// 获取测试用户
export const getTestUser = (phone: string) => {
  return TEST_USERS[phone]
}