<template>
  <div class="messages-page">
    <v-container class="py-12">
      <h1 class="text-h4 font-weight-bold mb-6">Messages & Prayer Requests</h1>

      <!-- Search and Filter Section -->
      <v-card class="mb-4" elevation="2">
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search messages..."
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-end">
              <v-btn
                variant="outlined"
                prepend-icon="mdi-filter"
                style="height: 40px;"
                @click="showStatusFilter = !showStatusFilter"
              >
                Filter by Status
              </v-btn>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-end">
              <v-btn
                variant="outlined"
                prepend-icon="mdi-filter"
                style="height: 40px;"
                @click="showCategoryFilter = !showCategoryFilter"
              >
                Filter by Category
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Messages Table -->
      <v-card elevation="2">
        <v-table>
          <thead>
            <tr>
              <th class="text-left font-weight-bold">Name</th>
              <th class="text-left font-weight-bold">Email</th>
              <th class="text-left font-weight-bold">Subject</th>
              <th class="text-left font-weight-bold">Date</th>
              <th class="text-left font-weight-bold">Category</th>
              <th class="text-left font-weight-bold">Status</th>
              <th class="text-left font-weight-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="messages.length === 0">
              <td colspan="7" class="text-center py-12">
                <div class="text-h6 font-weight-bold">No Record Found</div>
              </td>
            </tr>
            <tr v-for="message in messages" :key="message.id">
              <td>{{ message.name }}</td>
              <td>{{ message.email }}</td>
              <td>{{ message.subject }}</td>
              <td>{{ message.date }}</td>
              <td>
                <v-chip :color="getCategoryColor(message.category)" size="small">
                  {{ message.category }}
                </v-chip>
              </td>
              <td>
                <v-chip :color="getStatusColor(message.status)" size="small">
                  {{ message.status }}
                </v-chip>
              </td>
              <td>
                <v-btn icon="mdi-eye" variant="text" size="small" class="mr-2"></v-btn>
                <v-btn icon="mdi-dots-vertical" variant="text" size="small"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- Pagination -->
        <div class="d-flex justify-center align-center pa-4">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            density="compact"
          ></v-pagination>
          <span class="ml-4 text-body-2">{{ currentPage }} of {{ totalPages }}</span>
        </div>
      </v-card>
    </v-container>
    
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const showStatusFilter = ref(false)
const showCategoryFilter = ref(false)

const messages = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Prayer Request',
    date: '6/8/2023',
    category: 'Prayer Request',
    status: 'New'
  },
  {
    id: 2,
    name: 'Jennifer Garcia',
    email: 'jennifer.garcia@example.com',
    subject: 'Membership Inquiry',
    date: '6/1/2023',
    category: 'Inquiry',
    status: 'Read'
  }
])

const currentPage = ref(1)
const totalPages = ref(1)

const getCategoryColor = (category) => {
  const colors = {
    'Prayer Request': 'purple',
    'Inquiry': 'blue',
    'General': 'grey'
  }
  return colors[category] || 'default'
}

const getStatusColor = (status) => {
  const colors = {
    'New': 'green',
    'Read': 'yellow',
    'Replied': 'blue',
    'Archived': 'grey'
  }
  return colors[status] || 'default'
}
</script>

<style scoped>
.messages-page {
  min-height: 100vh;
  background: white;
  margin-top: 64px;
  padding: 24px 0;
}
</style>

