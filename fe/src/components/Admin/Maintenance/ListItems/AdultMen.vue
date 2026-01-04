<template>
  <div class="adult-men-list">
    <!-- Image -->
    <div class="list-item">
      <div class="item-label">Image</div>
      <div class="item-preview">
        <el-image
          v-if="adultMenData.image"
          :src="adultMenData.image"
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
          @change="handleImageChange"
        >
          <template #trigger>
            <el-button size="small" type="primary">
              <el-icon><Upload /></el-icon>
              Choose File
            </el-button>
          </template>
        </el-upload>
        <span v-if="!adultMenData.image" class="text-grey ml-2">No file chosen</span>
      </div>
    </div>
    <el-divider />

    <!-- Hero Title -->
    <div class="list-item">
      <div class="item-label">Hero Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ adultMenData.heroTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="adultMenData.heroTitle"
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
        <span class="text-grey">{{ adultMenData.heroDescription }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="adultMenData.heroDescription"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter hero description"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Description -->
    <div class="list-item">
      <div class="item-label">Description</div>
      <div class="item-preview">
        <span class="text-grey">{{ adultMenData.description }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="adultMenData.description"
          type="textarea"
          :rows="2"
          size="small"
          placeholder="Enter description"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Our Ministries Title -->
    <div class="list-item">
      <div class="item-label">Our Ministries Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ adultMenData.ourMinistriesTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="adultMenData.ourMinistriesTitle"
          size="small"
          placeholder="Enter our ministries title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Our Ministries Text -->
    <div class="list-item">
      <div class="item-label">Our Ministries Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ adultMenData.ourMinistriesText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="adultMenData.ourMinistriesText"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter our ministries text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Join Community Title -->
    <div class="list-item">
      <div class="item-label">Join Community Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ adultMenData.joinCommunityTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="adultMenData.joinCommunityTitle"
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
        <span class="text-grey">{{ adultMenData.joinCommunityText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="adultMenData.joinCommunityText"
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
          :style="{ backgroundColor: adultMenData.joinButtonColor, borderColor: adultMenData.joinButtonColor }"
          size="small"
          type="primary"
        >
          {{ adultMenData.joinButtonText }}
        </el-button>
      </div>
      <div class="item-action">
        <el-input
          v-model="adultMenData.joinButtonText"
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
          :style="{ backgroundColor: adultMenData.joinButtonColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="adultMenData.joinButtonColor"
          size="small"
        ></el-color-picker>
      </div>
    </div>
    <el-divider />

    <!-- Background Color -->
    <div class="list-item">
      <div class="item-label">Background Color</div>
      <div class="item-preview">
        <div
          class="color-preview"
          :style="{ backgroundColor: adultMenData.backgroundColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="adultMenData.backgroundColor"
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
  adultMenData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'adultMen'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('adultmen')

// Default data structure
const defaultAdultMenData = {
  image: '',
  heroTitle: 'Adult Men Department',
  heroDescription: "Our ministries are dedicated to meeting spiritual and practical needs, helping people grow in faith, and sharing God's love in our community.",
  description: 'Ministry for adult men.',
  ourMinistriesTitle: 'Our Ministries',
  ourMinistriesText: 'Discover our various ministries designed to help you grow in faith and serve our community.',
  joinCommunityTitle: 'Join Our Faith Community',
  joinCommunityText: 'We invite you to be a part of our church family. Come worship with us and experience the love of Christ.',
  joinButtonText: 'Become a Member',
  joinButtonColor: '#00bcd4',
  backgroundColor: '#ffffff'
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultAdultMenData)))
  return reactive(JSON.parse(JSON.stringify(data)))
}

const adultMenData = props.adultMenData
  ? createReactiveCopy(props.adultMenData)
  : reactive(JSON.parse(JSON.stringify(defaultAdultMenData)))

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'adultMen') {
    const loadedData = await loadPageData()
    if (loadedData) {
      Object.keys(loadedData).forEach(key => {
        adultMenData[key] = loadedData[key]
      })
    }
  }
})

// Watch for prop changes
watch(() => props.adultMenData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    Object.keys(cloned).forEach(key => {
      adultMenData[key] = cloned[key]
    })
  }
}, { deep: true })

// Handle image change
const handleImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    adultMenData.image = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Save changes to CMS
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    const contentToSave = JSON.parse(JSON.stringify(adultMenData))
    const imagesToSave = {}
    
    // Extract image if it's base64
    if (contentToSave.image && typeof contentToSave.image === 'string' && contentToSave.image.startsWith('data:image/')) {
      imagesToSave.image = contentToSave.image
      delete contentToSave.image
    }
    
    // Save to CMS
    const success = await savePageData(contentToSave, imagesToSave)
    
    if (success) {
      // Reload data to get updated version
      const loadedData = await loadPageData()
      if (loadedData) {
        Object.keys(loadedData).forEach(key => {
          adultMenData[key] = loadedData[key]
        })
      }
    }
  } catch (error) {
    console.error('Error saving adult men page:', error)
  }
}
</script>

<style scoped>
.adult-men-list {
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

