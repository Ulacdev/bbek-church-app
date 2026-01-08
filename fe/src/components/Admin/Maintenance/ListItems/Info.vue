<template>
  <div class="info-list pa-4">
    <!-- Column 1 Settings -->
    <v-card class="mb-4" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        Column 1 - Sunday Service
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="infoData.column1Icon"
          label="Icon Name"
          placeholder="mdi-clock-outline"
          hint="Use Material Design Icons names"
          persistent-hint
          variant="outlined"
          density="compact"
          class="mb-2"
        />

        <v-text-field
          v-model="infoData.column1Title"
          label="Title"
          placeholder="SUNDAY SERVICE"
          variant="outlined"
          density="compact"
          class="mb-2"
        />

        <v-textarea
          v-model="infoData.column1Text"
          label="Text"
          placeholder="Enter text (use <br> for line breaks)"
          variant="outlined"
          rows="3"
          auto-grow
        />
      </v-card-text>
    </v-card>

    <!-- Column 2 Settings -->
    <v-card class="mb-4" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        Column 2 - Watch Online
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="infoData.column2Icon"
          label="Icon Name"
          placeholder="mdi-laptop"
          hint="Use Material Design Icons names"
          persistent-hint
          variant="outlined"
          density="compact"
          class="mb-2"
        />

        <v-text-field
          v-model="infoData.column2Title"
          label="Title"
          placeholder="WATCH ONLINE"
          variant="outlined"
          density="compact"
          class="mb-2"
        />

        <v-textarea
          v-model="infoData.column2Text"
          label="Text"
          placeholder="Enter text (use <br> for line breaks)"
          variant="outlined"
          rows="3"
          auto-grow
          class="mb-2"
        />

        <v-text-field
          v-model="infoData.watchLiveButtonText"
          label="Button Text"
          placeholder="WATCH LIVE"
          variant="outlined"
          density="compact"
          class="mb-2"
        />

        <v-text-field
          v-model="infoData.watchLiveLink"
          label="Button Link"
          placeholder="/live"
          variant="outlined"
          density="compact"
        />
      </v-card-text>
    </v-card>

    <!-- Column 3 Settings -->
    <v-card class="mb-4" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        Column 3 - Give
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="infoData.column3Icon"
          label="Icon Name"
          placeholder="mdi-cash"
          hint="Use Material Design Icons names"
          persistent-hint
          variant="outlined"
          density="compact"
          class="mb-2"
        />

        <v-text-field
          v-model="infoData.column3Title"
          label="Title"
          placeholder="GIVE"
          variant="outlined"
          density="compact"
          class="mb-2"
        />

        <v-textarea
          v-model="infoData.column3Text"
          label="Text"
          placeholder="Enter text (use <br> for line breaks)"
          variant="outlined"
          rows="3"
          auto-grow
          class="mb-2"
        />

        <v-text-field
          v-model="infoData.giveButtonText"
          label="Button Text"
          placeholder="GIVE"
          variant="outlined"
          density="compact"
          class="mb-2"
        />

        <v-text-field
          v-model="infoData.giveLink"
          label="Button Link"
          placeholder="/give"
          variant="outlined"
          density="compact"
        />
      </v-card-text>
    </v-card>

    <!-- Button Color -->
    <v-card class="mb-4" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        Button Color
      </v-card-title>
      <v-card-text>
        <div class="d-flex align-center">
          <v-color-picker
            v-model="infoData.buttonColor"
            hide-inputs
            hide-canvas
            show-swatches
            swatches-max-height="100"
          />
          <div class="ml-4">
            <v-text-field
              v-model="infoData.buttonColor"
              label="Hex Color"
              variant="outlined"
              density="compact"
              style="width: 150px;"
            />
            <v-btn
              :color="infoData.buttonColor"
              class="text-white mt-2"
            >
              Preview Button
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Save Button -->
    <div class="d-flex align-center">
      <v-btn
        color="primary"
        size="large"
        :loading="saving"
        @click="saveInfoData"
      >
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </v-btn>
      <v-chip
        v-if="saveStatus"
        :color="saveStatus.type === 'success' ? 'success' : 'error'"
        class="ml-2"
      >
        {{ saveStatus.message }}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { useCms } from '@/composables/useCms'

const props = defineProps({
  infoData: {
    type: Object,
    default: () => ({})
  },
  activeSection: {
    type: String,
    required: true,
    default: 'info'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('info')

// Default data structure
const defaultInfoData = {
  column1Icon: 'mdi-clock-outline',
  column1Title: 'SUNDAY SERVICE',
  column1Text: 'Bible Baptist Ekklesia of Kawit<br>Time: 10:00am<br>Location: 485 Acacia St., Villa Ramirez, Tabon 1, Kawit, Cavite',
  column2Icon: 'mdi-laptop',
  column2Title: 'WATCH ONLINE',
  column2Text: 'Sunday: 10:00am<br>Wednesday: 7:00pm',
  watchLiveButtonText: 'WATCH LIVE',
  watchLiveLink: '/live',
  column3Icon: 'mdi-cash',
  column3Title: 'GIVE',
  column3Text: 'Support the ministry and missions of our church.<br>Be a part of what God is doing.',
  giveButtonText: 'GIVE',
  giveLink: '/give',
  buttonColor: '#008080'
}

// Create a reactive copy of the data
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultInfoData)))
  return reactive(JSON.parse(JSON.stringify(data)))
}

// Initialize with defaults to ensure all fields are reactive
const infoData = reactive(JSON.parse(JSON.stringify(defaultInfoData)))

// If props provide data, merge it
if (props.infoData) {
  const propData = createReactiveCopy(props.infoData)
  Object.keys(propData).forEach(key => {
    infoData[key] = propData[key]
  })
}

const saveStatus = ref(null)

// Save function
const saveInfoData = async () => {
  try {
    console.log('Saving Info data:', infoData)
    const contentToSave = JSON.parse(JSON.stringify(infoData))
    
    // The savePageData expects content directly, pageName is already set in useCms('info')
    const response = await savePageData(contentToSave)
    
    if (response) {
      saveStatus.value = { type: 'success', message: 'Saved successfully!' }
      console.log('✅ Info page saved successfully!')
      
      // Reload the data to ensure we have the latest
      const loadedData = await loadPageData()
      if (loadedData) {
        // Merge reloaded data
        Object.keys(defaultInfoData).forEach(key => {
          if (loadedData.hasOwnProperty(key)) {
            infoData[key] = loadedData[key]
          }
        })
        
        // Also merge any additional fields that might have been added
        Object.keys(loadedData).forEach(key => {
          if (!defaultInfoData.hasOwnProperty(key)) {
            infoData[key] = loadedData[key]
          }
        })
        
        console.log('Updated infoData after reload:', infoData)
      }
    } else {
      saveStatus.value = { type: 'error', message: 'Failed to save' }
      console.error('❌ Failed to save Info page:', response)
    }
  } catch (error) {
    saveStatus.value = { type: 'error', message: 'Error saving' }
    console.error('Error saving Info page:', error)
  }
}

// Watch for prop changes
watch(() => props.infoData, (newData) => {
  if (newData) {
    const cloned = createReactiveCopy(newData)
    Object.keys(cloned).forEach(key => {
      infoData[key] = cloned[key]
    })
  }
}, { deep: true })

onMounted(async () => {
  if (props.activeSection === 'info') {
    console.log('Loading Info CMS data...')
    const loadedData = await loadPageData()
    if (loadedData) {
      // Merge loaded data into reactive object, preserving defaults for missing fields
      Object.keys(defaultInfoData).forEach(key => {
        if (loadedData.hasOwnProperty(key)) {
          infoData[key] = loadedData[key]
          console.log(`Set ${key}:`, loadedData[key])
        } else {
          // Keep default value if not in loaded data
          console.log(`Keeping default for ${key}:`, defaultInfoData[key])
        }
      })
      
      // Also merge any additional fields that might have been added
      Object.keys(loadedData).forEach(key => {
        if (!defaultInfoData.hasOwnProperty(key)) {
          infoData[key] = loadedData[key]
          console.log(`Set additional field ${key}:`, loadedData[key])
        }
      })
      
      console.log('Final infoData:', infoData)
    } else {
      console.log('No CMS data loaded, using defaults')
    }
  }
})
</script>

<style scoped>
.info-list {
  width: 100%;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.ml-4 {
  margin-left: 16px;
}

.ml-2 {
  margin-left: 8px;
}

.mt-2 {
  margin-top: 8px;
}
</style>
