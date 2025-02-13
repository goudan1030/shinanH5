<template>
  <div class="page-container">
    <div class="gradient-header"></div>
    
    <div class="terms-container">
      <h1 class="terms-title">用户协议</h1>
      
      <div class="terms-content">
        <section>
          <h2>1. 服务条款</h2>
          <p>欢迎使用我们的服务。使用我们的服务即表示您同意以下条款：</p>
          <ul>
            <li>遵守相关法律法规</li>
            <li>尊重其他用户权益</li>
            <li>保护个人信息安全</li>
          </ul>
        </section>

        <section>
          <h2>2. 账号规则</h2>
          <p>关于账号使用的规定：</p>
          <ul>
            <li>一个手机号只能注册一个账号</li>
            <li>用户需要对账号安全负责</li>
            <li>禁止违规操作和恶意行为</li>
          </ul>
        </section>

        <!-- 更多用户协议内容 -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  position: relative;
  background-color: #fff;
}

.gradient-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg, rgba(2, 197, 136, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}

.terms-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.terms-title {
  font-size: 24px;
  color: #000;
  margin-bottom: 30px;
}

.terms-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

section {
  margin-bottom: 30px;
}

h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #000;
}

ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

li {
  margin-bottom: 8px;
}
</style> 