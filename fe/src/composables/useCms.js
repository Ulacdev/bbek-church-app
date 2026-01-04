import { ref, computed } from 'vue'
import axios from '@/api/axios'
import { ElMessage } from 'element-plus'
import { useCmsStore } from '@/stores/cmsStore'

/**
 * Composable for CMS operations
 * Uses the shared CMS store for caching and request deduplication
 * @param {String} pageName - The page name (e.g., 'home', 'about', 'header')
 */
export function useCms(pageName) {
  const cmsStore = useCmsStore()
  const saving = ref(false)
  const pageData = ref(null)

  // Get loading state from store
  const loading = computed(() => cmsStore.isPageLoading(pageName))

  /**
   * Load page data with images from CMS
   * Uses the shared CMS store to prevent duplicate requests
   */
  const loadPageData = async (forceRefresh = false) => {
    if (!pageName) {
      console.error('Page name is required')
      return null
    }

    try {
      // Fetch from shared store (handles caching and deduplication)
      const cmsData = await cmsStore.fetchPageData(pageName, forceRefresh)
      
      if (cmsData) {
        const { page, images } = cmsData
        
        // Merge images into content
        let content = page?.content || {}
        
        // Replace image placeholders with actual base64 images
        if (images) {
          Object.keys(images).forEach(fieldName => {
            if (images[fieldName]) {
              // Set image in content
              setNestedProperty(content, fieldName, images[fieldName])
            }
          })
        }
        
        pageData.value = content
        return content
      } else {
        ElMessage.warning('No data found')
        return null
      }
    } catch (error) {
      console.error(`Error loading CMS page ${pageName}:`, error)
      // Don't show error if it's just "not found" - that's expected for new pages
      if (error.response?.status !== 404) {
        ElMessage.error('Failed to load page data')
      }
      return null
    }
  }

  /**
   * Save page data to CMS
   * Clears cache after saving to ensure fresh data on next fetch
   * @param {Object} content - The content data to save
   * @param {Object} images - Object with field names as keys and base64 images as values
   */
  const savePageData = async (content, images = {}) => {
    if (!pageName) {
      ElMessage.error('Page name is required')
      return false
    }

    saving.value = true
    try {
      // Separate images from content
      const contentWithoutImages = { ...content }
      const imagesToSave = { ...images }

      // Extract images from content and add to imagesToSave
      extractImagesFromContent(contentWithoutImages, imagesToSave)

      // Save page with images
      const response = await axios.post(`/cms/${pageName}/save`, {
        content: contentWithoutImages,
        images: imagesToSave
      })

      if (response.data.success) {
        // Clear cache for this page so next fetch gets fresh data
        cmsStore.clearCache(pageName)
        
        ElMessage.success('Page saved successfully!')
        return true
      } else {
        ElMessage.error(response.data.message || 'Failed to save page')
        return false
      }
    } catch (error) {
      console.error(`Error saving CMS page ${pageName}:`, error)
      ElMessage.error(error.response?.data?.error || 'Failed to save page')
      return false
    } finally {
      saving.value = false
    }
  }

  /**
   * Helper to set nested property in object
   * Supports both dot notation (e.g., "services.0.image") and bracket notation (e.g., "services[0].image")
   */
  const setNestedProperty = (obj, path, value) => {
    // Normalize path: convert bracket notation to dot notation
    // e.g., "services[0].image" -> "services.0.image"
    const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1')
    const keys = normalizedPath.split('.')
    let current = obj
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      const nextKey = keys[i + 1]
      
      // Check if next key is a number (array index)
      const isArrayIndex = !isNaN(parseInt(nextKey))
      
      if (isArrayIndex) {
        // We're dealing with an array
        if (!Array.isArray(current[key])) {
          current[key] = []
        }
        // Ensure array is large enough
        const index = parseInt(nextKey)
        while (current[key].length <= index) {
          current[key].push({})
        }
        current = current[key][index]
        i++ // Skip the next iteration since we already processed it
      } else {
        // We're dealing with an object
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {}
        }
        current = current[key]
      }
    }
    
    // Set the final value
    const finalKey = keys[keys.length - 1]
    current[finalKey] = value
  }

  /**
   * Helper to extract images and videos from content recursively
   */
  const extractImagesFromContent = (content, imagesObj, prefix = '') => {
    if (!content || typeof content !== 'object') return

    Object.keys(content).forEach(key => {
      const value = content[key]
      const fieldPath = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'string' && (value.startsWith('data:image/') || value.startsWith('data:video/'))) {
        // This is a base64 image or video
        imagesObj[fieldPath] = value
        // Remove from content (or keep a placeholder)
        delete content[key]
      } else if (Array.isArray(value)) {
        // Handle arrays (e.g., services array)
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            extractImagesFromContent(item, imagesObj, `${fieldPath}[${index}]`)
          }
        })
      } else if (typeof value === 'object' && value !== null) {
        // Recursively process nested objects
        extractImagesFromContent(value, imagesObj, fieldPath)
      }
    })
  }

  /**
   * Convert file to base64
   */
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsDataURL(file)
    })
  }

  return {
    loading,
    saving,
    pageData,
    loadPageData,
    savePageData,
    fileToBase64
  }
}

