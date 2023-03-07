<template>
  <div class="container-actions">
    <input
      type="checkbox"
      :checked="allEmailsSelected"
      :class="[someEmailsSelected ? 'partial-check' : '']"
      @click="bulkSelectAll" />
    <button
      @click="emailSelection.markRead"
      class="btn-info"
      :disabled="Array.from(emailSelection.emails).every((email) => email.read)">
      Mark Read
    </button>
    <button
      @click="emailSelection.markUnread"
      class="btn-info"
      :disabled="Array.from(emailSelection.emails).every((email) => !email.read)">
      Mark Unread
    </button>
    <button
      v-if="selectedScreen == 'inbox'"
      @click="emailSelection.markArchive"
      class="btn-info"
      :disabled="emailSelection.emails.size === 0">
      Archive
    </button>
    <button v-else @click="emailSelection.markUnarchive" class="btn-info" :disabled="emailSelection.emails.size === 0">
      Unarchive
    </button>
  </div>
</template>

<script>
import useEmailSelection from '../composables/useEmailSelection'
import { computed } from 'vue'
export default {
  setup(props) {
    let numberEmails = computed(() => props.emails.length)
    let emailSelection = useEmailSelection()
    let numberSelected = computed(() => emailSelection.emails.size)
    let allEmailsSelected = computed(() => numberSelected.value === numberEmails.value)
    let someEmailsSelected = computed(() => numberSelected.value > 0 && numberSelected.value < numberEmails.value)

    let bulkSelectAll = function () {
      if (allEmailsSelected.value) {
        emailSelection.clear()
      } else {
        emailSelection.addMultiple(props.emails)
      }
    }
    return {
      numberEmails,
      numberSelected,
      allEmailsSelected,
      someEmailsSelected,
      emailSelection: useEmailSelection(),
      bulkSelectAll
    }
  },
  props: {
    emails: {
      type: Array,
      required: true
    },
    selectedScreen: {
      type: String,
      required: true
    }
  }
}
</script>
