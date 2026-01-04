<template>
  <div class="preview-page">
    <div v-if="!isSpecificCertificate" class="preview-controls no-print">
      <button @click="currentCertificate = 'child'" :class="{ active: currentCertificate === 'child' }" class="preview-btn">
        Child Dedication
      </button>
      <button @click="currentCertificate = 'marriage'" :class="{ active: currentCertificate === 'marriage' }" class="preview-btn">
        Marriage Certificate
      </button>
      <button @click="currentCertificate = 'baptism'" :class="{ active: currentCertificate === 'baptism' }" class="preview-btn">
        Water Baptism
      </button>
      <button @click="currentCertificate = 'death'" :class="{ active: currentCertificate === 'death' }" class="preview-btn">
        Death Certificate
      </button>
    </div>
    
    <div v-if="isSpecificCertificate" class="back-button no-print">
      <button @click="goBack" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>
    </div>

    <ChildDedicationCertificate
      v-if="currentCertificate === 'child'"
      :childName="childDedicationData.childName"
      :birthLocation="childDedicationData.birthLocation"
      :birthDate="childDedicationData.birthDate"
      :fatherName="childDedicationData.fatherName"
      :motherName="childDedicationData.motherName"
      :dedicationDate="childDedicationData.dedicationDate"
      :sponsors="childDedicationData.sponsors"
      :ministerName="childDedicationData.ministerName"
      :churchName="childDedicationData.churchName"
      :churchAddress="childDedicationData.churchAddress"
    />

    <MarriageCertificate
      v-else-if="currentCertificate === 'marriage'"
      :groomName="marriageData.groomName"
      :brideName="marriageData.brideName"
      :marriageDate="marriageData.marriageDate"
      :marriageLocation="marriageData.marriageLocation"
      :sponsors="marriageData.sponsors"
      :ministerName="marriageData.ministerName"
      :churchName="marriageData.churchName"
      :churchAddress="marriageData.churchAddress"
    />

    <WaterBaptismCertificate
      v-else-if="currentCertificate === 'baptism'"
      :name="baptismData.name"
      :birth-date="baptismData.birthDate"
      :address="baptismData.address"
      :baptism-date="baptismData.baptismDate"
      :baptism-location="baptismData.baptismLocation"
      :year="baptismData.year"
      :member-id="baptismData.memberId"
      :saved-date="baptismData.savedDate"
      :fited-date="baptismData.fitedDate"
      :civil-status="baptismData.civilStatus"
      :desire-ministry="baptismData.desireMinistry"
      :if-married="baptismData.ifMarried"
      :spouse-name="baptismData.spouseName"
      :marriage-date="baptismData.marriageDate"
      :witness-name="baptismData.witnessName"
      :minister-name="baptismData.ministerName"
      :church-address="baptismData.churchAddress"
      :contact-number="baptismData.contactNumber"
    />

    <DeathCertificate
      v-else-if="currentCertificate === 'death'"
      :deceasedName="deathData.deceasedName"
      :birthDate="deathData.birthDate"
      :deathDate="deathData.deathDate"
      :ageAtDeath="deathData.ageAtDeath"
      :placeOfDeath="deathData.placeOfDeath"
      :address="deathData.address"
      :burialDate="deathData.burialDate"
      :burialLocation="deathData.burialLocation"
      :nextOfKin="deathData.nextOfKin"
      :relationship="deathData.relationship"
      :witnessName="deathData.witnessName"
      :ministerName="deathData.ministerName"
      :churchAddress="deathData.churchAddress"
      :contactNumber="deathData.contactNumber"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChildDedicationCertificate from '../components/Certificates/ChildDedicationCertificate.vue'
import MarriageCertificate from '../components/Certificates/MarriageCertificate.vue'
import WaterBaptismCertificate from '../components/Certificates/WaterBaptismCertificate.vue'
import DeathCertificate from '../components/Certificates/DeathCertificate.vue'

const route = useRoute()
const router = useRouter()

// Check if this is a specific certificate view (from route params)
const certificateType = route.params.type || route.query.type
const isSpecificCertificate = computed(() => !!certificateType)

// Initialize currentCertificate based on route or default to 'child'
const currentCertificate = ref(certificateType || 'child')

// Get certificate data from route state, sessionStorage, or query params
const routeCertificateData = computed(() => {
  // First try route state
  if (route.state && route.state.certificateData) {
    return route.state.certificateData
  }
  
  // Fallback to sessionStorage
  try {
    const storedData = sessionStorage.getItem('certificateData')
    if (storedData) {
      const parsed = JSON.parse(storedData)
      // Clear after reading
      sessionStorage.removeItem('certificateData')
      return parsed
    }
  } catch (e) {
    console.error('Error reading certificate data from sessionStorage:', e)
  }
  
  // Try to get from query params (for water baptism)
  if (route.query.data) {
    try {
      return JSON.parse(decodeURIComponent(route.query.data))
    } catch (e) {
      console.error('Error parsing certificate data from query:', e)
      return null
    }
  }
  return null
})

const goBack = () => {
  router.back()
}

const childDedicationData = ref({
  childName: 'John Michael Smith',
  birthLocation: 'Manila, Philippines',
  birthDate: '2020-05-15',
  fatherName: 'John Smith',
  motherName: 'Jane Smith',
  dedicationDate: '2021-06-20',
  sponsors: [
    'Michael Johnson',
    'Sarah Johnson',
    'David Williams',
    'Emily Williams',
    'Robert Brown',
    'Lisa Brown',
    'James Davis',
    'Maria Davis',
    'William Miller',
    'Anna Miller'
  ],
  ministerName: 'Rev. Fresco Q. Sulapas',
  churchName: 'BIBLE BAPTIST EKKLESIA OF KAWIT',
  churchAddress: '485 Acacia St. Villa Ramirez, Tabon 1, Kawit Cavite'
})

const marriageData = ref({
  groomName: 'John Michael Smith',
  brideName: 'Sarah Elizabeth Johnson',
  marriageDate: '2025-08-15',
  marriageLocation: '123 Anywhere St., Any City',
  sponsors: [
    'Michael Johnson',
    'Sarah Johnson',
    'David Williams'
  ],
  ministerName: 'Rev. Fresco Q. Sulapas',
  churchName: 'BIBLE BAPTIST EKKLESIA OF KAWIT',
  churchAddress: '485 Acacia St. Villa Ramirez, Tabon 1, Kawit Cavite'
})

// Computed property for baptism data - use route data if available, otherwise use default
const baptismData = computed(() => {
  if (routeCertificateData.value && currentCertificate.value === 'baptism') {
    // Handle both transaction data structure and direct service data
    let data = routeCertificateData.value
    if (data.service) {
      data = data.service
    }
    
    const baptismDate = data.baptism_date || data.baptismDate || ''
    
    return {
      name: data.member_fullname || data.name || '',
      birthDate: data.member_birthdate || data.birthdate || data.birthDate || '',
      address: data.member_address || data.address || '',
      baptismDate: baptismDate,
      baptismLocation: data.baptism_location || data.baptismLocation || '',
      year: baptismDate ? new Date(baptismDate).getFullYear().toString() : (data.year || ''),
      memberId: data.member_id || data.memberId || '',
      savedDate: data.member_date_created || data.savedDate || '',
      fitedDate: data.fited_date || data.fitted_date || data.date_fited || data.fitedDate || baptismDate,
      civilStatus: data.civil_status || data.member_civil_status || data.civilStatus || '',
      desireMinistry: data.desire_ministry || data.desireMinistry || '',
      ifMarried: data.if_married || data.ifMarried || '',
      spouseName: data.spouse_name || data.spouseName || '',
      marriageDate: data.marriage_date || data.marriageDate || '',
      witnessName: data.witness_fullname || data.witness_name || data.witnessName || '',
      ministerName: data.pastor_fullname || data.minister_fullname || data.ministerName || 'Rev. Fresco Q. Sulapas',
      churchAddress: data.churchAddress || '0559 Villa Ramirez, Tabon 1, Kawit, Cavite',
      contactNumber: data.contactNumber || '09353166809'
    }
  }
  
  // Default data for preview
  return {
    name: 'John Michael Smith',
    birthDate: '1990-05-15',
    address: '123 Main Street, Kawit, Cavite',
    baptismDate: '2024-06-20',
    baptismLocation: 'Bible Baptist Ekklesia of Kawit',
    year: '2024',
    memberId: 'BBEK-2024-001',
    savedDate: '2024-05-10',
    fitedDate: '2024-06-15',
    civilStatus: 'Single',
    desireMinistry: 'Music Ministry',
    ifMarried: 'No',
    spouseName: '',
    marriageDate: '',
    witnessName: 'Michael Johnson',
    ministerName: 'Rev. Fresco Q. Sulapas',
    churchAddress: '0559 Villa Ramirez, Tabon 1, Kawit, Cavite',
    contactNumber: '09353166809'
  }
})

onMounted(() => {
  // Set certificate type from route if available
  if (certificateType) {
    currentCertificate.value = certificateType
  }
})

const deathData = ref({
  deceasedName: 'John Michael Smith',
  birthDate: '1950-03-20',
  deathDate: '2024-12-15',
  ageAtDeath: '74 years',
  placeOfDeath: 'Manila, Philippines',
  address: '123 Main Street, Kawit, Cavite',
  burialDate: '2024-12-20',
  burialLocation: 'Kawit Memorial Cemetery',
  nextOfKin: 'Jane Smith',
  relationship: 'Spouse',
  witnessName: 'Michael Johnson',
  ministerName: 'Rev. Fresco Q. Sulapas',
  churchAddress: '0559 Villa Ramirez, Tabon 1, Kawit, Cavite',
  contactNumber: '09353166809'
})
</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  position: relative;
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #1e40af;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: #1e40af;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.back-btn:hover {
  background: #eff6ff;
  transform: translateX(-2px);
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.preview-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.preview-btn {
  padding: 10px 20px;
  background: white;
  border: 2px solid #1e40af;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: #1e40af;
}

.preview-btn:hover {
  background: #eff6ff;
}

.preview-btn.active {
  background: #1e40af;
  color: white;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>

