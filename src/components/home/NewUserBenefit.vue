<template>
  <div class="benefit-card">
    <div class="benefit-content">
      <div class="left-content">
        <div class="subtitle">新人福利限时领取</div>
        <div class="title">
          <span class="highlight">信息擦亮，免费领7天</span>
        </div>
      </div>
      <button class="claim-button">立即领取</button>
    </div>
  </div>
</template>

<style scoped>
.benefit-card {
  height: 78px;
  opacity: 1;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(50, 61, 87, 1) 0%, rgba(78, 90, 120, 1) 100%);
  margin-bottom: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.benefit-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subtitle {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 20.27px;
  color: rgba(255, 189, 128, 1);
  text-align: left;
  vertical-align: top;
}

.title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 26.06px;
  color: rgba(240, 188, 128, 1);
  text-align: left;
  vertical-align: top;
}

.highlight {
  position: relative;
}

.claim-button {
  height: 32px;
  padding: 0 16px;
  opacity: 1;
  border-radius: 152px;
  background: linear-gradient(90deg, rgba(248, 212, 178, 1) 0%, rgba(251, 232, 214, 1) 68.09%, rgba(255, 255, 255, 1) 100%);
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  transition: opacity 0.3s;
}

.claim-button:active {
  opacity: 0.8;
}
</style> 