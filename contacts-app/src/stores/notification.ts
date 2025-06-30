import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type notification } from '@/interfaces/notification'

export const useNotification = defineStore('notification', () => {
  let notificationsArray = reactive([] as notification[])

  function addNotification(notification: notification): void {
    notificationsArray.push(notification)
  }
  function isEmpty(): Boolean {
    return notificationsArray.length == 0
  }
  function removeNotification(notification: notification): void {
    notificationsArray.splice(notificationsArray.indexOf(notification), 1)
  }
  function getIndex(notification: notification): number {
    return notificationsArray.indexOf(notification)
  }

  return {
    notificationsArray,
    addNotification,
    isEmpty,
    removeNotification,
    getIndex,
  }
})
