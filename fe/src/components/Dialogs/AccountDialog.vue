<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="isEditMode ? 'Update Account' : 'Add Account'"
    width="700px"
    :close-on-click-modal="!loading"
    :close-on-press-escape="!loading"
    :show-close="!loading"
    class="account-dialog"
    @close="handleClose"
  >
    <!-- Loading Overlay -->
    <div v-if="loading" class="dialog-loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <p class="loading-text">Processing...</p>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="140px"
      label-position="left"
      :disabled="loading"
    >
      <!-- Email -->
      <el-form-item label="Member" prop="email">
        <el-select
          v-model="formData.email"
          placeholder="Select email"
          size="large"
          style="width: 100%"
          clearable
          filterable
        >
          <el-option
            v-for="email in emailOptions"
            :key="email.email"
            :label="email.name"
            :value="email.email"
          />
        </el-select>
      </el-form-item>

      <!-- Position -->
      <el-form-item label="Position" prop="position">
        <el-select
          v-model="formData.position"
          placeholder="Select position"
          size="large"
          style="width: 100%"
          clearable
        >
          <el-option label="Administrator" value="admin" />
          <el-option label="Staff" value="staff" />
          <el-option label="Member" value="member" />
        </el-select>
      </el-form-item>

      <!-- Status -->
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="formData.status"
          placeholder="Select status"
          size="large"
          style="width: 100%"
          clearable
        >
          <el-option label="Active" value="active" />
          <el-option label="Inactive" value="inactive" />
        </el-select>
      </el-form-item>

      <!-- Date Created -->
      <el-form-item label="Date Created" prop="date_created">
        <el-date-picker
         disabled
          v-model="formData.date_created"
          type="datetime"
          placeholder="Select date and time"
          size="large"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
          :disabled="isEditMode"
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
          {{ isEditMode ? 'Update' : 'Add' }} Account
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  accountData: {
    type: Object,
    default: null
  },
  // Email options for selection: ['email1@example.com', 'email2@example.com', ...]
  emailOptions: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit'])

// Refs
const formRef = ref(null)
const loading = ref(false)

// Check if in edit mode
const isEditMode = computed(() => !!props.accountData)

// Form data
const formData = reactive({
  email: '',
  position: '',
  status: 'active',
  date_created: ''
})

// Date created validation function
const validateDateCreated = (rule, value, callback) => {
  if (!value && !isEditMode.value) {
    callback(new Error('Date created is required'))
    return
  }
  
  if (value) {
    const selectedDate = new Date(value)
    const now = new Date()
    
    // Allow dates in the past and present, but not too far in the future (max 1 hour ahead)
    const maxFutureDate = new Date(now.getTime() + 60 * 60 * 1000)
    
    if (selectedDate > maxFutureDate) {
      callback(new Error('Date created cannot be more than 1 hour in the future'))
      return
    }
    
    // Check if date is not too far in the past (more than 100 years)
    const minDate = new Date()
    minDate.setFullYear(now.getFullYear() - 100)
    if (selectedDate < minDate) {
      callback(new Error('Date created is too far in the past'))
      return
    }
  }
  
  callback()
}

// Validation rules
const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
    { max: 255, message: 'Email must not exceed 255 characters', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value) {
          // Check for common email format issues
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            callback(new Error('Please enter a valid email address'))
            return
          }
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  status: [
    { required: true, message: 'Status is required', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('Status is required'))
          return
        }
        if (!['active', 'inactive'].includes(value)) {
          callback(new Error('Status must be either active or inactive'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  date_created: [
    { validator: validateDateCreated, trigger: 'change' }
  ],
  position: [
    { required: true, message: 'Position is required', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('Position is required'))
          return
        }
        if (!['admin', 'staff', 'member'].includes(value)) {
          callback(new Error('Position must be Administrator, Staff, or Member'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ]
}

// Watch for accountData changes to populate form in edit mode
watch(() => props.accountData, (newData) => {
  if (newData && props.modelValue) {
    formData.email = newData.email || ''
    formData.position = newData.position || ''
    formData.status = newData.status || 'active'
    formData.date_created = newData.date_created || ''
  }
}, { immediate: true })

// Watch for dialog open/close to reset form
watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    // Reset form when dialog closes
    resetForm()
  } else if (props.accountData) {
    // Populate form when dialog opens in edit mode
    const data = props.accountData
    formData.email = data.email || ''
    formData.position = data.position || ''
    formData.status = data.status || 'active'
    formData.date_created = data.date_created || ''
  } else {
    // Reset form for add mode
    resetForm()
    // Set default date_created to current date/time
    const now = new Date()
    formData.date_created = now.toISOString().slice(0, 19).replace('T', ' ')
  }
})

// Reset form
const resetForm = () => {
  formData.email = ''
  formData.position = ''
  formData.status = 'active'
  formData.date_created = ''
  
  // Clear validation
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// Handle close
const handleClose = () => {
  emit('update:modelValue', false)
}

// Handle submit
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // Validate form
    await formRef.value.validate()
    
    // Show confirmation dialog before submitting
    const actionText = isEditMode.value ? 'update' : 'create'
    const actionTitle = isEditMode.value ? 'Update' : 'Create'
    
    try {
      await ElMessageBox.confirm(
        `Are you sure you want to ${actionText} this account?`,
        `Confirm ${actionTitle} Account`,
        {
          confirmButtonText: actionTitle,
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
      
      // User confirmed, proceed with submission
      loading.value = true
      
      // Prepare data for submission
      const submitData = {
        email: formData.email.trim().toLowerCase(),
        position: formData.position,
        status: formData.status,
        date_created: formData.date_created
      }
      
      // Note: For updates, the acc_id is passed in the URL, not in the body
      // The API endpoint is: PUT /updateAccount/:id

      // Emit submit event with data
      emit('submit', submitData)
      
      // Safety timeout: reset loading after 30 seconds if still loading
      // This prevents loading state from getting stuck if parent component fails silently
      setTimeout(() => {
        if (loading.value) {
          loading.value = false
        }
      }, 30000)
      
    } catch (confirmError) {
      // User cancelled the confirmation dialog
      if (confirmError === 'cancel') {
        // Do nothing, user cancelled
        return
      }
      throw confirmError
    }
    
  } catch (error) {
    // Validation failed or other error
    if (error !== 'cancel') {
      console.error('Validation failed:', error)
      ElMessage.error('Please fill in all required fields correctly')
    }
  } finally {
    loading.value = false
  }
}

// Expose method to reset loading (can be called by parent component on API error)
const resetLoading = () => {
  loading.value = false
}

// Expose methods for parent component
defineExpose({
  resetLoading
})
</script>

<style scoped>
.account-dialog :deep(.el-dialog__body) {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.account-dialog :deep(.el-form-item) {
  margin-bottom: 20px;
}

.account-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: #424242;
}

.account-dialog :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.account-dialog :deep(.el-input__wrapper:hover) {
  border-color: #bdbdbd;
}

.account-dialog :deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #14b8a6;
  box-shadow: 0 0 0 1px #14b8a6 inset;
}

.account-dialog :deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

.account-dialog :deep(.el-date-editor.el-input) {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer .el-button {
  border-radius: 8px;
  font-weight: 500;
  min-width: 100px;
}

.dialog-footer .el-button--primary {
  background-color: #14b8a6;
  border-color: #14b8a6;
}

.dialog-footer .el-button--primary:hover {
  background-color: #0d9488;
  border-color: #0d9488;
}

.dialog-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 4px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  position: relative;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #14b8a6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dialog-loading-overlay .loading-text {
  margin-top: 16px;
  color: #606266;
  font-size: 14px;
}

.account-dialog :deep(.el-dialog__body) {
  position: relative;
}
</style>

