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
              <div class="sec-registered">S.E.C. REGISTERED</div>
            </div>
          </div>
          <div class="header-right">
            <h1 class="church-name">{{ churchName }}</h1>
            <h2 v-if="churchNameSub" class="church-name-sub">{{ churchNameSub }}</h2>
            <p class="church-address">{{ churchAddress }}</p>
            <p class="church-contact">Contact no. {{ contactNumber }}</p>
          </div>
        </div>

        <!-- Certificate Title -->
        <div class="certificate-title-section">
          <h2 class="certificate-title">CERTIFICATE</h2>
          <h3 class="certificate-subtitle">OF WATER BAPTISM</h3>
        </div>

        <!-- Introductory Statement -->
        <div class="intro-section">
          <p class="intro-text">
            This certifies that the following individual has publicly professed their faith in the Lord Jesus Christ and has been baptized in obedience to His command.
          </p>
        </div>

        <!-- Personal Information Fields -->
        <div class="personal-info-section">
          <div class="info-field">
            <span class="field-label">Name</span>
            <span class="field-value">{{ name || '________________' }}</span>
          </div>
          <div class="info-field">
            <span class="field-label">Born on</span>
            <span class="field-value">{{ formattedBirthDate || '________________' }}</span>
          </div>
          <div class="info-field">
            <span class="field-label">Address</span>
            <span class="field-value">{{ address || '________________' }}</span>
          </div>
          <div class="info-field">
            <span class="field-label">Has been baptized on</span>
            <span class="field-value">{{ formattedBaptismDate || '________________' }}</span>
          </div>
          <div class="info-field">
            <span class="field-label">At</span>
            <span class="field-value">{{ baptismLocation || '________________' }}</span>
          </div>
        </div>

        <!-- Scripture Verse -->
        <div class="verse-section">
          <p class="verse-text">
            "Therefore we are buried with Him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life."
          </p>
          <p class="verse-reference">— Romans 6:4 (KJV)</p>
        </div>

        <!-- Church Membership Data Section -->
        <div class="membership-section">
          <h4 class="membership-title">CHURCH MEMBERSHIP DATA</h4>
          <div class="membership-grid">
            <div class="membership-column">
              <div class="info-field">
                <span class="field-label">Year</span>
                <span class="field-value">{{ year || '________________' }}</span>
              </div>
              <div class="info-field">
                <span class="field-label">Member ID No:</span>
                <span class="field-value">{{ memberId || '________________' }}</span>
              </div>
              <div class="info-field">
                <span class="field-label">Date Got Saved:</span>
                <span class="field-value">{{ formattedSavedDate || '________________' }}</span>
              </div>
            </div>
            <div class="membership-column">
              <div class="info-field">
                <span class="field-label">Date Fited:</span>
                <span class="field-value">{{ formattedFitedDate || '________________' }}</span>
              </div>
              <div class="info-field">
                <span class="field-label">Civil Status:</span>
                <span class="field-value">{{ civilStatus || '________________' }}</span>
              </div>
              <div class="info-field">
                <span class="field-label">Desire Ministry:</span>
                <span class="field-value">{{ desireMinistry || '________________' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Marriage Information Section -->
        <div class="marriage-info-section">
          <div class="info-field">
            <span class="field-label">If Married:</span>
            <span class="field-value">{{ ifMarried || '________________' }}</span>
          </div>
          <div class="info-field">
            <span class="field-label">Spouse's Name:</span>
            <span class="field-value">{{ spouseName || '________________' }}</span>
          </div>
          <div class="info-field">
            <span class="field-label">Marriage Date:</span>
            <span class="field-value">{{ formattedMarriageDate || '________________' }}</span>
          </div>
        </div>

        <!-- Signatures Section -->
        <div class="signatures-section">
          <div class="signature-witness">
            <p class="signature-label">Witnessed by:</p>
            <span class="signature-value">{{ witnessName || '________________' }}</span>
          </div>
          <div class="signature-minister">
            <p class="minister-name">{{ ministerName || 'Rev. Fresco Q. Sulapas' }}</p>
            <p class="minister-title">Church Minister</p>
          </div>
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
  name: {
    type: String,
    default: ''
  },
  birthDate: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  baptismDate: {
    type: String,
    default: ''
  },
  baptismLocation: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: ''
  },
  memberId: {
    type: String,
    default: ''
  },
  savedDate: {
    type: String,
    default: ''
  },
  fitedDate: {
    type: String,
    default: ''
  },
  civilStatus: {
    type: String,
    default: ''
  },
  desireMinistry: {
    type: String,
    default: ''
  },
  ifMarried: {
    type: String,
    default: ''
  },
  spouseName: {
    type: String,
    default: ''
  },
  marriageDate: {
    type: String,
    default: ''
  },
  witnessName: {
    type: String,
    default: ''
  },
  ministerName: {
    type: String,
    default: 'Rev. Fresco Q. Sulapas'
  },
  churchAddress: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    default: ''
  }
})

const formattedBirthDate = computed(() => {
  if (!props.birthDate) return ''
  const date = new Date(props.birthDate)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const formattedBaptismDate = computed(() => {
  if (!props.baptismDate) return ''
  const date = new Date(props.baptismDate)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const formattedSavedDate = computed(() => {
  if (!props.savedDate) return ''
  const date = new Date(props.savedDate)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const formattedFitedDate = computed(() => {
  if (!props.fitedDate) return ''
  const date = new Date(props.fitedDate)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const formattedMarriageDate = computed(() => {
  if (!props.marriageDate) return ''
  const date = new Date(props.marriageDate)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

// Dynamic header data
const churchLogo = ref('')
const churchName = ref('BIBLE BAPTIST EKKLESIA')
const churchNameSub = ref('OF KAWIT')
const churchAddress = ref(props.churchAddress || '0559 Villa Ramirez, Tabon 1, Kawit, Cavite')
const contactNumber = ref(props.contactNumber || '09353166809')

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
      
      // Get church name from content and split if needed
      if (content.fullname) {
        const fullName = content.fullname.toUpperCase()
        // Try to split at "OF" if it exists
        const ofIndex = fullName.indexOf(' OF ')
        if (ofIndex > 0) {
          churchName.value = fullName.substring(0, ofIndex)
          churchNameSub.value = fullName.substring(ofIndex + 1)
        } else {
          churchName.value = fullName
          churchNameSub.value = ''
        }
      }
      
      // Get church address if available
      if (content.address) {
        churchAddress.value = content.address
      }
      
      // Get contact number if available
      if (content.contactNumber) {
        contactNumber.value = content.contactNumber
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
  padding: 50px 60px;
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
  gap: 25px;
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
  font-size: 9px;
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
  font-size: 24px;
  font-weight: 900;
  color: #000;
  margin: 0 0 5px 0;
  font-family: Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.2;
}

.church-name-sub {
  font-size: 20px;
  font-weight: 900;
  color: #000;
  margin: 0 0 8px 0;
  font-family: Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.2;
}

.church-address {
  font-size: 13px;
  color: #000;
  margin: 0 0 4px 0;
  font-family: Arial, sans-serif;
}

.church-contact {
  font-size: 13px;
  color: #000;
  margin: 0;
  font-family: Arial, sans-serif;
}

/* Certificate Title Section */
.certificate-title-section {
  text-align: center;
  margin: 35px 0 25px 0;
}

.certificate-title {
  font-size: 42px;
  font-weight: 900;
  color: #000;
  margin: 0 0 8px 0;
  font-family: Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1;
}

.certificate-subtitle {
  font-size: 36px;
  font-weight: 900;
  color: #000;
  margin: 0;
  font-family: Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1;
}

/* Introductory Section */
.intro-section {
  margin: 25px 0;
  text-align: center;
}

.intro-text {
  font-size: 14px;
  color: #000;
  margin: 0;
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Personal Information Section */
.personal-info-section {
  margin: 25px 0;
}

.info-field {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
  font-family: 'Times New Roman', serif;
}

.field-label {
  font-size: 14px;
  color: #000;
  font-weight: 600;
  min-width: 140px;
  margin-right: 10px;
}

.field-value {
  font-size: 14px;
  color: #000;
  flex: 1;
  border-bottom: 1px solid #000;
  padding-bottom: 2px;
  min-height: 18px;
}

/* Verse Section */
.verse-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px 0;
}

.verse-text {
  font-size: 13px;
  color: #000;
  font-family: 'Times New Roman', serif;
  font-style: italic;
  margin: 0 0 8px 0;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.verse-reference {
  font-size: 12px;
  color: #000;
  margin: 0;
  font-family: 'Times New Roman', serif;
}

/* Membership Section */
.membership-section {
  margin: 25px 0;
}

.membership-title {
  font-size: 16px;
  font-weight: 900;
  color: #000;
  margin: 0 0 20px 0;
  font-family: Arial, sans-serif;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1px;
}

.membership-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.membership-column {
  display: flex;
  flex-direction: column;
}

.membership-column .info-field {
  margin-bottom: 12px;
}

/* Marriage Info Section */
.marriage-info-section {
  margin: 25px 0;
}

/* Signatures Section */
.signatures-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 30px;
  padding-top: 20px;
}

.signature-witness {
  flex: 1;
}

.signature-label {
  font-size: 13px;
  color: #000;
  margin: 0 0 8px 0;
  font-family: 'Times New Roman', serif;
  font-weight: 600;
}

.signature-value {
  font-size: 13px;
  color: #000;
  border-bottom: 1px solid #000;
  padding-bottom: 2px;
  display: inline-block;
  min-width: 200px;
  font-family: 'Times New Roman', serif;
}

.signature-minister {
  text-align: center;
  flex: 1;
}

.minister-name {
  font-size: 15px;
  font-weight: 900;
  color: #000;
  margin: 0 0 5px 0;
  font-family: Arial, sans-serif;
}

.minister-title {
  font-size: 13px;
  color: #000;
  margin: 0;
  font-family: Arial, sans-serif;
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
    padding: 12px 20px !important;
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
    transform: scale(0.97);
    transform-origin: top center;
  }

  /* Reduce spacing for print */
  .certificate-header {
    margin-bottom: 5px !important;
    gap: 12px !important;
  }

  .logo-circle {
    width: 55px !important;
    height: 55px !important;
    margin-bottom: 3px !important;
  }

  .logo-building {
    font-size: 7px !important;
  }

  .sec-registered {
    font-size: 6px !important;
  }

  .church-name {
    font-size: 14px !important;
    margin: 0 0 2px 0 !important;
    line-height: 1 !important;
  }

  .church-name-sub {
    font-size: 12px !important;
    margin: 0 0 3px 0 !important;
    line-height: 1 !important;
  }

  .church-address,
  .church-contact {
    font-size: 9px !important;
    margin: 0 0 1px 0 !important;
    line-height: 1.1 !important;
  }

  .certificate-title-section {
    margin: 8px 0 5px 0 !important;
  }

  .certificate-title {
    font-size: 28px !important;
    margin-bottom: 3px !important;
    letter-spacing: 0.5px !important;
    line-height: 1 !important;
  }

  .certificate-subtitle {
    font-size: 24px !important;
    letter-spacing: 0.5px !important;
    line-height: 1 !important;
  }

  .intro-section {
    margin: 6px 0 !important;
  }

  .intro-text {
    font-size: 10px !important;
    line-height: 1.3 !important;
    max-width: 500px !important;
  }

  .personal-info-section {
    margin: 6px 0 !important;
  }

  .info-field {
    margin-bottom: 6px !important;
  }

  .field-label {
    font-size: 10px !important;
    min-width: 100px !important;
    margin-right: 6px !important;
  }

  .field-value {
    font-size: 10px !important;
    min-height: 12px !important;
  }

  .verse-section {
    margin: 8px 0 !important;
    padding: 6px 0 !important;
  }

  .verse-text {
    font-size: 9px !important;
    margin: 0 0 3px 0 !important;
    line-height: 1.3 !important;
    max-width: 480px !important;
  }

  .verse-reference {
    font-size: 8px !important;
  }

  .membership-section {
    margin: 8px 0 !important;
  }

  .membership-title {
    font-size: 11px !important;
    margin: 0 0 8px 0 !important;
    letter-spacing: 0.3px !important;
  }

  .membership-grid {
    gap: 15px !important;
  }

  .membership-column .info-field {
    margin-bottom: 6px !important;
  }

  .marriage-info-section {
    margin: 8px 0 !important;
  }

  .signatures-section {
    margin-top: 10px !important;
    padding-top: 6px !important;
  }

  .signature-label {
    font-size: 9px !important;
    margin: 0 0 4px 0 !important;
  }

  .signature-value {
    font-size: 9px !important;
    min-width: 130px !important;
  }

  .minister-name {
    font-size: 10px !important;
    margin: 0 0 2px 0 !important;
  }

  .minister-title {
    font-size: 9px !important;
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

  .membership-grid {
    grid-template-columns: 1fr;
  }

  .signatures-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>

