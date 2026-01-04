<template>
  <div class="belief-list">
    <!-- Hero Image -->
    <div class="list-item">
      <div class="item-label">Hero Image</div>
      <div class="item-preview">
        <el-image
          v-if="beliefData.heroImage"
          :src="beliefData.heroImage"
          fit="cover"
          class="preview-image"
        />
        <span v-else class="text-grey">No file chosen</span>
      </div>
      <div class="item-action">
        <el-upload
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          @change="handleHeroImageChange"
        >
          <template #trigger>
            <el-button size="small" type="primary">
              <el-icon><Upload /></el-icon>
              Choose File
            </el-button>
          </template>
        </el-upload>
        <span v-if="!beliefData.heroImage" class="text-grey ml-2">No file chosen</span>
      </div>
    </div>
    <el-divider />

    <!-- Hero Title -->
    <div class="list-item">
      <div class="item-label">Hero Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.heroTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.heroTitle"
          size="small"
          placeholder="Enter hero title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Hero Subtitle -->
    <div class="list-item">
      <div class="item-label">Hero Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.heroSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.heroSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter hero subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Doctrinal Title -->
    <div class="list-item">
      <div class="item-label">Doctrinal Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.doctrinalTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.doctrinalTitle"
          size="small"
          placeholder="Enter doctrinal title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Doctrinal Text -->
    <div class="list-item">
      <div class="item-label">Doctrinal Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.doctrinalText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.doctrinalText"
          type="textarea"
          :rows="4"
          size="small"
          placeholder="Enter doctrinal text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Essentials Title -->
    <div class="list-item">
      <div class="item-label">Essentials Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.essentialsTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.essentialsTitle"
          size="small"
          placeholder="Enter essentials title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Essentials Text -->
    <div class="list-item">
      <div class="item-label">Essentials Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.essentialsText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.essentialsText"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter essentials text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Liberty Title -->
    <div class="list-item">
      <div class="item-label">Liberty Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.libertyTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.libertyTitle"
          size="small"
          placeholder="Enter liberty title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Liberty Text -->
    <div class="list-item">
      <div class="item-label">Liberty Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.libertyText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.libertyText"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter liberty text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Love Title (Doctrinal Section) -->
    <div class="list-item">
      <div class="item-label">Love Title (Doctrinal Section)</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.loveTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.loveTitle"
          size="small"
          placeholder="Enter love title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Love Text (Doctrinal Section) -->
    <div class="list-item">
      <div class="item-label">Love Text (Doctrinal Section)</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.loveText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.loveText"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter love text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Core Beliefs Title -->
    <div class="list-item">
      <div class="item-label">Core Beliefs Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.coreBeliefsTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.coreBeliefsTitle"
          size="small"
          placeholder="Enter core beliefs title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Core Beliefs Subtitle -->
    <div class="list-item">
      <div class="item-label">Core Beliefs Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.coreBeliefsSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.coreBeliefsSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter core beliefs subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Beliefs Section -->
    <div class="beliefs-section">
      <div class="section-header">
        <div class="section-header-left">
          <h3 class="section-title">Core Beliefs</h3>
          <span class="section-count">{{ beliefData.coreBeliefs?.length || 0 }} items</span>
        </div>
        <el-button type="primary" size="default" @click="showAddBeliefDialog">
          <el-icon><Plus /></el-icon>
          Add Belief
        </el-button>
      </div>

      <div class="beliefs-container">
        <template v-for="(belief, index) in beliefData.coreBeliefs" :key="`belief-${index}`">
          <div class="belief-card">
            <div class="belief-header">
              <div class="belief-main">
                <div class="belief-number-badge">{{ index + 1 }}</div>
                <div class="belief-content">
                  <div class="belief-fields">
                    <div class="belief-field">
                      <label class="belief-field-label">Title</label>
                      <el-input
                        v-model="belief.title"
                        size="default"
                        placeholder="Belief title"
                        class="belief-input"
                      />
                      <div class="belief-meta">
                        <span class="belief-value text-bold">{{ belief.title }}</span>
                      </div>
                    </div>
                    <div class="belief-field">
                      <label class="belief-field-label">Description</label>
                      <el-input
                        v-model="belief.description"
                        type="textarea"
                        :rows="3"
                        size="small"
                        placeholder="Belief description"
                        class="belief-textarea"
                      />
                      <div class="belief-meta">
                        <span class="belief-value">{{ belief.description }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="belief-actions">
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteBelief(index)"
                >
                  Delete
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <el-divider />

    <!-- Matter Title -->
    <div class="list-item">
      <div class="item-label">Matter Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.matterTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.matterTitle"
          size="small"
          placeholder="Enter matter title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Matter Subtitle -->
    <div class="list-item">
      <div class="item-label">Matter Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.matterSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.matterSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter matter subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Clarity Title -->
    <div class="list-item">
      <div class="item-label">Clarity Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.clarityTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.clarityTitle"
          size="small"
          placeholder="Enter clarity title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Clarity Text -->
    <div class="list-item">
      <div class="item-label">Clarity Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.clarityText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.clarityText"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter clarity text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Unity Title -->
    <div class="list-item">
      <div class="item-label">Unity Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.unityTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.unityTitle"
          size="small"
          placeholder="Enter unity title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Unity Text -->
    <div class="list-item">
      <div class="item-label">Unity Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.unityText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.unityText"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter unity text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Matter Love Title -->
    <div class="list-item">
      <div class="item-label">Matter Love Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ beliefData.matterLoveTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.matterLoveTitle"
          size="small"
          placeholder="Enter matter love title"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Matter Love Text -->
    <div class="list-item">
      <div class="item-label">Matter Love Text</div>
      <div class="item-preview">
        <span class="text-grey">{{ beliefData.matterLoveText }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.matterLoveText"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Enter matter love text"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Back Button Text -->
    <div class="list-item">
      <div class="item-label">Back Button Text</div>
      <div class="item-preview">
        <el-button
          :style="{ backgroundColor: beliefData.backButtonColor, borderColor: beliefData.backButtonColor }"
          size="small"
          type="primary"
        >
          {{ beliefData.backButtonText }}
        </el-button>
      </div>
      <div class="item-action">
        <el-input
          v-model="beliefData.backButtonText"
          size="small"
          placeholder="Button text"
          style="max-width: 300px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Back Button Color -->
    <div class="list-item">
      <div class="item-label">Back Button Color</div>
      <div class="item-preview">
        <div
          class="color-preview"
          :style="{ backgroundColor: beliefData.backButtonColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="beliefData.backButtonColor"
          size="small"
        ></el-color-picker>
      </div>
    </div>

    <!-- Add Belief Dialog -->
    <el-dialog
      v-model="addDialogVisible"
      title="Add New Belief"
      width="500px"
      @close="closeAddDialog"
    >
      <div class="edit-dialog-content">
        <div class="form-group">
          <label>Title:</label>
          <el-input
            v-model="newBelief.title"
            placeholder="Enter belief title"
            style="margin-top: 8px;"
          ></el-input>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Description:</label>
          <el-input
            v-model="newBelief.description"
            type="textarea"
            :rows="4"
            placeholder="Enter belief description"
            style="margin-top: 8px;"
          ></el-input>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddDialog">Cancel</el-button>
          <el-button type="primary" @click="addNewBelief">Add Belief</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <!-- Fixed Actions Bar -->
  <div class="actions-row-fixed">
    <div class="actions-container">
      <el-button type="primary" size="default" :loading="saving" :disabled="saving" @click="saveChanges">
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </el-button>
    </div>
  </div>

  <!-- Loader Dialog -->
  <Loader :loading="loading || saving" />
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { Upload, Plus } from '@element-plus/icons-vue'
import { useCms } from '@/composables/useCms'
import Loader from './Loader.vue'

const props = defineProps({
  beliefData: {
    type: Object,
    required: false,
    default: () => null
  },
  activeSection: {
    type: String,
    required: true,
    default: 'beliefs'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('belief')

// Default data structure aligned with landing page
const defaultBeliefData = {
  heroImage: '',
  heroTitle: 'Our Beliefs',
  heroSubtitle: 'Anchored in truth, united in love, living for Christ.',
  doctrinalTitle: 'Doctrinal Statement',
  doctrinalText: 'We believe that doctrine matters — not because it divides, but because it anchors our faith in truth. While misunderstandings can create division, essential biblical teachings are non-negotiable for us. At the same time, we honor freedom in areas where Scripture allows for diversity. Above all, we strive to grow in love.',
  essentialsTitle: 'In essentials, unity.',
  essentialsText: 'We hold tightly to core Christian truths.',
  libertyTitle: 'In non-essentials, liberty.',
  libertyText: 'We give grace for secondary theological convictions.',
  loveTitle: 'In all things, love.',
  loveText: 'Everything we believe and do is rooted in the love of Christ.',
  coreBeliefsTitle: 'Our Core Beliefs',
  coreBeliefsSubtitle: 'Our core beliefs are the foundation of our faith and practice. Here are the key doctrines we hold to, guiding our understanding of God, Scripture, and the Christian life.',
  coreBeliefs: [
    {
      title: 'The Bible',
      description: "We affirm the Bible as God's inspired, authoritative Word. It is without error in its original manuscripts and serves as the ultimate guide for faith and life."
    },
    {
      title: 'God',
      description: 'There is one eternal God, Creator of all. He exists eternally in three persons — Father, Son, and Holy Spirit — each equally divine.'
    },
    {
      title: 'Jesus Christ',
      description: 'Jesus is fully God and fully man. He was virgin-born, lived a sinless life, did miracles, died on the cross, rose bodily from the dead, and ascended to heaven where He intercedes for us.'
    },
    {
      title: 'The Holy Spirit',
      description: 'The Holy Spirit is co-equal and co-eternal with the Father and Son. He convicts the world of sin, regenerates believers, dwells within us, and empowers us for godly living.'
    },
    {
      title: 'Humanity',
      description: 'Every person is made in the image of God and has inherent dignity. But because of sin, we are separated from God. Human rebellion has corrupted our nature and left us in need of redemption.'
    },
    {
      title: 'Salvation',
      description: "Salvation is a free gift of God's grace. It is received through personal faith in Jesus Christ, and not by any works. Through Jesus' death and resurrection, we are reconciled to God."
    },
    {
      title: 'Sanctification',
      description: 'When we trust Christ, we are set apart for God. The Holy Spirit continues His work in us, renewing our minds and transforming our character to reflect Christ.'
    },
    {
      title: 'The Church',
      description: 'There is one true Church — the global body of believers. The local church is a community of believers who gather for worship, fellowship, and mission.'
    },
    {
      title: 'Kingdom of God',
      description: 'Jesus has been given all authority in heaven and on earth (Matthew 28:18). Our citizenship is in His Kingdom, not in earthly systems. We seek first His Kingdom and righteousness.'
    },
    {
      title: 'Creeds',
      description: "We affirm historic Christian creeds as faithful summaries of biblical truth. In particular, we embrace the Apostles' Creed as a unifying statement of essential Christian doctrine."
    }
  ],
  matterTitle: 'Why These Beliefs Matter',
  matterSubtitle: 'These core beliefs are not just doctrines—they shape our community, guide our decisions, and inspire our mission to love and serve others.',
  clarityTitle: 'Clarity',
  clarityText: 'These beliefs articulate who we are and what guides our decisions — from teaching to mission.',
  unityTitle: 'Unity',
  unityText: 'They help us remain grounded together, even as we differ on less central issues.',
  matterLoveTitle: 'Love',
  matterLoveText: 'Theology without love is incomplete. These beliefs shape not just what we think, but how we live and love.',
  backButtonText: 'Back to About',
  backButtonColor: '#14b8a6'
}

// Initialize with defaults to ensure all fields are reactive
const beliefData = reactive(JSON.parse(JSON.stringify(defaultBeliefData)))

// If props provide data, merge it
if (props.beliefData) {
  const propData = JSON.parse(JSON.stringify(props.beliefData))
  Object.keys(propData).forEach(key => {
    if (key === 'coreBeliefs' && Array.isArray(propData[key])) {
      beliefData.coreBeliefs = propData[key].map(belief => ({ ...belief }))
    } else {
      beliefData[key] = propData[key]
    }
  })
}

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'beliefs') {
    console.log('Loading Belief CMS data...')
    const loadedData = await loadPageData()
    console.log('Loaded data from CMS:', loadedData)
    
    if (loadedData && typeof loadedData === 'object') {
      // Merge loaded data into reactive object, preserving defaults for missing fields
      Object.keys(defaultBeliefData).forEach(key => {
        if (loadedData.hasOwnProperty(key)) {
          // Special handling for heroImage - it should be base64 after composable merges
          if (key === 'heroImage' && loadedData[key]) {
            const heroImage = loadedData[key]
            if (typeof heroImage === 'string' && heroImage.startsWith('data:image/')) {
              beliefData[key] = heroImage
              console.log(`Set ${key}: base64 image (length: ${heroImage.length})`)
            } else {
              console.log(`Hero image is not base64, keeping default`)
            }
          } else if (key === 'coreBeliefs' && Array.isArray(loadedData[key])) {
            // Handle coreBeliefs array
            beliefData.coreBeliefs = loadedData[key].map(belief => ({
              title: belief.title || '',
              description: belief.description || ''
            }))
            console.log(`Set coreBeliefs: ${beliefData.coreBeliefs.length} items`)
          } else {
            beliefData[key] = loadedData[key]
            console.log(`Set ${key}:`, loadedData[key])
          }
        } else {
          // Keep default value if not in loaded data
          console.log(`Keeping default for ${key}:`, defaultBeliefData[key])
        }
      })
      
      // Also handle any additional fields that might be in loaded data
      Object.keys(loadedData).forEach(key => {
        if (!defaultBeliefData.hasOwnProperty(key)) {
          beliefData[key] = loadedData[key]
          console.log(`Set additional field ${key}:`, loadedData[key])
        }
      })
      
      console.log('Final beliefData:', beliefData)
    } else {
      console.log('No data loaded, using defaults')
    }
  }
})

// Watch for prop changes
watch(() => props.beliefData, (newData) => {
  if (newData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    // Update coreBeliefs array
    if (cloned.coreBeliefs && Array.isArray(cloned.coreBeliefs)) {
      beliefData.coreBeliefs = cloned.coreBeliefs.map(belief => ({ ...belief }))
    }
    // Update other properties
    Object.keys(cloned).forEach(key => {
      if (key !== 'coreBeliefs') {
        beliefData[key] = cloned[key]
      }
    })
  }
}, { deep: true })

// Add dialog state
const addDialogVisible = ref(false)
const newBelief = reactive({
  title: '',
  description: ''
})

// Handle hero image change
const handleHeroImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    beliefData.heroImage = e.target.result
  }
  reader.readAsDataURL(fileObj)
}

// Show add belief dialog
const showAddBeliefDialog = () => {
  addDialogVisible.value = true
}

// Close add dialog
const closeAddDialog = () => {
  addDialogVisible.value = false
  newBelief.title = ''
  newBelief.description = ''
}

// Add new belief
const addNewBelief = () => {
  if (newBelief.title.trim()) {
    beliefData.coreBeliefs.push({
      title: newBelief.title.trim(),
      description: newBelief.description.trim()
    })
    closeAddDialog()
  } else {
    // eslint-disable-next-line no-alert
    alert('Please enter a belief title')
  }
}

// Delete belief
const deleteBelief = (index) => {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this belief?')) {
    beliefData.coreBeliefs.splice(index, 1)
  }
}

// Save changes to CMS
// Hero image is saved as BLOB in database (not in JSON)
// Flow: base64 in content → composable extracts → backend converts to Buffer → saves as BLOB
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    console.log('Saving Belief data:', beliefData)
    const contentToSave = JSON.parse(JSON.stringify(beliefData))
    
    // Keep hero image in content - composable will extract it and save as BLOB
    // The composable's extractImagesFromContent will automatically extract base64 images
    // Backend will convert base64 to Buffer and save as BLOB in tbl_cms_images
    if (contentToSave.heroImage && typeof contentToSave.heroImage === 'string' && contentToSave.heroImage.startsWith('data:image/')) {
      console.log('Hero image will be saved as BLOB (base64 length:', contentToSave.heroImage.length, ')')
    } else if (contentToSave.heroImage) {
      console.log('Hero image is not base64, keeping as is')
    }
    
    console.log('Content to save:', Object.keys(contentToSave))
    
    // Save to CMS - the composable will automatically extract base64 images
    // Backend will convert base64 to Buffer and save as BLOB in tbl_cms_images
    const success = await savePageData(contentToSave, {})
    
    if (success) {
      console.log('Save successful, reloading data...')
      // Reload data to get updated version
      const loadedData = await loadPageData(true) // Force refresh
      console.log('Reloaded data after save:', loadedData)
      
      if (loadedData && typeof loadedData === 'object') {
        // Merge reloaded data
        Object.keys(defaultBeliefData).forEach(key => {
          if (loadedData.hasOwnProperty(key)) {
            // Special handling for heroImage
            if (key === 'heroImage' && loadedData[key] && typeof loadedData[key] === 'string' && loadedData[key].startsWith('data:image/')) {
              beliefData[key] = loadedData[key]
            } else if (key === 'coreBeliefs' && Array.isArray(loadedData[key])) {
              beliefData.coreBeliefs = loadedData[key].map(belief => ({
                title: belief.title || '',
                description: belief.description || ''
              }))
            } else if (key !== 'heroImage') {
              beliefData[key] = loadedData[key]
            }
          }
        })
        
        // Handle additional fields
        Object.keys(loadedData).forEach(key => {
          if (!defaultBeliefData.hasOwnProperty(key)) {
            beliefData[key] = loadedData[key]
          }
        })
        
        console.log('Updated beliefData after reload:', beliefData)
      }
    } else {
      console.error('Save failed')
    }
  } catch (error) {
    console.error('Error saving belief page:', error)
  }
}
</script>

<style scoped>
.belief-list {
  width: 100%;
  padding-bottom: 80px; /* Add padding to prevent content from being hidden behind fixed button */
}

.list-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  gap: 16px;
}

.item-label {
  font-weight: 500;
  min-width: 150px;
  color: #606266;
}

.item-preview {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-action {
  min-width: 300px;
  display: flex;
  justify-content: flex-end;
}

.color-preview {
  width: 80px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.text-bold {
  font-weight: 600;
}

.text-grey {
  color: #909399;
  font-size: 12px;
}

.ml-2 {
  margin-left: 8px;
}

.preview-image {
  width: 300px;
  height: 180px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  object-fit: cover;
}

/* Beliefs Section Styles */
.beliefs-section {
  width: 100%;
  margin-top: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.section-count {
  font-size: 14px;
  color: #909399;
  background: #f5f7fa;
  padding: 4px 12px;
  border-radius: 12px;
}

.beliefs-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.belief-card {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.belief-card:hover {
  border-color: #c0c4cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.belief-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.belief-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.belief-number-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.belief-content {
  flex: 1;
  min-width: 0;
}

.belief-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.belief-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.belief-field-label {
  font-size: 12px;
  font-weight: 500;
  color: #606266;
}

.belief-input {
  width: 100%;
  max-width: 400px;
}

.belief-textarea {
  width: 100%;
  max-width: 500px;
}

.belief-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;
}

.belief-value {
  color: #909399;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.belief-actions {
  display: flex;
  gap: 8px;
}

.edit-dialog-content {
  padding: 8px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.actions-row-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 16px 24px;
}

.actions-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

