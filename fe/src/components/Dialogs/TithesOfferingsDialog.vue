<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="isEditMode ? 'Update Tithes & Offerings' : 'Add Tithes & Offerings'"
    width="700px"
    :close-on-click-modal="!loading"
    :close-on-press-escape="!loading"
    :show-close="!loading"
    class="tithes-offerings-dialog"
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
      <!-- Member -->
      <el-form-item label="Member" prop="member_id">
        <el-select
          v-model="formData.member_id"
          placeholder="Select member"
          size="large"
          style="width: 100%"
          clearable
          filterable
        >
          <el-option
            v-for="member in memberOptions"
            :key="member.id"
            :label="member.name"
            :value="member.id"
          />
        </el-select>
      </el-form-item>

      <!-- Amount -->
      <el-form-item label="Amount" prop="amount">
        <el-input-number
          v-model="formData.amount"
          :min="1"
          :max="100000000"
          :step="10"
          size="large"
          style="width: 100%"
          placeholder="Enter amount"
        />
      </el-form-item>

      <!-- Type -->
      <el-form-item label="Type" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="Select type"
          size="large"
          style="width: 100%"
          clearable
        >
          <el-option label="Tithe" value="tithe" />
          <el-option label="Offering" value="offering" />
          <el-option label="Missions" value="missions" />
          <el-option label="Love Gift" value="love_gift" />
          <el-option label="Building Fund" value="building_fund" />
          <el-option label="Donation" value="donation" />
          <el-option label="Other" value="other" />
        </el-select>
      </el-form-item>

      <!-- Payment Method -->
      <el-form-item label="Payment Method" prop="payment_method">
        <el-select
          v-model="formData.payment_method"
          placeholder="Select payment method"
          size="large"
          style="width: 100%"
          clearable
        >
          <el-option label="Cash" value="cash" />
          <el-option label="Check" value="check" />
          <el-option label="Other" value="other" />
        </el-select>
      </el-form-item>

      <!-- Notes -->
      <el-form-item label="Notes" prop="notes">
        <el-input
          v-model="formData.notes"
          type="textarea"
          :rows="3"
          placeholder="Enter notes (optional)"
          size="large"
          maxlength="500"
          show-word-limit
        />
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
          <el-option label="Pending" value="pending" />
          <el-option label="Completed" value="completed" />
          <el-option label="Cancelled" value="cancelled" />
        </el-select>
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
          {{ isEditMode ? 'Update' : 'Add' }} Record
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
  tithesData: {
    type: Object,
    default: null
  },
  // Alias for tithesData to match component usage
  tithesOfferingsData: {
    type: Object,
    default: null
  },
  // Members for selection: [{ id, name }]
  memberOptions: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit'])

// Refs
const formRef = ref(null)
const loading = ref(false)

// Check if in edit mode (support both prop names)
const isEditMode = computed(() => !!(props.tithesData || props.tithesOfferingsData))

// Form data
const formData = reactive({
  member_id: null,
  amount: null,
  type: '',
  payment_method: '',
  notes: '',
  status: 'pending'
})

// Validation rules
const rules = {
  member_id: [
    { required: true, message: 'Member is required', trigger: 'change' }
  ],
  amount: [
    { required: true, message: 'Amount is required', trigger: 'change' },
    { type: 'number', min: 1, message: 'Amount must be at least 1', trigger: 'change' }
  ],
  type: [
    { required: true, message: 'Type is required', trigger: 'change' }
  ],
  payment_method: [
    { required: true, message: 'Payment method is required', trigger: 'change' }
  ],
  notes: [
    { max: 500, message: 'Notes must not exceed 500 characters', trigger: 'blur' }
  ],
  status: [
    { required: true, message: 'Status is required', trigger: 'change' }
  ]
}

// Get the data from either prop
const donationData = computed(() => props.tithesData || props.tithesOfferingsData)

// Watch for donation data changes to populate form in edit mode
watch(
  () => donationData.value,
  (newData) => {
    if (newData && props.modelValue) {
      formData.member_id = newData.member_id ?? null
      formData.amount = typeof newData.amount === 'number' ? newData.amount : parseFloat(newData.amount) || null
      formData.type = newData.type || ''
      formData.payment_method = newData.payment_method || ''
      formData.notes = newData.notes || ''
      formData.status = newData.status || 'pending'
    }
  },
  { immediate: true }
)

// Watch dialog open/close to reset or populate form
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
    } else if (donationData.value) {
      const data = donationData.value
      formData.member_id = data.member_id ?? null
      formData.amount = typeof data.amount === 'number' ? data.amount : parseFloat(data.amount) || null
      formData.type = data.type || ''
      formData.payment_method = data.payment_method || ''
      formData.notes = data.notes || ''
      formData.status = data.status || 'pending'
    } else {
      resetForm()
    }
  }
)

// Reset form
const resetForm = () => {
  formData.member_id = null
  formData.amount = null
  formData.type = ''
  formData.payment_method = ''
  formData.notes = ''
  formData.status = 'pending'

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
        `Are you sure you want to ${actionText} this donation record?`,
        `Confirm ${actionTitle} Donation`,
        {
          confirmButtonText: actionTitle,
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
      
      // User confirmed, proceed with submission
      loading.value = true

      const submitData = {
        member_id: formData.member_id,
        amount: formData.amount,
        type: formData.type,
        payment_method: formData.payment_method,
        notes: formData.notes ? formData.notes.trim() : '',
        status: formData.status
      }

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
.tithes-offerings-dialog :deep(.el-dialog__body) {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.tithes-offerings-dialog :deep(.el-form-item) {
  margin-bottom: 20px;
}

.tithes-offerings-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: #424242;
}

.tithes-offerings-dialog :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.tithes-offerings-dialog :deep(.el-input__wrapper:hover) {
  border-color: #bdbdbd;
}

.tithes-offerings-dialog :deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #14b8a6;
  box-shadow: 0 0 0 1px #14b8a6 inset;
}

.tithes-offerings-dialog :deep(.el-textarea__inner) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.tithes-offerings-dialog :deep(.el-textarea__inner:hover) {
  border-color: #bdbdbd;
}

.tithes-offerings-dialog :deep(.el-textarea.is-focus .el-textarea__inner) {
  border-color: #14b8a6;
  box-shadow: 0 0 0 1px #14b8a6 inset;
}

.tithes-offerings-dialog :deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

.tithes-offerings-dialog :deep(.el-date-editor.el-input) {
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

.tithes-offerings-dialog :deep(.el-dialog__body) {
  position: relative;
}
</style>


