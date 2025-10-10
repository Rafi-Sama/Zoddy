"use client"

import { ImportModal } from '@/components/shared/import-modal'

interface ImportCustomersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (file: File) => Promise<void>
}

export function ImportCustomersModal({ open, onOpenChange, onImport }: ImportCustomersModalProps) {
  return (
    <ImportModal
      open={open}
      onOpenChange={onOpenChange}
      onImport={onImport}
      title="Import Customers"
      description="Upload a CSV or Excel file to import multiple customers"
      requirements={[
        { label: "Column headers", description: "Name, Phone, Email, Address" },
        { label: "First row should contain headers", description: "" },
        { label: "Maximum 1000 customers per import", description: "" }
      ]}
      actionLabel="Import Customers"
    />
  )
}
