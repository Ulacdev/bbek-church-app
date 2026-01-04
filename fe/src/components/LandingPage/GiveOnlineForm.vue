<template>
  <div class="give-online-form">
    <!-- GCash Card -->
    <v-card class="gcash-card" elevation="0" variant="flat">
      <div class="gcash-content">
        <!-- GCash Logo -->
        <div class="gcash-logo-container">
          <img src="/img/gcash.png" alt="GCash Logo" class="gcash-logo-img" />
        </div>
        
        <!-- GCash Text -->
        <div class="gcash-text">{{ gcashText }}</div>
        
        <!-- Instruction Text -->
        <p class="gcash-instruction">
          Send your donation to this GCash account
        </p>
        
        <!-- GCash QR Code -->
        <div class="gcash-qr-container">
          <img src="/img/gcash-qr.png" alt="GCash QR Code" class="gcash-qr-img" />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/api/axios'

const gcashText = ref('GCash')
const gcashNumber = ref('09309224324')

// Fetch give data from CMS
const fetchGiveData = async () => {
  try {
    const response = await axios.get('/cms/give/full')
    if (response.data.success && response.data.data) {
      const { page } = response.data.data
      const content = page?.content || {}
      
      // Update GCash data
      gcashText.value = content.gcashText || gcashText.value
      gcashNumber.value = content.gcashNumber || gcashNumber.value
    }
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error fetching give data from CMS:', error)
    }
  }
}

onMounted(async () => {
  await fetchGiveData()
})
</script>

<style scoped>
.give-online-form {
  padding: 0;
}

.gcash-card {
  background: white;
  border-radius: 8px;
  padding: 32px 24px;
}

.gcash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.gcash-logo-container {
  margin-bottom: 16px;
}

.gcash-logo-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.gcash-text {
  font-size: 24px;
  font-weight: 700;
  color: #0070BA;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  text-transform: uppercase;
}

.gcash-instruction {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
}

.gcash-qr-container {
  margin-top: 16px;
}

.gcash-qr-img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .gcash-card {
    padding: 24px 16px;
  }
  
  .gcash-logo-img {
    width: 64px;
    height: 64px;
  }
  
  .gcash-text {
    font-size: 20px;
  }
  
  .gcash-qr-img {
    width: 120px;
    height: 120px;
  }
}
</style>

