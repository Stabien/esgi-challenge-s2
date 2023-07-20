<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/utils'

defineProps({ variant: { default: 'default' } })

const size = 'default'
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 disabled:pointer-events-none focus:outline-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
  // Focus ring if necessary -> "focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
  {
    variants: {
      variant: {
        default:
          'bg-palette-primary-500 text-white hover:bg-palette-primary-600 dark:bg-palette-primary-400 dark:hover:bg-palette-primary-600 dark:text-white',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
        outline:
          'bg-transparent text-palette-primary-500 border border-palette-primary-500 hover:bg-palette-primary-50 dark:border-palette-primary-400 dark:text-palette-primary-400 dark:hover:bg-palette-primary-900 dark:hover:text-palette-primary-400',
        subtle:
          'bg-palette-gray-100 text-palette-gray-900 hover:bg-palette-gray-200 dark:bg-palette-gray-800 dark:text-palette-gray-300',
        ghost:
          'bg-transparent text-palette-primary-500 hover:bg-palette-primary-50 dark:hover:bg-palette-gray-900 dark:text-palette-primary-400 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
        link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-palette-gray-900 dark:text-soft-white hover:bg-transparent dark:hover:bg-transparent'
      },
      size: {
        default: 'py-2 px-4 text-md',
        sm: 'h-9 px-2 rounded-md text-sm',
        lg: 'h-11 px-8 rounded-md text-xl'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)
</script>

<template>
  <button :class="cn(buttonVariants({ variant, size }))">
    <slot></slot>
  </button>
</template>
