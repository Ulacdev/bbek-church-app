<template>
  <div class="water-baptism-list">
    <!-- Hero Image -->
    <div class="list-item">
      <div class="item-label">Hero Image</div>
      <div class="item-preview">
        <el-image
          v-if="waterBaptismData.heroImage"
          :src="waterBaptismData.heroImage"
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
        <span v-if="!waterBaptismData.heroImage" class="text-grey ml-2">No file chosen</span>
      </div>
    </div>
    <el-divider />

    <!-- Hero Title -->
    <div class="list-item">
      <div class="item-label">Hero Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ waterBaptismData.heroTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.heroTitle"
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
        <span class="text-grey">{{ waterBaptismData.heroDescription }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.heroDescription"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter hero description"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Section Title -->
    <div class="list-item">
      <div class="item-label">Section Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ waterBaptismData.sectionTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.sectionTitle"
          size="small"
          placeholder="Enter section title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Biblical Foundation Title -->
    <div class="list-item">
      <div class="item-label">Biblical Foundation Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ waterBaptismData.biblicalFoundationTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.biblicalFoundationTitle"
          size="small"
          placeholder="Enter biblical foundation title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Biblical Foundation Text -->
    <div class="list-item">
      <div class="item-label">Biblical Foundation Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ waterBaptismData.biblicalFoundationText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.biblicalFoundationText"
          type="textarea"
          :rows="4"
          size="small"
          placeholder="Enter biblical foundation text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Significance Title -->
    <div class="list-item">
      <div class="item-label">Significance Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ waterBaptismData.significanceTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.significanceTitle"
          size="small"
          placeholder="Enter significance title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Significance Text -->
    <div class="list-item">
      <div class="item-label">Significance Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ waterBaptismData.significanceText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.significanceText"
          type="textarea"
          :rows="4"
          size="small"
          placeholder="Enter significance text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Who Should Be Baptized Title -->
    <div class="list-item">
      <div class="item-label">Who Should Be Baptized Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ waterBaptismData.whoShouldBeBaptizedTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.whoShouldBeBaptizedTitle"
          size="small"
          placeholder="Enter who should be baptized title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Who Point 1 -->
    <div class="list-item">
      <div class="item-label">Who Point 1</div>
      <div class="item-preview">
        <span class="text-grey">{{ waterBaptismData.whoPoint1 }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.whoPoint1"
          size="small"
          placeholder="Enter point 1"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Who Point 2 -->
    <div class="list-item">
      <div class="item-label">Who Point 2</div>
      <div class="item-preview">
        <span class="text-grey">{{ waterBaptismData.whoPoint2 }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.whoPoint2"
          size="small"
          placeholder="Enter point 2"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Who Point 3 -->
    <div class="list-item">
      <div class="item-label">Who Point 3</div>
      <div class="item-preview">
        <span class="text-grey">{{ waterBaptismData.whoPoint3 }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="waterBaptismData.whoPoint3"
          size="small"
          placeholder="Enter point 3"
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
  waterBaptismData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'waterBaptism'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('waterbaptism')

// Default data structure
const defaultWaterBaptismData = {
  heroImage: '',
  heroTitle: 'Water Baptism',
  heroDescription: 'Take the next step in your faith journey through water baptism, a public declaration of your commitment to follow Jesus Christ.',
  sectionTitle: 'What is Water Baptism?',
  biblicalFoundationTitle: 'Biblical Foundation',
  biblicalFoundationText: 'Water baptism is an act of obedience symbolizing the believer\'s faith in a crucified, buried, and risen Savior. It is a public declaration of one\'s faith and commitment to Christ.',
  significanceTitle: 'Significance',
  significanceText: 'Baptism illustrates Christ\'s death, burial, and resurrection. When you are immersed in water, you identify with Christ\'s death and burial, and when you come out of the water, you identify with His resurrection.',
  whoShouldBeBaptizedTitle: 'Who Should Be Baptized?',
  whoPoint1: 'Those who have accepted Jesus Christ as their personal Savior',
  whoPoint2: 'Those who understand the meaning and significance of baptism',
  whoPoint3: 'Those who are willing to publicly profess their faith in Christ'
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultWaterBaptismData)))
  return reactive(JSON.parse(JSON.stringify(data)))
}

const waterBaptismData = props.waterBaptismData
  ? createReactiveCopy(props.waterBaptismData)
  : reactive(JSON.parse(JSON.stringify(defaultWaterBaptismData)))

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'waterBaptism') {
    const loadedData = await loadPageData()
    if (loadedData) {
      Object.keys(loadedData).forEach(key => {
        waterBaptismData[key] = loadedData[key]
      })
    }
  }
})

// Watch for prop changes
watch(() => props.waterBaptismData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    Object.keys(cloned).forEach(key => {
      waterBaptismData[key] = cloned[key]
    })
  }
}, { deep: true })

// Handle hero image change
const handleHeroImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    waterBaptismData.heroImage = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Save changes to CMS
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    const contentToSave = JSON.parse(JSON.stringify(waterBaptismData))
    const imagesToSave = {}
    
    // Extract hero image if it's base64
    if (contentToSave.heroImage && typeof contentToSave.heroImage === 'string' && contentToSave.heroImage.startsWith('data:image/')) {
      imagesToSave.heroImage = contentToSave.heroImage
      delete contentToSave.heroImage
    }
    
    // Save to CMS
    const success = await savePageData(contentToSave, imagesToSave)
    
    if (success) {
      // Reload data to get updated version
      const loadedData = await loadPageData()
      if (loadedData) {
        Object.keys(loadedData).forEach(key => {
          waterBaptismData[key] = loadedData[key]
        })
      }
    }
  } catch (error) {
    console.error('Error saving water baptism page:', error)
  }
}
</script>

<style scoped>
.water-baptism-list {
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

