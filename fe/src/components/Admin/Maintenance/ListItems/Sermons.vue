<template>
  <div class="sermons-list">
    <!-- Hero Image -->
    <div class="list-item">
      <div class="item-label">Hero Image</div>
      <div class="item-preview">
        <el-image
          v-if="sermonsData.heroImage"
          :src="sermonsData.heroImage"
          fit="cover"
          class="preview-image"
        />
        <span v-else class="text-grey">No file chosen</span>
      </div>
      <div class="item-action">
        <el-upload
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          @change="handleHeroImageChange"
        >
          <template #trigger>
            <el-button size="small" type="primary">
              <el-icon><Upload /></el-icon>
              Choose File
            </el-button>
          </template>
        </el-upload>
        <span v-if="!sermonsData.heroImage" class="text-grey ml-2">No file chosen</span>
      </div>
    </div>
    <el-divider />

    <!-- Page Title -->
    <div class="list-item">
      <div class="item-label">Page Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ sermonsData.pageTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="sermonsData.pageTitle"
          size="small"
          placeholder="Enter page title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Hero Title -->
    <div class="list-item">
      <div class="item-label">Hero Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ sermonsData.heroTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="sermonsData.heroTitle"
          size="small"
          placeholder="Enter hero title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Hero Description -->
    <div class="list-item">
      <div class="item-label">Hero Description</div>
      <div class="item-preview">
        <span class="text-bold">{{ sermonsData.heroDescription }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="sermonsData.heroDescription"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter hero description"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Background Color -->
    <div class="list-item">
      <div class="item-label">Background Color</div>
      <div class="item-preview">
        <div class="color-preview" :style="{ backgroundColor: sermonsData.backgroundColor }"></div>
        <span class="text-bold ml-2">{{ sermonsData.backgroundColor }}</span>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="sermonsData.backgroundColor"
          size="small"
          show-alpha
        ></el-color-picker>
      </div>
    </div>
    <el-divider />

    <!-- Sermon Archive Title -->
    <div class="list-item">
      <div class="item-label">Sermon Archive Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ sermonsData.sermonArchiveTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="sermonsData.sermonArchiveTitle"
          size="small"
          placeholder="Enter sermon archive title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Sermon Archive Description -->
    <div class="list-item">
      <div class="item-label">Sermon Archive Description</div>
      <div class="item-preview">
        <span class="text-bold">{{ sermonsData.sermonArchiveDescription }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="sermonsData.sermonArchiveDescription"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter sermon archive description"
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
import { Upload } from '@element-plus/icons-vue'
import { useCms } from '@/composables/useCms'
import Loader from './Loader.vue'

const props = defineProps({
  sermonsData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'sermons'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('sermons')

// Default data structure
const defaultSermonsData = {
  heroImage: '',
  pageTitle: 'Sermons',
  heroTitle: 'LIVE WORSHIP & SERMONS',
  heroDescription: 'Join us for live worship services, powerful sermons, and spiritual encouragement from our community',
  backgroundColor: '#ffffff',
  sermonArchiveTitle: 'Sermon Archive',
  sermonArchiveDescription: 'Browse through our collection of past sermons and teachings'
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultSermonsData)))
  return reactive(JSON.parse(JSON.stringify(data)))
}

// Initialize with defaults to ensure all fields are reactive
const sermonsData = reactive(JSON.parse(JSON.stringify(defaultSermonsData)))

// If props provide data, merge it
if (props.sermonsData) {
  const propData = createReactiveCopy(props.sermonsData)
  Object.keys(propData).forEach(key => {
    sermonsData[key] = propData[key]
  })
}

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'sermons') {
    console.log('Loading Sermons CMS data...')
    const loadedData = await loadPageData()
    console.log('Loaded data from CMS:', loadedData)
    
    if (loadedData && typeof loadedData === 'object') {
      // Merge loaded data into reactive object, preserving defaults for missing fields
      Object.keys(defaultSermonsData).forEach(key => {
        if (loadedData.hasOwnProperty(key)) {
          // Special handling for heroImage - it should be base64 after composable merges
          if (key === 'heroImage' && loadedData[key]) {
            const heroImage = loadedData[key]
            if (typeof heroImage === 'string' && heroImage.startsWith('data:image/')) {
              sermonsData[key] = heroImage
              console.log(`Set ${key}: base64 image (length: ${heroImage.length})`)
            } else {
              console.log(`Hero image is not base64, keeping default`)
            }
          } else {
            sermonsData[key] = loadedData[key]
            console.log(`Set ${key}:`, loadedData[key])
          }
        } else {
          // Keep default value if not in loaded data
          console.log(`Keeping default for ${key}:`, defaultSermonsData[key])
        }
      })
      
      // Also handle any additional fields that might be in loaded data
      Object.keys(loadedData).forEach(key => {
        if (!defaultSermonsData.hasOwnProperty(key)) {
          sermonsData[key] = loadedData[key]
          console.log(`Set additional field ${key}:`, loadedData[key])
        }
      })
      
      console.log('Final sermonsData:', sermonsData)
    } else {
      console.log('No data loaded, using defaults')
    }
  }
})

// Watch for prop changes
watch(() => props.sermonsData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    Object.keys(cloned).forEach(key => {
      sermonsData[key] = cloned[key]
    })
  }
}, { deep: true })

// Handle hero image change
const handleHeroImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    sermonsData.heroImage = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Save changes to CMS
// Hero image is saved as BLOB in database (not in JSON)
// Flow: base64 in content → composable extracts → backend converts to Buffer → saves as BLOB
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    console.log('Saving Sermons data:', sermonsData)
    const contentToSave = JSON.parse(JSON.stringify(sermonsData))
    
    // Keep hero image in content - composable will extract it and save as BLOB
    // The composable's extractImagesFromContent will automatically extract base64 images
    // Backend will convert base64 to Buffer and save as BLOB in tbl_cms_images
    if (contentToSave.heroImage && typeof contentToSave.heroImage === 'string' && contentToSave.heroImage.startsWith('data:image/')) {
      console.log('Hero image will be saved as BLOB (base64 length:', contentToSave.heroImage.length, ')')
    } else if (contentToSave.heroImage) {
      console.log('Hero image is not base64, keeping as is')
    }
    
    console.log('Content to save:', Object.keys(contentToSave))
    
    // Save to CMS - the composable will automatically extract base64 images
    // Backend will convert base64 to Buffer and save as BLOB in tbl_cms_images
    const success = await savePageData(contentToSave, {})
    
    if (success) {
      console.log('Save successful, reloading data...')
      // Reload data to get updated version
      const loadedData = await loadPageData(true) // Force refresh
      console.log('Reloaded data after save:', loadedData)
      
      if (loadedData && typeof loadedData === 'object') {
        // Merge reloaded data
        Object.keys(defaultSermonsData).forEach(key => {
          if (loadedData.hasOwnProperty(key)) {
            // Special handling for heroImage
            if (key === 'heroImage' && loadedData[key] && typeof loadedData[key] === 'string' && loadedData[key].startsWith('data:image/')) {
              sermonsData[key] = loadedData[key]
            } else if (key !== 'heroImage') {
              sermonsData[key] = loadedData[key]
            }
          }
        })
        
        // Handle additional fields
        Object.keys(loadedData).forEach(key => {
          if (!defaultSermonsData.hasOwnProperty(key)) {
            sermonsData[key] = loadedData[key]
          }
        })
        
        console.log('Updated sermonsData after reload:', sermonsData)
      }
    } else {
      console.error('Save failed')
    }
  } catch (error) {
    console.error('Error saving sermons page:', error)
  }
}
</script>

<style scoped>
.sermons-list {
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

.text-bold {
  font-weight: 600;
}

.text-grey {
  color: #909399;
  font-size: 12px;
}

.ml-2 {
  margin-left: 8px;
}

.preview-image {
  width: 300px;
  height: 180px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  object-fit: cover;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
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

