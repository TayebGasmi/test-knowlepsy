import {z} from 'zod'

export const loginSchema = z.object({
  email: z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address'),
  password: z
  .string()
  .min(1, 'Password is required'),
})

export const signupSchema = z.object({
  name: z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters'),
  email: z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address'),
  password: z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be less than 100 characters'),
})

export const eventSchema = z.object({
  title: z
  .string()
  .min(1, 'Title is required')
  .max(200, 'Title must be less than 200 characters'),
  description: z
  .string()
  .min(1, 'Description is required')
  .max(2000, 'Description must be less than 2000 characters'),
  date: z
  .string()
  .min(1, 'Date is required')
  .refine((date) => {
    const eventDate = new Date(date)
    return eventDate > new Date() && !isNaN(eventDate.getTime())
  }, 'Event date must be in the future'),
  location: z
  .string()
  .min(1, 'Location is required')
  .max(200, 'Location must be less than 200 characters'),
  capacity: z
  .number()
  .min(1, 'Capacity must be at least 1')
  .max(10000, 'Capacity must be less than 10000'),
})
