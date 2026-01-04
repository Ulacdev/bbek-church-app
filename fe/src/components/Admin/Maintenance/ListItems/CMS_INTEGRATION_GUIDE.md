# CMS Integration Guide for ListItems Components

This guide shows how to integrate the CMS API into all ListItems components. The pattern has been applied to:
- ✅ Home.vue
- ✅ About.vue
- ✅ Header.vue
- ✅ Services.vue

## Pattern to Follow

### 1. Import Required Dependencies

Add these imports at the top of the `<script setup>` section:

```javascript
import { reactive, ref, watch, onMounted } from 'vue'
import { useCms } from '@/composables/useCms'
```

### 2. Initialize CMS Composable

Add this after the props definition (replace `'pagename'` with your actual page name):

```javascript
// Initialize CMS composable
const { loading, saving, loadPageData, savePageData } = useCms('pagename')
```

**Page Name Mapping:**
- `Header.vue` → `'header'`
- `Home.vue` → `'home'`
- `About.vue` → `'about'`
- `ImNew.vue` → `'imnew'`
- `Services.vue` → `'services'`
- `Events.vue` → `'events'`
- `Give.vue` → `'give'`
- `Footer.vue` → `'footer'`
- `PlanVisit.vue` → `'planvisit'`
- `WaterBaptism.vue` → `'waterbaptism'`
- `BurialService.vue` → `'burialservice'`
- `Sermons.vue` → `'sermons'`
- `YoungPeople.vue` → `'youngpeople'`
- `AdultMen.vue` → `'adultmen'`
- `AdultLadies.vue` → `'adultladies'`
- `LearnMoreMinistry.vue` → `'learnmoreministry'`
- `LearnMoreEvents.vue` → `'learnmoreevents'`
- `AcceptJesus.vue` → `'acceptjesus'`
- `Belief.vue` → `'belief'`
- `ChurchLeader.vue` → `'churchleader'`
- `DepartmentOfficer.vue` → `'departmentofficer'`
- `OurStory.vue` → `'ourstory'`

### 3. Add onMounted Hook

Add this after your reactive data initialization:

```javascript
// Load data from CMS on mount
onMounted(async () => {
  if (props.activeSection === 'your-section-name') {
    const loadedData = await loadPageData()
    if (loadedData) {
      // Merge loaded data into your component data
      Object.keys(loadedData).forEach(key => {
        if (key === 'arrayField' && Array.isArray(loadedData[key])) {
          yourData.arrayField = loadedData[key].map(item => ({ ...item }))
        } else {
          yourData[key] = loadedData[key]
        }
      })
    }
  }
})
```

### 4. Update saveChanges Function

Replace the existing `saveChanges` function with this pattern:

```javascript
// Save changes to CMS
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    // Prepare content (remove file objects and imagePath fields)
    const contentToSave = JSON.parse(JSON.stringify(yourData))
    const imagesToSave = {}
    
    // Remove file objects
    delete contentToSave.someFileField
    
    // Extract images from content
    // For simple image fields:
    if (contentToSave.imageField && typeof contentToSave.imageField === 'string' && contentToSave.imageField.startsWith('data:')) {
      imagesToSave.imageField = contentToSave.imageField
      delete contentToSave.imageField
    }
    
    // For images in arrays:
    if (contentToSave.items && Array.isArray(contentToSave.items)) {
      contentToSave.items.forEach((item, index) => {
        delete item.imagePath
        if (item.image && typeof item.image === 'string' && item.image.startsWith('data:')) {
          imagesToSave[`items[${index}].image`] = item.image
          item.image = ''
        }
      })
    }
    
    // For nested objects:
    Object.keys(contentToSave).forEach(key => {
      if (typeof contentToSave[key] === 'object' && contentToSave[key] !== null && !Array.isArray(contentToSave[key])) {
        const obj = contentToSave[key]
        if (obj.image && typeof obj.image === 'string' && obj.image.startsWith('data:')) {
          imagesToSave[`${key}.image`] = obj.image
        }
        delete obj.imagePath
      }
    })
    
    // Save to CMS
    const success = await savePageData(contentToSave, imagesToSave)
    
    if (success) {
      // Reload data to get updated version
      const loadedData = await loadPageData()
      if (loadedData) {
        Object.keys(loadedData).forEach(key => {
          if (key === 'arrayField' && Array.isArray(loadedData[key])) {
            yourData.arrayField = loadedData[key].map(item => ({ ...item }))
          } else {
            yourData[key] = loadedData[key]
          }
        })
      }
    }
  } catch (error) {
    console.error('Error saving page:', error)
  }
}
```

## Component-Specific Examples

### Simple Component (e.g., Events.vue, Give.vue)

```javascript
// Save changes
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    const contentToSave = JSON.parse(JSON.stringify(eventsData))
    const imagesToSave = {}
    
    // Extract hero image
    if (contentToSave.heroImage && typeof contentToSave.heroImage === 'string' && contentToSave.heroImage.startsWith('data:')) {
      imagesToSave.heroImage = contentToSave.heroImage
      delete contentToSave.heroImage
    }
    
    const success = await savePageData(contentToSave, imagesToSave)
    
    if (success) {
      const loadedData = await loadPageData()
      if (loadedData) {
        Object.assign(eventsData, loadedData)
      }
    }
  } catch (error) {
    console.error('Error saving events page:', error)
  }
}
```

### Component with Array of Items (e.g., Services.vue)

```javascript
// Save changes
const saveChanges = async () => {
  if (saving.value) return
  
  try {
    const contentToSave = JSON.parse(JSON.stringify(servicesData))
    const imagesToSave = {}
    
    if (contentToSave.services && Array.isArray(contentToSave.services)) {
      contentToSave.services.forEach((service, index) => {
        delete service.imagePath
        if (service.image && typeof service.image === 'string' && service.image.startsWith('data:')) {
          imagesToSave[`services[${index}].image`] = service.image
          service.image = ''
        }
      })
    }
    
    const success = await savePageData(contentToSave, imagesToSave)
    
    if (success) {
      const loadedData = await loadPageData()
      if (loadedData && loadedData.services) {
        servicesData.services = loadedData.services.map(s => ({ ...s }))
      }
    }
  } catch (error) {
    console.error('Error saving services page:', error)
  }
}
```

## Key Points

1. **Images are stored separately** - Extract base64 images from content and save them in the `imagesToSave` object
2. **Remove file objects** - Delete any `File` objects or `imagePath` fields before saving
3. **Use field paths for nested images** - For images in arrays or nested objects, use paths like `services[0].image` or `section.image`
4. **Reload after save** - Always reload data after successful save to get the updated version from the server
5. **Handle arrays properly** - When merging loaded data, map arrays to ensure reactivity

## Remaining Components to Update

- [ ] Events.vue
- [ ] Give.vue
- [ ] Footer.vue
- [ ] PlanVisit.vue
- [ ] WaterBaptism.vue
- [ ] BurialService.vue
- [ ] Sermons.vue
- [ ] YoungPeople.vue
- [ ] AdultMen.vue
- [ ] AdultLadies.vue
- [ ] LearnMoreMinistry.vue
- [ ] LearnMoreEvents.vue
- [ ] AcceptJesus.vue
- [ ] Belief.vue
- [ ] ChurchLeader.vue
- [ ] DepartmentOfficer.vue
- [ ] OurStory.vue
- [ ] ImNew.vue

## Testing

After updating each component:

1. Check that data loads on mount
2. Verify images display correctly
3. Test saving changes
4. Confirm data persists after page reload

