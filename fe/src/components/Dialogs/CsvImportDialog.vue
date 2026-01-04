<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Import CSV Data"
    :width="dialogWidth"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="!uploading"
    class="csv-import-dialog"
    @close="handleClose"
    v-loading="uploading"
    :loading-text="`${uploadProgress}% - ${uploadStatus}`"
  >
    <!-- Step 1: File Selection -->
    <div v-if="!uploadComplete" class="upload-section">
      <!-- Instructions -->
      <el-alert
        title="CSV Import Instructions"
        type="info"
        show-icon
        :closable="false"
        description="Select a CSV file with required columns: firstname, lastname, birthdate, age, gender, address, email, phone_number"
        style="margin-bottom: 20px"
      />

      <!-- File Selection -->
      <el-form-item label="Select CSV File" prop="file">
        <el-upload
          ref="uploadRef"
          :action="uploadUrl"
          :headers="uploadHeaders"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-progress="handleUploadProgress"
          :before-upload="beforeUpload"
          :show-file-list="true"
          :auto-upload="false"
          accept=".csv"
          name="csvFile"
          class="upload-demo"
        >
          <template #default>
            <el-button type="primary" :loading="uploading" size="large" :disabled="uploading">
              {{ uploading ? 'Uploading...' : 'Select CSV File' }}
            </el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">
              Max 10MB, CSV format only. Ensure headers match required column names.
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <!-- File Preview -->
      <el-form-item v-if="selectedFile" label="Selected File">
        <div class="file-info">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
        </div>
      </el-form-item>

      <!-- Progress Bar -->
      <el-form-item v-if="uploading" label="Upload Progress">
        <el-progress 
          :percentage="uploadProgress" 
          :status="uploadProgress === 100 ? 'success' : undefined"
        />
        <div class="progress-text">{{ uploadStatus }}</div>
      </el-form-item>
    </div>

    <!-- Step 2: Results Display -->
    <div v-else class="results-section">
      <!-- Summary Alert -->
      <el-alert
        :title="`Import Complete: ${results.successCount} imported, ${results.errorCount} errors`"
        :type="results.errorCount > 0 ? 'warning' : 'success'"
        show-icon
        :closable="false"
        style="margin-bottom: 20px"
      />

      <!-- Statistics -->
      <el-statistic-group direction="horizontal" v-if="importStats">
        <el-statistic label="Total Rows" :value="importStats.totalRows" />
        <el-statistic label="Imported" :value="importStats.imported" :prefix="`✓`" />
        <el-statistic label="Duplicates" :value="importStats.duplicates" />
        <el-statistic label="Invalid" :value="importStats.invalid" />
        <el-statistic v-if="importStats.processingTimeMs" label="Time" :value="`${importStats.processingTimeMs}ms`" />
      </el-statistic-group>

      <!-- Success List -->
      <div v-if="successList.length > 0" class="results-section-item">
        <h4 class="section-title">
          <el-icon class="is-loading"><CircleCheckFilled /></el-icon>
          Successfully Imported ({{ successList.length }})
        </h4>
        <el-table :data="successList.slice(0, 10)" style="width: 100%" max-height="250">
          <el-table-column prop="rowNumber" label="Row" width="80" />
          <el-table-column prop="name" label="Member Name" />
          <el-table-column prop="member_id" label="Member ID" width="100" />
        </el-table>
        <p v-if="successList.length > 10" class="show-more">
          +{{ successList.length - 10 }} more members
        </p>
      </div>

      <!-- Duplicates List -->
      <div v-if="duplicateList.length > 0" class="results-section-item">
        <h4 class="section-title">
          <el-icon><Warning /></el-icon>
          Duplicate Members Skipped ({{ duplicateList.length }})
        </h4>
        <el-table :data="duplicateList" style="width: 100%" max-height="250">
          <el-table-column prop="rowNumber" label="Row" width="80" />
          <el-table-column label="Name">
            <template #default="{ row }">
              {{ row.data.firstname }} {{ row.data.lastname }}
            </template>
          </el-table-column>
          <el-table-column label="Duplicate Match" width="180">
            <template #default="{ row }">
              <el-tag 
                v-for="match in getMatchingFields(row.duplicateDetails)"
                :key="match"
                size="small"
                style="margin-right: 4px"
              >
                {{ match }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Errors List -->
      <div v-if="errorList.length > 0" class="results-section-item">
        <h4 class="section-title">
          <el-icon><CircleCloseFilled /></el-icon>
          Import Errors ({{ errorList.length }})
        </h4>
        <el-collapse accordion>
          <el-collapse-item 
            v-for="(error, index) in errorList"
            :key="index"
            :title="`Row ${error.rowNumber}: ${error.data?.firstname || 'Unknown'} ${error.data?.lastname || ''}`"
            :name="index"
          >
            <div class="error-details">
              <div v-for="(errMsg, i) in error.errors" :key="i" class="error-item">
                <el-icon class="error-icon"><CircleCloseFilled /></el-icon>
                {{ errMsg }}
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- Download Error Report -->
      <el-button 
        v-if="errorList.length > 0"
        type="primary"
        size="small"
        @click="downloadErrorReport"
        style="margin-top: 12px"
      >
        Download Error Report
      </el-button>
    </div>

    <!-- Dialog Footer -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" size="large" :disabled="uploading">
          {{ uploadComplete ? 'Close' : 'Cancel' }}
        </el-button>
        <el-button
          v-if="!uploadComplete"
          type="primary"
          @click="startUpload"
          size="large"
          :loading="uploading"
          :disabled="uploading || !selectedFile"
        >
          Upload
        </el-button>
        <el-button
          v-if="uploadComplete"
          type="primary"
          @click="resetDialog"
          size="large"
        >
          Import Another File
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheckFilled, CircleCloseFilled, Warning } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  uploadUrl: {
    type: String,
    required: true
  },
  uploadHeaders: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error'])

// Refs
const uploadRef = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref('Initializing...')
const uploadComplete = ref(false)
const selectedFile = ref(null)

// Results data
const results = reactive({
  successCount: 0,
  errorCount: 0,
  successList: [],
  duplicateList: [],
  errorList: [],
  summary: {}
})

const importStats = computed(() => results.summary)
const successList = computed(() => results.successList || [])
const duplicateList = computed(() => results.duplicateList || [])
const errorList = computed(() => results.errorList || [])

// Responsive dialog width
const dialogWidth = computed(() => {
  if (window.innerWidth <= 600) {
    return '95%'
  } else if (window.innerWidth <= 960) {
    return '90%'
  }
  return '700px'
})

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Get matching fields for duplicate display
const getMatchingFields = (duplicateDetails) => {
  if (!duplicateDetails || !Array.isArray(duplicateDetails)) return []
  const fields = new Set()
  duplicateDetails.forEach(detail => {
    if (detail.matchingFields) {
      detail.matchingFields.forEach(field => fields.add(field))
    }
  })
  return Array.from(fields)
}

// Before upload validation
const beforeUpload = (file) => {
  selectedFile.value = file
  
  // Validate file type
  if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
    ElMessage.error('Please select a CSV file')
    selectedFile.value = null
    return false
  }
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('File size must be less than 10MB')
    selectedFile.value = null
    return false
  }
  
  return true
}

// Start upload
const startUpload = () => {
  // Validation checks
  if (!uploadUrl) {
    ElMessage.error('Upload URL not configured. Contact administrator.')
    console.error('uploadUrl is not set:', uploadUrl)
    return
  }
  
  if (!selectedFile.value) {
    ElMessage.error('Please select a file first')
    return
  }
  
  // Debug logging
  console.log('Starting upload', {
    uploadUrl,
    uploadHeaders,
    selectedFile: selectedFile.value.name,
    uploadRef: !!uploadRef.value
  })
  
  try {
    if (uploadRef.value) {
      // Trigger submit on the upload component
      uploadRef.value.submit()
    } else {
      ElMessage.error('Upload component not initialized')
    }
  } catch (error) {
    console.error('Upload error:', error)
    ElMessage.error('Upload failed: ' + error.message)
  }
}

// Handle upload progress
const handleUploadProgress = (event) => {
  uploading.value = true
  const progress = event.loaded && event.total ? Math.round((event.loaded / event.total) * 100) : Math.round((event.percent || 0))
  uploadProgress.value = Math.min(progress, 99) // Cap at 99 until server responds
  
  // Update status based on progress
  if (uploadProgress.value < 30) {
    uploadStatus.value = 'Uploading file...'
  } else if (uploadProgress.value < 60) {
    uploadStatus.value = 'Validating data...'
  } else if (uploadProgress.value < 90) {
    uploadStatus.value = 'Checking for duplicates...'
  } else {
    uploadStatus.value = 'Finalizing import...'
  }
}

// Handle upload success
const handleUploadSuccess = (response, file, fileList) => {
  uploading.value = false
  uploadProgress.value = 100
  uploadStatus.value = 'Complete'
  uploadComplete.value = true

  // Ensure response has the correct structure
  if (response && (response.success !== false || response.summary)) {
    results.summary = response.summary || {}
    results.successCount = response.data?.imported?.length || 0
    results.successList = response.data?.imported || []
    results.duplicateList = response.data?.duplicates || []
    results.errorList = response.data?.invalid || []
    results.errorCount = (results.errorList?.length || 0) + (results.duplicateList?.length || 0)

    const message = response.message || 'File uploaded successfully'
    ElMessage.success(message)
    emit('upload-success', response)
  } else {
    const errorMsg = response?.error || response?.message || 'Import failed'
    handleUploadError({ message: errorMsg }, file, fileList)
  }
}

// Handle upload error
const handleUploadError = (error, file, fileList) => {
  uploading.value = false
  uploadProgress.value = 0
  uploadStatus.value = ''
  uploadComplete.value = false
  
  const errorMsg = error?.message || error?.error || String(error) || 'Upload failed'
  console.error('Upload error:', error)
  ElMessage.error(`Upload failed: ${errorMsg}`)
  emit('upload-error', error)
}

// Download error report as CSV
const downloadErrorReport = () => {
  if (errorList.value.length === 0) return

  // Create CSV content
  let csvContent = 'Row,Name,Errors\n'
  errorList.value.forEach(error => {
    const name = `"${error.data?.firstname || ''} ${error.data?.lastname || ''}"`
    const errors = `"${error.errors?.join('; ') || 'Unknown error'}"`
    csvContent += `${error.rowNumber},${name},${errors}\n`
  })

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `import-errors-${Date.now()}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  ElMessage.success('Error report downloaded')
}

// Reset dialog
const resetDialog = () => {
  uploadComplete.value = false
  uploading.value = false
  uploadProgress.value = 0
  uploadStatus.value = ''
  selectedFile.value = null
  
  results.successCount = 0
  results.errorCount = 0
  results.successList = []
  results.duplicateList = []
  results.errorList = []
  results.summary = {}
  
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

// Handle close
const handleClose = () => {
  if (uploading.value) {
    ElMessage.warning('Please wait for upload to complete')
    return
  }
  resetDialog()
  emit('update:modelValue', false)
}
</script>

<style scoped>
.csv-import-dialog :deep(.el-dialog__body) {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.csv-import-dialog :deep(.el-form-item) {
  margin-bottom: 20px;
}

.csv-import-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: #424242;
}

.upload-demo {
  text-align: left;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.file-name {
  font-weight: 500;
  color: #303133;
}

.file-size {
  color: #909399;
  font-size: 12px;
  margin-left: 12px;
}

.progress-text {
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
  text-align: center;
}

.el-upload__tip {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}

.results-section {
  width: 100%;
}

.results-section-item {
  margin-top: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .el-icon {
  font-size: 18px;
}

.error-details {
  padding: 12px;
}

.error-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #f56c6c;
}

.error-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.show-more {
  margin-top: 12px;
  font-size: 12px;
  color: #606266;
  text-align: center;
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

@media (max-width: 960px) {
  .csv-import-dialog :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto !important;
    max-height: 90vh;
  }

  .csv-import-dialog :deep(.el-dialog__body) {
    padding: 16px;
    max-height: calc(90vh - 120px);
    overflow-y: auto;
  }
}

@media (max-width: 640px) {
  .csv-import-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: 5vh auto !important;
    max-height: 90vh;
  }

  .csv-import-dialog :deep(.el-dialog__header) {
    padding: 16px;
  }

  .csv-import-dialog :deep(.el-dialog__title) {
    font-size: 1rem;
  }

  .csv-import-dialog :deep(.el-dialog__body) {
    padding: 12px;
    max-height: calc(90vh - 140px);
    overflow-y: auto;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 8px;
    padding: 12px 0;
  }

  .dialog-footer .el-button {
    width: 100%;
    min-width: auto;
    margin: 0;
  }
}
</style>