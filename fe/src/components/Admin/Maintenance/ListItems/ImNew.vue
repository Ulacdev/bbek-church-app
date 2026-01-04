<template>
  <div class="imnew-list">
    <!-- Hero Background Image -->
    <div class="list-item">
      <div class="item-label">Hero Background Image</div>
      <div class="item-preview">
        <el-image
          v-if="imNewData.heroBackgroundImage"
          :src="imNewData.heroBackgroundImage"
          fit="cover"
          class="preview-image"
        />
        <span v-else class="text-grey">No image selected</span>
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
      </div>
    </div>
    <el-divider />

    <!-- Hero Title -->
    <div class="list-item">
      <div class="item-label">Hero Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ imNewData.heroTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.heroTitle"
          size="small"
          placeholder="Hero title"
          style="max-width: 300px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Hero Subtitle -->
    <div class="list-item">
      <div class="item-label">Hero Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ imNewData.heroSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.heroSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Hero subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Plan Your Visit Button Text -->
    <div class="list-item">
      <div class="item-label">Plan Your Visit Button Text</div>
      <div class="item-preview">
        <el-button
          :style="{ backgroundColor: imNewData.planVisitButtonColor, borderColor: imNewData.planVisitButtonColor }"
          size="small"
          type="primary"
        >
          {{ imNewData.planVisitButtonText }}
        </el-button>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.planVisitButtonText"
          size="small"
          placeholder="Button text"
          style="max-width: 300px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Plan Your Visit Button Color -->
    <div class="list-item">
      <div class="item-label">Plan Your Visit Button Color</div>
      <div class="item-preview">
        <div
          class="color-preview"
          :style="{ backgroundColor: imNewData.planVisitButtonColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="imNewData.planVisitButtonColor"
          size="small"
        ></el-color-picker>
      </div>
    </div>
    <el-divider />

    <!-- Learn More About Us Button Text -->
    <div class="list-item">
      <div class="item-label">Learn More About Us Button Text</div>
      <div class="item-preview">
        <el-button
          :style="{ backgroundColor: imNewData.learnMoreButtonColor, borderColor: imNewData.learnMoreButtonColor }"
          size="small"
          type="primary"
        >
          {{ imNewData.learnMoreButtonText }}
        </el-button>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.learnMoreButtonText"
          size="small"
          placeholder="Button text"
          style="max-width: 300px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Learn More About Us Button Color -->
    <div class="list-item">
      <div class="item-label">Learn More About Us Button Color</div>
      <div class="item-preview">
        <div
          class="color-preview"
          :style="{ backgroundColor: imNewData.learnMoreButtonColor }"
        ></div>
      </div>
      <div class="item-action">
        <el-color-picker
          v-model="imNewData.learnMoreButtonColor"
          size="small"
        ></el-color-picker>
      </div>
    </div>
    <el-divider />

    <!-- Ministries Section Title -->
    <div class="list-item">
      <div class="item-label">Ministries Section Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ imNewData.ministriesTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.ministriesTitle"
          size="small"
          placeholder="Section title"
          style="max-width: 300px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Ministries Section Subtitle -->
    <div class="list-item">
      <div class="item-label">Ministries Section Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ imNewData.ministriesSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.ministriesSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Section subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Ministries Section -->
    <div class="ministries-section">
      <div class="section-header">
        <h3 class="section-title">Ministries</h3>
        <span class="section-count">{{ imNewData.ministries?.length || 0 }} items</span>
      </div>

      <div class="ministries-container">
        <div
          v-for="(ministry, idx) in imNewData.ministries"
          :key="`ministry-${idx}`"
          class="ministry-card"
        >
          <div class="ministry-header">
            <div class="ministry-main">
              <div class="ministry-number-badge">{{ idx + 1 }}</div>
              <div class="ministry-content">
                <div class="ministry-fields">
                  <div class="ministry-field">
                    <label class="ministry-field-label">Title</label>
                    <el-input
                      v-model="ministry.title"
                      size="default"
                      placeholder="Ministry title"
                      class="ministry-input"
                    />
                    <div class="ministry-meta">
                      <span class="ministry-value">{{ ministry.title }}</span>
                    </div>
                  </div>
                  <div class="ministry-field">
                    <label class="ministry-field-label">Description</label>
                    <el-input
                      v-model="ministry.description"
                      type="textarea"
                      :rows="3"
                      size="small"
                      placeholder="Ministry description"
                      class="ministry-textarea"
                    />
                    <div class="ministry-meta">
                      <span class="ministry-value">{{ ministry.description }}</span>
                    </div>
                  </div>
                  <div class="ministry-field">
                    <label class="ministry-field-label">Images</label>
                    <div class="ministry-images-preview">
                      <div
                        v-for="(img, imgIdx) in ministry.images"
                        :key="`img-${idx}-${imgIdx}`"
                        class="ministry-image-item"
                      >
                        <el-image
                          v-if="img"
                          :src="img"
                          fit="cover"
                          class="ministry-preview-image"
                        />
                        <span v-else class="text-grey">No image</span>
                      </div>
                    </div>
                    <el-upload
                      :auto-upload="false"
                      :show-file-list="false"
                      accept="image/*"
                      multiple
                      @change="(file) => handleMinistryImageChange(file, idx)"
                    >
                      <template #trigger>
                        <el-button size="small" type="primary">
                          <el-icon><Upload /></el-icon>
                          Add Images
                        </el-button>
                      </template>
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-divider />

    <!-- Baptism FAQ Section Title -->
    <div class="list-item">
      <div class="item-label">Baptism FAQ Section Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ imNewData.baptismFAQTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.baptismFAQTitle"
          size="small"
          placeholder="Section title"
          style="max-width: 300px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Baptism FAQ Section Subtitle -->
    <div class="list-item">
      <div class="item-label">Baptism FAQ Section Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ imNewData.baptismFAQSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.baptismFAQSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Section subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Baptism FAQs Section -->
    <div class="faqs-section">
      <div class="section-header">
        <h3 class="section-title">Baptism FAQs</h3>
        <span class="section-count">{{ imNewData.baptismFAQs?.length || 0 }} items</span>
      </div>

      <div class="faqs-container">
        <div
          v-for="(faq, idx) in imNewData.baptismFAQs"
          :key="`faq-${idx}`"
          class="faq-card"
        >
          <div class="faq-header">
            <div class="faq-main">
              <div class="faq-number-badge">{{ idx + 1 }}</div>
              <div class="faq-content">
                <div class="faq-fields">
                  <div class="faq-field">
                    <label class="faq-field-label">Question</label>
                    <el-input
                      v-model="faq.question"
                      size="default"
                      placeholder="FAQ question"
                      class="faq-input"
                    />
                    <div class="faq-meta">
                      <span class="faq-value">{{ faq.question }}</span>
                    </div>
                  </div>
                  <div class="faq-field">
                    <label class="faq-field-label">Answer</label>
                    <el-input
                      v-model="faq.answer"
                      type="textarea"
                      :rows="3"
                      size="small"
                      placeholder="FAQ answer"
                      class="faq-textarea"
                    />
                    <div class="faq-meta">
                      <span class="faq-value">{{ faq.answer }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-divider />

    <!-- Baptism Preparation Section Title -->
    <div class="list-item">
      <div class="item-label">Baptism Preparation Section Title</div>
      <div class="item-preview">
        <span class="text-bold">{{ imNewData.baptismPrepTitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.baptismPrepTitle"
          size="small"
          placeholder="Section title"
          style="max-width: 300px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Baptism Preparation Section Subtitle -->
    <div class="list-item">
      <div class="item-label">Baptism Preparation Section Subtitle</div>
      <div class="item-preview">
        <span class="text-grey">{{ imNewData.baptismPrepSubtitle }}</span>
      </div>
      <div class="item-action">
        <el-input
          v-model="imNewData.baptismPrepSubtitle"
          type="textarea"
          :rows="3"
          size="small"
          placeholder="Section subtitle"
          style="max-width: 400px;"
        ></el-input>
      </div>
    </div>
    <el-divider />

    <!-- Spiritual Preparation Section -->
    <div class="preparation-section">
      <div class="section-header">
        <h3 class="section-title">Spiritual Preparation</h3>
        <span class="section-count">{{ imNewData.spiritualPreparation?.length || 0 }} items</span>
      </div>

      <div class="preparation-container">
        <div
          v-for="(item, idx) in imNewData.spiritualPreparation"
          :key="`spiritual-${idx}`"
          class="preparation-card"
        >
          <div class="preparation-header">
            <div class="preparation-main">
              <div class="preparation-number-badge">{{ idx + 1 }}</div>
              <div class="preparation-content">
                <div class="preparation-fields">
                  <div class="preparation-field">
                    <label class="preparation-field-label">Title</label>
                    <el-input
                      v-model="item.title"
                      size="default"
                      placeholder="Preparation title"
                      class="preparation-input"
                    />
                    <div class="preparation-meta">
                      <span class="preparation-value">{{ item.title }}</span>
                    </div>
                  </div>
                  <div class="preparation-field">
                    <label class="preparation-field-label">Description</label>
                    <el-input
                      v-model="item.description"
                      type="textarea"
                      :rows="2"
                      size="small"
                      placeholder="Preparation description"
                      class="preparation-textarea"
                    />
                    <div class="preparation-meta">
                      <span class="preparation-value">{{ item.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-divider />

    <!-- Practical Preparation Section -->
    <div class="preparation-section">
      <div class="section-header">
        <h3 class="section-title">Practical Preparation</h3>
        <span class="section-count">{{ imNewData.practicalPreparation?.length || 0 }} items</span>
      </div>

      <div class="preparation-container">
        <div
          v-for="(item, idx) in imNewData.practicalPreparation"
          :key="`practical-${idx}`"
          class="preparation-card"
        >
          <div class="preparation-header">
            <div class="preparation-main">
              <div class="preparation-number-badge">{{ idx + 1 }}</div>
              <div class="preparation-content">
                <div class="preparation-fields">
                  <div class="preparation-field">
                    <label class="preparation-field-label">Title</label>
                    <el-input
                      v-model="item.title"
                      size="default"
                      placeholder="Preparation title"
                      class="preparation-input"
                    />
                    <div class="preparation-meta">
                      <span class="preparation-value">{{ item.title }}</span>
                    </div>
                  </div>
                  <div class="preparation-field">
                    <label class="preparation-field-label">Description</label>
                    <el-input
                      v-model="item.description"
                      type="textarea"
                      :rows="2"
                      size="small"
                      placeholder="Preparation description"
                      class="preparation-textarea"
                    />
                    <div class="preparation-meta">
                      <span class="preparation-value">{{ item.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
import { Upload } from '@element-plus/icons-vue'
import { useCms } from '@/composables/useCms'
import Loader from './Loader.vue'

// Use props if provided, otherwise use mock data
const props = defineProps({
  imNewData: {
    type: Object,
    required: false,
    default: () => ({
      heroBackgroundImage: '',
      heroBackgroundImageFile: null,
      heroTitle: 'New Here?',
      heroSubtitle: 'Discover what makes Bible Baptist Ekklesia of Kawit a place where faith, family, and community come together.',
      planVisitButtonText: 'Plan Your Visit',
      planVisitButtonColor: 'rgba(255, 255, 255, 0.2)',
      learnMoreButtonText: 'Learn More About Us',
      learnMoreButtonColor: 'rgba(255, 255, 255, 0.2)',
      ministriesTitle: 'Our Ministries',
      ministriesSubtitle: 'Discover the heart of our church through our three core ministries, each designed to nurture faith and build community at different life stages.',
      ministries: [
        {
          title: 'Youth Ministry',
          description: 'Our youth ministry focuses on spiritual growth, leadership development, and building lasting friendships. Through Bible studies, outreach activities, and fellowship events, we help young people discover their purpose and develop a strong foundation in faith.',
          images: []
        },
        {
          title: 'Adult Men Ministry',
          description: 'The adult men\'s ministry emphasizes spiritual leadership, mentorship, and brotherhood. We provide opportunities for men to grow in their faith, serve their families, and impact their communities through prayer, Bible study, and service projects.',
          images: []
        },
        {
          title: 'Adult Ladies Ministry',
          description: 'Our adult women\'s ministry creates a nurturing environment for spiritual growth, fellowship, and service. Through prayer groups, Bible studies, and outreach initiatives, we empower women to deepen their faith and support one another in their walk with Christ.',
          images: []
        }
      ],
      baptismFAQTitle: 'Baptism FAQ',
      baptismFAQSubtitle: 'Common questions about baptism that first-time visitors often ask. We\'re here to help you understand this important step in your faith journey.',
      baptismFAQs: [
        {
          question: 'Do I need to be a church member first?',
          answer: 'No, baptism is available to anyone who has made a personal decision to follow Jesus Christ. You don\'t need to be a member first - many people are baptized during their first few visits to our church.'
        },
        {
          question: 'What if I\'m not sure I\'m ready?',
          answer: 'It\'s completely normal to have questions and uncertainties. We encourage you to attend our worship services, participate in Bible studies, and speak with our pastors. We\'ll walk alongside you as you consider this step.'
        },
        {
          question: 'What happens during the baptism ceremony?',
          answer: 'The baptism service includes worship, testimony, and the baptism ceremony itself. When your name is called, you\'ll walk into the baptismal pool, share briefly about your faith journey if you wish, and be baptized by immersion in Jesus\' name.'
        },
        {
          question: 'What should I bring and wear?',
          answer: 'Bring a towel and change of clothes. We provide the baptismal clothing - typically a white t-shirt and shorts for modesty. Avoid jewelry that might be lost in water, and consider wearing modest swimwear underneath.'
        },
        {
          question: 'Can my family and friends attend?',
          answer: 'Absolutely! We encourage you to invite family and friends to witness this important moment in your faith journey. We\'ll provide them with information about service times and seating.'
        },
        {
          question: 'What happens after I\'m baptized?',
          answer: 'After baptism, you\'ll be welcomed into our church family. You\'ll have opportunities to join Bible studies, serve in ministry, and participate in various church activities as you continue growing in your faith.'
        },
        {
          question: 'What if I was baptized as a child?',
          answer: 'If you were baptized as an infant or child, we believe in believer\'s baptism as an adult when you make your own decision to follow Christ. This doesn\'t diminish your previous experience but celebrates your personal commitment.'
        },
        {
          question: 'How do I prepare spiritually?',
          answer: 'Spend time in prayer and reading the Bible, especially passages about baptism and new life in Christ. Consider attending our baptism preparation class where we\'ll discuss the meaning of baptism and answer any questions.'
        }
      ],
      baptismPrepTitle: 'Baptism Preparation Guide',
      baptismPrepSubtitle: 'Here\'s everything you need to know to prepare spiritually and practically for your baptism day. We\'re here to support you every step of the way.',
      spiritualPreparation: [
        {
          title: 'Pray and Reflect',
          description: 'Spend time in prayer asking God to prepare your heart for this important step. Reflect on your faith journey and why you want to be baptized.'
        },
        {
          title: 'Study God\'s Word',
          description: 'Read baptism-related passages like Matthew 28:19, Romans 6:4, and Acts 8:36-37 to understand the biblical foundation for baptism.'
        },
        {
          title: 'Share Your Testimony',
          description: 'Think about your faith story - how you came to know Jesus and what He means to your life today. This will help when you\'re asked to share.'
        },
        {
          title: 'Attend Preparation Class',
          description: 'Join our baptism preparation class (held the Saturday before the service) to learn more about the baptism process and ask any questions.'
        }
      ],
      practicalPreparation: [
        {
          title: 'What to Bring',
          description: 'Towel, change of clothes, and any personal items you might need. Remove jewelry that could be lost in water.'
        },
        {
          title: 'What to Wear',
          description: 'We\'ll provide baptismal clothing - a white t-shirt and shorts. Wear modest swimwear underneath for comfort and privacy.'
        },
        {
          title: 'Service Details',
          description: 'Arrive 30 minutes early on the day of your baptism. Family and friends are welcome to attend and take photos after the service.'
        },
        {
          title: 'Recovery Time',
          description: 'Plan to rest after the service. The baptismal pool is warm, but you\'ll want time to change and celebrate with loved ones.'
        }
      ]
    })
  },
  activeSection: {
    type: String,
    required: true,
    default: 'imNew'
  }
})

// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('imnew')

// Create reactive mock data if no prop is provided
const mockImNewData = reactive({
  heroBackgroundImage: '',
  heroBackgroundImageFile: null,
  heroTitle: 'New Here?',
  heroSubtitle: 'Discover what makes Bible Baptist Ekklesia of Kawit a place where faith, family, and community come together.',
  planVisitButtonText: 'Plan Your Visit',
  planVisitButtonColor: 'rgba(255, 255, 255, 0.2)',
  learnMoreButtonText: 'Learn More About Us',
  learnMoreButtonColor: 'rgba(255, 255, 255, 0.2)',
  ministriesTitle: 'Our Ministries',
  ministriesSubtitle: 'Discover the heart of our church through our three core ministries, each designed to nurture faith and build community at different life stages.',
  ministries: [
    {
      title: 'Youth Ministry',
      description: 'Our youth ministry focuses on spiritual growth, leadership development, and building lasting friendships. Through Bible studies, outreach activities, and fellowship events, we help young people discover their purpose and develop a strong foundation in faith.',
      images: []
    },
    {
      title: 'Adult Men Ministry',
      description: 'The adult men\'s ministry emphasizes spiritual leadership, mentorship, and brotherhood. We provide opportunities for men to grow in their faith, serve their families, and impact their communities through prayer, Bible study, and service projects.',
      images: []
    },
    {
      title: 'Adult Ladies Ministry',
      description: 'Our adult women\'s ministry creates a nurturing environment for spiritual growth, fellowship, and service. Through prayer groups, Bible studies, and outreach initiatives, we empower women to deepen their faith and support one another in their walk with Christ.',
      images: []
    }
  ],
  baptismFAQTitle: 'Baptism FAQ',
  baptismFAQSubtitle: 'Common questions about baptism that first-time visitors often ask. We\'re here to help you understand this important step in your faith journey.',
  baptismFAQs: [
    {
      question: 'Do I need to be a church member first?',
      answer: 'No, baptism is available to anyone who has made a personal decision to follow Jesus Christ. You don\'t need to be a member first - many people are baptized during their first few visits to our church.'
    },
    {
      question: 'What if I\'m not sure I\'m ready?',
      answer: 'It\'s completely normal to have questions and uncertainties. We encourage you to attend our worship services, participate in Bible studies, and speak with our pastors. We\'ll walk alongside you as you consider this step.'
    },
    {
      question: 'What happens during the baptism ceremony?',
      answer: 'The baptism service includes worship, testimony, and the baptism ceremony itself. When your name is called, you\'ll walk into the baptismal pool, share briefly about your faith journey if you wish, and be baptized by immersion in Jesus\' name.'
    },
    {
      question: 'What should I bring and wear?',
      answer: 'Bring a towel and change of clothes. We provide the baptismal clothing - typically a white t-shirt and shorts for modesty. Avoid jewelry that might be lost in water, and consider wearing modest swimwear underneath.'
    },
    {
      question: 'Can my family and friends attend?',
      answer: 'Absolutely! We encourage you to invite family and friends to witness this important moment in your faith journey. We\'ll provide them with information about service times and seating.'
    },
    {
      question: 'What happens after I\'m baptized?',
      answer: 'After baptism, you\'ll be welcomed into our church family. You\'ll have opportunities to join Bible studies, serve in ministry, and participate in various church activities as you continue growing in your faith.'
    },
    {
      question: 'What if I was baptized as a child?',
      answer: 'If you were baptized as an infant or child, we believe in believer\'s baptism as an adult when you make your own decision to follow Christ. This doesn\'t diminish your previous experience but celebrates your personal commitment.'
    },
    {
      question: 'How do I prepare spiritually?',
      answer: 'Spend time in prayer and reading the Bible, especially passages about baptism and new life in Christ. Consider attending our baptism preparation class where we\'ll discuss the meaning of baptism and answer any questions.'
    }
  ],
  baptismPrepTitle: 'Baptism Preparation Guide',
  baptismPrepSubtitle: 'Here\'s everything you need to know to prepare spiritually and practically for your baptism day. We\'re here to support you every step of the way.',
  spiritualPreparation: [
    {
      title: 'Pray and Reflect',
      description: 'Spend time in prayer asking God to prepare your heart for this important step. Reflect on your faith journey and why you want to be baptized.'
    },
    {
      title: 'Study God\'s Word',
      description: 'Read baptism-related passages like Matthew 28:19, Romans 6:4, and Acts 8:36-37 to understand the biblical foundation for baptism.'
    },
    {
      title: 'Share Your Testimony',
      description: 'Think about your faith story - how you came to know Jesus and what He means to your life today. This will help when you\'re asked to share.'
    },
    {
      title: 'Attend Preparation Class',
      description: 'Join our baptism preparation class (held the Saturday before the service) to learn more about the baptism process and ask any questions.'
    }
  ],
  practicalPreparation: [
    {
      title: 'What to Bring',
      description: 'Towel, change of clothes, and any personal items you might need. Remove jewelry that could be lost in water.'
    },
    {
      title: 'What to Wear',
      description: 'We\'ll provide baptismal clothing - a white t-shirt and shorts. Wear modest swimwear underneath for comfort and privacy.'
    },
    {
      title: 'Service Details',
      description: 'Arrive 30 minutes early on the day of your baptism. Family and friends are welcome to attend and take photos after the service.'
    },
    {
      title: 'Recovery Time',
      description: 'Plan to rest after the service. The baptismal pool is warm, but you\'ll want time to change and celebrate with loved ones.'
    }
  ]
})

// Create a reactive copy of prop data to allow mutations
const createReactiveCopy = (data) => {
  if (!data) return mockImNewData
  const cloned = JSON.parse(JSON.stringify(data))
  // Ensure arrays are reactive
  if (cloned.ministries && Array.isArray(cloned.ministries)) {
    cloned.ministries = cloned.ministries.map(ministry => ({
      ...ministry,
      images: ministry.images ? [...ministry.images] : []
    }))
  }
  if (cloned.baptismFAQs && Array.isArray(cloned.baptismFAQs)) {
    cloned.baptismFAQs = cloned.baptismFAQs.map(faq => ({ ...faq }))
  }
  if (cloned.spiritualPreparation && Array.isArray(cloned.spiritualPreparation)) {
    cloned.spiritualPreparation = cloned.spiritualPreparation.map(item => ({ ...item }))
  }
  if (cloned.practicalPreparation && Array.isArray(cloned.practicalPreparation)) {
    cloned.practicalPreparation = cloned.practicalPreparation.map(item => ({ ...item }))
  }
  return reactive(cloned)
}

// Use props.imNewData if provided, otherwise use mock data
const imNewData = props.imNewData 
  ? createReactiveCopy(props.imNewData) 
  : mockImNewData

// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'imNew') {
    const loadedData = await loadPageData()
    if (loadedData) {
      // Handle arrays specially
      if (loadedData.ministries && Array.isArray(loadedData.ministries)) {
        imNewData.ministries = loadedData.ministries.map(ministry => ({
          ...ministry,
          images: ministry.images ? [...ministry.images] : []
        }))
      }
      if (loadedData.baptismFAQs && Array.isArray(loadedData.baptismFAQs)) {
        imNewData.baptismFAQs = loadedData.baptismFAQs.map(faq => ({ ...faq }))
      }
      if (loadedData.spiritualPreparation && Array.isArray(loadedData.spiritualPreparation)) {
        imNewData.spiritualPreparation = loadedData.spiritualPreparation.map(item => ({ ...item }))
      }
      if (loadedData.practicalPreparation && Array.isArray(loadedData.practicalPreparation)) {
        imNewData.practicalPreparation = loadedData.practicalPreparation.map(item => ({ ...item }))
      }
      // Handle other properties
      Object.keys(loadedData).forEach(key => {
        if (!['ministries', 'baptismFAQs', 'spiritualPreparation', 'practicalPreparation'].includes(key)) {
          imNewData[key] = loadedData[key]
        }
      })
    }
  }
})

// Watch for prop changes and update reactive copy
watch(() => props.imNewData, (newData) => {
  if (newData && props.imNewData) {
    const cloned = JSON.parse(JSON.stringify(newData))
    // Update arrays
    if (cloned.ministries && Array.isArray(cloned.ministries)) {
      imNewData.ministries = cloned.ministries.map(ministry => ({
        ...ministry,
        images: ministry.images ? [...ministry.images] : []
      }))
    }
    if (cloned.baptismFAQs && Array.isArray(cloned.baptismFAQs)) {
      imNewData.baptismFAQs = cloned.baptismFAQs.map(faq => ({ ...faq }))
    }
    if (cloned.spiritualPreparation && Array.isArray(cloned.spiritualPreparation)) {
      imNewData.spiritualPreparation = cloned.spiritualPreparation.map(item => ({ ...item }))
    }
    if (cloned.practicalPreparation && Array.isArray(cloned.practicalPreparation)) {
      imNewData.practicalPreparation = cloned.practicalPreparation.map(item => ({ ...item }))
    }
    // Update other properties
    Object.keys(cloned).forEach(key => {
      if (!['ministries', 'baptismFAQs', 'spiritualPreparation', 'practicalPreparation'].includes(key)) {
        imNewData[key] = cloned[key]
      }
    })
  }
}, { deep: true })

const handleHeroImageChange = (file) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  
  imNewData.heroBackgroundImageFile = fileObj
  const reader = new FileReader()
  reader.onload = (ev) => {
    imNewData.heroBackgroundImage = ev.target?.result || imNewData.heroBackgroundImage
  }
  reader.readAsDataURL(fileObj)
}

const handleMinistryImageChange = (file, index) => {
  if (!file || !file.raw) return
  const fileObj = file.raw
  
  const reader = new FileReader()
  reader.onload = (ev) => {
    if (!imNewData.ministries[index].images) {
      imNewData.ministries[index].images = []
    }
    imNewData.ministries[index].images.push(ev.target?.result)
  }
  reader.readAsDataURL(fileObj)
}

// Save changes to CMS
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    const contentToSave = JSON.parse(JSON.stringify(imNewData))
    const imagesToSave = {}
    
    // Remove file objects
    delete contentToSave.heroBackgroundImageFile
    
    // Extract hero background image if it's base64
    if (contentToSave.heroBackgroundImage && typeof contentToSave.heroBackgroundImage === 'string' && contentToSave.heroBackgroundImage.startsWith('data:image/')) {
      imagesToSave.heroBackgroundImage = contentToSave.heroBackgroundImage
      delete contentToSave.heroBackgroundImage
    }
    
    // Extract images from ministries array (nested arrays)
    if (contentToSave.ministries && Array.isArray(contentToSave.ministries)) {
      contentToSave.ministries.forEach((ministry, ministryIndex) => {
        if (ministry.images && Array.isArray(ministry.images)) {
          ministry.images.forEach((img, imgIndex) => {
            if (typeof img === 'string' && img.startsWith('data:image/')) {
              imagesToSave[`ministries[${ministryIndex}].images[${imgIndex}]`] = img
            }
          })
          // Clear images from content, will be loaded from images
          ministry.images = []
        }
      })
    }
    
    // Save to CMS
    const success = await savePageData(contentToSave, imagesToSave)
    
    if (success) {
      // Reload data to get updated version
      const loadedData = await loadPageData()
      if (loadedData) {
        if (loadedData.ministries && Array.isArray(loadedData.ministries)) {
          imNewData.ministries = loadedData.ministries.map(ministry => ({
            ...ministry,
            images: ministry.images ? [...ministry.images] : []
          }))
        }
        if (loadedData.baptismFAQs && Array.isArray(loadedData.baptismFAQs)) {
          imNewData.baptismFAQs = loadedData.baptismFAQs.map(faq => ({ ...faq }))
        }
        if (loadedData.spiritualPreparation && Array.isArray(loadedData.spiritualPreparation)) {
          imNewData.spiritualPreparation = loadedData.spiritualPreparation.map(item => ({ ...item }))
        }
        if (loadedData.practicalPreparation && Array.isArray(loadedData.practicalPreparation)) {
          imNewData.practicalPreparation = loadedData.practicalPreparation.map(item => ({ ...item }))
        }
        Object.keys(loadedData).forEach(key => {
          if (!['ministries', 'baptismFAQs', 'spiritualPreparation', 'practicalPreparation'].includes(key)) {
            imNewData[key] = loadedData[key]
          }
        })
      }
    }
  } catch (error) {
    console.error('Error saving imNew page:', error)
  }
}
</script>

<style scoped>
.imnew-list {
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

.preview-image {
  width: 200px;
  height: 120px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

/* Ministries Section Styles */
.ministries-section {
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

.ministries-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ministry-card {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.ministry-card:hover {
  border-color: #c0c4cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.ministry-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.ministry-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.ministry-number-badge {
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

.ministry-content {
  flex: 1;
  min-width: 0;
}

.ministry-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ministry-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ministry-field-label {
  font-size: 12px;
  font-weight: 500;
  color: #606266;
}

.ministry-input {
  width: 100%;
  max-width: 400px;
}

.ministry-textarea {
  width: 100%;
  max-width: 500px;
}

.ministry-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;
}

.ministry-value {
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

.ministry-images-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.ministry-image-item {
  width: 100px;
  height: 70px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  overflow: hidden;
}

.ministry-preview-image {
  width: 100%;
  height: 100%;
}

/* FAQs Section Styles */
.faqs-section {
  width: 100%;
  margin-top: 8px;
}

.faqs-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-card {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.faq-card:hover {
  border-color: #c0c4cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.faq-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.faq-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.faq-number-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.faq-content {
  flex: 1;
  min-width: 0;
}

.faq-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-field-label {
  font-size: 12px;
  font-weight: 500;
  color: #606266;
}

.faq-input {
  width: 100%;
  max-width: 400px;
}

.faq-textarea {
  width: 100%;
  max-width: 500px;
}

.faq-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;
}

.faq-value {
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

/* Preparation Section Styles */
.preparation-section {
  width: 100%;
  margin-top: 8px;
}

.preparation-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preparation-card {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.preparation-card:hover {
  border-color: #c0c4cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.preparation-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.preparation-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.preparation-number-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.preparation-content {
  flex: 1;
  min-width: 0;
}

.preparation-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preparation-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preparation-field-label {
  font-size: 12px;
  font-weight: 500;
  color: #606266;
}

.preparation-input {
  width: 100%;
  max-width: 400px;
}

.preparation-textarea {
  width: 100%;
  max-width: 500px;
}

.preparation-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;
}

.preparation-value {
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

