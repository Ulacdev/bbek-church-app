<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="isEditMode ? 'Update Announcement' : 'Create Announcement'"
    width="700px"
    :close-on-click-modal="!loading"
    :close-on-press-escape="!loading"
    :show-close="!loading"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="150px"
      label-position="left"
      :disabled="loading"
    >
      <el-form-item label="Title" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="Enter announcement title"
          size="large"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="Content" prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="6"
          placeholder="Enter announcement content"
          maxlength="5000"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="Type" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="Select type"
          size="large"
          style="width: 100%"
        >
          <el-option label="Info" value="info" />
          <el-option label="Success" value="success" />
          <el-option label="Warning" value="warning" />
          <el-option label="Error" value="error" />
        </el-select>
      </el-form-item>

      <el-form-item label="Priority" prop="priority">
        <el-select
          v-model="formData.priority"
          placeholder="Select priority"
          size="large"
          style="width: 100%"
        >
          <el-option label="Low" value="low" />
          <el-option label="Normal" value="normal" />
          <el-option label="High" value="high" />
          <el-option label="Urgent" value="urgent" />
        </el-select>
      </el-form-item>

      <el-form-item label="Target Audience" prop="target_audience">
        <el-select
          v-model="formData.target_audience"
          placeholder="Select target audience"
          size="large"
          style="width: 100%"
        >
          <el-option label="All Users" value="all" />
          <el-option label="Admin" value="admin" />
          <el-option label="Pastor" value="pastor" />
          <el-option label="Member" value="member" />
          <el-option label="Non-Member" value="non_member" />
        </el-select>
      </el-form-item>

      <el-form-item label="Start Date" prop="start_date">
        <el-date-picker
          v-model="formData.start_date"
          type="datetime"
          placeholder="Select start date (optional)"
          style="width: 100%"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          clearable
        />
      </el-form-item>

      <el-form-item label="End Date" prop="end_date">
        <el-date-picker
          v-model="formData.end_date"
          type="datetime"
          placeholder="Select end date (optional)"
          style="width: 100%"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          clearable
        />
      </el-form-item>

      <el-form-item label="Status" prop="is_active">
        <el-switch
          v-model="formData.is_active"
          active-text="Active"
          inactive-text="Inactive"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" size="large" :disabled="loading">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          size="large"
          :loading="loading"
          :disabled="loading"
        >
          {{ isEditMode ? 'Update' : 'Create' }} Announcement
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useAnnouncementStore } from '@/stores/announcementStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  announcementData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const announcementStore = useAnnouncementStore()
const formRef = ref(null)
const loading = ref(false)

// Check if in edit mode
const isEditMode = computed(() => !!props.announcementData)

// Form data
const formData = reactive({
  title: '',
  content: '',
  type: 'info',
  priority: 'normal',
  target_audience: 'all',
  start_date: null,
  end_date: null,
  is_active: true
})

// Validation rules
const rules = {
  title: [
    { required: true, message: 'Please enter announcement title', trigger: 'blur' },
    { min: 3, max: 255, message: 'Title must be between 3 and 255 characters', trigger: 'blur' }
  ],
  content: [
    { required: true, message: 'Please enter announcement content', trigger: 'blur' },
    { min: 10, max: 5000, message: 'Content must be between 10 and 5000 characters', trigger: 'blur' }
  ],
  type: [
    { required: true, message: 'Please select announcement type', trigger: 'change' }
  ],
  priority: [
    { required: true, message: 'Please select priority', trigger: 'change' }
  ],
  target_audience: [
    { required: true, message: 'Please select target audience', trigger: 'change' }
  ]
}

// Watch for announcementData changes (edit mode)
watch(() => props.announcementData, (newData) => {
  if (newData) {
    formData.title = newData.title || ''
    formData.content = newData.content || ''
    formData.type = newData.type || 'info'
    formData.priority = newData.priority || 'normal'
    formData.target_audience = newData.target_audience || 'all'
    formData.start_date = newData.start_date || null
    formData.end_date = newData.end_date || null
    formData.is_active = newData.is_active !== undefined ? Boolean(newData.is_active) : true
  }
}, { immediate: true })

// Reset form
const resetForm = () => {
  formData.title = ''
  formData.content = ''
  formData.type = 'info'
  formData.priority = 'normal'
  formData.target_audience = 'all'
  formData.start_date = null
  formData.end_date = null
  formData.is_active = true
  
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// Handle close
const handleClose = () => {
  resetForm()
  emit('update:modelValue', false)
}

// Handle submit
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    loading.value = true

    const submitData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      type: formData.type,
      priority: formData.priority,
      target_audience: formData.target_audience,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      is_active: Boolean(formData.is_active)
    }

    if (isEditMode.value) {
      await announcementStore.updateAnnouncement(props.announcementData.announcement_id, submitData)
      ElMessage.success('Announcement updated successfully')
    } else {
      await announcementStore.createAnnouncement(submitData)
      ElMessage.success('Announcement created successfully')
    }

    emit('submit')
    handleClose()
  } catch (error) {
    if (error !== false) { // Validation error returns false
      console.error('Error saving announcement:', error)
      const errorMessage = error.message || error.response?.data?.error || error.response?.data?.message || 'Failed to save announcement'
      ElMessage.error(errorMessage)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

