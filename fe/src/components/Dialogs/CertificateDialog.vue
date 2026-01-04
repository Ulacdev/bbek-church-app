<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="`${getCertificateTitle()} Certificate`"
    width="90%"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :show-close="true"
    class="certificate-dialog"
    @close="handleClose"
    fullscreen
  >
    <div class="certificate-dialog-content">
      <!-- Marriage Certificate -->
      <MarriageCertificate
        v-if="certificateType === 'marriage' && certificateData"
        :groom-name="getGroomDisplayName(certificateData.service)"
        :bride-name="getBrideDisplayName(certificateData.service)"
        :marriage-date="certificateData.service?.marriage_date || ''"
        :marriage-location="certificateData.service?.location || ''"
        :sponsors="marriageSponsors"
        :minister-name="certificateData.service?.pastor_fullname || 'Rev. Fresco Q. Sulapas'"
      />

      <!-- Death Certificate -->
      <DeathCertificate
        v-else-if="certificateType === 'burial' && certificateData"
        :deceased-name="certificateData.service?.deceased_name || ''"
        :birth-date="certificateData.service?.deceased_birthdate || ''"
        :death-date="certificateData.service?.date_death || ''"
        :age-at-death="String(calculateAge(certificateData.service?.deceased_birthdate, certificateData.service?.date_death))"
        :place-of-death="certificateData.service?.location || ''"
        :address="certificateData.service?.member_address || ''"
        :burial-date="certificateData.service?.service_date || ''"
        :burial-location="certificateData.service?.location || ''"
        :next-of-kin="certificateData.service?.member_fullname || ''"
        :relationship="certificateData.service?.relationship || ''"
        :witness-name="certificateData.service?.member_fullname || ''"
        :minister-name="certificateData.service?.pastor_fullname || 'Rev. Fresco Q. Sulapas'"
      />

      <!-- Child Dedication Certificate -->
      <ChildDedicationCertificate
        v-else-if="certificateType === 'child_dedication' && certificateData"
        :child-name="getChildName(certificateData.service)"
        :birth-location="certificateData.service?.place_of_birth || ''"
        :birth-date="certificateData.service?.date_of_birth || ''"
        :father-name="getFatherName(certificateData.service)"
        :mother-name="getMotherName(certificateData.service)"
        :dedication-date="certificateData.service?.preferred_dedication_date || certificateData.service?.dedication_date || ''"
        :sponsors="childDedicationSponsors"
        :minister-name="'Rev. Fresco Q. Sulapas'"
      />

      <!-- Water Baptism Certificate -->
      <WaterBaptismCertificate
        v-else-if="certificateType === 'water_baptism' && certificateData"
        :name="certificateData.service?.member_fullname || ''"
        :birth-date="certificateData.service?.member_birthdate || ''"
        :address="certificateData.service?.member_address || ''"
        :baptism-date="certificateData.service?.baptism_date || ''"
        :baptism-location="certificateData.service?.baptism_location || ''"
        :year="new Date(certificateData.service?.baptism_date || certificateData.service?.date_created).getFullYear() || ''"
        :member-id="certificateData.service?.member_id || ''"
        :saved-date="certificateData.service?.member_date_created || ''"
        :fited-date="getFitedDate(certificateData.service)"
        :civil-status="certificateData.service?.civil_status || certificateData.service?.member_civil_status || ''"
        :desire-ministry="certificateData.service?.desire_ministry || ''"
        :if-married="certificateData.service?.if_married || ''"
        :spouse-name="certificateData.service?.spouse_name || ''"
        :marriage-date="certificateData.service?.marriage_date || ''"
        :witness-name="getWaterBaptismWitness(certificateData.service)"
        :minister-name="certificateData.service?.pastor_fullname || certificateData.service?.minister_fullname || 'Rev. Fresco Q. Sulapas'"
      />

      <!-- No certificate data -->
      <div v-else class="no-certificate">
        <p>Certificate data not available</p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import MarriageCertificate from '@/components/Certificates/MarriageCertificate.vue'
import DeathCertificate from '@/components/Certificates/DeathCertificate.vue'
import ChildDedicationCertificate from '@/components/Certificates/ChildDedicationCertificate.vue'
import WaterBaptismCertificate from '@/components/Certificates/WaterBaptismCertificate.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  certificateData: {
    type: Object,
    default: null
  },
  certificateType: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue' ,'print'])

// Helper function to normalize sponsors/guardians to array of strings
const normalizeSponsors = (guardians) => {
  if (!guardians) return []
  
  try {
    // If it's a string, try to parse it
    let parsed = typeof guardians === 'string' ? JSON.parse(guardians) : guardians
    
    // Ensure it's an array
    if (!Array.isArray(parsed)) {
      parsed = [parsed]
    }
    
    // Convert all items to strings (in case they're objects)
    return parsed.map(item => {
      if (typeof item === 'string') {
        return item
      } else if (typeof item === 'object' && item !== null) {
        // If it's an object, try to extract a name field or stringify it
        return item.name || item.fullname || item.firstname || JSON.stringify(item)
      } else {
        return String(item)
      }
    }).filter(item => item && item.trim() !== '') // Remove empty strings
  } catch (e) {
    console.error('Error parsing guardians:', e)
    // If parsing fails, try to use as string or return empty array
    if (typeof guardians === 'string' && guardians.trim()) {
      return [guardians]
    }
    return []
  }
}

// Computed property for marriage sponsors
const marriageSponsors = computed(() => {
  if (props.certificateType === 'marriage' && props.certificateData?.service?.guardians) {
    return normalizeSponsors(props.certificateData.service.guardians)
  }
  return []
})

// Computed property for child dedication sponsors
const childDedicationSponsors = computed(() => {
  if (props.certificateType === 'child_dedication' && props.certificateData?.service?.sponsors) {
    return normalizeSponsors(props.certificateData.service.sponsors)
  }
  return []
})

const getCertificateTitle = () => {
  const typeMap = {
    'marriage': 'Marriage',
    'burial': 'Death',
    'child_dedication': 'Child Dedication',
    'water_baptism': 'Water Baptism'
  }
  return typeMap[props.certificateType] || 'Certificate'
}

const calculateAge = (birthDate, deathDate) => {
  if (!birthDate || !deathDate) return ''
  const birth = new Date(birthDate)
  const death = new Date(deathDate)
  const age = death.getFullYear() - birth.getFullYear()
  const monthDiff = death.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
    return age - 1
  }
  return age
}

const getChildName = (service) => {
  // Get child name from the new schema fields
  if (service?.child_fullname) {
    return service.child_fullname
  }
  if (service?.child_firstname && service?.child_lastname) {
    const middleName = service.child_middle_name ? ` ${service.child_middle_name} ` : ' '
    return `${service.child_firstname}${middleName}${service.child_lastname}`.trim()
  }
  return ''
}

const getFatherName = (service) => {
  // Priority: explicit father_fullname > father name fields > requester if male
  if (service?.father_fullname && service.father_fullname.trim()) {
    return service.father_fullname.trim()
  }
  if (service?.father_firstname && service?.father_lastname) {
    const middleName = service.father_middle_name ? ` ${service.father_middle_name} ` : ' '
    const fullName = `${service.father_firstname}${middleName}${service.father_lastname}`.trim()
    if (fullName) return fullName
  }
  // Fallback: if requester is male, use requester name
  if (service?.requester_gender === 'M' && service?.requester_fullname) {
    return service.requester_fullname
  }
  return ''
}

const getMotherName = (service) => {
  // Priority: explicit mother_fullname > mother name fields > requester if female
  if (service?.mother_fullname && service.mother_fullname.trim()) {
    return service.mother_fullname.trim()
  }
  if (service?.mother_firstname && service?.mother_lastname) {
    const middleName = service.mother_middle_name ? ` ${service.mother_middle_name} ` : ' '
    const fullName = `${service.mother_firstname}${middleName}${service.mother_lastname}`.trim()
    if (fullName) return fullName
  }
  // Fallback: if requester is female, use requester name
  if (service?.requester_gender === 'F' && service?.requester_fullname) {
    return service.requester_fullname
  }
  return ''
}

const getWaterBaptismWitness = (service) => {
  // Water baptism doesn't have a witness field in the database
  // Use minister name as witness, or provide a default
  if (service?.witness_fullname) {
    return service.witness_fullname
  }
  if (service?.witness_name) {
    return service.witness_name
  }
  // Default to minister name or a standard witness
  return service?.pastor_fullname || service?.minister_fullname || 'Rev. Fresco Q. Sulapas'
}

const getFitedDate = (service) => {
  // Water baptism table doesn't have a fited_date field
  // Use fited_date if available, otherwise use baptism_date as fallback
  // (Date Fited typically refers to when the member was prepared/fitted for baptism)
  if (service?.fited_date) {
    return service.fited_date
  }
  if (service?.fitted_date) {
    return service.fitted_date
  }
  if (service?.date_fited) {
    return service.date_fited
  }
  // Fallback to baptism_date if available (when they were baptized, they were likely "fitted" for it)
  if (service?.baptism_date) {
    return service.baptism_date
  }
  return ''
}

// Helper functions to get display names for groom and bride (using only groom_name and bride_name fields)
const getGroomDisplayName = (service) => {
  if (!service) return ''
  // Use groom_name field directly (from tbl_marriageservice)
  return service.groom_name || ''
}

const getBrideDisplayName = (service) => {
  if (!service) return ''
  // Use bride_name field directly (from tbl_marriageservice)
  return service.bride_name || ''
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('print', false)
}
</script>

<style scoped>
.certificate-dialog :deep(.el-dialog__body) {
  padding: 0;
  overflow: auto;
}

.certificate-dialog-content {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}

.no-certificate {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #666;
}
</style>

