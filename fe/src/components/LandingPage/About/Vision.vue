<template>
  <div class="vision-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div
        class="hero-background"
        :style="{ backgroundImage: `url(${getImageUrl('/img/vision.webp')})` }"
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
        <h1 class="hero-title fade-in-up">Our Vision</h1>
        <p class="hero-subtitle fade-in-up-delay">A Community Transformed by God's Love</p>
      </div>
    </section>

    <!-- Vision Statement -->
    <div class="vision-statement bg-grey-darken-4 text-white -mt-20 relative z-10">
      <v-container class="py-20">
        <div class="text-center max-width-4xl mx-auto">
          <v-avatar size="80" color="purple" class="mb-8">
            <v-icon size="40" color="white">mdi-eye</v-icon>
          </v-avatar>
          <h2 class="text-h3 text-md-h4 text-lg-h3 font-weight-bold mb-8">Our Vision</h2>
          <p class="text-h5 text-md-h6 text-purple-lighten-3">
            "To be a thriving church community that transforms lives, strengthens families, and impacts our city and beyond with the love and truth of Jesus Christ."
          </p>
        </div>
      </v-container>
    </div>

    <!-- Vision in Action -->
    <section class="py-20 bg-white">
      <v-container>
        <div class="text-center mb-16">
          <h2 class="text-h3 text-md-h4 font-weight-bold text-grey-darken-3 mb-4 fade-in-up">Our Vision in Action</h2>
          <p class="text-h6 text-grey-darken-1 max-width-3xl mx-auto fade-in-up-delay">
            We envision a future where our church serves as a beacon of hope, transformation, and love in our community and beyond.
          </p>
        </div>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="text-center pa-6 vision-action-card vision-action-card-1" elevation="2" hover>
              <v-avatar size="96" color="blue" class="mb-6">
                <v-icon size="48" color="white">mdi-star</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">Transformed Lives</h3>
              <p class="text-body-1 text-grey-darken-1">
                We envision individuals discovering their identity in Christ, experiencing healing and restoration, and living out their God-given purpose with passion and joy.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="text-center pa-6 vision-action-card vision-action-card-2" elevation="2" hover>
              <v-avatar size="96" color="green" class="mb-6">
                <v-icon size="48" color="white">mdi-compass</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">Strong Families</h3>
              <p class="text-body-1 text-grey-darken-1">
                We see families built on biblical foundations, where love, respect, and faith are passed down through generations, creating a legacy of godliness.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="text-center pa-6 vision-action-card vision-action-card-3" elevation="2" hover>
              <v-avatar size="96" color="purple" class="mb-6">
                <v-icon size="48" color="white">mdi-arrow-right</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">Community Impact</h3>
              <p class="text-body-1 text-grey-darken-1">
                We dream of a community where the love of Christ is tangibly felt through our service, compassion, and commitment to justice and mercy.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 5-Year Vision -->
    <section class="py-20 bg-grey-lighten-5">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h4 font-weight-bold text-grey-darken-3 mb-4">Our 5-Year Vision</h2>
          <p class="text-h6 text-grey-darken-1">
            By God's grace, we are working toward these specific goals that will help us fulfill our vision.
          </p>
        </div>
        <v-row>
          <v-col cols="12" md="6">
            <div class="space-y-6">
              <div v-for="(goal, index) in fiveYearGoals.slice(0, 3)" :key="index" class="d-flex align-start gap-4">
                <v-icon color="green" size="24">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h6 font-weight-semibold text-grey-darken-3 mb-2">{{ goal.title }}</h3>
                  <p class="text-body-2 text-grey-darken-1">{{ goal.description }}</p>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="space-y-6">
              <div v-for="(goal, index) in fiveYearGoals.slice(3)" :key="index" class="d-flex align-start gap-4">
                <v-icon color="green" size="24">mdi-check-circle</v-icon>
                <div>
                  <h3 class="text-h6 font-weight-semibold text-grey-darken-3 mb-2">{{ goal.title }}</h3>
                  <p class="text-body-2 text-grey-darken-1">{{ goal.description }}</p>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Help Us Achieve -->
    <section class="py-20 bg-white">
      <v-container>
        <div class="text-center mb-12 max-width-4xl mx-auto">
          <h2 class="text-h3 text-md-h4 font-weight-bold text-grey-darken-3 mb-6">Help Us Achieve Our Vision</h2>
          <p class="text-h6 text-grey-darken-1 mb-12">
            Our vision becomes reality when every member of our church family contributes their unique gifts, talents, and resources to God's work.
          </p>
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="pa-6 text-center" color="blue-lighten-5" elevation="2">
                <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-3">Pray</h3>
                <p class="text-body-2 text-grey-darken-1">
                  Join us in praying for God's guidance and blessing as we work toward our vision together.
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-6 text-center" color="green-lighten-5" elevation="2">
                <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-3">Participate</h3>
                <p class="text-body-2 text-grey-darken-1">
                  Get involved in our ministries and programs that are making our vision a reality in our community.
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-6 text-center" color="purple-lighten-5" elevation="2">
                <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-3">Partner</h3>
                <p class="text-body-2 text-grey-darken-1">
                  Support our vision through your financial gifts and volunteer service to expand God's kingdom.
                </p>
              </v-card>
            </v-col>
          </v-row>
          <div class="d-flex flex-column flex-sm-row gap-4 justify-center mt-8">
            <v-btn color="purple" size="large" rounded @click="$router.push('/ministries')">
              Join a Ministry
            </v-btn>
            <v-btn variant="outlined" size="large" rounded @click="$router.push('/give')">
              Support Our Vision
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>

    <!-- Future is Bright -->
    <section class="py-20 bg-purple text-white">
      <v-container>
        <div class="text-center max-width-3xl mx-auto">
          <h2 class="text-h3 text-md-h4 font-weight-bold mb-6">The Future is Bright</h2>
          <p class="text-h6 text-white opacity-90 mb-8">
            We believe that God has great things in store for our church and community. Join us as we step into the future He has prepared for us.
          </p>
          <v-btn
            variant="outlined"
            color="white"
            size="large"
            rounded
            @click="$router.push('/plan-your-visit')"
          >
            Experience Our Vision
          </v-btn>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

const fiveYearGoals = ref([
  {
    title: "Expand Our Reach",
    description: "Plant new churches in surrounding communities and establish satellite campuses to reach more people with the Gospel."
  },
  {
    title: "Strengthen Discipleship",
    description: "Develop comprehensive discipleship programs that equip every member to grow spiritually and serve effectively."
  },
  {
    title: "Enhance Facilities",
    description: "Improve and expand our church facilities to better serve our growing congregation and community programs."
  },
  {
    title: "Increase Community Service",
    description: "Launch new outreach programs that address specific needs in our community, from education to healthcare."
  },
  {
    title: "Global Missions",
    description: "Support and send missionaries to unreached areas, partnering with international organizations to spread the Gospel worldwide."
  },
  {
    title: "Leadership Development",
    description: "Raise up and train the next generation of church leaders who will carry forward our mission and vision."
  }
])
</script>

<style scoped>
.vision-page {
  min-height: 100vh;
  background: white;
  margin-top: 64px;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 50vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 50px;
  padding-bottom: 50px;
}

.hero-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.25rem;
  font-family: 'Georgia', serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.vision-statement {
  margin-top: -80px;
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.fade-in-up-delay {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.vision-action-card {
  animation: fadeInUp 0.6s ease-out both;
  transition: all 0.3s ease;
}

.vision-action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.vision-action-card-1 { animation-delay: 200ms; }
.vision-action-card-2 { animation-delay: 300ms; }
.vision-action-card-3 { animation-delay: 400ms; }

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

