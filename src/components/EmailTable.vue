<template>
  <div class="container-screen">
    <button class="btn-info" @click="selectScreen('inbox')" :disabled="selectedScreen == 'inbox'">Inbox</button>
    <button class="btn-info" @click="selectScreen('archived')" :disabled="selectedScreen == 'archived'">Archive</button>
  </div>
  <BulkActionBar :emails="filteredEmails" :selectedScreen="selectedScreen" />

  <table v-if="!view" class="email-table">
    <tr v-for="email in filteredEmails" :key="email.id" :class="['clickeable', email.read ? '' : 'unread-email']">
      <td>
        <input type="checkbox" @click="emailSelection.toggle(email)" :checked="emailSelection.emails.has(email)" />
      </td>
      <td>{{ email.from }}</td>
      <td class="pointer" @click="openedEmail(email)">
        <p>
          <small v-if="email.read == false">UNREAD </small>
          <strong>{{ email.subject }} </strong>
          - {{ email.body }}
        </p>
      </td>
      <td class="time-data-table">
        {{ format(new Date(email.sentAt), 'd MMM yyyy k:m') }}
      </td>
      <td>
        <button v-if="selectedScreen == 'inbox'" class="btn-info" @click="eventArchive(email)">Archive</button>
        <button v-else class="btn-info" @click="eventUnarchive(email)">Unarchive</button>
      </td>
    </tr>
  </table>
  <MailView v-if="view" @changeEmail="changeEmail" :email="viewEmail" v-model:view="view" />
</template>

<script>
import { format } from 'date-fns'
import axios from 'axios'
import { ref } from 'vue'
import MailView from './MailView.vue'
import useEmailSelection from '../composables/useEmailSelection'
import BulkActionBar from './BulkActionBar.vue'

export default {
  name: 'EmailTable',
  async setup() {
    let { data: emails } = await axios.get('http://localhost:3000/emails')

    return {
      emailSelection: useEmailSelection(),
      format,
      emails: ref(emails),
      viewEmail: ref(null),
      view: ref(false),
      selectedScreen: ref('inbox')
    }
  },
  methods: {
    selectScreen(newScreen) {
      this.selectedScreen = newScreen
      this.emailSelection.clear()
    },
    eventArchive(email) {
      email.archived = true
      this.updateEmail(email)
    },
    eventUnarchive(email) {
      email.archived = false
      this.updateEmail(email)
    },
    openedEmail(email) {
      email.read = true
      this.updateEmail(email)
      this.viewEmail = email
      this.view = true
    },
    changeEmail({ toggleRead, toggleArchived, save, closeModal, changeIndex }) {
      let email = this.viewEmail
      if (toggleRead) {
        email.read = !email.read
      }
      if (toggleArchived) {
        email.archived = !email.archived
      }
      if (changeIndex) {
        let emails = this.filteredEmails
        let countEmails = emails.length - 1
        let newEmail = null
        let currentIndex = emails.indexOf(email)
        if (currentIndex - changeIndex == -1) {
          newEmail = emails[countEmails]
        } else if (currentIndex == countEmails && changeIndex != 1) {
          newEmail = emails[0]
        } else {
          newEmail = emails[currentIndex - changeIndex]
        }
        this.openedEmail(newEmail)
      }
      if (save) {
        this.updateEmail(email)
      }
      if (closeModal) {
        this.back()
      }
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    },
    back() {
      this.view = false
    }
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((emailOne, emailTwo) => {
        return emailOne.sentAt < emailTwo.sentAt ? 1 : -1
      })
    },
    filteredEmails() {
      if (this.selectedScreen == 'inbox') {
        return this.sortedEmails.filter((email) => !email.archived)
      } else {
        return this.sortedEmails.filter((email) => email.archived)
      }
    }
  },
  components: { MailView, BulkActionBar }
}
</script>

<style scoped></style>
