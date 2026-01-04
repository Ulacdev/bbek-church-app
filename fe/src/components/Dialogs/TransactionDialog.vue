<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="isEditMode ? 'Update Transaction' : 'Add Transaction'"
    width="600px"
    :close-on-click-modal="!loading"
    :close-on-press-escape="!loading"
    :show-close="!loading"
    class="transaction-dialog"
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
      label-width="150px"
      label-position="left"
      :disabled="loading"
    >
      <!-- Type of Service -->
      <el-form-item label="Type of Service" prop="type_of_service">
        <el-select
          v-model="formData.type_of_service"
          placeholder="Select service type"
          size="large"
          style="width: 100%"
          clearable
          filterable
          @change="handleServiceTypeChange"
        >
          <el-option
            v-for="serviceType in serviceTypeOptions"
            :key="serviceType.value"
            :label="serviceType.label"
            :value="serviceType.value"
          />
        </el-select>
      </el-form-item>

      <!-- Service ID -->
      <el-form-item label="Service ID" prop="service_id" v-if="formData.type_of_service && serviceOptions.length > 0">
        <el-select
          v-if="formData.type_of_service && serviceOptions.length > 0"
          v-model="formData.service_id"
          placeholder="Select service"
          size="large"
          style="width: 100%"
          clearable
          filterable
          :loading="loadingServices"
        >
          <el-option
            v-for="service in serviceOptions"
            :key="service.id"
            :label="service.label"
            :value="service.id"
          />
        </el-select>
        <el-input
          v-else
          v-model="formData.service_id"
          placeholder="Enter service ID"
          size="large"
          clearable
        />
        <div v-if="formData.type_of_service" class="text-caption mt-1 text-grey">
          Select a {{ getServiceTypeLabel(formData.type_of_service) }} service
        </div>
      </el-form-item>

      <!-- Total Amount -->
      <el-form-item label="Total Amount(optional)" prop="total">
        <el-input-number
          v-model="formData.total"
          :min="0"
          :precision="2"
          :step="0.01"
          size="large"
          style="width: 100%"
          placeholder="Enter total amount"
        />
      </el-form-item>

      <!-- Date Created -->
      <el-form-item label="Date Created" prop="date_created">
        <el-date-picker
          disabled
          v-model="formData.date_created"
          type="datetime"
          placeholder="Select date and time"
          size="large"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
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
          {{ isEditMode ? 'Update' : 'Create' }} Transaction
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/api/axios'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  transactionData: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit'])

// Refs
const formRef = ref(null)
const loading = ref(false)
const loadingServices = ref(false)
const serviceOptions = ref([])

// Check if in edit mode
const isEditMode = computed(() => !!props.transactionData)

// Service type options
const serviceTypeOptions = [
  { label: 'Marriage Service', value: 'marriage' },
  { label: 'Burial Service', value: 'burial' },
  { label: 'Child Dedication', value: 'child_dedication' },
  // { label: 'Water Baptism', value: 'water_baptism' }
]

// Form data
const formData = reactive({
  type_of_service: '',
  service_id: '',
  total: 0.00,
  date_created: ''
})

// Validation rules
const rules = {
  type_of_service: [
    { required: true, message: 'Service type is required', trigger: 'change' }
  ],
  service_id: [
    { required: true, message: 'Service ID is required', trigger: 'blur' }
  ],
  date_created: [
    {
      validator: (rule, value, callback) => {
        // Date is optional, but if provided, validate it
        if (!value) {
          callback() // No date is fine
          return
        }
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          callback(new Error('Invalid date format'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ]
}

// Watch for transactionData changes to populate form in edit mode
watch(
  () => props.transactionData,
  (newData) => {
    if (newData && props.modelValue) {
      formData.type_of_service = newData.type_of_service || ''
      formData.service_id = newData.service_id || ''
      formData.total = newData.total || null
      formData.date_created = newData.date_created || ''
      
      // Fetch services for the selected type
      if (newData.type_of_service) {
        fetchServices(newData.type_of_service)
      }
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
    } else if (props.transactionData) {
      const data = props.transactionData
      formData.type_of_service = data.type_of_service || ''
      formData.service_id = data.service_id || ''
      formData.total = data.total || null
      formData.date_created = data.date_created || ''
      
      // Fetch services for the selected type
      if (data.type_of_service) {
        fetchServices(data.type_of_service)
      }
    } else {
      resetForm()
      // Set default date_created to current date and time for new transactions
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      formData.date_created = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
)

// Get service type label
const getServiceTypeLabel = (type) => {
  const option = serviceTypeOptions.find(opt => opt.value === type)
  return option ? option.label : type
}

// Handle service type change
const handleServiceTypeChange = (value) => {
  formData.service_id = '' // Reset service ID when type changes
  serviceOptions.value = []
  if (value) {
    fetchServices(value)
  }
}

// Fetch services based on type
const fetchServices = async (serviceType) => {
  if (!serviceType) return
  
  loadingServices.value = true
  try {
    const accessToken = localStorage.getItem('accessToken')
    let endpoint = ''
    
    // Map service type to API endpoint
    switch (serviceType) {
      case 'marriage':
        endpoint = '/services/marriage-services/getAllMarriageServices'
        break
      case 'burial':
        endpoint = '/church-records/burial-services/getAllBurialServices'
        break
      case 'child_dedication':
        endpoint = '/church-records/child-dedications/getAllChildDedications'
        break
      // case 'water_baptism':
      //   endpoint = '/services/water-baptisms/getAllWaterBaptisms'
      //   break
      default:
        return
    }
    
    const response = await axios.get(`${endpoint}?page=1&pageSize=1000`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.data && response.data.success) {
      const services = response.data.data || []
      
      // Format services based on type
      serviceOptions.value = services.map(service => {
        let id = ''
        let label = ''
        let memberNames = []
        
        switch (serviceType) {
          case 'marriage':
            id = service.marriage_id || service.id
            // Marriage has both groom and bride
            if (service.groom_fullname) memberNames.push(service.groom_fullname)
            if (service.bride_fullname) memberNames.push(service.bride_fullname)
            // Fallback to individual names if fullname not available
            if (memberNames.length === 0) {
              if (service.groom_firstname || service.groom_lastname) {
                const groomName = `${service.groom_firstname || ''} ${service.groom_middle_name || ''} ${service.groom_lastname || ''}`.trim()
                if (groomName) memberNames.push(groomName)
              }
              if (service.bride_firstname || service.bride_lastname) {
                const brideName = `${service.bride_firstname || ''} ${service.bride_middle_name || ''} ${service.bride_lastname || ''}`.trim()
                if (brideName) memberNames.push(brideName)
              }
            }
            label = `Marriage ${id}${memberNames.length > 0 ? ` - ${memberNames.join(' & ')}` : ''}`
            break
          case 'burial':
            id = service.burial_id || service.id
            // Burial has member (requestor) and deceased
            if (service.fullname) memberNames.push(service.fullname)
            if (service.deceased_name) memberNames.push(`Deceased: ${service.deceased_name}`)
            // Fallback to individual names if fullname not available
            if (!service.fullname && (service.firstname || service.lastname)) {
              const memberName = `${service.firstname || ''} ${service.middle_name || ''} ${service.lastname || ''}`.trim()
              if (memberName) memberNames.unshift(memberName)
            }
            label = `Burial ${id}${memberNames.length > 0 ? ` - ${memberNames.join(', ')}` : ''}`
            break
          case 'child_dedication':
            id = service.child_id || service.id
            // Child dedication has parent (member) and guardians
            if (service.fullname) memberNames.push(`Parent: ${service.fullname}`)
            // Fallback to individual names if fullname not available
            if (!service.fullname && (service.firstname || service.lastname)) {
              const parentName = `${service.firstname || ''} ${service.middle_name || ''} ${service.lastname || ''}`.trim()
              if (parentName) memberNames.push(`Parent: ${parentName}`)
            }
            // Add guardians if available
            if (service.guardians) {
              try {
                const guardians = typeof service.guardians === 'string' ? JSON.parse(service.guardians) : service.guardians
                if (Array.isArray(guardians) && guardians.length > 0) {
                  memberNames.push(`Guardians: ${guardians.join(', ')}`)
                }
              } catch (e) {
                // If parsing fails, try to use as string
                if (typeof service.guardians === 'string' && service.guardians.trim()) {
                  memberNames.push(`Guardians: ${service.guardians}`)
                }
              }
            }
            label = `Child Dedication ${id}${memberNames.length > 0 ? ` - ${memberNames.join(', ')}` : ''}`
            break
          // case 'water_baptism':
          //   id = service.baptism_id || service.id
          //   // Water baptism has the member being baptized
          //   if (service.fullname) memberNames.push(service.fullname)
          //   // Fallback to individual names if fullname not available
          //   if (!service.fullname && (service.firstname || service.lastname)) {
          //     const memberName = `${service.firstname || ''} ${service.middle_name || ''} ${service.lastname || ''}`.trim()
          //     if (memberName) memberNames.push(memberName)
          //   }
          //   label = `Baptism ${id}${memberNames.length > 0 ? ` - ${memberNames.join(', ')}` : ''}`
          //   break
        }
        
        return { id, label }
      })
    }
  } catch (error) {
    console.error('Error fetching services:', error)
    ElMessage.warning('Failed to load services. You can enter the service ID manually.')
    serviceOptions.value = []
  } finally {
    loadingServices.value = false
  }
}

// Reset form
const resetForm = () => {
  formData.type_of_service = ''
  formData.service_id = ''
  formData.total = null
  formData.date_created = ''
  serviceOptions.value = []
  
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
    await formRef.value.validate()
    
    const submitData = {
      type_of_service: formData.type_of_service,
      service_id: formData.service_id.trim(),
      total: parseFloat(formData.total)
    }
    
    // Only include date_created if provided
    if (formData.date_created) {
      submitData.date_created = formData.date_created
    }
    
    emit('submit', submitData)
  } catch (error) {
    console.error('Validation failed:', error)
    ElMessage.error('Please fill in all required fields correctly.')
  }
}
</script>

<style scoped>
.transaction-dialog :deep(.el-dialog__body) {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.transaction-dialog :deep(.el-form-item) {
  margin-bottom: 20px;
}

.transaction-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: #424242;
}

.transaction-dialog :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.transaction-dialog :deep(.el-input__wrapper:hover) {
  border-color: #bdbdbd;
}

.transaction-dialog :deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #14b8a6;
  box-shadow: 0 0 0 1px #14b8a6 inset;
}

.transaction-dialog :deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

.transaction-dialog :deep(.el-date-editor.el-input) {
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
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 4px;
}

.loading-spinner {
  margin-bottom: 16px;
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

.loading-text {
  color: #666;
  font-size: 14px;
}

@media (max-width: 640px) {
  .transaction-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: 0 auto !important;
    max-height: 90vh;
  }

  .transaction-dialog :deep(.el-dialog__body) {
    padding: 16px;
    max-height: calc(90vh - 120px);
    overflow-y: auto;
  }

  .transaction-dialog :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  .transaction-dialog :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left !important;
    padding-bottom: 4px;
    font-size: 0.875rem;
  }

  .transaction-dialog :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }

  .transaction-dialog :deep(.el-input),
  .transaction-dialog :deep(.el-select),
  .transaction-dialog :deep(.el-date-editor) {
    width: 100%;
  }
}
</style>

