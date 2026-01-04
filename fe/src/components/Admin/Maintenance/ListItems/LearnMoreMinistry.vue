<template>
  <div class="learn-more-ministry-list">
    <!-- Background Color -->
    <div class="list-item">
      <div class="item-label">Background Color</div>
      <div class="item-preview">
        <div
          class="color-preview"
          :style="{ backgroundColor: learnMoreMinistryData.backgroundColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="learnMoreMinistryData.backgroundColor"
          size="small"
        ></el-color-picker>
      </div>
    </div>
    <el-divider />

    <!-- Button Color -->
    <div class="list-item">
      <div class="item-label">Button Color</div>
      <div class="item-preview">
        <div
          class="color-preview"
          :style="{ backgroundColor: learnMoreMinistryData.buttonColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="learnMoreMinistryData.buttonColor"
          size="small"
        ></el-color-picker>
      </div>
    </div>
    <el-divider />

    <!-- About Title -->
    <div class="list-item">
      <div class="item-label">About Title</div>
      <div class="item-preview">
        <span class="text-grey">{{ learnMoreMinistryData.aboutTitle || 'No title set' }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="learnMoreMinistryData.aboutTitle"
          placeholder="Enter about title"
          size="small"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Default Description -->
    <div class="list-item">
      <div class="item-label">Default Description</div>
      <div class="item-preview">
        <span class="text-grey">{{ learnMoreMinistryData.defaultDescription || 'No description set' }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="learnMoreMinistryData.defaultDescription"
          type="textarea"
          :rows="3"
          placeholder="Enter default description"
          size="small"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Details Title -->
    <div class="list-item">
      <div class="item-label">Details Title</div>
      <div class="item-preview">
        <span class="text-grey">{{ learnMoreMinistryData.detailsTitle || 'No title set' }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="learnMoreMinistryData.detailsTitle"
          placeholder="Enter details title"
          size="small"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Join Button Text -->
    <div class="list-item">
      <div class="item-label">Join Button Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ learnMoreMinistryData.joinButtonText || 'No text set' }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="learnMoreMinistryData.joinButtonText"
          placeholder="Enter join button text"
          size="small"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Already Joined Text -->
    <div class="list-item">
      <div class="item-label">Already Joined Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ learnMoreMinistryData.alreadyJoinedText || 'No text set' }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="learnMoreMinistryData.alreadyJoinedText"
          placeholder="Enter already joined text"
          size="small"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
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
import { useCms } from '@/composables/useCms'
import Loader from './Loader.vue'

const props = defineProps({
  learnMoreMinistryData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'learnMoreMinistry'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('learnmoreministry')

// Default data structure
const defaultLearnMoreMinistryData = {
  backgroundColor: '#ffffff',
  buttonColor: '#00bcd4',
  aboutTitle: 'About This Ministry',
  defaultDescription: "This ministry is designed to help believers grow in faith, connect with community, and discover God's purpose for their lives.",
  detailsTitle: 'Ministry Details',
  joinButtonText: 'Join Us',
  alreadyJoinedText: 'Already Joined'
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultLearnMoreMinistryData)))
  return reactive(JSON.parse(JSON.stringify(data)))
}

// Initialize with defaults to ensure all fields are reactive
const learnMoreMinistryData = reactive(JSON.parse(JSON.stringify(defaultLearnMoreMinistryData)))

// If props provide data, merge it
if (props.learnMoreMinistryData) {
  const propData = createReactiveCopy(props.learnMoreMinistryData)
  Object.keys(propData).forEach(key => {
    learnMoreMinistryData[key] = propData[key]
  })
}

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'learnMoreMinistry') {
    console.log('Loading Learn More Ministry CMS data...')
    const loadedData = await loadPageData()
    console.log('Loaded data from CMS:', loadedData)
    
    if (loadedData && typeof loadedData === 'object') {
      // Merge loaded data into reactive object, preserving defaults for missing fields
      Object.keys(defaultLearnMoreMinistryData).forEach(key => {
        if (loadedData.hasOwnProperty(key)) {
          learnMoreMinistryData[key] = loadedData[key]
          console.log(`Set ${key}:`, loadedData[key])
        } else {
          // Keep default value if not in loaded data
          console.log(`Keeping default for ${key}:`, defaultLearnMoreMinistryData[key])
        }
      })
      
      // Also handle any additional fields that might be in loaded data
      Object.keys(loadedData).forEach(key => {
        if (!defaultLearnMoreMinistryData.hasOwnProperty(key)) {
        learnMoreMinistryData[key] = loadedData[key]
          console.log(`Set additional field ${key}:`, loadedData[key])
        }
      })
      
      console.log('Final learnMoreMinistryData:', learnMoreMinistryData)
    } else {
      console.log('No data loaded, using defaults')
    }
  }
})

// Watch for prop changes
watch(() => props.learnMoreMinistryData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    Object.keys(cloned).forEach(key => {
      learnMoreMinistryData[key] = cloned[key]
    })
  }
}, { deep: true })

// Save changes to CMS
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    console.log('Saving Learn More Ministry data:', learnMoreMinistryData)
    const contentToSave = JSON.parse(JSON.stringify(learnMoreMinistryData))
    console.log('Content to save:', contentToSave)
    
    // Save to CMS (no images for this component)
    const success = await savePageData(contentToSave, {})
    
    if (success) {
      console.log('Save successful, reloading data...')
      // Reload data to get updated version
      const loadedData = await loadPageData(true) // Force refresh
      console.log('Reloaded data after save:', loadedData)
      
      if (loadedData && typeof loadedData === 'object') {
        // Merge reloaded data
        Object.keys(defaultLearnMoreMinistryData).forEach(key => {
          if (loadedData.hasOwnProperty(key)) {
            learnMoreMinistryData[key] = loadedData[key]
          }
        })
        
        // Handle additional fields
        Object.keys(loadedData).forEach(key => {
          if (!defaultLearnMoreMinistryData.hasOwnProperty(key)) {
          learnMoreMinistryData[key] = loadedData[key]
          }
        })
        
        console.log('Updated learnMoreMinistryData after reload:', learnMoreMinistryData)
      }
    } else {
      console.error('Save failed')
    }
  } catch (error) {
    console.error('Error saving learn more ministry page:', error)
  }
}
</script>

<style scoped>
.learn-more-ministry-list {
  width: 100%;
  padding-bottom: 80px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  gap: 16px;
}

.item-label {
  font-weight: 500;
  min-width: 150px;
  color: #606266;
}

.item-preview {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-action {
  min-width: 300px;
  display: flex;
  justify-content: flex-end;
}

.text-grey {
  color: #909399;
  font-size: 12px;
}

.color-preview {
  width: 80px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
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

