<template>
  <div class="page-container">
    <div class="gradient-header"></div>
    
    <div class="policy-container">
      <h1 class="policy-title">隐私政策</h1>
      
      <div class="policy-content">
        <section>
          <h2>1. 信息收集</h2>
          <p>我们收集的信息包括但不限于：</p>
          <ul>
            <li>手机号码</li>
            <li>设备信息</li>
            <li>使用记录</li>
          </ul>
        </section>

        <section>
          <h2>2. 信息使用</h2>
          <p>我们收集的信息将用于：</p>
          <ul>
            <li>提供服务</li>
            <li>改善体验</li>
            <li>安全保障</li>
          </ul>
        </section>

        <!-- 更多隐私政策内容 -->
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

.policy-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.policy-title {
  font-size: 24px;
  color: #000;
  margin-bottom: 30px;
}

.policy-content {
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