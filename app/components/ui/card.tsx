import * as React from 'react'

export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
      {...props}
    />
  )
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mb-2 text-lg font-semibold text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  )
}

export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-sm text-gray-700 dark:text-gray-300 ${className}`} {...props} />
  )
}

export function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 border-t pt-2 text-sm text-gray-500 dark:border-gray-700 ${className}`} {...props} />
  )
}
