<template>
  <div class="landing-page">
    <!-- Loading overlay for sequential CMS data loading -->
    <v-overlay :model-value="isLoadingCmsData" contained class="align-center justify-center" style="z-index: 10000;">
      <div class="text-center">
        <v-progress-circular 
          :model-value="loadingProgress.total > 0 ? (loadingProgress.current / loadingProgress.total) * 100 : 0"
          color="primary" 
          size="64" 
          width="6"
          class="mb-4"
        >
          <span class="text-caption">{{ loadingProgress.current }}/{{ loadingProgress.total }}</span>
        </v-progress-circular>
        <p class="text-white text-h6">{{ loadingMessage }}</p>
        <p class="text-white text-caption mt-2">
          Loading CMS data sequentially to reduce server load...
        </p>
      </div>
    </v-overlay>
    <v-main>
      <HeroSection />
      <BeliefsSection />
      <ServicesSection />
      <VisionSection />
      <DepartmentCategories />
      <EventsSection />
      <PastEventsSection />
    </v-main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navigation from '../components/LandingPage/Navigation.vue'
import HeroSection from '../components/LandingPage/HeroSection.vue'
import BeliefsSection from '../components/LandingPage/BeliefsSection.vue'
import ServicesSection from '../components/LandingPage/ServicesSection.vue'
import VisionSection from '../components/LandingPage/VisionSection.vue'
import DepartmentCategories from '../components/LandingPage/DepartmentCategories.vue'
import EventsSection from '../components/LandingPage/EventsSection.vue'
import PastEventsSection from '../components/LandingPage/PastEventsSection.vue'
import Footer from '../components/LandingPage/Footer.vue'
import SocialMediaIcons from '../components/LandingPage/SocialMediaIcons.vue'
import { fetchCmsPagesSequentially, CORE_CMS_PAGES } from '@/utils/cmsSequentialLoader'

const isLoadingCmsData = ref(false)
const loadingMessage = ref('Loading page data...')
const loadingProgress = ref({ current: 0, total: 0 })

/**
 * Sequentially fetch only the core CMS pages needed for the landing page
 * (footer, home, header)
 * Other CMS pages will be loaded when their respective pages are opened
 */
const fetchCmsDataSequentially = async () => {
  isLoadingCmsData.value = true
  loadingProgress.value.total = CORE_CMS_PAGES.length
  loadingProgress.value.current = 0
  
  try {
    console.log(`🚀 Loading core CMS pages for landing page: ${CORE_CMS_PAGES.join(', ')}`)
    
    const results = await fetchCmsPagesSequentially(CORE_CMS_PAGES, {
      useStore: true,
      forceRefresh: false,
      delayMs: 500, // 500ms delay between each request to prevent MySQL errors
      onProgress: (pageName, current, total) => {
        loadingProgress.value.current = current
        loadingProgress.value.total = total
        loadingMessage.value = `Loading ${pageName} data... (${current}/${total})`
        console.log(`📊 Progress: ${current}/${total} - ${pageName}`)
      }
    })
    
    const successCount = Object.values(results).filter(r => r.success).length
    const failedCount = Object.values(results).filter(r => !r.success).length
    
    console.log(`✅ Core CMS data loading complete!`)
    console.log(`   ✅ Successful: ${successCount}/${CORE_CMS_PAGES.length}`)
    if (failedCount > 0) {
      console.log(`   ⚠️  Failed/Not Found: ${failedCount}/${CORE_CMS_PAGES.length}`)
    }
    
    // Log which pages were successfully loaded
    const successfulPages = Object.keys(results).filter(key => results[key].success)
    console.log(`   📄 Loaded pages: ${successfulPages.join(', ')}`)
    console.log(`   💡 Other CMS pages will load when their pages are opened`)
    
  } catch (error) {
    console.error('❌ Error loading CMS data sequentially:', error)
    // Continue anyway - components will use default/fallback data
  } finally {
    isLoadingCmsData.value = false
    loadingMessage.value = 'Loading page data...'
  }
}

// Load CMS data sequentially when component mounts
onMounted(async () => {
  await fetchCmsDataSequentially()
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
}
</style>
