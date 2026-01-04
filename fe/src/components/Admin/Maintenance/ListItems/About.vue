<template>
  <div class="about-list">
    <!-- Hero Image -->
    <div class="list-item">
      <div class="item-label">Hero Image</div>
      <div class="item-preview">
        <el-image
          v-if="aboutData.heroImage"
          :src="aboutData.heroImage"
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
        <span v-if="!aboutData.heroImage" class="text-grey ml-2">No file chosen</span>
      </div>
    </div>
    <el-divider />

    <!-- Hero Title -->
    <div class="list-item">
      <div class="item-label">Hero Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ aboutData.heroTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="aboutData.heroTitle"
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
        <span class="text-grey">{{ aboutData.heroSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="aboutData.heroSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter hero subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Grid Title -->
    <div class="list-item">
      <div class="item-label">Grid Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ aboutData.gridTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="aboutData.gridTitle"
          size="small"
          placeholder="Enter grid title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Grid Subtitle -->
    <div class="list-item">
      <div class="item-label">Grid Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ aboutData.gridSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="aboutData.gridSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter grid subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- About Sections -->
    <div class="sections-section">
      <div class="section-header">
        <div class="section-header-left">
          <h3 class="section-title">About Sections</h3>
          <span class="section-count">{{ aboutData.aboutSections?.length || 0 }} items</span>
        </div>
        <el-button type="primary" size="default" @click="showAddSectionDialog">
          <el-icon><Plus /></el-icon>
          Add Section
        </el-button>
      </div>

      <div class="sections-container">
        <template v-for="(section, index) in aboutData.aboutSections" :key="`section-${index}`">
          <div class="section-card">
            <div class="section-header-inner">
              <div class="section-number-badge">{{ index + 1 }}</div>
              <div class="section-content">
                <div class="section-fields">
                  <div class="section-field">
                    <label class="section-field-label">Title</label>
                    <el-input
                      v-model="section.title"
                      size="default"
                      placeholder="Section title"
                      class="section-input"
                    />
                    <div class="section-meta">
                      <span class="section-value text-bold">{{ section.title }}</span>
                    </div>
                  </div>
                  <div class="section-field">
                    <label class="section-field-label">Description</label>
                    <el-input
                      v-model="section.description"
                      type="textarea"
                      :rows="3"
                      size="small"
                      placeholder="Section description"
                      class="section-textarea"
                    />
                    <div class="section-meta">
                      <span class="section-value">{{ section.description }}</span>
                    </div>
                  </div>
                  <div class="section-field">
                    <label class="section-field-label">Link</label>
                    <el-input
                      v-model="section.link"
                      size="default"
                      placeholder="Section link (e.g., /about/aboutus)"
                      class="section-input"
                    />
                    <div class="section-meta">
                      <span class="section-value">{{ section.link }}</span>
                    </div>
                  </div>
                  <div class="section-field">
                    <label class="section-field-label">Image</label>
                    <div class="section-image-preview">
                      <el-image
                        v-if="section.image"
                        :src="section.image"
                        fit="cover"
                        class="section-preview-image"
                      />
                      <span v-else class="text-grey">No image selected</span>
                    </div>
                    <el-upload
                      :auto-upload="false"
                      :show-file-list="false"
                      accept="image/*"
                      @change="(file) => handleSectionImageChange(file, index)"
                    >
                      <template #trigger>
                        <el-button size="small" type="primary">
                          <el-icon><Upload /></el-icon>
                          Choose File
                        </el-button>
                      </template>
                    </el-upload>
                  </div>
                  <div class="section-field">
                    <label class="section-field-label">Fallback Image (optional)</label>
                    <el-input
                      v-model="section.fallback"
                      size="default"
                      placeholder="Fallback image path (e.g., /img/fallback.jpg)"
                      class="section-input"
                    />
                    <div class="section-meta">
                      <span class="section-value">{{ section.fallback || 'No fallback' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="section-actions">
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteSection(index)"
                >
                  Delete
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Add Section Dialog -->
    <el-dialog
      v-model="addSectionDialogVisible"
      title="Add New Section"
      width="500px"
      @close="closeAddSectionDialog"
    >
      <div class="edit-dialog-content">
        <div class="form-group">
          <label>Title:</label>
          <el-input
            v-model="newSection.title"
            placeholder="Enter section title"
            style="margin-top: 8px;"
          ></el-input>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Description:</label>
          <el-input
            v-model="newSection.description"
            type="textarea"
            :rows="3"
            placeholder="Enter section description"
            style="margin-top: 8px;"
          ></el-input>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Link:</label>
          <el-input
            v-model="newSection.link"
            placeholder="Enter section link (e.g., /about/aboutus)"
            style="margin-top: 8px;"
          ></el-input>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Image:</label>
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="handleNewSectionImageChange"
            style="margin-top: 8px;"
          >
            <template #trigger>
              <el-button size="small" type="primary">
                <el-icon><Upload /></el-icon>
                Choose File
              </el-button>
            </template>
          </el-upload>
          <span v-if="!newSection.image" class="text-grey ml-2">No file chosen</span>
          <span v-else class="text-grey ml-2">Image selected</span>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Fallback Image (optional):</label>
          <el-input
            v-model="newSection.fallback"
            placeholder="Enter fallback image path (e.g., /img/fallback.jpg)"
            style="margin-top: 8px;"
          ></el-input>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddSectionDialog">Cancel</el-button>
          <el-button type="primary" @click="addNewSection">Add Section</el-button>
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
import { Upload, Plus } from '@element-plus/icons-vue'
import { useCms } from '@/composables/useCms'
import Loader from './Loader.vue'

const props = defineProps({
  aboutData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'about'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('about')

// Default data structure aligned with landing page
const defaultAboutData = {
  heroImage: '',
  heroTitle: 'About Bible Baptist Ekklesia of Kawit',
  heroSubtitle: 'Discover our faith community, leadership, and the heart of our mission to serve and grow together in Christ.',
  gridTitle: 'Explore Our Community',
  gridSubtitle: 'Dive deeper into what makes our church family special. Each section reveals a different aspect of our spiritual journey and community life.',
  aboutSections: [
    {
      title: 'Our Story',
      image: '',
      fallback: '/img/abt.jpg',
      link: '/about/aboutus',
      description: 'Learn about our journey, values, and the foundation of our faith community'
    },
    {
      title: 'Department Officers',
      image: '',
      fallback: '/img/departments.webp',
      link: '/about/departmentofficer',
      description: 'Meet the dedicated leaders serving in our various church departments'
    },
    {
      title: 'Church Leadership',
      image: '',
      fallback: '/img/sir.jpeg',
      link: '/about/churchleaders',
      description: 'Discover our pastors and leaders guiding our spiritual journey'
    },
    {
      title: 'Beliefs',
      image: '',
      fallback: '/img/beliefs.webp',
      link: '/about/beliefs',
      description: 'Explore the core doctrines and principles that guide our faith'
    }
  ]
}

// Initialize with defaults to ensure all fields are reactive
const aboutData = reactive(JSON.parse(JSON.stringify(defaultAboutData)))

// If props provide data, merge it
if (props.aboutData) {
  const propData = JSON.parse(JSON.stringify(props.aboutData))
  Object.keys(propData).forEach(key => {
    if (key === 'aboutSections' && Array.isArray(propData[key])) {
      aboutData.aboutSections = propData[key].map(section => ({ ...section }))
    } else {
      aboutData[key] = propData[key]
    }
  })
}

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'about') {
    console.log('Loading About Grid CMS data...')
    const loadedData = await loadPageData()
    console.log('Loaded data from CMS:', loadedData)
    
    if (loadedData && typeof loadedData === 'object') {
      // Merge loaded data into reactive object, preserving defaults for missing fields
      Object.keys(defaultAboutData).forEach(key => {
        if (loadedData.hasOwnProperty(key)) {
          // Special handling for heroImage - it should be base64 after composable merges
          if (key === 'heroImage' && loadedData[key]) {
            const heroImage = loadedData[key]
            if (typeof heroImage === 'string' && heroImage.startsWith('data:image/')) {
              aboutData[key] = heroImage
              console.log(`Set ${key}: base64 image (length: ${heroImage.length})`)
            } else {
              console.log(`Hero image is not base64, keeping default`)
            }
          } else if (key === 'aboutSections' && Array.isArray(loadedData[key])) {
            // Handle aboutSections array with images
            aboutData.aboutSections = loadedData[key].map((section, index) => {
              const sectionObj = {
                title: section.title || '',
                description: section.description || '',
                link: section.link || '',
                fallback: section.fallback || '',
                image: ''
              }
              
              // Check if section has image (base64 after composable merges)
              if (section.image && typeof section.image === 'string' && section.image.startsWith('data:image/')) {
                sectionObj.image = section.image
                console.log(`Set aboutSections[${index}].image: base64 image`)
              } else {
                console.log(`Section ${index} image is not base64`)
              }
              
              return sectionObj
            })
            console.log(`Set aboutSections: ${aboutData.aboutSections.length} sections`)
          } else {
            aboutData[key] = loadedData[key]
            console.log(`Set ${key}:`, loadedData[key])
          }
        } else {
          // Keep default value if not in loaded data
          console.log(`Keeping default for ${key}:`, defaultAboutData[key])
        }
      })
      
      // Also handle any additional fields that might be in loaded data
      Object.keys(loadedData).forEach(key => {
        if (!defaultAboutData.hasOwnProperty(key)) {
          aboutData[key] = loadedData[key]
          console.log(`Set additional field ${key}:`, loadedData[key])
        }
      })
      
      console.log('Final aboutData:', aboutData)
    } else {
      console.log('No data loaded, using defaults')
    }
  }
})

// Watch for prop changes
watch(() => props.aboutData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    // Update aboutSections array
    if (cloned.aboutSections && Array.isArray(cloned.aboutSections)) {
      aboutData.aboutSections = cloned.aboutSections.map(section => ({ ...section }))
    }
    // Update other properties
    Object.keys(cloned).forEach(key => {
      if (key !== 'aboutSections') {
        aboutData[key] = cloned[key]
      }
    })
  }
}, { deep: true })

// Add section dialog state
const addSectionDialogVisible = ref(false)
const newSection = reactive({
  title: '',
  description: '',
  link: '',
  image: '',
  fallback: ''
})

// Handle hero image change
const handleHeroImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    aboutData.heroImage = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Handle section image change
const handleSectionImageChange = (file, index) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    aboutData.aboutSections[index].image = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Handle new section image change
const handleNewSectionImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    newSection.image = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Show add section dialog
const showAddSectionDialog = () => {
  addSectionDialogVisible.value = true
}

// Close add section dialog
const closeAddSectionDialog = () => {
  addSectionDialogVisible.value = false
  newSection.title = ''
  newSection.description = ''
  newSection.link = ''
  newSection.image = ''
  newSection.fallback = ''
}

// Add new section
const addNewSection = () => {
  if (newSection.title.trim() && newSection.link.trim()) {
    aboutData.aboutSections.push({
      title: newSection.title.trim(),
      description: newSection.description.trim(),
      link: newSection.link.trim(),
      image: newSection.image,
      fallback: newSection.fallback.trim()
    })
    closeAddSectionDialog()
  } else {
    // eslint-disable-next-line no-alert
    alert('Please enter a title and link')
  }
}

// Delete section
const deleteSection = (index) => {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this section?')) {
    aboutData.aboutSections.splice(index, 1)
  }
}

// Save changes to CMS
// Hero image and section images are saved as BLOB in database (not in JSON)
// Flow: base64 in content → composable extracts → backend converts to Buffer → saves as BLOB
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    console.log('Saving About Grid data:', aboutData)
    const contentToSave = JSON.parse(JSON.stringify(aboutData))
    
    // Keep images in content - composable will extract them and save as BLOB
    // The composable's extractImagesFromContent will automatically extract base64 images
    // Backend will convert base64 to Buffer and save as BLOB in tbl_cms_images
    if (contentToSave.heroImage && typeof contentToSave.heroImage === 'string' && contentToSave.heroImage.startsWith('data:image/')) {
      console.log('Hero image will be saved as BLOB (base64 length:', contentToSave.heroImage.length, ')')
    } else if (contentToSave.heroImage) {
      console.log('Hero image is not base64, keeping as is')
    }
    
    // Section images are kept in the aboutSections array - composable will extract them
    if (contentToSave.aboutSections && Array.isArray(contentToSave.aboutSections)) {
      contentToSave.aboutSections.forEach((section, index) => {
        if (section.image && typeof section.image === 'string' && section.image.startsWith('data:image/')) {
          console.log(`Section ${index} image will be saved as BLOB (base64 length: ${section.image.length})`)
        }
      })
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
        Object.keys(defaultAboutData).forEach(key => {
          if (loadedData.hasOwnProperty(key)) {
            // Special handling for heroImage
            if (key === 'heroImage' && loadedData[key] && typeof loadedData[key] === 'string' && loadedData[key].startsWith('data:image/')) {
              aboutData[key] = loadedData[key]
            } else if (key === 'aboutSections' && Array.isArray(loadedData[key])) {
              // Handle aboutSections array with images
              aboutData.aboutSections = loadedData[key].map((section) => ({
                title: section.title || '',
                description: section.description || '',
                link: section.link || '',
                fallback: section.fallback || '',
                image: (section.image && typeof section.image === 'string' && section.image.startsWith('data:image/')) ? section.image : ''
              }))
            } else if (key !== 'heroImage') {
              aboutData[key] = loadedData[key]
            }
          }
        })
        
        // Handle additional fields
        Object.keys(loadedData).forEach(key => {
          if (!defaultAboutData.hasOwnProperty(key)) {
            aboutData[key] = loadedData[key]
          }
        })
        
        console.log('Updated aboutData after reload:', aboutData)
      }
    } else {
      console.error('Save failed')
    }
  } catch (error) {
    console.error('Error saving about grid page:', error)
  }
}
</script>

<style scoped>
.about-list {
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

/* Sections Section Styles */
.sections-section {
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

.sections-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.section-card:hover {
  border-color: #c0c4cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.section-number-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.section-content {
  flex: 1;
  min-width: 0;
}

.section-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-field-label {
  font-size: 12px;
  font-weight: 500;
  color: #606266;
}

.section-input {
  width: 100%;
  max-width: 400px;
}

.section-textarea {
  width: 100%;
  max-width: 500px;
}

.section-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;
}

.section-value {
  color: #909399;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.section-image-preview {
  margin-bottom: 8px;
}

.section-preview-image {
  width: 150px;
  height: 100px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
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
