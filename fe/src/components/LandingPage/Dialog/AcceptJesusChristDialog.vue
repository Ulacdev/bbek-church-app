<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="false"
    class="accept-jesus-dialog"
  >
    <div class="dialog-card">
      <!-- Header Section - Teal Background -->
      <div class="dialog-header">
        <h2 class="header-title">Join Our Church Family</h2>
        <p class="header-subtitle">Become a baptized member to participate in events.</p>
        <el-button
          text
          circle
          @click="closeDialog"
          class="close-btn"
        >
          <el-icon class="close-icon"><Close /></el-icon>
        </el-button>
      </div>

      <!-- Content Section -->
      <div class="dialog-content">
        <!-- Membership Required Box -->
        <div class="membership-box">
          <el-icon class="check-icon"><Check /></el-icon>
          <div class="membership-text">
            <p class="membership-title">Membership Required</p>
            <p class="membership-description">
              Event participation is available to baptized members of our church family.
            </p>
          </div>
        </div>

        <!-- Your Journey to Membership Section -->
        <div class="journey-section">
          <h3 class="journey-title">Your Journey to Membership</h3>
          
          <div class="steps-container">
            <!-- Step 1 -->
            <div class="step-box">
              <div class="step-number">1</div>
              <div class="step-content">
                <p class="step-title">Accept Jesus Christ</p>
                <p class="step-description">Make the decision to follow Jesus.</p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="step-box">
              <div class="step-number">2</div>
              <div class="step-content">
                <p class="step-title">Be Baptized</p>
                <p class="step-description">Publicly declare your faith.</p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="step-box">
              <div class="step-number">3</div>
              <div class="step-content">
                <p class="step-title">Join Events</p>
                <p class="step-description">Participate in church activities.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <el-button
            v-if="requestId"
            size="large"
            class="accept-btn"
            :loading="isCreatingApproval"
            :disabled="isCreatingApproval"
            @click="handleAcceptJesus"
          >
            <span class="heart-icon">❤️</span>
            {{ isCreatingApproval ? 'Submitting...' : 'Accept Jesus Christ' }}
          </el-button>
          
          <el-button
            v-else
            size="large"
            class="accept-btn"
            @click="handleAcceptJesus"
          >
            <span class="heart-icon">❤️</span>
            Accept Jesus Christ
          </el-button>
          
          <el-button
            size="large"
            class="maybe-later-btn"
            @click="handleMaybeLater"
          >
            Maybe Later
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Close, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import axios from '@/api/axios'
import { ElMessage } from 'element-plus'

const router = useRouter()

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'event', // event or ministry
    required: true
  },
  requestId: {
    type: [Number, String],
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'approval-created'])

// State
const isCreatingApproval = ref(false)

// Methods
const closeDialog = () => {
  emit('update:modelValue', false)
}

const handleJoinEvent = async () => {
  if (!props.requestId) {
    ElMessage.error('Event ID is missing')
    return
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  if (!userInfo?.account?.email) {
    ElMessage.error('User email is required')
    return
  }

  isCreatingApproval.value = true
  try {
    const approvalData = {
      type: props.type,
      email: userInfo.account.email,
      status: 'pending',
      request_id: props.requestId
    }

    const response = await axios.post('/church-records/approvals/createApproval', approvalData)
    
    if (response.data.success) {
      ElMessage.success('Your request to join has been submitted. An admin will review and approve your request.')
      // Emit event to parent component
      emit('approval-created')
      closeDialog()
    } else {
      ElMessage.error(response.data.message || 'Failed to submit join request')
    }
  } catch (error) {
    console.error('Error creating approval:', error)
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to submit join request. Please try again.'
    
    // Check if it's a duplicate error
    if (errorMessage.toLowerCase().includes('already') || errorMessage.toLowerCase().includes('duplicate')) {
      ElMessage.warning('You have already submitted a request to join.')
      emit('approval-created')
      closeDialog()
    } else {
      ElMessage.error(errorMessage)
    }
  } finally {
    isCreatingApproval.value = false
  }
}

const handleAcceptJesus = async () => {
  // If requestId is provided, create approval first
  if (props.requestId) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    if (!userInfo?.account?.email) {
      // ElMessage.error('User email is required')
      router.push({ name: 'AcceptJesusChrist' })
      return
    }

    isCreatingApproval.value = true
    try {
      const approvalData = {
        type: props.type,
        email: userInfo.account.email,
        status: 'pending',
        request_id: props.requestId
      }

      const response = await axios.post('/church-records/approvals/createApproval', approvalData)
      
      if (response.data.success) {
        ElMessage.success('Your request to join has been submitted. An admin will review and approve your request.')
        // Emit event to parent component
        emit('approval-created')
        closeDialog()
        // Navigate to Accept Jesus Christ page after approval is created
        router.push({ name: 'AcceptJesusChrist' })
      } else {
        ElMessage.error(response.data.message || 'Failed to submit join request')
      }
    } catch (error) {
      console.error('Error creating approval:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to submit join request. Please try again.'
      
      // Check if it's a duplicate error
      if (errorMessage.toLowerCase().includes('already') || errorMessage.toLowerCase().includes('duplicate')) {
        ElMessage.warning('You have already submitted a request to join.')
        emit('approval-created')
        closeDialog()
        router.push({ name: 'AcceptJesusChrist' })
      } else {
        ElMessage.error(errorMessage)
      }
    } finally {
      isCreatingApproval.value = false
    }
  } else {
    // If no requestId, just navigate
    router.push({ name: 'AcceptJesusChrist' })
    closeDialog()
  }
}

const handleMaybeLater = () => {
  closeDialog()
}
</script>

<style scoped>
.accept-jesus-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.accept-jesus-dialog :deep(.el-overlay) {
  backdrop-filter: blur(8px);
}

.dialog-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  background-color: #14b8a6;
  padding: 32px 24px 24px 24px;
  position: relative;
  border-radius: 12px 12px 0 0;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-align: center;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 14px;
  color: white;
  margin: 0;
  text-align: center;
  line-height: 1.5;
}

.close-btn {
  position: absolute;
  right: 24px;
  top: 24px;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
}

.close-icon {
  font-size: 20px;
  width: 20px;
  height: 20px;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.dialog-content {
  padding: 24px;
}

.membership-box {
  background-color: #d1fae5;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.check-icon {
  color: #16a34a;
  font-size: 24px;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.membership-text {
  flex: 1;
}

.membership-title {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.membership-description {
  font-size: 14px;
  color: #000;
  margin: 0;
  line-height: 1.5;
}

.journey-section {
  margin-bottom: 24px;
}

.journey-title {
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-box {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.step-number {
  background-color: #9ca3af;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.step-description {
  font-size: 14px;
  color: #000;
  margin: 0;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.accept-btn {
  width: 100%;
  background-color: #14b8a6 !important;
  border-color: #14b8a6 !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.accept-btn:hover {
  background-color: #0d9488 !important;
  border-color: #0d9488 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
}

.heart-icon {
  font-size: 18px;
  display: inline-block;
  margin-right: 4px;
}

.maybe-later-btn {
  width: 100%;
  background-color: white !important;
  border-color: #e0e0e0 !important;
  color: #000 !important;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  padding: 14px 24px;
  transition: all 0.3s ease;
}

.maybe-later-btn:hover {
  background-color: #f5f5f5 !important;
  border-color: #bdbdbd !important;
}
</style>

