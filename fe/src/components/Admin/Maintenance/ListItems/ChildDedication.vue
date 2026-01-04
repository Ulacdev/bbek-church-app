<template>
  <div class="child-dedication-list">
    <!-- Hero Image -->
    <div class="list-item">
      <div class="item-label">Hero Image</div>
      <div class="item-preview">
        <el-image
          v-if="childDedicationData.heroImage"
          :src="childDedicationData.heroImage"
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
        <span v-if="!childDedicationData.heroImage" class="text-grey ml-2">No file chosen</span>
      </div>
    </div>
    <el-divider />

    <!-- Hero Title -->
    <div class="list-item">
      <div class="item-label">Hero Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ childDedicationData.heroTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.heroTitle"
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
        <span class="text-grey">{{ childDedicationData.heroDescription }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.heroDescription"
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
        <span class="text-bold">{{ childDedicationData.sectionTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.sectionTitle"
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
        <span class="text-bold">{{ childDedicationData.biblicalFoundationTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.biblicalFoundationTitle"
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
        <span class="text-grey">{{ childDedicationData.biblicalFoundationText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.biblicalFoundationText"
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
        <span class="text-bold">{{ childDedicationData.ourCommitmentTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.ourCommitmentTitle"
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
        <span class="text-grey">{{ childDedicationData.ourCommitmentText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.ourCommitmentText"
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
        <span class="text-bold">{{ childDedicationData.whatWeOfferTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.whatWeOfferTitle"
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
        <span class="text-grey">{{ childDedicationData.offerPoint1 }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.offerPoint1"
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
        <span class="text-grey">{{ childDedicationData.offerPoint2 }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.offerPoint2"
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
        <span class="text-grey">{{ childDedicationData.offerPoint3 }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="childDedicationData.offerPoint3"
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
  childDedicationData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'childDedication'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('childdedication')

// Default data structure
const defaultChildDedicationData = {
  heroImage: '',
  heroTitle: 'Child Dedication',
  heroDescription: 'Dedicate your child to the Lord and commit to raising them in a Christ-centered home. Our child dedication service is a meaningful celebration of your family\'s commitment to God.',
  sectionTitle: 'What is Child Dedication?',
  biblicalFoundationTitle: 'Biblical Foundation',
  biblicalFoundationText: 'Child dedication is a public commitment by parents to raise their child according to God\'s Word and in the ways of the Lord. It is a beautiful expression of faith and a promise to guide your child in their spiritual journey.',
  ourCommitmentTitle: 'Our Commitment',
  ourCommitmentText: 'We are committed to supporting families in their journey of raising children in the faith. Through our dedication services, we join with parents in prayer and commitment to nurture the next generation in Christ.',
  whatWeOfferTitle: 'What We Offer',
  offerPoint1: 'Meaningful dedication ceremonies and celebrations',
  offerPoint2: 'Pastoral support and guidance for parents',
  offerPoint3: 'Ongoing resources and community for Christian families'
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultChildDedicationData)))
  return reactive(JSON.parse(JSON.stringify(data)))
}

const childDedicationData = props.childDedicationData
  ? createReactiveCopy(props.childDedicationData)
  : reactive(JSON.parse(JSON.stringify(defaultChildDedicationData)))

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'childDedication') {
    const loadedData = await loadPageData()
    if (loadedData) {
      Object.keys(loadedData).forEach(key => {
        childDedicationData[key] = loadedData[key]
      })
    }
  }
})

// Watch for prop changes
watch(() => props.childDedicationData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    Object.keys(cloned).forEach(key => {
      childDedicationData[key] = cloned[key]
    })
  }
}, { deep: true })

// Handle hero image change
const handleHeroImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    childDedicationData.heroImage = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Save changes to CMS
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    const contentToSave = JSON.parse(JSON.stringify(childDedicationData))
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
          childDedicationData[key] = loadedData[key]
        })
      }
    }
  } catch (error) {
    console.error('Error saving child dedication page:', error)
  }
}
</script>

<style scoped>
.child-dedication-list {
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

