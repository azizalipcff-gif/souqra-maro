"use client"

import { BusinessWizard } from '@/components/dashboard/BusinessWizard'

export default function NewBusinessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Business</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Fill in the details to create your business listing</p>
      </div>
      <BusinessWizard />
    </div>
  )
}
