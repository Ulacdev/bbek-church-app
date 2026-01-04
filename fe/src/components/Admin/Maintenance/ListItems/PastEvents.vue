<template>
  <div class="past-events-list">
    <!-- Past Events Title -->
    <div class="list-item">
      <div class="item-label">Past Events Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ pastEventsData.pastEventsTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="pastEventsData.pastEventsTitle"
          size="small"
          placeholder="Enter past events title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Past Events Subtitle -->
    <div class="list-item">
      <div class="item-label">Past Events Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ pastEventsData.pastEventsSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="pastEventsData.pastEventsSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter past events subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- All Events Button Text -->
    <div class="list-item">
      <div class="item-label">All Events Button Text</div>
      <div class="item-preview">
        <el-button
          :style="{ backgroundColor: pastEventsData.allEventsButtonColor, borderColor: pastEventsData.allEventsButtonColor }"
          size="small"
          type="primary"
        >
          {{ pastEventsData.allEventsButtonText }}
        </el-button>
      </div>
      <div class="item-action">
        <el-input
          v-model="pastEventsData.allEventsButtonText"
          size="small"
          placeholder="Button text"
          style="max-width: 300px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- All Events Button Color -->
    <div class="list-item">
      <div class="item-label">All Events Button Color</div>
      <div class="item-preview">
        <div
          class="color-preview"
          :style="{ backgroundColor: pastEventsData.allEventsButtonColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="pastEventsData.allEventsButtonColor"
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
import { useCms } from '@/composables/useCms'
import Loader from './Loader.vue'

const props = defineProps({
  pastEventsData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'pastEvents'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('pastEvents')

// Default data structure
const defaultPastEventsData = {
  pastEventsTitle: 'Past Events',
  pastEventsSubtitle: 'Reflecting on our completed events that brought our community together in faith and fellowship.',
  allEventsButtonText: 'All Events',
  allEventsButtonColor: '#14b8a6'
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultPastEventsData)))
  return reactive(JSON.parse(JSON.stringify(data)))
}

// Initialize with defaults to ensure all fields are reactive
const pastEventsData = reactive(JSON.parse(JSON.stringify(defaultPastEventsData)))

// If props provide data, merge it
if (props.pastEventsData) {
  const propData = createReactiveCopy(props.pastEventsData)
  Object.keys(propData).forEach(key => {
    pastEventsData[key] = propData[key]
  })
}

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'pastEvents') {
    console.log('Loading Past Events CMS data...')
    const loadedData = await loadPageData()
    console.log('Loaded data from CMS:', loadedData)

    if (loadedData && typeof loadedData === 'object') {
      // Merge loaded data into reactive object, preserving defaults for missing fields
      Object.keys(defaultPastEventsData).forEach(key => {
        if (loadedData.hasOwnProperty(key)) {
          pastEventsData[key] = loadedData[key]
          console.log(`Set ${key}:`, loadedData[key])
        } else {
          // Keep default value if not in loaded data
          console.log(`Keeping default for ${key}:`, defaultPastEventsData[key])
        }
      })

      // Also handle any additional fields that might be in loaded data
      Object.keys(loadedData).forEach(key => {
        if (!defaultPastEventsData.hasOwnProperty(key)) {
          pastEventsData[key] = loadedData[key]
          console.log(`Set additional field ${key}:`, loadedData[key])
        }
      })

      console.log('Final pastEventsData:', pastEventsData)
    } else {
      console.log('No data loaded, using defaults')
    }
  }
})

// Watch for prop changes
watch(() => props.pastEventsData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    Object.keys(cloned).forEach(key => {
      pastEventsData[key] = cloned[key]
    })
  }
}, { deep: true })

// Save changes to CMS
const saveChanges = async () => {
  if (saving.value) return

  try {
    console.log('Saving Past Events data:', pastEventsData)
    const contentToSave = JSON.parse(JSON.stringify(pastEventsData))

    console.log('Content to save:', Object.keys(contentToSave))

    // Save to CMS
    const success = await savePageData(contentToSave, {})

    if (success) {
      console.log('Save successful, reloading data...')
      // Reload data to get updated version
      const loadedData = await loadPageData(true) // Force refresh
      console.log('Reloaded data after save:', loadedData)

      if (loadedData && typeof loadedData === 'object') {
        // Merge reloaded data
        Object.keys(defaultPastEventsData).forEach(key => {
          if (loadedData.hasOwnProperty(key)) {
            pastEventsData[key] = loadedData[key]
          }
        })

        // Handle additional fields
        Object.keys(loadedData).forEach(key => {
          if (!defaultPastEventsData.hasOwnProperty(key)) {
            pastEventsData[key] = loadedData[key]
          }
        })

        console.log('Updated pastEventsData after reload:', pastEventsData)
      }
    } else {
      console.error('Save failed')
    }
  } catch (error) {
    console.error('Error saving past events page:', error)
  }
}
</script>

<style scoped>
.past-events-list {
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