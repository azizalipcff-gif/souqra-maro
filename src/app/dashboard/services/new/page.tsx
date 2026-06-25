"use client"

import { ServiceWizard } from '@/components/dashboard/ServiceWizard'

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Service</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Fill in the details to create your service listing</p>
      </div>
      <ServiceWizard />
    </div>
  )
}
