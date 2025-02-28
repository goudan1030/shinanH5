# 滚动位置恢复功能优化

## 问题描述
从其他页面返回首页时，滚动位置恢复存在以下问题：
1. 从会员详情页返回首页时，滚动位置不准确
2. 从底部菜单栏其他页面返回时，滚动位置被重置为0

## 解决方案

### 1. 添加内存级滚动位置记录
```typescript
// 添加一个变量来记录实际的滚动位置
const lastScrollPosition = ref<Record<string, number>>({})
```

### 2. 优化滚动位置保存逻辑
```typescript
const handleScroll = throttle((e: Event) => {
  const target = e.target as HTMLElement
  if (target?.scrollTop !== undefined) {
    const position = target.scrollTop
    // 保存到内存中
    lastScrollPosition.value[props.activeTab] = position
    scrollPosition.value = position
    // 实时保存到 sessionStorage
    scrollManager.save(props.activeTab, position)
  }
}, 100, { leading: true, trailing: true })
```

### 3. 优化滚动位置恢复逻辑
```typescript
const restoreScrollPosition = () => {
  const position = scrollManager.get(props.activeTab)
  
  if (position > 0 && contentRef.value) {
    nextTick(() => {
      if (contentRef.value) {
        contentRef.value.scrollTop = position
        // 同时更新内存中的记录
        lastScrollPosition.value[props.activeTab] = position
        
        // 再次确认滚动位置
        setTimeout(() => {
          if (contentRef.value && contentRef.value.scrollTop !== position) {
            contentRef.value.scrollTop = position
          }
        }, 100)
      }
    })
  }
}
```

### 4. 修改组件失活时的处理
```typescript
onDeactivated(() => {
  // 使用最后记录的有效滚动位置
  const position = lastScrollPosition.value[props.activeTab]
  if (position !== undefined) {
    scrollManager.save(props.activeTab, position)
  }
})
```

## 优化效果
1. 从会员详情页返回首页时，可以准确恢复到之前的滚动位置
2. 从底部菜单栏其他页面返回时，不会丢失滚动位置
3. 切换标签页时，可以保持各个标签页的独立滚动位置

## 技术要点
1. 使用内存级变量记录实时滚动位置，避免组件隐藏时的位置重置问题
2. 使用 nextTick 和 setTimeout 确保滚动位置在 DOM 更新后正确设置
3. 使用节流优化滚动事件处理，避免频繁保存
4. 双重保存机制：内存 + sessionStorage，提高可靠性

## 注意事项
1. 滚动位置保存使用节流处理，可能会有轻微延迟
2. 需要确保组件卸载时正确清理节流函数
3. 在极端情况下可能需要多次尝试恢复滚动位置 