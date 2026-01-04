import { defineStore } from 'pinia'
import axios from '@/api/axios'

export const useMemberRegistrationStore = defineStore('memberRegistration', {
  state: () => ({
   memberRegistration: null,
   loading: false,
   error: null
  }),

  getters: {
  
  },

 actions:{

 async registerMemberFromWaterBaptism(payload) {
  console.log(payload)
  this.loading = true
  this.error = null
  try {
    const response = await axios.post('/member-registration/register/water-baptism', payload)
    if (response.status === 201) {
      this.memberRegistration = response.data.data
      return { success: true, data: response.data.data }
    } else {
      const errorList = response.data?.errors || []
      const errorMessage = response.data?.message || 'Failed to register member from water baptism'
      this.error = errorList.length > 0 ? errorList.join(', ') : errorMessage
      return { success: false, error: this.error, errors: errorList }
    }
  } catch (error) {
    const errorList = error.response?.data?.errors || []
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to register member from water baptism'
    this.error = errorList.length > 0 ? errorList.join(', ') : errorMessage
    console.error('Error registering member from water baptism:', error)
    return { success: false, error: this.error, errors: errorList }
  } finally {
    this.loading = false
  }
 },

 async registerMemberFromBurialService(payload) {
  this.loading = true
  this.error = null
  try {
    const response = await axios.post('/member-registration/register/burial-service', payload)
    if (response.status === 201) {
      this.memberRegistration = response.data.data
      return { success: true, data: response.data.data, message: response.data.message }
    } else {
      this.error = response.data.message || 'Failed to register member from burial service'
      return { success: false, error: response.data.message, errors: response.data.errors }
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to register member from burial service'
    const errorList = error.response?.data?.errors || []
    this.error = errorList.length > 0 ? errorList.join(', ') : errorMessage
    console.error('Error registering member from burial service:', error)
    return { success: false, error: this.error, errors: errorList }
  } finally {
    this.loading = false
  }
 }
},
})

