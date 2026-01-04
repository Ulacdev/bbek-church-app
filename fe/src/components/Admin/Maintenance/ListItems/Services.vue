<template>
  <div class="services-list">
    <!-- Services Section -->
    <div class="services-section">
      <div class="section-header">
        <div class="section-header-left">
          <h3 class="section-title">Services</h3>
          <span class="section-count">{{ servicesData.services?.length || 0 }} items</span>
        </div>
        <el-button type="primary" size="default" @click="showAddServiceDialog">
          <el-icon><Plus /></el-icon>
          Add Service
        </el-button>
      </div>

      <div class="services-table">
        <div class="table-header">
          <div class="header-cell">Element</div>
          <div class="header-cell">Preview</div>
          <div class="header-cell">Edit Action</div>
        </div>

        <template v-for="(service, index) in servicesData.services" :key="`service-${index}`">
          <div class="service-row">
            <div class="service-element">
              <span class="service-name">{{ service.title || 'Unnamed Service' }}</span>
            </div>
            <div class="service-preview">
              <el-image
                v-if="service.image"
                :src="service.image"
                fit="cover"
                class="service-preview-image"
              />
              <div v-else class="empty-preview">
                <span class="text-grey">No image set</span>
              </div>
            </div>
            <div class="service-action">
              <div class="action-controls">
                <el-upload
                  :auto-upload="false"
                  :show-file-list="false"
                  accept="image/*"
                  @change="(file) => handleServiceImageChange(file, index)"
                >
                  <template #trigger>
                    <el-button size="small" type="primary">
                      <el-icon><Upload /></el-icon>
                      Choose File
                    </el-button>
                  </template>
                </el-upload>
                <el-input
                  v-model="service.imagePath"
                  size="small"
                  placeholder="Image path"
                  style="max-width: 300px; margin-top: 8px;"
                ></el-input>
                <el-input
                  v-model="service.description"
                  type="textarea"
                  :rows="3"
                  size="small"
                  placeholder="Add description here..."
                  style="max-width: 400px; margin-top: 8px;"
                ></el-input>
                <el-select
                  v-model="service.icon"
                  size="small"
                  placeholder="Select an icon"
                  filterable
                  clearable
                  style="max-width: 400px; margin-top: 8px;"
                >
                  <el-option
                    v-for="icon in iconOptions"
                    :key="icon.value"
                    :label="`${icon.label} (${icon.value})`"
                    :value="icon.value"
                  >
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span>{{ icon.label }}</span>
                      <span style="color: #909399; font-size: 12px; margin-left: 12px;">{{ icon.value }}</span>
                    </div>
                  </el-option>
                </el-select>
                <div class="service-actions-row">
                  <el-button-group>
                    <el-button
                      size="small"
                      :disabled="index === 0"
                      @click="moveServiceUp(index)"
                    >
                      <el-icon><ArrowUp /></el-icon>
                    </el-button>
                    <el-button
                      size="small"
                      :disabled="index === servicesData.services.length - 1"
                      @click="moveServiceDown(index)"
                    >
                      <el-icon><ArrowDown /></el-icon>
                    </el-button>
                  </el-button-group>
                  <el-button
                    type="danger"
                    size="small"
                    @click="deleteService(index)"
                  >
                    <el-icon><Delete /></el-icon>
                    Delete
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Add Service Dialog -->
    <el-dialog
      v-model="addDialogVisible"
      title="Add New Service"
      width="500px"
      @close="closeAddDialog"
    >
      <div class="edit-dialog-content">
        <div class="form-group">
          <label>Service Name:</label>
          <el-input
            v-model="newService.title"
            placeholder="Enter service name"
            style="margin-top: 8px;"
          ></el-input>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Description:</label>
          <el-input
            v-model="newService.description"
            type="textarea"
            :rows="3"
            placeholder="Add description here..."
            style="margin-top: 8px;"
          ></el-input>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Icon:</label>
          <el-select
            v-model="newService.icon"
            placeholder="Select an icon"
            filterable
            clearable
            style="margin-top: 8px; width: 100%;"
          >
            <el-option
              v-for="icon in iconOptions"
              :key="icon.value"
              :label="`${icon.label} (${icon.value})`"
              :value="icon.value"
            >
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>{{ icon.label }}</span>
                <span style="color: #909399; font-size: 12px; margin-left: 12px;">{{ icon.value }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Image:</label>
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="handleNewServiceImageChange"
            style="margin-top: 8px;"
          >
            <template #trigger>
              <el-button size="small" type="primary">
                <el-icon><Upload /></el-icon>
                Choose File
              </el-button>
            </template>
          </el-upload>
          <span v-if="!newService.imagePath" class="text-grey ml-2">No file chosen</span>
          <span v-else class="text-grey ml-2">{{ newService.imagePath }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddDialog">Cancel</el-button>
          <el-button type="primary" @click="addNewService">Add Service</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <!-- Fixed Actions Bar -->
  <div class="actions-row-fixed">
    <div class="actions-container">
      <el-button type="primary" size="default" :loading="saving" :disabled="saving" @click="saveChanges">
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </el-button>
    </div>
  </div>

  <!-- Loader Dialog -->
  <Loader :loading="loading || saving" />
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { Upload, Plus, ArrowUp, ArrowDown, Delete } from '@element-plus/icons-vue'
import { useCms } from '@/composables/useCms'
import Loader from './Loader.vue'

const props = defineProps({
  servicesData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'services'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('services')

// Icon options for selection (Material Design Icons)
const iconOptions = [
  { value: 'mdi-water', label: 'Water (Baptism)' },
  { value: 'mdi-ring', label: 'Ring (Marriage)' },
  { value: 'mdi-baby-face-outline', label: 'Baby (Child Dedication)' },
  { value: 'mdi-cross', label: 'Cross (Burial)' },
  { value: 'mdi-church', label: 'Church' },
  { value: 'mdi-book-open-variant', label: 'Bible' },
  { value: 'mdi-heart', label: 'Heart / Love' },
  { value: 'mdi-candle', label: 'Candle' },
  { value: 'mdi-hand-heart', label: 'Hand Heart' },
  { value: 'mdi-account-group', label: 'Group / Community' },
  { value: 'mdi-music-note', label: 'Music / Worship' },
  { value: 'mdi-microphone', label: 'Microphone' },
  { value: 'mdi-teach', label: 'Teaching' },
  { value: 'mdi-pray', label: 'Prayer' },
  { value: 'mdi-hands-pray', label: 'Hands Praying' },
  { value: 'mdi-star', label: 'Star' },
  { value: 'mdi-flower', label: 'Flower' },
  { value: 'mdi-dove', label: 'Dove' },
  { value: 'mdi-gift', label: 'Gift' },
  { value: 'mdi-food', label: 'Food' },
  { value: 'mdi-home', label: 'Home' },
  { value: 'mdi-calendar', label: 'Calendar' },
  { value: 'mdi-clock-outline', label: 'Clock' },
  { value: 'mdi-map-marker', label: 'Location' },
  { value: 'mdi-phone', label: 'Phone' },
  { value: 'mdi-email', label: 'Email' },
  { value: 'mdi-account', label: 'Person' },
  { value: 'mdi-account-multiple', label: 'People' },
  { value: 'mdi-handshake', label: 'Handshake' },
  { value: 'mdi-heart-outline', label: 'Heart Outline' },
  { value: 'mdi-check-circle', label: 'Check Circle' }
]

// Default data structure based on images
const defaultServicesData = {
  services: [
    {
      title: 'Water Baptism',
      description: '',
      icon: 'mdi-water',
      image: '',
      imagePath: ''
    },
    {
      title: 'Marriage',
      description: '',
      icon: 'mdi-ring',
      image: '',
      imagePath: ''
    },
    {
      title: 'Child Dedication',
      description: '',
      icon: 'mdi-baby-face-outline',
      image: '',
      imagePath: ''
    },
    {
      title: 'Burial Service',
      description: '',
      icon: 'mdi-cross',
      image: '',
      imagePath: ''
    }
  ]
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultServicesData)))
  const cloned = JSON.parse(JSON.stringify(data))
  // Ensure services array is reactive
  if (cloned.services && Array.isArray(cloned.services)) {
    cloned.services = cloned.services.map(service => ({ ...service }))
  }
  return reactive(cloned)
}

const servicesData = props.servicesData
  ? createReactiveCopy(props.servicesData)
  : reactive(JSON.parse(JSON.stringify(defaultServicesData)))

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'services') {
    const loadedData = await loadPageData()
    if (loadedData) {
      // Merge loaded data into servicesData
      if (loadedData.services && Array.isArray(loadedData.services)) {
        servicesData.services = loadedData.services.map(service => ({ ...service }))
      }
    }
  }
})

// Watch for prop changes
watch(() => props.servicesData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    // Update services array
    if (cloned.services && Array.isArray(cloned.services)) {
      servicesData.services = cloned.services.map(service => ({ ...service }))
    }
  }
}, { deep: true })

// Add dialog state
const addDialogVisible = ref(false)
const newService = reactive({
  title: '',
  description: '',
  icon: '',
  image: '',
  imagePath: ''
})

// Handle service image change
const handleServiceImageChange = (file, index) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    servicesData.services[index].image = e.target.result
    servicesData.services[index].imagePath = fileObj.name
  }
  reader.readAsDataURL(fileObj)
}

// Handle image change for new service
const handleNewServiceImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    newService.image = e.target.result
    newService.imagePath = fileObj.name
  }
  reader.readAsDataURL(fileObj)
}

// Show add service dialog
const showAddServiceDialog = () => {
  addDialogVisible.value = true
}

// Close add dialog
const closeAddDialog = () => {
  addDialogVisible.value = false
  newService.title = ''
  newService.description = ''
  newService.icon = ''
  newService.image = ''
  newService.imagePath = ''
}

// Add new service
const addNewService = () => {
  if (newService.title.trim()) {
    servicesData.services.push({
      title: newService.title.trim(),
      description: newService.description.trim(),
      icon: newService.icon.trim(),
      image: newService.image,
      imagePath: newService.imagePath
    })
    closeAddDialog()
  } else {
    // eslint-disable-next-line no-alert
    alert('Please enter a service name')
  }
}

// Delete service
const deleteService = (index) => {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this service?')) {
    servicesData.services.splice(index, 1)
  }
}

// Move service up
const moveServiceUp = (index) => {
  if (index > 0) {
    const temp = servicesData.services[index]
    servicesData.services[index] = servicesData.services[index - 1]
    servicesData.services[index - 1] = temp
  }
}

// Move service down
const moveServiceDown = (index) => {
  if (index < servicesData.services.length - 1) {
    const temp = servicesData.services[index]
    servicesData.services[index] = servicesData.services[index + 1]
    servicesData.services[index + 1] = temp
  }
}

// Save changes to CMS
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    // Prepare content
    const contentToSave = JSON.parse(JSON.stringify(servicesData))
    const imagesToSave = {}
    
    // Extract images from services array
    if (contentToSave.services && Array.isArray(contentToSave.services)) {
      contentToSave.services.forEach((service, index) => {
        // Remove imagePath
        delete service.imagePath
        
        // Extract image if it's base64
        if (service.image && typeof service.image === 'string' && service.image.startsWith('data:')) {
          imagesToSave[`services[${index}].image`] = service.image
          service.image = '' // Clear from content
        }
      })
    }
    
    // Save to CMS
    const success = await savePageData(contentToSave, imagesToSave)
    
    if (success) {
      // Reload data
      const loadedData = await loadPageData()
      if (loadedData && loadedData.services && Array.isArray(loadedData.services)) {
        servicesData.services = loadedData.services.map(service => ({ ...service }))
      }
    }
  } catch (error) {
    console.error('Error saving services page:', error)
  }
}
</script>

<style scoped>
.services-list {
  width: 100%;
  padding-bottom: 80px; /* Add padding to prevent content from being hidden behind fixed button */
}

/* Services Section Styles */
.services-section {
  width: 100%;
  margin-top: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.section-count {
  font-size: 14px;
  color: #909399;
  background: #f5f7fa;
  padding: 4px 12px;
  border-radius: 12px;
}

.services-table {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: #f5f7fa;
  border-bottom: 2px solid #e4e7ed;
  font-weight: 600;
  color: #303133;
}

.header-cell {
  padding: 12px 16px;
  flex: 1;
}

.header-cell:nth-child(1) {
  min-width: 200px;
}

.header-cell:nth-child(2) {
  flex: 1;
}

.header-cell:nth-child(3) {
  min-width: 400px;
}

.service-row {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #e4e7ed;
  padding: 16px;
  gap: 16px;
}

.service-row:last-child {
  border-bottom: none;
}

.service-element {
  min-width: 200px;
  display: flex;
  align-items: center;
}

.service-name {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.service-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.service-preview-image {
  width: 100%;
  max-width: 400px;
  height: 200px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  object-fit: cover;
}

.empty-preview {
  width: 100%;
  max-width: 400px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background: #fafafa;
}

.service-action {
  min-width: 400px;
  display: flex;
  flex-direction: column;
}

.action-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-actions-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.text-grey {
  color: #909399;
  font-size: 12px;
}

.ml-2 {
  margin-left: 8px;
}

.edit-dialog-content {
  padding: 8px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.actions-row-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 16px 24px;
}

.actions-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

