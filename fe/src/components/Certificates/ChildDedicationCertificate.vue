<template>
  <div class="certificate-container">
    <div class="certificate-wrapper" id="certificate-print">
      <!-- Ornate Gold Border -->
      <div class="certificate-border">
        <div class="border-corner top-left"></div>
        <div class="border-corner top-right"></div>
        <div class="border-corner bottom-left"></div>
        <div class="border-corner bottom-right"></div>
        <div class="border-top"></div>
        <div class="border-bottom"></div>
        <div class="border-left"></div>
        <div class="border-right"></div>
      </div>

      <!-- Certificate Content -->
      <div class="certificate-content">
        <!-- Header Section -->
        <div class="certificate-header">
          <div class="header-left">
            <div class="church-logo">
              <div class="logo-circle">
                <img v-if="churchLogo" :src="churchLogo" alt="Church Logo" class="logo-image" />
                <div v-else class="logo-building">KAWIT</div>
              </div>
              <div class="sec-registered">S.E.C REGISTERED</div>
            </div>
          </div>
          <div class="header-right">
            <h1 class="church-name">{{ churchName }}</h1>
            <p class="church-address">{{ churchAddress }}</p>
          </div>
        </div>

        <!-- Certificate Title -->
        <div class="certificate-title-section">
          <h2 class="certificate-title">CERTIFICATE</h2>
          <h3 class="certificate-subtitle">OF DEDICATION</h3>
          <p class="dedication-statement">This day we dedicate to the Lord Jesus Christ</p>
        </div>

        <!-- Child's Information -->
        <div class="child-info-section">
          <div class="child-name">{{ childName || 'Name Here' }}</div>
          <div class="decorative-line">
            <div class="line-left"></div>
            <div class="line-center"></div>
            <div class="line-right"></div>
          </div>
          <p class="birth-info">
            born at <span class="underline">{{ birthLocation || 'LOCATION' }}</span> on <span class="underline">{{ formattedBirthDate || 'DATE' }}</span>.
          </p>
        </div>

        <!-- Parents Section -->
        <div class="parents-section">
          <p class="parents-intro">We are the parents</p>
          <div class="parents-names">
            <div class="parent-item">
              <div class="parent-line"></div>
              <p class="parent-label">Name</p>
              <p class="parent-role">Father</p>
            </div>
            <div class="parent-item">
              <div class="parent-line"></div>
              <p class="parent-label">Name</p>
              <p class="parent-role">Mother</p>
            </div>
          </div>
          <div class="parents-names-values">
            <div class="parent-value">{{ fatherName || 'Name' }}</div>
            <div class="parent-value">{{ motherName || 'Name' }}</div>
          </div>
        </div>

        <!-- Dedication Acknowledgment -->
        <div class="acknowledgment-section">
          <p class="acknowledgment-text">
            Acknowledging that this child is a precious gift from God. We take responsibility for guiding and training our child according to the bible and nurturing in God's way. This solemn act of dedication was held at
          </p>
          <p class="church-name-bold">{{ churchName }}</p>
          <p class="church-address-bold">{{ churchAddress }}</p>
          <p class="dedication-date">on this <span class="underline">{{ formattedDedicationDate || 'DATE' }}</span>.</p>
        </div>

        <!-- Sponsors Section -->
        <div class="sponsors-section">
          <h4 class="sponsors-title">SPONSORS:</h4>
          <div class="sponsors-grid">
            <div class="sponsors-column">
              <div v-for="(sponsor, index) in leftColumnSponsors" :key="`left-${index}`" class="sponsor-name">
                {{ sponsor || '' }}
              </div>
            </div>
            <div class="sponsors-column">
              <div v-for="(sponsor, index) in rightColumnSponsors" :key="`right-${index}`" class="sponsor-name">
                {{ sponsor || '' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Minister Signature -->
        <div class="minister-section">
          <p class="minister-name">{{ ministerName || 'Rev. Fresco Q. Sulapas' }}</p>
          <p class="minister-title">Church Minister</p>
        </div>

        <!-- Bible Verse -->
        <div class="verse-section">
          <p class="verse-text">
            "For this child I prayed; and the Lord hath given me my petition which I asked of him: Therefore also I have lent him to the Lord; as long as he liveth he shall be lent to the Lord. And he worshipped the Lord there."
          </p>
          <p class="verse-reference">1 Samuel 27-28</p>
        </div>
      </div>
    </div>

    <!-- Print Button (hidden when printing) -->
    <div class="certificate-actions no-print">
      <button @click="printCertificate" class="print-btn">
        Print Certificate
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from '@/api/axios'

const props = defineProps({
  childName: {
    type: String,
    default: ''
  },
  birthLocation: {
    type: String,
    default: ''
  },
  birthDate: {
    type: String,
    default: ''
  },
  fatherName: {
    type: String,
    default: ''
  },
  motherName: {
    type: String,
    default: ''
  },
  dedicationDate: {
    type: String,
    default: ''
  },
  sponsors: {
    type: Array,
    default: () => []
  },
  ministerName: {
    type: String,
    default: 'Rev. Fresco Q. Sulapas'
  },
  churchName: {
    type: String,
    default: ''
  },
  churchAddress: {
    type: String,
    default: ''
  }
})

const formattedBirthDate = computed(() => {
  if (!props.birthDate) return ''
  const date = new Date(props.birthDate)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const formattedDedicationDate = computed(() => {
  if (!props.dedicationDate) return ''
  const date = new Date(props.dedicationDate)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const leftColumnSponsors = computed(() => {
  const sponsorList = props.sponsors || []
  const midPoint = Math.ceil(sponsorList.length / 2)
  return sponsorList.slice(0, midPoint).concat(Array(5 - Math.min(midPoint, 5)).fill(''))
})

const rightColumnSponsors = computed(() => {
  const sponsorList = props.sponsors || []
  const midPoint = Math.ceil(sponsorList.length / 2)
  return sponsorList.slice(midPoint).concat(Array(5 - Math.min(sponsorList.length - midPoint, 5)).fill(''))
})

// Dynamic header data
const churchLogo = ref('')
const churchName = ref('BIBLE BAPTIST EKKLESIA OF KAWIT')
const churchAddress = ref(props.churchAddress || '485 Acacia St. Villa Ramirez, Tabon 1, Kawit Cavite')

// Fetch header data from CMS
const fetchHeaderData = async () => {
  try {
    const response = await axios.get('/cms/header/full')
    if (response.data.success && response.data.data) {
      const { page, images } = response.data.data
      const content = page?.content || {}
      
      // Get logo from images (base64 data URL)
      if (images?.logo) {
        churchLogo.value = images.logo
      }
      
      // Get church name from content
      if (content.fullname) {
        churchName.value = content.fullname.toUpperCase()
      }
      
      // Get church address if available
      if (content.address) {
        churchAddress.value = content.address
      }
    }
  } catch (error) {
    // If 404 or error, use default values
    if (error.response?.status !== 404) {
      console.error('Error fetching header data from CMS:', error)
    }
  }
}

const printCertificate = () => {
  window.print()
}

onMounted(async () => {
  // Fetch header data from CMS
  await fetchHeaderData()
  
  // Auto-print when component is mounted (optional)
  // Uncomment the line below if you want auto-print on open
  // setTimeout(() => window.print(), 500)
})
</script>

<style scoped>
.certificate-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.certificate-wrapper {
  position: relative;
  width: 100%;
  max-width: 8.5in;
  min-height: 11in;
  background: #faf8f3;
  margin: 0 auto;
  padding: 60px 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: auto;
}

/* Ornate Gold Border */
.certificate-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.border-corner {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 3px solid #d4af37;
  border-radius: 0;
}

.border-corner.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 15px;
}

.border-corner.top-right {
  top: 20px;
  right: 20px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 15px;
}

.border-corner.bottom-left {
  bottom: 20px;
  left: 20px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 15px;
}

.border-corner.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 15px;
}

.border-top,
.border-bottom {
  position: absolute;
  left: 100px;
  right: 100px;
  height: 3px;
  background: linear-gradient(to right, transparent, #d4af37 20%, #d4af37 80%, transparent);
}

.border-top {
  top: 20px;
}

.border-bottom {
  bottom: 20px;
}

.border-left,
.border-right {
  position: absolute;
  top: 100px;
  bottom: 100px;
  width: 3px;
  background: linear-gradient(to bottom, transparent, #d4af37 20%, #d4af37 80%, transparent);
}

.border-left {
  left: 20px;
}

.border-right {
  right: 20px;
}

.certificate-content {
  position: relative;
  z-index: 1;
}

/* Header Section */
.certificate-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 20px;
}

.header-left {
  flex-shrink: 0;
}

.church-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-circle {
  width: 100px;
  height: 100px;
  border: 3px solid #1e40af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  margin-bottom: 8px;
}

.logo-building {
  font-size: 12px;
  font-weight: bold;
  color: #1e40af;
  text-align: center;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.sec-registered {
  font-size: 10px;
  font-weight: 600;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-right {
  flex: 1;
  text-align: left;
}

.church-name {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin: 0 0 8px 0;
  font-family: 'Times New Roman', serif;
  line-height: 1.2;
}

.church-address {
  font-size: 14px;
  color: #000;
  margin: 0;
  font-family: 'Times New Roman', serif;
}

/* Certificate Title Section */
.certificate-title-section {
  text-align: center;
  margin: 40px 0;
}

.certificate-title {
  font-size: 48px;
  font-weight: bold;
  color: #000;
  margin: 0 0 10px 0;
  font-family: 'Times New Roman', serif;
  letter-spacing: 2px;
}

.certificate-subtitle {
  font-size: 32px;
  font-weight: bold;
  color: #000;
  margin: 0 0 15px 0;
  font-family: 'Times New Roman', serif;
}

.dedication-statement {
  font-size: 16px;
  color: #000;
  margin: 0;
  font-family: 'Times New Roman', serif;
}

/* Child Info Section */
.child-info-section {
  text-align: center;
  margin: 40px 0;
}

.child-name {
  font-size: 36px;
  font-weight: 600;
  color: #1e40af;
  font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
  margin-bottom: 20px;
  min-height: 50px;
}

.decorative-line {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
}

.line-left,
.line-right {
  flex: 1;
  height: 2px;
  background: #000;
  max-width: 150px;
}

.line-center {
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, #000 2px, transparent 2px);
  border-radius: 50%;
}

.birth-info {
  font-size: 16px;
  color: #000;
  margin: 20px 0 0 0;
  font-family: 'Times New Roman', serif;
}

.underline {
  text-decoration: underline;
}

/* Parents Section */
.parents-section {
  text-align: center;
  margin: 40px 0;
}

.parents-intro {
  font-size: 16px;
  color: #000;
  margin: 0 0 30px 0;
  font-family: 'Times New Roman', serif;
}

.parents-names {
  display: flex;
  justify-content: center;
  gap: 100px;
  margin-bottom: 10px;
}

.parent-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.parent-line {
  width: 200px;
  height: 2px;
  background: #000;
  margin-bottom: 8px;
}

.parent-label {
  font-size: 14px;
  color: #000;
  margin: 0 0 4px 0;
  font-family: 'Times New Roman', serif;
}

.parent-role {
  font-size: 14px;
  color: #000;
  margin: 0;
  font-family: 'Times New Roman', serif;
  font-weight: 600;
}

.parents-names-values {
  display: flex;
  justify-content: center;
  gap: 100px;
  margin-top: 10px;
}

.parent-value {
  width: 200px;
  font-size: 16px;
  color: #000;
  font-family: 'Times New Roman', serif;
  text-align: center;
}

/* Acknowledgment Section */
.acknowledgment-section {
  text-align: center;
  margin: 40px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.acknowledgment-text {
  font-size: 14px;
  color: #000;
  margin: 0 0 15px 0;
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
}

.church-name-bold {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin: 10px 0;
  font-family: 'Times New Roman', serif;
}

.church-address-bold {
  font-size: 14px;
  font-weight: bold;
  color: #000;
  margin: 5px 0;
  font-family: 'Times New Roman', serif;
}

.dedication-date {
  font-size: 14px;
  color: #000;
  margin: 15px 0 0 0;
  font-family: 'Times New Roman', serif;
}

/* Sponsors Section */
.sponsors-section {
  margin: 40px 0;
}

.sponsors-title {
  font-size: 18px;
  font-weight: bold;
  color: #1e40af;
  margin: 0 0 20px 0;
  text-align: center;
  font-family: Arial, sans-serif;
  text-transform: uppercase;
}

.sponsors-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 500px;
  margin: 0 auto;
}

.sponsors-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sponsor-name {
  font-size: 14px;
  color: #000;
  font-family: 'Times New Roman', serif;
  min-height: 20px;
}

/* Minister Section */
.minister-section {
  text-align: right;
  margin: 50px 0 30px 0;
  padding-right: 50px;
}

.minister-name {
  font-size: 16px;
  color: #000;
  margin: 0 0 5px 0;
  font-family: 'Times New Roman', serif;
}

.minister-title {
  font-size: 14px;
  color: #000;
  margin: 0;
  font-family: 'Times New Roman', serif;
}

/* Verse Section */
.verse-section {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
}

.verse-text {
  font-size: 14px;
  color: #1e40af;
  font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
  margin: 0 0 10px 0;
  line-height: 1.8;
  font-style: italic;
}

.verse-reference {
  font-size: 12px;
  color: #000;
  margin: 0;
  font-family: 'Times New Roman', serif;
}

/* Print Actions */
.certificate-actions {
  margin-top: 20px;
}

.print-btn {
  padding: 12px 24px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.print-btn:hover {
  background: #1e3a8a;
}

/* Print Styles */
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .certificate-container {
    padding: 0;
    background: white;
    min-height: auto;
  }

  .certificate-wrapper {
    box-shadow: none;
    margin: 0;
    padding: 15px 25px !important;
    page-break-after: avoid;
    page-break-inside: avoid;
    height: 11in;
    max-height: 11in;
    overflow: hidden;
    width: 8.5in;
    max-width: 8.5in;
  }

  .certificate-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Reduce spacing for print */
  .certificate-header {
    margin-bottom: 5px !important;
    gap: 10px !important;
  }

  .logo-circle {
    width: 60px !important;
    height: 60px !important;
    margin-bottom: 4px !important;
  }

  .logo-building {
    font-size: 8px !important;
  }

  .sec-registered {
    font-size: 8px !important;
  }

  .church-name {
    font-size: 15px !important;
    margin: 0 0 3px 0 !important;
    line-height: 1.1 !important;
  }

  .church-address {
    font-size: 10px !important;
    margin: 0 !important;
    line-height: 1.2 !important;
  }

  .certificate-title-section {
    margin: 8px 0 !important;
  }

  .certificate-title {
    font-size: 32px !important;
    margin-bottom: 2px !important;
    letter-spacing: 1px !important;
    line-height: 1 !important;
  }

  .certificate-subtitle {
    font-size: 22px !important;
    margin-bottom: 4px !important;
    line-height: 1 !important;
  }

  .dedication-statement {
    font-size: 11px !important;
    margin: 0 !important;
    line-height: 1.2 !important;
  }

  .child-info-section {
    margin: 8px 0 !important;
  }

  .child-name {
    font-size: 24px !important;
    margin-bottom: 5px !important;
    min-height: 30px !important;
    line-height: 1.1 !important;
  }

  .decorative-line {
    margin: 5px 0 !important;
    gap: 5px !important;
  }

  .line-left,
  .line-right {
    max-width: 100px !important;
    height: 1.5px !important;
  }

  .line-center {
    width: 20px !important;
    height: 20px !important;
  }

  .birth-info {
    font-size: 11px !important;
    margin: 5px 0 0 0 !important;
    line-height: 1.2 !important;
  }

  .parents-section {
    margin: 8px 0 !important;
  }

  .parents-intro {
    font-size: 11px !important;
    margin: 0 0 8px 0 !important;
    line-height: 1.2 !important;
  }

  .parents-names {
    gap: 60px !important;
    margin-bottom: 5px !important;
  }

  .parent-line {
    width: 150px !important;
    height: 1.5px !important;
    margin-bottom: 4px !important;
  }

  .parent-label {
    font-size: 10px !important;
    margin: 0 0 2px 0 !important;
  }

  .parent-role {
    font-size: 10px !important;
    margin: 0 !important;
  }

  .parents-names-values {
    gap: 60px !important;
    margin-top: 5px !important;
  }

  .parent-value {
    width: 150px !important;
    font-size: 11px !important;
    line-height: 1.2 !important;
  }

  .acknowledgment-section {
    margin: 8px 0 !important;
    max-width: 550px !important;
  }

  .acknowledgment-text {
    font-size: 10px !important;
    margin: 0 0 4px 0 !important;
    line-height: 1.3 !important;
  }

  .church-name-bold {
    font-size: 11px !important;
    margin: 3px 0 !important;
    line-height: 1.2 !important;
  }

  .church-address-bold {
    font-size: 10px !important;
    margin: 2px 0 !important;
    line-height: 1.2 !important;
  }

  .dedication-date {
    font-size: 10px !important;
    margin: 4px 0 0 0 !important;
    line-height: 1.2 !important;
  }

  .sponsors-section {
    margin: 8px 0 !important;
  }

  .sponsors-title {
    font-size: 13px !important;
    margin: 0 0 6px 0 !important;
    line-height: 1 !important;
  }

  .sponsor-name {
    font-size: 10px !important;
    min-height: 12px !important;
    line-height: 1.2 !important;
  }

  .sponsors-grid {
    gap: 20px !important;
    max-width: 450px !important;
  }

  .minister-section {
    margin: 8px 0 5px 0 !important;
    padding-right: 20px !important;
  }

  .minister-name {
    font-size: 11px !important;
    margin: 0 0 2px 0 !important;
    line-height: 1.2 !important;
  }

  .minister-title {
    font-size: 10px !important;
    margin: 0 !important;
    line-height: 1.2 !important;
  }

  .verse-section {
    margin-top: 5px !important;
    padding-top: 5px !important;
  }

  .verse-text {
    font-size: 10px !important;
    margin: 0 0 3px 0 !important;
    line-height: 1.4 !important;
  }

  .verse-reference {
    font-size: 9px !important;
    margin: 0 !important;
    line-height: 1.2 !important;
  }

  /* Adjust borders for print */
  .border-corner {
    width: 50px !important;
    height: 50px !important;
    border-width: 2px !important;
  }

  .border-corner.top-left,
  .border-corner.top-right {
    top: 10px !important;
  }

  .border-corner.bottom-left,
  .border-corner.bottom-right {
    bottom: 10px !important;
  }

  .border-corner.top-left,
  .border-corner.bottom-left {
    left: 10px !important;
  }

  .border-corner.top-right,
  .border-corner.bottom-right {
    right: 10px !important;
  }

  .border-top,
  .border-bottom {
    left: 60px !important;
    right: 60px !important;
    height: 2px !important;
    top: 10px !important;
  }

  .border-bottom {
    bottom: 10px !important;
    top: auto !important;
  }

  .border-left,
  .border-right {
    top: 60px !important;
    bottom: 60px !important;
    width: 2px !important;
  }

  .border-left {
    left: 10px !important;
  }

  .border-right {
    right: 10px !important;
  }

  .no-print {
    display: none !important;
  }

  .certificate-actions {
    display: none;
  }

  @page {
    size: letter portrait;
    margin: 0;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .certificate-wrapper {
    padding: 40px 30px;
  }

  .certificate-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .header-right {
    text-align: center;
  }

  .certificate-title {
    font-size: 36px;
  }

  .certificate-subtitle {
    font-size: 24px;
  }

  .child-name {
    font-size: 28px;
  }

  .parents-names,
  .parents-names-values {
    gap: 40px;
  }

  .parent-line,
  .parent-value {
    width: 150px;
  }

  .minister-section {
    padding-right: 20px;
  }
}
</style>

