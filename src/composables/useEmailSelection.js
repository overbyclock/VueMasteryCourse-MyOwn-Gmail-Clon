import { reactive } from 'vue'
import axios from 'axios'

let emails = reactive(new Set())

export const useEmailSelection = function () {
  let toggle = function (email) {
    if (emails.has(email)) {
      emails.delete(email)
    } else {
      emails.add(email)
    }
  }
  let clear = () => {
    emails.clear()
  }
  let addMultiple = (newEmails) => {
    newEmails.forEach((newEmail) => {
      emails.add(newEmail)
    })
  }
  let forSelected = (fn) => {
    emails.forEach((email) => {
      fn(email)
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    })
  }
  let markRead = () => forSelected((email) => (email.read = true))

  let markUnread = () => forSelected((email) => (email.read = false))

  let markArchive = () => {
    forSelected((email) => (email.archived = true))
    clear()
  }
  let markUnarchive = () => {
    forSelected((email) => (email.archived = false))
    clear()
  }

  return {
    emails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    markArchive,
    markUnarchive
  }
}

export default useEmailSelection
