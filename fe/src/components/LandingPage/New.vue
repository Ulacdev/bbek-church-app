<template>
  <div class="new-page" style="position: relative;">
    <!-- Loading overlay -->
    <v-overlay :model-value="isLoadingImNew" contained class="align-center justify-center" style="z-index: 1000;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-overlay>
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div
        class="hero-background"
        :style="{ backgroundImage: `url(${imNewData.heroBackgroundImage || '/img/comm.jpg'})` }"
      ></div>
      <div class="hero-overlay-gradient"></div>
      
      <!-- Floating Elements -->
      <div class="floating-elements">
        <div
          v-for="(element, index) in floatingElements"
          :key="index"
          class="floating-element"
          :style="element.style"
        ></div>
      </div>

      <div class="hero-content-wrapper">
        <h1 class="hero-title">{{ imNewData.heroTitle }}</h1>
        <p class="hero-subtitle">
          {{ imNewData.heroSubtitle }}
        </p>
        <div class="hero-buttons">
          <v-btn
            :style="{ backgroundColor: imNewData.planVisitButtonColor, borderColor: imNewData.planVisitButtonColor }"
            variant="outlined"
            class="text-white"
            size="large"
            rounded
            @click="$router.push('/plan-your-visit')"
          >
            {{ imNewData.planVisitButtonText }}
          </v-btn>
          <v-btn
            :style="{ backgroundColor: imNewData.learnMoreButtonColor, borderColor: imNewData.learnMoreButtonColor }"
            variant="outlined"
            class="text-white"
            size="large"
            rounded
            @click="$router.push('/about')"
          >
            {{ imNewData.learnMoreButtonText }}
          </v-btn>
        </div>
      </div>
    </section>

    <!-- Ministry Showcase Section -->
    <section class="ministry-section py-20">
      <v-container>
        <div class="text-center mb-16">
          <h2 class="text-h3 text-md-h4 font-weight-bold text-grey-darken-3 mb-4 fade-in-up">
            {{ imNewData.ministriesTitle }}
          </h2>
          <p class="text-h6 text-grey-darken-1 max-width-2xl mx-auto fade-in-up-delay">
            {{ imNewData.ministriesSubtitle }}
          </p>
        </div>

        <v-row>
          <v-col
            v-for="(ministry, index) in ministries"
            :key="index"
            cols="12"
            md="4"
          >
            <v-card
              :class="`ministry-card ministry-card-${index + 1}`"
              elevation="2"
              @click="openSlideshow(ministry.images, 0, ministry.title)"
            >
              <div class="ministry-image-container">
                <v-img
                  :src="ministry.images[ministry.currentIndex]"
                  :alt="ministry.title"
                  cover
                  height="400"
                  class="ministry-image"
                >
                  <div class="image-overlay">
                    <v-icon size="48" color="white">mdi-magnify-plus</v-icon>
                  </div>
                  <div class="image-indicators">
                    <div
                      v-for="(img, idx) in ministry.images"
                      :key="idx"
                      class="indicator"
                      :class="{ active: idx === ministry.currentIndex }"
                    ></div>
                  </div>
                </v-img>
              </div>
              <v-card-text>
                <h3 class="text-h6 font-weight-bold mb-3">{{ ministry.title }}</h3>
                <p class="text-body-2 text-grey-darken-1">
                  {{ ministry.description }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Baptism FAQ Section -->
    <section class="faq-section py-20 bg-grey-lighten-5">
      <v-container>
        <div class="text-center mb-16">
          <h2 class="text-h3 text-md-h4 font-weight-bold text-grey-darken-3 mb-4 fade-in-up">
            {{ imNewData.baptismFAQTitle }}
          </h2>
          <p class="text-h6 text-grey-darken-1 max-width-3xl mx-auto fade-in-up-delay">
            {{ imNewData.baptismFAQSubtitle }}
          </p>
        </div>

        <div class="max-width-4xl mx-auto">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel
              v-for="(faq, index) in baptismFAQs"
              :key="index"
              class="mb-2"
            >
              <v-expansion-panel-title>
                <span class="text-h6 font-weight-medium">{{ faq.question }}</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="text-body-1">{{ faq.answer }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-container>
    </section>

    <!-- Baptism Preparation Guide -->
    <section class="preparation-section py-20">
      <v-container>
        <div class="text-center mb-16">
          <h2 class="text-h3 text-md-h4 font-weight-bold text-grey-darken-3 mb-4 fade-in-up">
            {{ imNewData.baptismPrepTitle }}
          </h2>
          <p class="text-h6 text-grey-darken-1 max-width-3xl mx-auto fade-in-up-delay">
            {{ imNewData.baptismPrepSubtitle }}
          </p>
        </div>

        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-h5 font-weight-bold mb-6">Spiritual Preparation</h3>
            <div class="space-y-4">
              <v-card
                v-for="(item, index) in baptismPreparation.spiritual"
                :key="index"
                class="mb-4"
                variant="flat"
                color="teal-lighten-5"
              >
                <v-card-text>
                  <h4 class="text-h6 font-weight-semibold text-teal-darken-3 mb-2">
                    {{ item.title }}
                  </h4>
                  <p class="text-teal-darken-2">{{ item.description }}</p>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <h3 class="text-h5 font-weight-bold mb-6">Practical Preparation</h3>
            <div class="space-y-4">
              <v-card
                v-for="(item, index) in baptismPreparation.practical"
                :key="index"
                class="mb-4"
                variant="flat"
                color="teal-lighten-5"
              >
                <v-card-text>
                  <h4 class="text-h6 font-weight-semibold text-teal-darken-3 mb-2">
                    {{ item.title }}
                  </h4>
                  <p class="text-teal-darken-2">{{ item.description }}</p>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Slideshow Dialog -->
    <v-dialog
      v-model="slideshowOpen"
      fullscreen
      transition="dialog-bottom-transition"
      @click:outside="closeSlideshow"
    >
      <v-card color="black" class="slideshow-card">
        <v-btn
          icon
          variant="text"
          color="white"
          size="large"
          class="close-btn"
          @click="closeSlideshow"
        >
          <v-icon size="32">mdi-close</v-icon>
        </v-btn>
        <div v-if="slideshowData" class="slideshow-image-container">
          <v-img
            :src="slideshowData.images[slideshowData.currentIndex]"
            :alt="slideshowData.title"
            max-height="90vh"
            max-width="90vw"
            contain
            class="slideshow-image"
          ></v-img>
        </div>
        <v-btn
          v-if="slideshowData && slideshowData.images.length > 1"
          icon
          variant="text"
          color="white"
          class="nav-btn prev-btn"
          @click="prevImage"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          v-if="slideshowData && slideshowData.images.length > 1"
          icon
          variant="text"
          color="white"
          class="nav-btn next-btn"
          @click="nextImage"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from '@/api/axios'
const youthImages = [
  "/img/CHILDREN MINISTRY/436905801_7470232089728143_2350588810580647802_n.jpg",
  "/img/CHILDREN MINISTRY/438203864_2766158940200706_450215752701856802_n.jpg",
  "/img/CHILDREN MINISTRY/438223341_804322291570715_2512388097571005173_n.jpg",
  "/img/CHILDREN MINISTRY/439311038_756015450034535_2769396890444065022_n.jpg",
  "/img/CHILDREN MINISTRY/439344248_856483246202579_1353390949888500442_n.jpg",
  "/img/CHILDREN MINISTRY/439352864_975978340582926_3103111409827237789_n.jpg",
  "/img/CHILDREN MINISTRY/480913749_2154533405062033_2452182531715777334_n.jpg",
  "/img/CHILDREN MINISTRY/480941832_2154533888395318_3923278631858118060_n.jpg",
]

const menImages = [
  "/img/Street Preaching-Evangelism/438203942_1607246523394267_2180404566761606927_n.jpg",
  "/img/Street Preaching-Evangelism/439300551_1121843109052400_1059057811564347656_n.jpg",
  "/img/Street Preaching-Evangelism/439335961_942646994065661_3016684866085491924_n.jpg",
  "/img/Street Preaching-Evangelism/439335967_422949950466504_3643748450813015941_n.jpg",
  "/img/Street Preaching-Evangelism/439357174_977699080739749_472611322960890727_n.jpg",
  "/img/Street Preaching-Evangelism/439384496_3793148450961987_1834762187283058558_n.jpg",
  "/img/Street Preaching-Evangelism/439598593_825490232957568_4979177557703165911_n.jpg",
]

const ladiesImages = [
  "/img/COUPLES BANQUET & CANTATA/452848603_1974689073046468_1893782447700612494_n.jpg",
  "/img/COUPLES BANQUET & CANTATA/452866394_1974688966379812_3628917363609490669_n.jpg",
  "/img/COUPLES BANQUET & CANTATA/470227927_2090657931449581_5216106312973186398_n.jpg",
  "/img/COUPLES BANQUET & CANTATA/480139484_2131411950707512_6494082557653174571_n.jpg",
  "/img/COUPLES BANQUET & CANTATA/480232393_2131412514040789_6118620766929598526_n.jpg",
  "/img/COUPLES BANQUET & CANTATA/480714573_2131410627374311_190142983979816723_n.jpg",
  "/img/COUPLES BANQUET & CANTATA/481660483_2145146589334048_4863230574829962001_n.jpg",
  "/img/COUPLES BANQUET & CANTATA/482229096_2141665456348828_5913413905829675128_n.jpg",
]

const imNewData = ref({
  heroBackgroundImage: '/img/comm.jpg',
  heroTitle: 'New Here?',
  heroSubtitle: 'Discover what makes Bible Baptist Ekklesia of Kawit a place where faith, family, and community come together.',
  planVisitButtonText: 'Plan Your Visit',
  planVisitButtonColor: 'rgba(255, 255, 255, 0.2)',
  learnMoreButtonText: 'Learn More About Us',
  learnMoreButtonColor: 'rgba(255, 255, 255, 0.2)',
  ministriesTitle: 'Our Ministries',
  ministriesSubtitle: 'Discover the heart of our church through our three core ministries, each designed to nurture faith and build community at different life stages.',
  ministries: [
    {
      title: 'Youth Ministry',
      description: 'Our youth ministry focuses on spiritual growth, leadership development, and building lasting friendships. Through Bible studies, outreach activities, and fellowship events, we help young people discover their purpose and develop a strong foundation in faith.',
      images: youthImages,
      currentIndex: 0
    },
    {
      title: 'Adult Men Ministry',
      description: 'The adult men\'s ministry emphasizes spiritual leadership, mentorship, and brotherhood. We provide opportunities for men to grow in their faith, serve their families, and impact their communities through prayer, Bible study, and service projects.',
      images: menImages,
      currentIndex: 0
    },
    {
      title: 'Adult Ladies Ministry',
      description: 'Our adult women\'s ministry creates a nurturing environment for spiritual growth, fellowship, and service. Through prayer groups, Bible studies, and outreach initiatives, we empower women to deepen their faith and support one another in their walk with Christ.',
      images: ladiesImages,
      currentIndex: 0
    }
  ],
  baptismFAQTitle: 'Baptism FAQ',
  baptismFAQSubtitle: 'Common questions about baptism that first-time visitors often ask. We\'re here to help you understand this important step in your faith journey.',
  baptismFAQs: [],
  baptismPrepTitle: 'Baptism Preparation Guide',
  baptismPrepSubtitle: 'Here\'s everything you need to know to prepare spiritually and practically for your baptism day. We\'re here to support you every step of the way.',
  spiritualPreparation: [],
  practicalPreparation: []
})

const ministries = computed(() => imNewData.value.ministries || [])
const baptismFAQs = computed(() => imNewData.value.baptismFAQs || [])
const baptismPreparation = computed(() => ({
  spiritual: imNewData.value.spiritualPreparation || [],
  practical: imNewData.value.practicalPreparation || []
}))


const floatingElements = ref([
  { style: { top: '40px', left: '40px', width: '56px', height: '56px', animationDelay: '0.5s' } },
  { style: { bottom: '80px', left: '40px', width: '48px', height: '48px', animationDelay: '1.5s' } },
  { style: { top: '50%', left: '50%', width: '40px', height: '40px', animationDelay: '2.5s' } },
  { style: { top: '25%', right: '25%', width: '32px', height: '32px', animationDelay: '1s' } },
  { style: { bottom: '25%', left: '25%', width: '24px', height: '24px', animationDelay: '2s' } },
  { style: { top: '33%', left: '16%', width: '36px', height: '36px', animationDelay: '0.8s' } },
  { style: { bottom: '33%', right: '16%', width: '44px', height: '44px', animationDelay: '2.8s' } }
])

const slideshowOpen = ref(false)
const slideshowData = ref(null)

let imageIntervals = []

const openSlideshow = (images, startIndex, title) => {
  if (!images || images.length === 0) return
  slideshowData.value = {
    images: [...images], // Create a copy to avoid reactivity issues
    currentIndex: Math.max(0, Math.min(startIndex, images.length - 1)),
    title
  }
  slideshowOpen.value = true
}

const closeSlideshow = () => {
  slideshowOpen.value = false
  slideshowData.value = null
}

const nextImage = () => {
  if (slideshowData.value) {
    slideshowData.value.currentIndex = (slideshowData.value.currentIndex + 1) % slideshowData.value.images.length
  }
}

const prevImage = () => {
  if (slideshowData.value) {
    slideshowData.value.currentIndex = slideshowData.value.currentIndex === 0
      ? slideshowData.value.images.length - 1
      : slideshowData.value.currentIndex - 1
  }
}

// Loading state for CMS data
const isLoadingImNew = ref(false)

// Fetch imNew data from CMS
const fetchImNewData = async () => {
  isLoadingImNew.value = true
  try {
    const response = await axios.get('/cms/imnew/full')
    if (response.data.success && response.data.data) {
      const { page, images } = response.data.data
      const content = page?.content || {}
      
      // Update imNew data
      imNewData.value.heroTitle = content.heroTitle || imNewData.value.heroTitle
      imNewData.value.heroSubtitle = content.heroSubtitle || imNewData.value.heroSubtitle
      imNewData.value.planVisitButtonText = content.planVisitButtonText || imNewData.value.planVisitButtonText
      imNewData.value.planVisitButtonColor = content.planVisitButtonColor || imNewData.value.planVisitButtonColor
      imNewData.value.learnMoreButtonText = content.learnMoreButtonText || imNewData.value.learnMoreButtonText
      imNewData.value.learnMoreButtonColor = content.learnMoreButtonColor || imNewData.value.learnMoreButtonColor
      imNewData.value.ministriesTitle = content.ministriesTitle || imNewData.value.ministriesTitle
      imNewData.value.ministriesSubtitle = content.ministriesSubtitle || imNewData.value.ministriesSubtitle
      imNewData.value.baptismFAQTitle = content.baptismFAQTitle || imNewData.value.baptismFAQTitle
      imNewData.value.baptismFAQSubtitle = content.baptismFAQSubtitle || imNewData.value.baptismFAQSubtitle
      imNewData.value.baptismPrepTitle = content.baptismPrepTitle || imNewData.value.baptismPrepTitle
      imNewData.value.baptismPrepSubtitle = content.baptismPrepSubtitle || imNewData.value.baptismPrepSubtitle
      
      // Handle hero background image
      if (images?.heroBackgroundImage) {
        imNewData.value.heroBackgroundImage = images.heroBackgroundImage
      }
      
      // Update ministries array
      if (content.ministries && Array.isArray(content.ministries) && content.ministries.length > 0) {
        content.ministries.forEach((ministry, index) => {
          if (imNewData.value.ministries[index]) {
            imNewData.value.ministries[index].title = ministry.title || imNewData.value.ministries[index].title
            imNewData.value.ministries[index].description = ministry.description || imNewData.value.ministries[index].description
            // Handle ministry images from CMS
            const imageKey = `ministries[${index}].images`
            if (images && Object.keys(images).some(key => key.startsWith(`ministries[${index}].images[`))) {
              // Collect all images for this ministry
              const ministryImages = []
              Object.keys(images).forEach(key => {
                if (key.startsWith(`ministries[${index}].images[`)) {
                  const imgIndex = parseInt(key.match(/\[(\d+)\]$/)?.[1] || '0')
                  ministryImages[imgIndex] = images[key]
                }
              })
              if (ministryImages.length > 0) {
                imNewData.value.ministries[index].images = ministryImages.filter(img => img)
              }
            }
          }
        })
      }
      
      // Update baptism FAQs
      if (content.baptismFAQs && Array.isArray(content.baptismFAQs)) {
        imNewData.value.baptismFAQs = content.baptismFAQs
      }
      
      // Update baptism preparation
      if (content.spiritualPreparation && Array.isArray(content.spiritualPreparation)) {
        imNewData.value.spiritualPreparation = content.spiritualPreparation
      }
      if (content.practicalPreparation && Array.isArray(content.practicalPreparation)) {
        imNewData.value.practicalPreparation = content.practicalPreparation
      }
    }
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error fetching imNew data from CMS:', error)
    }
  } finally {
    isLoadingImNew.value = false
  }
}

onMounted(async () => {
  await fetchImNewData()
  
  // Auto-rotate ministry images
  ministries.value.forEach((ministry, index) => {
    if (ministry.images && ministry.images.length > 0) {
      const interval = setInterval(() => {
        ministry.currentIndex = (ministry.currentIndex + 1) % ministry.images.length
      }, 3000)
      imageIntervals.push(interval)
    }
  })

  // Keyboard navigation for slideshow
  const handleKeyPress = (event) => {
    if (!slideshowOpen.value) return
    switch (event.key) {
      case 'Escape':
        closeSlideshow()
        break
      case 'ArrowLeft':
        prevImage()
        break
      case 'ArrowRight':
        nextImage()
        break
    }
  }
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  imageIntervals.forEach(interval => clearInterval(interval))
})
</script>

<style scoped>
.new-page {
  min-height: 100vh;
  background: white;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: 64px;
}

.hero-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(20, 184, 166, 0.4), rgba(20, 184, 166, 0.2));
}

.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  background: rgba(63, 211, 194, 0.62);
  border-radius: 50%;
  animation: float 3.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.hero-content-wrapper {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 40px;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  font-family: 'Georgia', serif;
  font-style: italic;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Georgia', serif;
  font-style: italic;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.ministry-section {
  background: white;
}

.ministry-card {
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;
}

.ministry-card-1 {
  animation-delay: 200ms;
}

.ministry-card-2 {
  animation-delay: 300ms;
}

.ministry-card-3 {
  animation-delay: 400ms;
}

.ministry-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.ministry-image-container {
  position: relative;
  overflow: hidden;
}

.ministry-image-container :deep(.v-img) {
  transition: transform 0.5s ease;
}

.ministry-card:hover .ministry-image-container :deep(.v-img) {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2;
}

.ministry-card:hover .image-overlay {
  background: rgba(0, 0, 0, 0.4);
}

.ministry-card:hover .image-overlay :deep(.v-icon) {
  transform: scale(1.2);
}

.image-overlay :deep(.v-icon) {
  transition: transform 0.3s ease;
}

.image-indicators {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  z-index: 3;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.faq-section {
  position: relative;
}

.preparation-section {
  background: white;
}

.slideshow-card {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.slideshow-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 100px;
  position: relative;
  z-index: 1;
}

.slideshow-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.close-btn {
  position: absolute !important;
  top: 100px !important;
  right: 24px !important;
  z-index: 10001 !important;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.close-btn:hover {
  transform: rotate(90deg) scale(1.1);
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.close-btn :deep(.v-icon) {
  color: white !important;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  transform: translateY(-50%) scale(1.2);
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.prev-btn {
  left: 24px;
}

.next-btn {
  right: 24px;
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }

  .slideshow-image-container {
    padding: 60px 20px;
  }

  .nav-btn {
    padding: 8px;
  }

  .prev-btn {
    left: 10px;
  }

  .next-btn {
    right: 10px;
  }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.fade-in-up-delay {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

