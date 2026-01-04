<template>
  <div class="accept-jesus-list">
    <!-- Image Gallery Section -->
    <div class="images-section">
      <div class="section-header">
        <div class="section-header-left">
          <h3 class="section-title">Image Gallery</h3>
          <span class="section-count">{{ acceptJesusData.images?.length || 0 }} items</span>
        </div>
        <el-button type="primary" size="default" @click="showAddImageDialog">
          <el-icon><Plus /></el-icon>
          Add Image
        </el-button>
      </div>

      <div class="images-container">
        <template v-if="acceptJesusData.images && acceptJesusData.images.length > 0">
          <template v-for="(image, index) in acceptJesusData.images" :key="`image-${index}`">
            <div class="list-item">
              <div class="item-label">Image {{ index + 1 }}</div>
              <div class="item-preview">
                <el-image
                  v-if="image && image.image && image.image.startsWith('data:image/')"
                  :src="image.image"
                  fit="cover"
                  class="preview-image"
                  :preview-src-list="acceptJesusData.images.filter(img => img && img.image).map(img => img.image)"
                />
                <div v-else class="empty-preview">
                  <span class="text-grey">No image set</span>
                </div>
              </div>
              <div class="item-action">
                <el-upload
                  :auto-upload="false"
                  :show-file-list="false"
                  accept="image/*"
                  @change="(file) => handleImageChange(file, index)"
                >
                  <template #trigger>
                    <el-button size="small" type="primary">
                      <el-icon><Upload /></el-icon>
                      Choose File
                    </el-button>
                  </template>
                </el-upload>
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteImage(index)"
                  style="margin-top: 8px;"
                >
                  Delete
                </el-button>
              </div>
            </div>
            <el-divider />
          </template>
        </template>
        <div v-else class="empty-state">
          <span class="text-grey">No images added yet. Click "Add Image" to get started.</span>
        </div>
      </div>
    </div>

    <!-- Content Sections -->
    <div class="content-sections">
      <div class="section-header">
        <div class="section-header-left">
          <h3 class="section-title">Content Sections</h3>
          <span class="section-count">{{ acceptJesusData.contentSections?.length || 0 }} items</span>
        </div>
        <el-button type="primary" size="default" @click="showAddContentDialog">
          <el-icon><Plus /></el-icon>
          Add Content
        </el-button>
      </div>

      <div class="content-container">
        <template v-for="(section, index) in acceptJesusData.contentSections" :key="`content-${index}`">
          <div class="list-item">
            <div class="item-label">
              <el-input
                v-model="section.title"
                size="small"
                placeholder="Section title"
                style="max-width: 200px;"
              ></el-input>
            </div>
            <div class="item-preview">
              <span class="text-grey">{{ section.text || 'No content' }}</span>
            </div>
            <div class="item-action">
              <el-input
                v-model="section.text"
                type="textarea"
                :rows="3"
                size="small"
                placeholder="Enter content text"
                style="max-width: 400px;"
              ></el-input>
              <el-button
                type="danger"
                size="small"
                @click="deleteContent(index)"
                style="margin-top: 8px;"
              >
                Delete
              </el-button>
            </div>
          </div>
          <el-divider />
        </template>
      </div>
    </div>

    <!-- Buttons Section -->
    <div class="buttons-section">
      <div class="section-header">
        <div class="section-header-left">
          <h3 class="section-title">Buttons</h3>
          <span class="section-count">{{ acceptJesusData.buttons?.length || 0 }} items</span>
        </div>
        <el-button type="primary" size="default" @click="showAddButtonDialog">
          <el-icon><Plus /></el-icon>
          Add Button
        </el-button>
      </div>

      <div class="buttons-container">
        <template v-for="(button, index) in acceptJesusData.buttons" :key="`button-${index}`">
          <div class="list-item">
            <div class="item-label">Button {{ index + 1 }}</div>
            <div class="item-preview">
              <el-button
                :style="{ backgroundColor: button.color, borderColor: button.color }"
                size="small"
                type="primary"
              >
                {{ button.text }}
              </el-button>
            </div>
            <div class="item-action">
              <el-input
                v-model="button.text"
                size="small"
                placeholder="Button text"
                style="max-width: 300px; margin-bottom: 8px;"
              ></el-input>
              <el-input
                v-model="button.route"
                size="small"
                placeholder="Route (e.g., /services/water-baptism)"
                style="max-width: 300px; margin-bottom: 8px;"
              ></el-input>
              <el-color-picker
                v-model="button.color"
                size="small"
                style="margin-bottom: 8px;"
              ></el-color-picker>
              <el-button
                type="danger"
                size="small"
                @click="deleteButton(index)"
              >
                Delete
              </el-button>
            </div>
          </div>
          <el-divider />
        </template>
      </div>
    </div>

    <!-- Add Image Dialog -->
    <el-dialog
      v-model="addImageDialogVisible"
      title="Add New Image"
      width="500px"
      @close="closeAddImageDialog"
    >
      <div class="edit-dialog-content">
        <div class="form-group">
          <label>Image:</label>
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="handleNewImageChange"
            style="margin-top: 8px;"
          >
            <template #trigger>
              <el-button size="small" type="primary">
                <el-icon><Upload /></el-icon>
                Choose File
              </el-button>
            </template>
          </el-upload>
          <span v-if="!newImage.imagePath" class="text-grey ml-2">No file chosen</span>
          <span v-else class="text-grey ml-2">{{ newImage.imagePath }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddImageDialog">Cancel</el-button>
          <el-button type="primary" @click="addNewImage">Add Image</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Add Content Dialog -->
    <el-dialog
      v-model="addContentDialogVisible"
      title="Add New Content"
      width="500px"
      @close="closeAddContentDialog"
    >
      <div class="edit-dialog-content">
        <div class="form-group">
          <label>Title:</label>
          <el-input
            v-model="newContent.title"
            placeholder="Enter content title"
            style="margin-top: 8px;"
          ></el-input>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Text:</label>
          <el-input
            v-model="newContent.text"
            type="textarea"
            :rows="4"
            placeholder="Enter content text"
            style="margin-top: 8px;"
          ></el-input>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddContentDialog">Cancel</el-button>
          <el-button type="primary" @click="addNewContent">Add Content</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Add Button Dialog -->
    <el-dialog
      v-model="addButtonDialogVisible"
      title="Add New Button"
      width="500px"
      @close="closeAddButtonDialog"
    >
      <div class="edit-dialog-content">
        <div class="form-group">
          <label>Button Text:</label>
          <el-input
            v-model="newButton.text"
            placeholder="Enter button text"
            style="margin-top: 8px;"
          ></el-input>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Button Route:</label>
          <el-input
            v-model="newButton.route"
            placeholder="Route (e.g., /services/water-baptism)"
            style="margin-top: 8px;"
          ></el-input>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Button Color:</label>
          <el-color-picker
            v-model="newButton.color"
            size="small"
            style="margin-top: 8px;"
          ></el-color-picker>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddButtonDialog">Cancel</el-button>
          <el-button type="primary" @click="addNewButton">Add Button</el-button>
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
  acceptJesusData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'acceptJesus'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('acceptjesus')

// Default data structure based on images
const defaultAcceptJesusData = {
  images: [],
  contentSections: [
    { title: 'Accept Jesus Christ', text: '' },
    { title: 'What does it mean to accept Jesus?', text: '' },
    { title: 'Join Our Worship Services', text: '' },
    { title: 'Sunday Services', text: '' },
    { title: 'Wednesday Prayer', text: '' },
    { title: 'Special Events', text: '' }
  ],
  buttons: [
    { text: 'Next: Water Baptism', color: '#14b8a6', route: '/services/water-baptism' }
  ]
}

// Create reactive copy of prop data or use default
const createReactiveCopy = (data) => {
  if (!data) return reactive(JSON.parse(JSON.stringify(defaultAcceptJesusData)))
  const cloned = JSON.parse(JSON.stringify(data))
  // Ensure arrays are reactive
  if (cloned.images && Array.isArray(cloned.images)) {
    cloned.images = cloned.images.map(img => ({ ...img }))
  }
  if (cloned.contentSections && Array.isArray(cloned.contentSections)) {
    cloned.contentSections = cloned.contentSections.map(section => ({ ...section }))
  }
  if (cloned.buttons && Array.isArray(cloned.buttons)) {
    cloned.buttons = cloned.buttons.map(btn => ({ ...btn }))
  }
  return reactive(cloned)
}

const acceptJesusData = props.acceptJesusData
  ? createReactiveCopy(props.acceptJesusData)
  : reactive(JSON.parse(JSON.stringify(defaultAcceptJesusData)))

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'acceptJesus') {
    const loadedData = await loadPageData()
    if (loadedData) {
      console.log('Loaded CMS data:', loadedData)
      console.log('Images in loaded data:', loadedData.images)
      
      // Handle images array - images are stored in content.images but base64 is extracted
      // The composable merges them back using setNestedProperty, so images[0].image contains base64
      if (loadedData.images && Array.isArray(loadedData.images) && loadedData.images.length > 0) {
        console.log('Processing images array with', loadedData.images.length, 'items')
        acceptJesusData.images = loadedData.images.map((img, index) => {
          // After composable merges, img should be an object with .image property containing base64
          if (img && typeof img === 'object') {
            // Check if image property exists (merged by composable)
            const base64Image = img.image || ''
            const result = {
              image: base64Image, // Base64 image merged back by composable
              imagePath: img.imagePath || `image-${index + 1}`
            }
            console.log(`Image ${index + 1}:`, { hasImage: !!base64Image, imagePath: result.imagePath })
            return result
          }
          // If image is a base64 string directly (shouldn't happen after merge, but handle it)
          if (typeof img === 'string' && img.startsWith('data:image/')) {
            console.log(`Image ${index + 1}: base64 string directly`)
            return { image: img, imagePath: `image-${index + 1}` }
          }
          // Fallback - no image
          console.log(`Image ${index + 1}: no image data`)
          return { image: '', imagePath: `image-${index + 1}` }
        })
        console.log('Final images array:', acceptJesusData.images.length, 'items')
      } else {
        // No images in loaded data, initialize empty array
        console.log('No images found in loaded data')
        acceptJesusData.images = []
      }
      
      // Handle content sections
      if (loadedData.contentSections && Array.isArray(loadedData.contentSections)) {
        acceptJesusData.contentSections = loadedData.contentSections.map(section => ({
          title: section.title || '',
          text: section.text || ''
        }))
      } else {
        // Keep default content sections if none loaded
        if (acceptJesusData.contentSections.length === 0) {
          acceptJesusData.contentSections = defaultAcceptJesusData.contentSections.map(s => ({ ...s }))
        }
      }
      
      // Handle buttons - ensure route field exists
      if (loadedData.buttons && Array.isArray(loadedData.buttons)) {
        acceptJesusData.buttons = loadedData.buttons.map(btn => ({
          text: btn.text || '',
          color: btn.color || '#00bcd4',
          route: btn.route || '/services/water-baptism' // Default route
        }))
      } else {
        // Keep default button if none loaded
        if (acceptJesusData.buttons.length === 0) {
          acceptJesusData.buttons = defaultAcceptJesusData.buttons.map(b => ({ ...b, route: '/services/water-baptism' }))
        }
      }
      
      // Handle other properties
      Object.keys(loadedData).forEach(key => {
        if (!['images', 'contentSections', 'buttons'].includes(key)) {
          acceptJesusData[key] = loadedData[key]
        }
      })
    }
  }
})

// Watch for prop changes
watch(() => props.acceptJesusData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    if (cloned.images && Array.isArray(cloned.images)) {
      acceptJesusData.images = cloned.images.map(img => ({ ...img }))
    }
    if (cloned.contentSections && Array.isArray(cloned.contentSections)) {
      acceptJesusData.contentSections = cloned.contentSections.map(section => ({ ...section }))
    }
    if (cloned.buttons && Array.isArray(cloned.buttons)) {
      acceptJesusData.buttons = cloned.buttons.map(btn => ({ ...btn }))
    }
    Object.keys(cloned).forEach(key => {
      if (!['images', 'contentSections', 'buttons'].includes(key)) {
        acceptJesusData[key] = cloned[key]
      }
    })
  }
}, { deep: true })

// Dialog states
const addImageDialogVisible = ref(false)
const addContentDialogVisible = ref(false)
const addButtonDialogVisible = ref(false)

const newImage = reactive({
  image: '',
  imagePath: ''
})

const newContent = reactive({
  title: '',
  text: ''
})

const newButton = reactive({
  text: '',
  color: '#00bcd4',
  route: '/services/water-baptism'
})

// Handle image change
const handleImageChange = (file, index) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    acceptJesusData.images[index].image = e.target.result
    acceptJesusData.images[index].imagePath = fileObj.name
  }
  reader.readAsDataURL(fileObj)
}

// Handle new image change
const handleNewImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    newImage.image = e.target.result
    newImage.imagePath = fileObj.name
  }
  reader.readAsDataURL(fileObj)
}

// Show dialogs
const showAddImageDialog = () => {
  addImageDialogVisible.value = true
}

const showAddContentDialog = () => {
  addContentDialogVisible.value = true
}

const showAddButtonDialog = () => {
  addButtonDialogVisible.value = true
}

// Close dialogs
const closeAddImageDialog = () => {
  addImageDialogVisible.value = false
  newImage.image = ''
  newImage.imagePath = ''
}

const closeAddContentDialog = () => {
  addContentDialogVisible.value = false
  newContent.title = ''
  newContent.text = ''
}

const closeAddButtonDialog = () => {
  addButtonDialogVisible.value = false
  newButton.text = ''
  newButton.color = '#00bcd4'
  newButton.route = '/services/water-baptism'
}

// Add new items
const addNewImage = () => {
  if (newImage.image) {
    acceptJesusData.images.push({
      image: newImage.image,
      imagePath: newImage.imagePath
    })
    closeAddImageDialog()
  } else {
    // eslint-disable-next-line no-alert
    alert('Please select an image')
  }
}

const addNewContent = () => {
  if (newContent.title.trim()) {
    acceptJesusData.contentSections.push({
      title: newContent.title.trim(),
      text: newContent.text.trim()
    })
    closeAddContentDialog()
  } else {
    // eslint-disable-next-line no-alert
    alert('Please enter a content title')
  }
}

const addNewButton = () => {
  if (newButton.text.trim()) {
    acceptJesusData.buttons.push({
      text: newButton.text.trim(),
      color: newButton.color,
      route: newButton.route || '/services/water-baptism'
    })
    closeAddButtonDialog()
  } else {
    // eslint-disable-next-line no-alert
    alert('Please enter button text')
  }
}

// Delete items
const deleteImage = (index) => {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this image?')) {
    acceptJesusData.images.splice(index, 1)
  }
}

const deleteContent = (index) => {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this content section?')) {
    acceptJesusData.contentSections.splice(index, 1)
  }
}

const deleteButton = (index) => {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this button?')) {
    acceptJesusData.buttons.splice(index, 1)
  }
}

// Save changes to CMS
// Images are saved as BLOB in database (not in JSON)
// Flow: base64 → composable extracts → backend converts to Buffer → saves as BLOB in tbl_cms_images
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    console.log('💾 Saving AcceptJesus data...')
    console.log('Images count:', acceptJesusData.images.length)
    acceptJesusData.images.forEach((img, idx) => {
      console.log(`Image ${idx + 1}:`, {
        hasImage: !!img.image,
        isBase64: img.image && img.image.startsWith('data:image/'),
        imageLength: img.image ? img.image.length : 0,
        imagePath: img.imagePath
      })
    })
    
    // Create content structure with base64 images included
    // The composable's extractImagesFromContent will automatically extract them
    // Important: Keep the array structure even for empty images so positions are maintained
    const contentToSave = {
      images: acceptJesusData.images.length > 0 
        ? acceptJesusData.images.map((img, index) => {
            // Keep base64 in content - composable will extract it to images['images[0].image']
            // Backend will convert base64 to Buffer and save as BLOB
            const imageData = {
              image: img.image || '', // Base64 image - will be extracted by composable and saved as BLOB
              imagePath: img.imagePath || `image-${index + 1}`
            }
            
            // Log for debugging
            if (img.image && img.image.startsWith('data:image/')) {
              console.log(`✅ Image ${index + 1} will be saved as BLOB (base64 length: ${img.image.length})`)
            } else if (img.image) {
              console.warn(`⚠️ Image ${index + 1} is not a valid base64 data URL`)
            } else {
              console.log(`ℹ️ Image ${index + 1} is empty (will be skipped)`)
            }
            
            return imageData
          })
        : [], // Empty array if no images
      contentSections: acceptJesusData.contentSections.map(section => ({
        title: section.title || '',
        text: section.text || ''
      })),
      buttons: acceptJesusData.buttons.map(btn => ({
        text: btn.text || '',
        color: btn.color || '#00bcd4',
        route: btn.route || '/services/water-baptism'
      }))
    }
    
    // Count how many images have base64 data
    const imagesWithData = contentToSave.images.filter(img => img.image && img.image.startsWith('data:image/')).length
    console.log(`📊 Summary: ${imagesWithData} images with base64 data will be saved as BLOB`)
    console.log('Content structure:', {
      imagesCount: contentToSave.images.length,
      contentSectionsCount: contentToSave.contentSections.length,
      buttonsCount: contentToSave.buttons.length
    })
    
    // Save to CMS - the composable will automatically extract base64 images
    // Flow: 
    // 1. Composable extracts base64 from content.images[0].image → images['images[0].image'] = base64
    // 2. Backend receives base64 → converts to Buffer using base64ToBuffer()
    // 3. Backend saves Buffer as BLOB in tbl_cms_images table (field_name = 'images[0].image')
    // 4. Content JSON saved without base64 (base64 removed by composable)
    console.log('📤 Sending to CMS (base64 will be converted to BLOB)...')
    const success = await savePageData(contentToSave, {})
    
    if (success) {
      console.log('✅ Save successful! Images saved as BLOB in database.')
      // Reload data to get updated version with proper image structure
      const loadedData = await loadPageData(true) // Force refresh
      console.log('🔄 Reloaded data after save:', {
        hasImages: !!loadedData?.images,
        imagesCount: loadedData?.images?.length || 0
      })
      
      if (loadedData) {
        // Reconstruct images array - images should be merged back by composable
        if (loadedData.images && Array.isArray(loadedData.images) && loadedData.images.length > 0) {
          acceptJesusData.images = loadedData.images.map((img, index) => {
            // After composable merges, img should be an object with .image property
            if (img && typeof img === 'object') {
              return {
                image: img.image || '', // Base64 image merged back by composable
                imagePath: img.imagePath || `image-${index + 1}`
              }
            }
            // Fallback
            return { image: '', imagePath: `image-${index + 1}` }
          })
        } else {
          // If no images after reload, keep what we have (they might have been saved)
          console.log('No images in reloaded data, keeping current images')
        }
        
        // Update content sections
        if (loadedData.contentSections && Array.isArray(loadedData.contentSections)) {
          acceptJesusData.contentSections = loadedData.contentSections.map(section => ({
            title: section.title || '',
            text: section.text || ''
          }))
        }
        
        // Update buttons with route
        if (loadedData.buttons && Array.isArray(loadedData.buttons)) {
          acceptJesusData.buttons = loadedData.buttons.map(btn => ({
            text: btn.text || '',
            color: btn.color || '#00bcd4',
            route: btn.route || '/services/water-baptism'
          }))
        }
      }
    }
  } catch (error) {
    console.error('Error saving accept Jesus page:', error)
  }
}
</script>

<style scoped>
.accept-jesus-list {
  width: 100%;
  padding-bottom: 80px;
}

.list-item {
  display: flex;
  align-items: flex-start;
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
  flex-direction: column;
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

.empty-preview {
  width: 300px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background: #fafafa;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

/* Section Styles */
.images-section,
.content-sections,
.buttons-section {
  width: 100%;
  margin-top: 24px;
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

.images-container,
.content-container,
.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 0;
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

