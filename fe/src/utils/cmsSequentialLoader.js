import axios from '@/api/axios'
import { useCmsStore } from '@/stores/cmsStore'

/**
 * All available CMS page names in the application
 */
export const ALL_CMS_PAGES = [
  'header',
  'home',
  'footer',
  'about',
  'imnew',
  'services',
  'events',
  'give',
  'planvisit',
  'waterbaptism',
  'burialservice',
  'sermons',
  'youngpeople',
  'adultmen',
  'adultladies',
  'learnmoreministry',
  'learnmoreevents',
  'acceptjesus',
  'belief',
  'churchleader',
  'departmentofficer',
  'ourstory'
]

/**
 * Core CMS pages that are loaded on the landing page
 */
export const CORE_CMS_PAGES = [
  'footer',
  'home',
  'header'
]

/**
 * Sequentially fetch multiple CMS pages one after another
 * @param {Array<string>} pageNames - Array of page names to fetch
 * @param {Object} options - Options for fetching
 * @param {boolean} options.useStore - Whether to use cmsStore (default: true)
 * @param {boolean} options.forceRefresh - Force refresh even if cached (default: false)
 * @param {Function} options.onProgress - Callback function called after each page loads (pageName, index, total)
 * @param {number} options.delayMs - Delay in milliseconds between each request (default: 500ms)
 * @returns {Promise<Object>} Object with page names as keys and their data as values
 */
export const fetchCmsPagesSequentially = async (pageNames = [], options = {}) => {
  const {
    useStore = true,
    forceRefresh = false,
    onProgress = null,
    delayMs = 500 // Default 500ms delay between requests
  } = options
  
  const results = {}
  const total = pageNames.length
  const cmsStore = useStore ? useCmsStore() : null
  
  for (let index = 0; index < pageNames.length; index++) {
    const pageName = pageNames[index]
    
    try {
      console.log(`📥 [${index + 1}/${total}] Fetching CMS page: ${pageName}...`)
      
      let pageData = null
      
      if (useStore && cmsStore) {
        // Use store (handles caching automatically)
        pageData = await cmsStore.fetchPageData(pageName, forceRefresh)
        
        if (pageData) {
          results[pageName] = {
            success: true,
            data: {
              page: pageData.page,
              images: pageData.images
            },
            page: pageData.page,
            images: pageData.images,
            content: pageData.content || {}
          }
          console.log(`✅ [${index + 1}/${total}] Successfully loaded: ${pageName}`)
        } else {
          results[pageName] = {
            success: false,
            data: null,
            error: 'No data returned'
          }
          console.warn(`⚠️ [${index + 1}/${total}] No data for: ${pageName}`)
        }
      } else {
        // Direct axios call
        const response = await axios.get(`/cms/${pageName}/full`)
        
        if (response.data.success && response.data.data) {
          const { page, images } = response.data.data
          
          results[pageName] = {
            success: true,
            data: response.data.data,
            page,
            images,
            content: page?.content || {}
          }
          
          // Cache in store if available
          if (cmsStore) {
            cmsStore.pageCache[pageName] = {
              page,
              images,
              content: page?.content || {}
            }
          }
          
          console.log(`✅ [${index + 1}/${total}] Successfully loaded: ${pageName}`)
        } else {
          results[pageName] = {
            success: false,
            data: null,
            error: 'No data returned'
          }
          console.warn(`⚠️ [${index + 1}/${total}] No data for: ${pageName}`)
        }
      }
      
      // Call progress callback if provided
      if (onProgress) {
        onProgress(pageName, index + 1, total)
      }
      
      // Add delay before next request (except for the last one) to prevent MySQL errors
      if (index < pageNames.length - 1 && delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
      
    } catch (error) {
      // Handle 404 gracefully (page doesn't exist yet)
      if (error.response?.status === 404) {
        results[pageName] = {
          success: false,
          data: null,
          error: 'Page not found'
        }
        console.warn(`⚠️ [${index + 1}/${total}] Page not found: ${pageName}`)
      } else {
        results[pageName] = {
          success: false,
          data: null,
          error: error.message
        }
        console.error(`❌ [${index + 1}/${total}] Error fetching ${pageName}:`, error)
      }
      
      // Call progress callback even on error
      if (onProgress) {
        onProgress(pageName, index + 1, total, error)
      }
      
      // Add delay before next request even on error (except for the last one)
      if (index < pageNames.length - 1 && delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }
  
  return results
}

/**
 * Fetch footer, home, and header CMS data sequentially
 * @returns {Promise<Object>} Object with footer, home, and header data
 */
export const fetchFooterHomeHeaderSequentially = async () => {
  return await fetchCmsPagesSequentially(CORE_CMS_PAGES)
}

/**
 * Fetch ALL CMS pages sequentially
 * @param {Object} options - Options for fetching
 * @returns {Promise<Object>} Object with all CMS page data
 */
export const fetchAllCmsPagesSequentially = async (options = {}) => {
  return await fetchCmsPagesSequentially(ALL_CMS_PAGES, options)
}

