import { format, parseISO, isToday, isTomorrow, isPast, isFuture } from 'date-fns'

export const formatDate = (date, formatString = 'PPP') => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

export const formatDateTime = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'PPP p')
}

export const formatTime = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'p')
}

export const getRelativeDate = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) return 'Today'
  if (isTomorrow(dateObj)) return 'Tomorrow'
  
  return formatDate(dateObj, 'MMM d, yyyy')
}

export const isEventPast = (date) => {
  if (!date) return false
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isPast(dateObj)
}

export const isEventFuture = (date) => {
  if (!date) return false
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isFuture(dateObj)
}

export const formatDateForInput = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, "yyyy-MM-dd'T'HH:mm")
}
