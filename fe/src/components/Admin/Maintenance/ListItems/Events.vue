<template>
  <div class="events-list">
    <!-- Hero Image -->
    <div class="list-item">
      <div class="item-label">Hero Image</div>
      <div class="item-preview">
        <el-image
          v-if="eventsData.heroImage"
          :src="eventsData.heroImage"
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
        <span v-if="!eventsData.heroImage" class="text-grey ml-2">No file chosen</span>
      </div>
    </div>
    <el-divider />

    <!-- Hero Title -->
    <div class="list-item">
      <div class="item-label">Hero Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ eventsData.heroTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="eventsData.heroTitle"
          size="small"
          placeholder="Enter hero title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Hero Subtitle -->
    <div class="list-item">
      <div class="item-label">Hero Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ eventsData.heroSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="eventsData.heroSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter hero subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Section Background Color -->
    <div class="list-item">
      <div class="item-label">Section Background Color</div>
      <div class="item-preview">
        <div
          class="color-preview"
          :style="{ backgroundColor: eventsData.sectionBackgroundColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="eventsData.sectionBackgroundColor"
          size="small"
        ></el-color-picker>
      </div>
    </div>
    <el-divider />

    <!-- Upcoming Events Title -->
    <div class="list-item">
      <div class="item-label">Upcoming Events Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ eventsData.upcomingEventsTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="eventsData.upcomingEventsTitle"
          size="small"
          placeholder="Enter upcoming events title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Upcoming Events Text -->
    <div class="list-item">
      <div class="item-label">Upcoming Events Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ eventsData.upcomingEventsText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="eventsData.upcomingEventsText"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter upcoming events text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Join Community Title -->
    <div class="list-item">
      <div class="item-label">Join Community Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ eventsData.joinCommunityTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="eventsData.joinCommunityTitle"
          size="small"
          placeholder="Enter join community title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Join Community Text -->
    <div class="list-item">
      <div class="item-label">Join Community Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ eventsData.joinCommunityText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="eventsData.joinCommunityText"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter join community text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Join Button Text -->
    <div class="list-item">
      <div class="item-label">Join Button Text</div>
      <div class="item-preview">
        <el-button
          :style="{ backgroundColor: eventsData.joinButtonColor, borderColor: eventsData.joinButtonColor }"
          size="small"
          type="primary"
        >
          {{ eventsData.joinButtonText }}
        </el-button>
      </div>
      <div class="item-action">
        <el-input
          v-model="eventsData.joinButtonText"
          size="small"
          placeholder="Button text"
          style="max-width: 300px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Join Button Color -->
    <div class="list-item">
      <div class="item-label">Join Button Color</div>
      <div class="item-preview">
        <div
          class="color-preview"
          :style="{ backgroundColor: eventsData.joinButtonColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="eventsData.joinButtonColor"
          size="small"
        ></el-color-picker>
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
  eventsData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'events'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('events')

// Default data structure
const defaultEventsData = {
  heroImage: '',
  heroTitle: 'OUR EVENTS',
  heroSubtitle: 'Join us for exciting upcoming events that bring our community together in faith and fellowship.',
  sectionBackgroundColor: '#ffffff',
  upcomingEventsTitle: 'Upcoming Events',
  upcomingEventsText: 'Join us for exciting upcoming events that bring our community together in faith and fellowship.',
  joinCommunityTitle: 'Join Our Community',
  joinCommunityText: 'We invite you to be a part of our church family. Come worship with us and experience the love of Christ.',
  joinButtonText: 'Become a Member',
  joinButtonColor: '#14b8a6'
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultEventsData)))
  return reactive(JSON.parse(JSON.stringify(data)))
}

// Initialize with defaults to ensure all fields are reactive
const eventsData = reactive(JSON.parse(JSON.stringify(defaultEventsData)))

// If props provide data, merge it
if (props.eventsData) {
  const propData = createReactiveCopy(props.eventsData)
  Object.keys(propData).forEach(key => {
    eventsData[key] = propData[key]
  })
}

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'events') {
    console.log('Loading Events CMS data...')
    const loadedData = await loadPageData()
    console.log('Loaded data from CMS:', loadedData)
    
    if (loadedData && typeof loadedData === 'object') {
      // Merge loaded data into reactive object, preserving defaults for missing fields
      Object.keys(defaultEventsData).forEach(key => {
        if (loadedData.hasOwnProperty(key)) {
          // Special handling for heroImage - it should be base64 after composable merges
          if (key === 'heroImage' && loadedData[key]) {
            const heroImage = loadedData[key]
            if (typeof heroImage === 'string' && heroImage.startsWith('data:image/')) {
              eventsData[key] = heroImage
              console.log(`Set ${key}: base64 image (length: ${heroImage.length})`)
            } else {
              console.log(`Hero image is not base64, keeping default`)
            }
          } else {
            eventsData[key] = loadedData[key]
            console.log(`Set ${key}:`, loadedData[key])
          }
        } else {
          // Keep default value if not in loaded data
          console.log(`Keeping default for ${key}:`, defaultEventsData[key])
        }
      })
      
      // Also handle any additional fields that might be in loaded data
      Object.keys(loadedData).forEach(key => {
        if (!defaultEventsData.hasOwnProperty(key)) {
          eventsData[key] = loadedData[key]
          console.log(`Set additional field ${key}:`, loadedData[key])
        }
      })
      
      console.log('Final eventsData:', eventsData)
    } else {
      console.log('No data loaded, using defaults')
    }
  }
})

// Watch for prop changes
watch(() => props.eventsData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    Object.keys(cloned).forEach(key => {
      eventsData[key] = cloned[key]
    })
  }
}, { deep: true })

// Handle hero image change
const handleHeroImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    eventsData.heroImage = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Save changes to CMS
// Hero image is saved as BLOB in database (not in JSON)
// Flow: base64 in content → composable extracts → backend converts to Buffer → saves as BLOB
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    console.log('Saving Events data:', eventsData)
    const contentToSave = JSON.parse(JSON.stringify(eventsData))
    
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
        Object.keys(defaultEventsData).forEach(key => {
          if (loadedData.hasOwnProperty(key)) {
            // Special handling for heroImage
            if (key === 'heroImage' && loadedData[key] && typeof loadedData[key] === 'string' && loadedData[key].startsWith('data:image/')) {
              eventsData[key] = loadedData[key]
            } else if (key !== 'heroImage') {
              eventsData[key] = loadedData[key]
            }
          }
        })
        
        // Handle additional fields
        Object.keys(loadedData).forEach(key => {
          if (!defaultEventsData.hasOwnProperty(key)) {
            eventsData[key] = loadedData[key]
          }
        })
        
        console.log('Updated eventsData after reload:', eventsData)
      }
    } else {
      console.error('Save failed')
    }
  } catch (error) {
    console.error('Error saving events page:', error)
  }
}
</script>

<style scoped>
.events-list {
  width: 100%;
  padding-bottom: 80px; /* Add padding to prevent content from being hidden behind fixed button */
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

.color-preview {
  width: 80px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
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

