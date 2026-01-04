<template>
  <div class="mission-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div
        class="hero-background"
        :style="{ backgroundImage: `url(${getImageUrl('/img/mission.webp')})` }"
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
        <h1 class="hero-title fade-in-up">Our Mission</h1>
        <p class="hero-subtitle fade-in-up-delay">Making Disciples, Transforming Lives</p>
      </div>
    </section>

    <!-- Mission Statement -->
    <div class="mission-statement bg-grey-darken-4 text-white -mt-20 relative z-10">
      <v-container class="py-20">
        <div class="text-center max-width-4xl mx-auto">
          <v-avatar size="80" color="blue" class="mb-8">
            <v-icon size="40" color="white">mdi-target</v-icon>
          </v-avatar>
          <h2 class="text-h3 text-md-h4 text-lg-h3 font-weight-bold mb-8">Our Mission Statement</h2>
          <p class="text-h5 text-md-h6 text-blue-lighten-3">
            "To glorify God by making disciples of Jesus Christ through biblical preaching, authentic worship, and compassionate service to our community and the world."
          </p>
        </div>
      </v-container>
    </div>

    <!-- How We Live Our Mission -->
    <section class="py-20 bg-white">
      <v-container>
        <div class="text-center mb-16">
          <h2 class="text-h3 text-md-h4 font-weight-bold text-grey-darken-3 mb-4 fade-in-up">How We Live Our Mission</h2>
          <p class="text-h6 text-grey-darken-1 max-width-3xl mx-auto fade-in-up-delay">
            Our mission comes to life through four key areas of focus that guide everything we do as a church community.
          </p>
        </div>
        <v-row>
          <v-col cols="12" lg="6">
            <v-card class="pa-8 mb-4 mission-card mission-card-1" color="blue-lighten-5" elevation="2" hover>
              <v-avatar size="64" color="blue" class="mb-6">
                <v-icon size="32" color="white">mdi-heart</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">Authentic Worship</h3>
              <p class="text-body-1 text-grey-darken-1 mb-6">
                We gather to worship God with genuine hearts, celebrating His goodness through music, prayer, and the study of His Word. Our worship is both reverent and joyful, reflecting the character of our amazing God.
              </p>
              <ul class="space-y-2">
                <li class="d-flex align-center mb-2">
                  <v-icon size="16" color="blue" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Sunday worship services</span>
                </li>
                <li class="d-flex align-center mb-2">
                  <v-icon size="16" color="blue" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Prayer and fasting meetings</span>
                </li>
                <li class="d-flex align-center">
                  <v-icon size="16" color="blue" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Special worship events</span>
                </li>
              </ul>
            </v-card>
          </v-col>
          <v-col cols="12" lg="6">
            <v-card class="pa-8 mb-4 mission-card mission-card-2" color="green-lighten-5" elevation="2" hover>
              <v-avatar size="64" color="green" class="mb-6">
                <v-icon size="32" color="white">mdi-account-group</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">Making Disciples</h3>
              <p class="text-body-1 text-grey-darken-1 mb-6">
                We are committed to helping people grow in their relationship with Jesus Christ through Bible study, mentorship, and spiritual formation. Every believer is called to be a disciple who makes disciples.
              </p>
              <ul class="space-y-2">
                <li class="d-flex align-center mb-2">
                  <v-icon size="16" color="green" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Bible study groups</span>
                </li>
                <li class="d-flex align-center mb-2">
                  <v-icon size="16" color="green" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Mentorship programs</span>
                </li>
                <li class="d-flex align-center">
                  <v-icon size="16" color="green" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Leadership development</span>
                </li>
              </ul>
            </v-card>
          </v-col>
          <v-col cols="12" lg="6">
            <v-card class="pa-8 mb-4 mission-card mission-card-3" color="purple-lighten-5" elevation="2" hover>
              <v-avatar size="64" color="purple" class="mb-6">
                <v-icon size="32" color="white">mdi-heart</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">Compassionate Service</h3>
              <p class="text-body-1 text-grey-darken-1 mb-6">
                We demonstrate God's love through practical service to our community, caring for the physical, emotional, and spiritual needs of those around us. Love in action is a powerful witness.
              </p>
              <ul class="space-y-2">
                <li class="d-flex align-center mb-2">
                  <v-icon size="16" color="purple" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Feeding programs</span>
                </li>
                <li class="d-flex align-center mb-2">
                  <v-icon size="16" color="purple" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Community outreach</span>
                </li>
                <li class="d-flex align-center">
                  <v-icon size="16" color="purple" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Family support services</span>
                </li>
              </ul>
            </v-card>
          </v-col>
          <v-col cols="12" lg="6">
            <v-card class="pa-8 mb-4 mission-card mission-card-4" color="orange-lighten-5" elevation="2" hover>
              <v-avatar size="64" color="orange" class="mb-6">
                <v-icon size="32" color="white">mdi-earth</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">Global Evangelism</h3>
              <p class="text-body-1 text-grey-darken-1 mb-6">
                We are passionate about sharing the Gospel both locally and globally, supporting missions and evangelistic efforts that bring the message of salvation to all nations.
              </p>
              <ul class="space-y-2">
                <li class="d-flex align-center mb-2">
                  <v-icon size="16" color="orange" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Local evangelism</span>
                </li>
                <li class="d-flex align-center mb-2">
                  <v-icon size="16" color="orange" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Mission support</span>
                </li>
                <li class="d-flex align-center">
                  <v-icon size="16" color="orange" class="mr-2">mdi-arrow-right</v-icon>
                  <span class="text-body-2">Church planting</span>
                </li>
              </ul>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Biblical Foundation -->
    <section class="py-20 bg-grey-lighten-5">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h4 font-weight-bold text-grey-darken-3 mb-4">Our Biblical Foundation</h2>
          <p class="text-h6 text-grey-darken-1">
            Our mission is rooted in the clear commands and promises found in God's Word.
          </p>
        </div>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-8" elevation="2">
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">The Great Commission</h3>
              <blockquote class="text-body-1 text-grey-darken-1 italic mb-4">
                "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you."
              </blockquote>
              <p class="text-body-2 text-grey-darken-1 font-weight-medium">Matthew 28:19-20</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-8" elevation="2">
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">The Great Commandment</h3>
              <blockquote class="text-body-1 text-grey-darken-1 italic mb-4">
                "Love the Lord your God with all your heart and with all your soul and with all your mind... Love your neighbor as yourself."
              </blockquote>
              <p class="text-body-2 text-grey-darken-1 font-weight-medium">Matthew 22:37-39</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Be Part of Our Mission -->
    <section class="py-20 bg-blue text-white">
      <v-container>
        <div class="text-center max-width-3xl mx-auto">
          <h2 class="text-h3 text-md-h4 font-weight-bold mb-6">Be Part of Our Mission</h2>
          <p class="text-h6 text-white opacity-90 mb-8">
            God has called each of us to be part of His mission in the world. Discover how you can use your gifts and passions to make a difference.
          </p>
          <div class="d-flex flex-column flex-sm-row gap-4 justify-center">
            <v-btn
              variant="outlined"
              color="white"
              size="large"
              rounded
              @click="$router.push('/ministries')"
            >
              Explore Ministries
            </v-btn>
            <v-btn
              color="white"
              size="large"
              rounded
              class="text-blue"
              @click="$router.push('/beoneofus/accept-jesus')"
            >
              Get Involved
            </v-btn>
          </div>
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
</script>

<style scoped>
.mission-page {
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.25rem;
  font-family: 'Georgia', serif;
  font-style: italic;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.mission-statement {
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

.mission-card {
  animation: fadeInUp 0.6s ease-out both;
  transition: all 0.3s ease;
}

.mission-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.mission-card-1 { animation-delay: 200ms; }
.mission-card-2 { animation-delay: 300ms; }
.mission-card-3 { animation-delay: 400ms; }
.mission-card-4 { animation-delay: 500ms; }

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

