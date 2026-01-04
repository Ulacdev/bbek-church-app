<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="announcement?.title || 'Announcement'"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    @close="handleClose"
  >
    <div v-if="announcement" class="announcement-content">
      <el-alert
        :type="announcement.type"
        :closable="false"
        show-icon
        class="mb-4"
      >
        <template #title>
          <div class="alert-title">{{ announcement.title }}</div>
        </template>
      </el-alert>

      <div class="content-body">
        <div class="content-text">{{ announcement.content }}</div>
      </div>

      <div class="announcement-meta">
        <el-tag
          :type="getPriorityColor(announcement.priority)"
          size="small"
          class="mr-2"
        >
          {{ announcement.priority.toUpperCase() }}
        </el-tag>
        <span class="meta-text">
          {{ formatDateTime(announcement.created_at) }}
        </span>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleMarkAsViewed" size="large">
          Got it
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useAnnouncementStore } from '@/stores/announcementStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  announcement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'viewed'])

const announcementStore = useAnnouncementStore()

const handleMarkAsViewed = async () => {
  if (props.announcement) {
    try {
      await announcementStore.markAnnouncementAsViewed(props.announcement.announcement_id)
      emit('viewed', props.announcement.announcement_id)
      emit('update:modelValue', false)
    } catch (error) {
      ElMessage.error(error.message || 'Failed to mark announcement as viewed')
    }
  }
}

const handleClose = () => {
  // When user closes without clicking "Got it", still mark as viewed
  if (props.announcement) {
    handleMarkAsViewed()
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPriorityColor = (priority) => {
  const colorMap = {
    urgent: 'danger',
    high: 'warning',
    normal: 'info',
    low: ''
  }
  return colorMap[priority] || 'info'
}
</script>

<style scoped>
.announcement-content {
  padding: 0;
}

.alert-title {
  font-size: 16px;
  font-weight: 600;
}

.content-body {
  margin: 20px 0;
  padding: 16px;
  background: #F5F7FA;
  border-radius: 4px;
}

.content-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
  color: #303133;
}

.announcement-meta {
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #EBEEF5;
}

.meta-text {
  font-size: 12px;
  color: #909399;
}

.mr-2 {
  margin-right: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>

