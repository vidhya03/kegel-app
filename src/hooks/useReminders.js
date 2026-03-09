import { useEffect, useRef, useCallback, useState } from 'react'

// useReminders — daily reminder via Web Notifications API
// Works when app is open; fires at the scheduled time if the user is in the app.
// No service worker required for this basic implementation.

const REMINDER_FIRED_KEY = 'kc_reminder_last_fired'

function getPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission // 'default' | 'granted' | 'denied'
}

function didFireToday() {
  const last = localStorage.getItem(REMINDER_FIRED_KEY)
  if (!last) return false
  return new Date(last).toDateString() === new Date().toDateString()
}

function markFiredToday() {
  localStorage.setItem(REMINDER_FIRED_KEY, new Date().toISOString())
}

function fireNotification() {
  try {
    new Notification('KegelCoach', {
      body: "Time for your daily session! Keep the streak going.",
      icon: '/favicon.svg',
      tag: 'kc-daily-reminder'
    })
    markFiredToday()
  } catch {
    // silently fail if blocked
  }
}

export function useReminders(settings) {
  const [permission, setPermission] = useState(getPermission)
  const intervalRef = useRef(null)

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported'
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])

  // Check every minute if the reminder time has been reached
  useEffect(() => {
    if (!settings?.reminderEnabled || permission !== 'granted') return

    const check = () => {
      if (didFireToday()) return
      const now = new Date()
      const [h, m] = (settings.reminderTime || '08:00').split(':').map(Number)
      if (now.getHours() === h && now.getMinutes() === m) {
        fireNotification()
      }
    }

    check() // run immediately on mount in case time already passed
    intervalRef.current = setInterval(check, 60_000)

    return () => clearInterval(intervalRef.current)
  }, [settings?.reminderEnabled, settings?.reminderTime, permission])

  const sendTestNotification = useCallback(() => {
    if (permission !== 'granted') return
    try {
      new Notification('KegelCoach — Test', {
        body: 'Reminders are working! See you at ' + (settings?.reminderTime || '08:00'),
        icon: '/favicon.svg',
        tag: 'kc-test'
      })
    } catch {
      // silently fail
    }
  }, [permission, settings?.reminderTime])

  return { permission, requestPermission, sendTestNotification }
}
