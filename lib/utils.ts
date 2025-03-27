import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function formatAmount(amount : number) : string {
  const formatter = new Intl.NumberFormat('en-US',{
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
  return formatter.format(amount)
}

export const authFormSchema = (type:string) => z.object({
  firstName: type === 'sign-in' ? z.string().optional() : z.string().min(2),
  lastName: type === 'sign-in' ? z.string().optional() : z.string().min(2),
  address: type === 'sign-in' ? z.string().optional() : z.string().max(50),
  city: type === 'sign-in' ? z.string().optional() : z.string().max(50),
  state: type === 'sign-in' ? z.string().optional() : z.string().min(2),
  postalCode: type === 'sign-in' ? z.string().optional() : z.string().min(6).max(6),
  dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().min(6),
  ssn: type === 'sign-in' ? z.string().optional() : z.string().min(2),
  // sign in
  email: z.string().email(),
  password: z.string().min(8),
})