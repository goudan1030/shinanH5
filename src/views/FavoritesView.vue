<template>
  <div class="favorites">
    <NavBar title="我的收藏" />
    
    <div class="content">
      <!-- 收藏列表 -->
      <div class="favorite-list">
        <t-cell-group>
          <t-cell
            v-for="item in favoriteList"
            :key="item.id"
            :title="item.title"
            :description="item.description"
            arrow
            @click="handleItemClick(item)"
          />
        </t-cell-group>
      </div>

      <!-- 空状态 -->
      <div v-if="favoriteList.length === 0" class="empty-state">
        <p>暂无收藏内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  CellGroup as TCellGroup,
  Cell as TCell
} from 'tdesign-mobile-vue'
import NavBar from '@/components/common/NavBar.vue'

const router = useRouter()

// 模拟收藏数据
const favoriteList = ref([
  {
    id: 1,
    title: '深圳 28岁 IT工程师',
    description: '本科学历，年收入30万+，期待遇见有缘人'
  },
  {
    id: 2,
    title: '广州 26岁 设计师',
    description: '性格开朗，喜欢旅行和美食，希望找一个成熟稳重的另一半'
  }
])

const handleItemClick = (item: any) => {
  // TODO: 跳转到详情页
  console.log('查看详情:', item)
}
</script>

<style scoped>
.favorites {
  min-height: 100vh;
  background: var(--app-background);
  padding-top: 44px;  /* 为 navbar 预留空间 */
}

.content {
  padding: 16px;
}

.favorite-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

:deep(.t-cell) {
  padding: 16px;
}

:deep(.t-cell__title) {
  font-size: 16px;
  color: #333;
}

:deep(.t-cell__description) {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}
</style> 