<template>
  <div class="officers-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div
        class="hero-background"
        :style="{ backgroundImage: `url(${officersData.heroImage || getImageUrl('/img/officers.webp')})` }"
        @error="handleHeroImageError"
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
        <h1 class="hero-title fade-in-up">{{ officersData.heroTitle || 'Department Officers' }}</h1>
        <p class="hero-subtitle fade-in-up-delay">{{ officersData.heroSubtitle || 'Bible Baptist Ekklesia of Kawit' }}</p>
      </div>
    </section>

    <!-- Officers Content -->
    <section class="py-12 md:py-24">
      <v-container>
        <div
          v-for="(dept, deptIndex) in departmentsData"
          :key="deptIndex"
          class="mb-16"
        >
          <h2 class="text-h4 font-weight-bold text-center mb-8">
            {{ dept.name }}
          </h2>
          <v-row>
            <v-col
              v-for="(officer, index) in dept.officers"
              :key="index"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card class="text-center pa-6" elevation="2" hover>
                <v-avatar size="120" class="mb-4">
                  <v-img
                    :src="officer.image && officer.image.startsWith('data:') ? officer.image : getImageUrl(officer.image)"
                    :alt="officer.name"
                    cover
                  ></v-img>
                </v-avatar>
                <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">
                  {{ officer.name }}
                </h3>
                <p class="text-body-2 text-teal font-weight-semibold">
                  {{ officer.role }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div class="text-center mt-12">
          <v-btn
            variant="outlined"
            :color="officersData.backButtonColor || '#14b8a6'"
            size="large"
            @click="$router.push('/about')"
          >
            {{ officersData.backButtonText || 'Back to About' }}
          </v-btn>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/api/axios'

const getImageUrl = (imagePath) => {
  const parts = imagePath.split('/')
  const filename = parts.pop()
  const encodedFilename = encodeURIComponent(filename)
  return parts.join('/') + '/' + encodedFilename
}

const handleHeroImageError = (event) => {
  const target = event.target || event.currentTarget
  if (target) {
    target.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
}

const floatingElements = ref([
  { style: { top: '40px', left: '40px', width: '64px', height: '64px', animationDelay: '0s' } },
  { style: { top: '80px', right: '80px', width: '48px', height: '48px', animationDelay: '1s' } },
  { style: { bottom: '80px', left: '80px', width: '56px', height: '56px', animationDelay: '2s' } },
  { style: { bottom: '40px', right: '40px', width: '40px', height: '40px', animationDelay: '0.5s' } },
  { style: { top: '50%', left: '33%', width: '32px', height: '32px', animationDelay: '1.5s' } },
  { style: { top: '25%', left: '25%', width: '24px', height: '24px', animationDelay: '0.8s' } },
  { style: { bottom: '33%', left: '50%', width: '36px', height: '36px', animationDelay: '2.2s' } },
  { style: { top: '75%', left: '40px', width: '20px', height: '20px', animationDelay: '1.8s' } },
  { style: { bottom: '25%', right: '25%', width: '28px', height: '28px', animationDelay: '0.3s' } },
  { style: { top: '33%', right: '40px', width: '44px', height: '44px', animationDelay: '2.8s' } },
  { style: { top: '50%', right: '33%', width: '16px', height: '16px', animationDelay: '1.1s' } },
  { style: { bottom: '50%', left: '25%', width: '52px', height: '52px', animationDelay: '0.9s' } }
])

const defaultDepartments = [
  {
    name: "Adult Ladies Department",
    officers: [
      { name: "Sis. Danica Aldousari", role: "President/Coordinator", image: "/img/officers/adult_ladies_president.png" },
      { name: "Sis. Melody Bilog", role: "Vice President", image: "/img/officers/adult_ladies_vice_president.png" },
      { name: "Sis. Espie Apelado", role: "Secretary", image: "/img/officers/adult_ladies_secretary.png" },
      { name: "Sis. Nancy Belleza", role: "Treasurer", image: "/img/officers/adult_ladies_treasurer.png" },
      { name: "Ma'am Gina Sulapas", role: "Auditor", image: "/img/officers/adult_ladies_auditor.jpg" }
    ]
  },
  {
    name: "Adult Men Department",
    officers: [
      { name: "Bro. Danny Delos santos", role: "President", image: "/img/officers/adult_men_president.jpg" },
      { name: "Bro. Roland Santos", role: "Vice President", image: "/img/officers/adult_men_vice_president.jpg" },
      { name: "Bro. Robert Apelado", role: "Secretary", image: "/img/officers/adult_men_secretary.jpg" },
      { name: "Bro. Rowel Bucayan", role: "Treasurer", image: "/img/officers/adult_men_treasurer.png" }
    ]
  },
  {
    name: "Young People Department",
    officers: [
      { name: "Sis. Jessica Las", role: "President", image: "/img/officers/yp_president.jpg" },
      { name: "Bro. Jessie Timuat", role: "Vice President", image: "/img/officers/yp_vice_president.jpg" },
      { name: "Sis. Erica Villegas", role: "Secretary", image: "/img/officers/yp_secretary.jpg" },
      { name: "Sis. Selah Acojedo", role: "Assistant Secretary", image: "/img/officers/yp_assistant_secretary.jpg" },
      { name: "Sis. Frena May Sulapas", role: "Treasurer", image: "/img/officers/yp_treasurer.jpg" },
      { name: "Sis. Camille Bucayan", role: "PIO", image: "/img/officers/yp_pio.jpg" },
      { name: "Sis. Donita Sibugan", role: "Social Media Coordinator", image: "/img/officers/yp_socmed.jpg" }
    ]
  }
]

const officersData = ref({
  heroTitle: 'Department Officers',
  heroSubtitle: 'Bible Baptist Ekklesia of Kawit',
  heroImage: null,
  backButtonText: 'Back to About',
  backButtonColor: '#14b8a6'
})

const departmentsData = ref(defaultDepartments)

// Fetch officers data from CMS
const fetchOfficersData = async () => {
  try {
    const response = await axios.get('/cms/departmentofficer/full')
    if (response.data.success && response.data.data) {
      const { page, images } = response.data.data
      const content = page?.content || {}
      
      // Update officers data
      if (content.heroTitle) officersData.value.heroTitle = content.heroTitle
      if (content.heroSubtitle) officersData.value.heroSubtitle = content.heroSubtitle
      if (content.backButtonText) officersData.value.backButtonText = content.backButtonText
      if (content.backButtonColor) officersData.value.backButtonColor = content.backButtonColor
      
      // Handle hero image
      if (images?.heroImage) {
        officersData.value.heroImage = images.heroImage
      }
      
      // Handle departments array
      if (content.departments && Array.isArray(content.departments) && content.departments.length > 0) {
        departmentsData.value = content.departments.map((dept, deptIdx) => ({
          name: dept.name || '',
          officers: (dept.officers || []).map((officer, offIdx) => {
            // Check if officer image exists in images object (using bracket notation)
            const imageKey = `departments[${deptIdx}].officers[${offIdx}].image`
            const officerImage = images?.[imageKey] || officer.image || ''
            return {
              name: officer.name || '',
              role: officer.role || '',
              image: officerImage
            }
          })
        }))
      }
    }
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error fetching officers data from CMS:', error)
    }
  }
}

onMounted(async () => {
  await fetchOfficersData()
})
</script>

<style scoped>
.officers-page {
  min-height: 100vh;
  background: white;
  margin-top: 64px;
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
  z-index: 1;
}

.floating-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
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
  max-width: 80rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  font-family: 'Georgia', serif;
  font-style: italic;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-family: 'Georgia', serif;
  font-style: italic;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.fade-in-up-delay {
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
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

@media (max-width: 960px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
}
</style>

