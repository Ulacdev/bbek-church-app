<template>
  <div class="all-ministries-user-page">
    
    <!-- Floating Elements -->
    <div class="floating-elements">
      <div
        v-for="(element, index) in floatingElements"
        :key="index"
        class="floating-element"
        :style="element.style"
      ></div>
    </div>

    <div class="w-screen h-auto relative overflow-hidden">
      <!-- Hero Section -->
      <section
        class="hero-section relative w-full"
        :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/img/youth (4).jpg')` }"
      >
        <div class="hero-content relative z-10 text-center px-4 max-w-5xl mx-auto w-full flex flex-col items-center justify-center">
          <h1 class="hero-title text-3xl md:text-5xl font-weight-bold text-white mb-4">
            MY MINISTRY
          </h1>
          <p class="hero-subtitle text-lg md:text-xl text-white font-weight-light">
            Discover the ministries you've joined and continue to grow in faith and serve our community.
          </p>
        </div>
      </section>

      <!-- Ministries List Section -->
      <section class="ministries-section py-16 px-4 bg-white overflow-hidden relative">
        <!-- Floating elements -->
        <div class="floating-elements">
          <div
            v-for="(element, index) in sectionFloatingElements"
            :key="index"
            class="floating-element"
            :style="element.style"
          ></div>
        </div>

        <div class="max-w-7xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-weight-bold text-black mb-6 text-center" style="font-family: 'Georgia', serif; font-style: italic; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
            My Ministry
          </h2>
          <p class="text-lg md:text-xl text-black text-center leading-relaxed mb-8" style="font-family: 'Georgia', serif; font-style: italic; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
            Discover the ministries you've joined and continue to grow in faith and serve our community.
          </p>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-16 flex flex-col items-center justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="mt-4 text-grey">Loading ministries...</p>
          </div>

          <!-- Search and Filter -->
          <div v-else class="max-w-4xl mx-auto mt-8">
            <div class="d-flex align-center gap-2">
              <v-text-field
                v-model="query"
                placeholder="Search ministries..."
                variant="outlined"
                density="compact"
                hide-details
                class="flex-grow-1"
              ></v-text-field>
              <div class="relative">
                <v-btn
                  icon
                  variant="text"
                  @click="toggleSort"
                >
                  <v-icon>mdi-filter</v-icon>
                </v-btn>
                <v-menu
                  v-model="showSort"
                  location="bottom end"
                >
                  <v-list>
                    <v-list-item
                      @click="setSelectedStatus(''); toggleSort()"
                    >
                      <v-list-item-title>All Statuses</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="setSelectedStatus('active'); toggleSort()"
                    >
                      <v-list-item-title>Active</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="setSelectedStatus('inactive'); toggleSort()"
                    >
                      <v-list-item-title>Inactive</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>

          <!-- Ministries Grid -->
          <div
            v-if="!loading"
            class="ministries-grid mt-16"
          >
            <v-card
              v-for="(ministry, index) in ministryData"
              :key="ministry.ministry_id || index"
              class="ministry-card"
              elevation="4"
              hover
            >
              <div
                class="ministry-image"
                :style="{ backgroundImage: ministry.imageUrl ? `url(${ministry.imageUrl})` : 'url(/img/events.jpg)' }"
              ></div>
              <div class="ministry-overlay"></div>
              <div class="ministry-content">
                <h3 class="ministry-title">{{ ministry.ministry_name }}</h3>
                <v-btn
                  color="white"
                  variant="outlined"
                  class="mt-4"
                  @click="goToLearnMore(ministry)"
                >
                  Learn More
                </v-btn>
              </div>
            </v-card>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && ministryData.length === 0" class="text-center py-16 flex flex-col items-center justify-center">
            <p class="text-lg text-grey">No ministries found. Join a ministry to see it here.</p>
            <v-btn
              color="#14b8a6"
              class="mt-4 text-white"
              @click="$router.push('/ministries')"
            >
              Browse Ministries
            </v-btn>
          </div>

          <!-- Pagination -->
          <div v-if="!loading && ministryData.length > 0" class="w-full p-4 d-flex align-center justify-center relative mt-8">
            <v-btn
              variant="text"
              :disabled="pageNumber === 1"
              @click="previousPage"
            >
              &laquo; Previous
            </v-btn>
            <span class="mx-4">
              Page {{ pageNumber }} of {{ totalPage }}
            </span>
            <v-btn
              variant="text"
              :disabled="pageNumber >= totalPage"
              @click="nextPage"
            >
              Next &raquo;
            </v-btn>
          </div>
        </div>
      </section>

      <!-- Join Community Section -->
      <section class="join-section py-16 bg-white text-black">
        <v-container>
          <div class="text-center">
            <h2 class="text-4xl font-weight-bold mb-6 text-black" style="font-family: 'Georgia', serif; font-style: italic; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
              Join Our Community
            </h2>
            <p class="text-xl mb-10 max-w-2xl mx-auto text-grey-darken-1" style="font-family: 'Georgia', serif; font-style: italic; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
              We invite you to be a part of our church family. Come worship with us and experience the love of Christ.
            </p>
            <v-btn
              color="#14b8a6"
              size="large"
              rounded
              class="text-white"
              style="font-family: 'Georgia', serif; font-style: italic;"
              @click="$router.push('/beoneofus/accept-jesus')"
            >
              Become a Member
            </v-btn>
          </div>
        </v-container>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMinistriesStore } from '@/stores/ChurchRecords/ministriesStore'

const router = useRouter()
const ministriesStore = useMinistriesStore()

const ministryData = ref([])
const showSort = ref(false)
const query = ref('')
const pageNumber = ref(1)
const totalPage = ref(1)
const refresh = ref(true)
const selectedStatus = ref('')
const loading = ref(false)

const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

const floatingElements = ref([
  { style: { top: '80px', left: '80px', width: '48px', height: '48px', animationDelay: '0s' } },
  { style: { top: '33%', right: '64px', width: '32px', height: '32px', animationDelay: '1.5s' } },
  { style: { bottom: '33%', left: '64px', width: '40px', height: '40px', animationDelay: '2s' } },
  { style: { bottom: '80px', right: '80px', width: '24px', height: '24px', animationDelay: '0.8s' } },
  { style: { top: '50%', left: '25%', width: '28px', height: '28px', animationDelay: '1.2s' } },
  { style: { bottom: '25%', right: '33%', width: '36px', height: '36px', animationDelay: '2.5s' } },
  { style: { top: '25%', left: '33%', width: '16px', height: '16px', animationDelay: '1.8s' } },
  { style: { top: '75%', right: '25%', width: '44px', height: '44px', animationDelay: '0.3s' } },
  { style: { bottom: '50%', left: '16%', width: '20px', height: '20px', animationDelay: '2.1s' } }
])

const sectionFloatingElements = ref([
  { style: { top: '40px', left: '40px', width: '64px', height: '64px', animationDelay: '0s' } },
  { style: { top: '80px', right: '80px', width: '48px', height: '48px', animationDelay: '1s' } },
  { style: { bottom: '80px', left: '80px', width: '56px', height: '56px', animationDelay: '2s' } },
  { style: { bottom: '40px', right: '40px', width: '40px', height: '40px', animationDelay: '0.5s' } },
  { style: { top: '50%', left: '33%', width: '32px', height: '32px', animationDelay: '1.5s' } },
  { style: { top: '25%', right: '25%', width: '24px', height: '24px', animationDelay: '0.8s' } },
  { style: { bottom: '33%', left: '50%', width: '36px', height: '36px', animationDelay: '2.2s' } },
  { style: { top: '75%', left: '40px', width: '20px', height: '20px', animationDelay: '1.8s' } },
  { style: { bottom: '25%', right: '25%', width: '28px', height: '28px', animationDelay: '0.3s' } },
  { style: { top: '33%', right: '40px', width: '44px', height: '44px', animationDelay: '2.8s' } },
  { style: { top: '50%', right: '33%', width: '16px', height: '16px', animationDelay: '1.1s' } },
  { style: { bottom: '50%', left: '25%', width: '52px', height: '52px', animationDelay: '0.9s' } }
])

const toggleSort = () => {
  showSort.value = !showSort.value
}

const setSelectedStatus = (status) => {
  selectedStatus.value = status
  pageNumber.value = 1
  refresh.value = true
}

const handleQueryChange = () => {
  refresh.value = true
}

const fetchMinistryData = async () => {
  try {
    // Check if user is logged in and has member ID
    if (!userInfo.value || !userInfo.value.member || !userInfo.value.member.member_id) {
      console.warn('User is not logged in or member ID not found')
      ministryData.value = []
      totalPage.value = 1
      loading.value = false
      return
    }

    const memberId = userInfo.value.member.member_id
    loading.value = true

    const result = await ministriesStore.fetchUserMinistries(memberId, {
      page: pageNumber.value,
      pageSize: 10,
      search: query.value,
      status: selectedStatus.value,
      sortBy: 'Date Created (Newest)'
    })

    if (result.success) {
      ministryData.value = result.data || []
      totalPage.value = result.totalPages || 1
      
      // Reset to page 1 if current page exceeds total pages
      if (pageNumber.value > totalPage.value && totalPage.value > 0) {
        pageNumber.value = 1
      }
    } else {
      console.error('Failed to fetch user ministries:', result.error)
      ministryData.value = []
      totalPage.value = 1
    }
  } catch (e) {
    console.error('Error fetching user ministries:', e)
    ministryData.value = []
    totalPage.value = 1
  } finally {
    loading.value = false
  }
}

const goToLearnMore = (ministry) => {
  router.push({
    name: 'LearnMoreMinistry',
    params: { id: ministry.ministry_id },
    query: { ministryModel: encodeURIComponent(JSON.stringify(ministry)) }
  })
}

const previousPage = () => {
  if (pageNumber.value > 1) {
    pageNumber.value--
    refresh.value = true
  }
}

const nextPage = () => {
  if (pageNumber.value < totalPage.value) {
    pageNumber.value++
    refresh.value = true
  }
}

watch([refresh, pageNumber], () => {
  if (refresh.value) {
    fetchMinistryData()
    refresh.value = false
  }
})

// Watch query separately with debounce for search
let searchTimeout = null
watch(query, () => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  // Set new timeout to debounce search
  searchTimeout = setTimeout(() => {
    pageNumber.value = 1
    refresh.value = true
  }, 500) // 500ms debounce delay
})

watch(selectedStatus, () => {
  pageNumber.value = 1
  refresh.value = true
})

onMounted(() => {
  fetchMinistryData()
})
</script>

<style scoped>
.all-ministries-user-page {
  min-height: 100vh;
  background: white;
  margin-top: 64px;
}

.hero-section {
  position: relative;
  height: 50vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

@media (min-width: 960px) {
  .hero-section {
    height: 60vh;
    min-height: 600px;
  }
}

.hero-content {
  position: relative;
  z-index: 10;
}

.hero-title {
  font-family: 'Georgia', serif;
  font-style: italic;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-family: 'Poppins', 'Inter', sans-serif;
}

.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
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

.ministries-section {
  position: relative;
}

.ministries-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
  max-height: calc(100vh - 400px);
  overflow-y: auto;
  padding-right: 0.5rem;
}

@media (min-width: 768px) {
  .ministries-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .ministries-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Custom scrollbar styling */
.ministries-grid::-webkit-scrollbar {
  width: 8px;
}

.ministries-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.ministries-grid::-webkit-scrollbar-thumb {
  background: #14b8a6;
  border-radius: 10px;
}

.ministries-grid::-webkit-scrollbar-thumb:hover {
  background: #0fa08f;
}

.ministry-card {
  position: relative;
  height: 384px;
  overflow: hidden;
  border-radius: 1rem;
  width: 100%;
  max-width: 100%;
}

.ministry-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.ministry-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(55, 65, 81, 0.7), rgba(75, 85, 99, 0.2), transparent);
  z-index: 1;
}

.ministry-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  padding: 1.5rem;
  color: white;
}

.ministry-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  font-family: 'Poppins', 'Inter', sans-serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}


.join-section {
  position: relative;
  z-index: 2;
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>

