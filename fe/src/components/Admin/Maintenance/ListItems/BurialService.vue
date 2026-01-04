<template>
  <div class="burial-service-list">
    <!-- Hero Image -->
    <div class="list-item">
      <div class="item-label">Hero Image</div>
      <div class="item-preview">
        <el-image
          v-if="burialServiceData.heroImage"
          :src="burialServiceData.heroImage"
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
        <span v-if="!burialServiceData.heroImage" class="text-grey ml-2">No file chosen</span>
      </div>
    </div>
    <el-divider />

    <!-- Hero Title -->
    <div class="list-item">
      <div class="item-label">Hero Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ burialServiceData.heroTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.heroTitle"
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
        <span class="text-grey">{{ burialServiceData.heroDescription }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.heroDescription"
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
        <span class="text-bold">{{ burialServiceData.sectionTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.sectionTitle"
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
        <span class="text-bold">{{ burialServiceData.biblicalFoundationTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.biblicalFoundationTitle"
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
        <span class="text-grey">{{ burialServiceData.biblicalFoundationText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.biblicalFoundationText"
          type="textarea"
          :rows="4"
          size="small"
          placeholder="Enter biblical foundation text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Our Commitment Title -->
    <div class="list-item">
      <div class="item-label">Our Commitment Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ burialServiceData.ourCommitmentTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.ourCommitmentTitle"
          size="small"
          placeholder="Enter our commitment title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Our Commitment Text -->
    <div class="list-item">
      <div class="item-label">Our Commitment Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ burialServiceData.ourCommitmentText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.ourCommitmentText"
          type="textarea"
          :rows="4"
          size="small"
          placeholder="Enter our commitment text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- What We Offer Title -->
    <div class="list-item">
      <div class="item-label">What We Offer Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ burialServiceData.whatWeOfferTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.whatWeOfferTitle"
          size="small"
          placeholder="Enter what we offer title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Offer Point 1 -->
    <div class="list-item">
      <div class="item-label">Offer Point 1</div>
      <div class="item-preview">
        <span class="text-grey">{{ burialServiceData.offerPoint1 }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.offerPoint1"
          size="small"
          placeholder="Enter offer point 1"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Offer Point 2 -->
    <div class="list-item">
      <div class="item-label">Offer Point 2</div>
      <div class="item-preview">
        <span class="text-grey">{{ burialServiceData.offerPoint2 }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.offerPoint2"
          size="small"
          placeholder="Enter offer point 2"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Offer Point 3 -->
    <div class="list-item">
      <div class="item-label">Offer Point 3</div>
      <div class="item-preview">
        <span class="text-grey">{{ burialServiceData.offerPoint3 }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="burialServiceData.offerPoint3"
          size="small"
          placeholder="Enter offer point 3"
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
  burialServiceData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'burialService'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('burialservice')

// Default data structure
const defaultBurialServiceData = {
  heroImage: '',
  heroTitle: 'Burial Service',
  heroDescription: 'During times of loss and grief, our burial services provide comfort and hope through sacred ceremonies that honor life and celebrate eternal life through Jesus Christ.',
  sectionTitle: 'What is Burial Service?',
  biblicalFoundationTitle: 'Biblical Foundation',
  biblicalFoundationText: 'Burial services honor the sacredness of life and provide comfort during times of loss. We believe in the resurrection and eternal life through Jesus Christ, offering hope and peace to those who mourn.',
  ourCommitmentTitle: 'Our Commitment',
  ourCommitmentText: 'We provide compassionate support, meaningful ceremonies, and spiritual guidance during difficult times. Our services reflect God\'s love and the promise of eternal life.',
  whatWeOfferTitle: 'What We Offer',
  offerPoint1: 'Compassionate pastoral care and counseling',
  offerPoint2: 'Meaningful memorial services and ceremonies',
  offerPoint3: 'Support for grieving families and loved ones'
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultBurialServiceData)))
  return reactive(JSON.parse(JSON.stringify(data)))
}

const burialServiceData = props.burialServiceData
  ? createReactiveCopy(props.burialServiceData)
  : reactive(JSON.parse(JSON.stringify(defaultBurialServiceData)))

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'burialService') {
    const loadedData = await loadPageData()
    if (loadedData) {
      Object.keys(loadedData).forEach(key => {
        burialServiceData[key] = loadedData[key]
      })
    }
  }
})

// Watch for prop changes
watch(() => props.burialServiceData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    Object.keys(cloned).forEach(key => {
      burialServiceData[key] = cloned[key]
    })
  }
}, { deep: true })

// Handle hero image change
const handleHeroImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    burialServiceData.heroImage = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Save changes to CMS
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    const contentToSave = JSON.parse(JSON.stringify(burialServiceData))
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
          burialServiceData[key] = loadedData[key]
        })
      }
    }
  } catch (error) {
    console.error('Error saving burial service page:', error)
  }
}
</script>

<style scoped>
.burial-service-list {
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

