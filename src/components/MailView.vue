<template>
  <div class="email-container">
    <div class="actions">
      <button class="btn-info" @click="toggleArchived()">
        {{ email.archived ? 'To Inbox (e)' : 'To Archived (e)' }}
      </button>
      <button class="btn-info" @click="toggleRead()">
        {{ email.read ? 'Mark Unread (r)' : 'Mark Read (r)' }}
      </button>
      <button class="btn-info" @click="goNext()">Next (k)</button>
      <button class="btn-info" @click="goLast()">Last (j)</button>
    </div>
    <h2>{{ email.subject }}</h2>
    <p class="info">
      {{ email.from }}
      <span class="info">{{ format(new Date(email.sentAt), 'd MMM yyyy k:m') }}</span>
    </p>
    <div class="body" v-html="marked.parse(email.body)" />
    <button class="btn-info" @click="back()">Back</button>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { marked, parse } from 'marked'
import { ref } from 'vue'
import useKeydown from '../composables/useKeydown'

import axios from 'axios'

export default {
  props: {
    email: {
      type: Object,
      required: true
    },
    view: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    let childView = true

    useKeydown([
      {
        key: 'Escape',
        fn: () => {
          back()
        }
      },
      {
        key: 'r',
        fn: () => {
          toggleRead()
        }
      },
      {
        key: 'e',
        fn: () => {
          toggleArchived()
        }
      },
      {
        key: 'k',
        fn: () => {
          goNext()
        }
      },
      {
        key: 'j',
        fn: () => {
          goLast()
        }
      },
      {
        key: '[',
        fn: () => {
          goNextAndArchived()
        }
      },
      {
        key: ']',
        fn: () => {
          goLastAndArchived()
        }
      }
    ])

    let toggleRead = () => {
      emit('changeEmail', { toggleRead: true, save: true })
    }
    let toggleArchived = () => {
      emit('changeEmail', { toggleArchived: true, save: true, closeModal: true })
    }
    let goNext = () => {
      emit('changeEmail', { changeIndex: -1 })
    }
    let goLast = () => {
      emit('changeEmail', { changeIndex: 1 })
    }
    let goNextAndArchived = () => {
      emit('changeEmail', { changeIndex: -1, toggleArchived: true, save: true })
    }
    let goLastAndArchived = () => {
      emit('changeEmail', { changeIndex: 1, toggleArchived: true, save: true })
    }
    function updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    }
    function back() {
      childView = false
      emit('update:view', childView)
    }
    return {
      format,
      marked,
      parse,
      childView: ref(true),
      emit,
      back,
      toggleRead,
      toggleArchived,
      updateEmail,
      goNext,
      goNextAndArchived,
      goLast,
      goLastAndArchived
    }
  }
}
</script>
