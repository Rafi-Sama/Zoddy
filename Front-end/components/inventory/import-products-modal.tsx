"use client"

import { ImportModal } from '@/components/shared/import-modal'

interface ImportProductsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (file: File) => Promise<void>
}

export function ImportProductsModal({ open, onOpenChange, onImport }: ImportProductsModalProps) {
  return (
    <ImportModal
      open={open}
      onOpenChange={onOpenChange}
      onImport={onImport}
      title="Import Products"
      description="Upload a CSV or Excel file to import multiple products"
      requirements={[
        { label: "Column headers", description: "Name, SKU, Description, Category, Stock, Cost, Price" },
        { label: "First row should contain headers", description: "" },
        { label: "Maximum 1000 products per import", description: "" }
      ]}
      actionLabel="Import Products"
    />
  )
}
