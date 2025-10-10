"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { FileUploadCard } from './file-upload-card'

interface FileRequirement {
  label: string
  description: string
}

interface ImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (file: File) => Promise<void>
  title: string
  description: string
  requirements?: FileRequirement[]
  accept?: string
  maxSize?: number
  actionLabel?: string
}

export function ImportModal({
  open,
  onOpenChange,
  onImport,
  title,
  description,
  requirements,
  accept = ".csv,.xls,.xlsx",
  maxSize = 5,
  actionLabel = "Import"
}: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImport = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      await onImport(file)
      clearInterval(interval)
      setProgress(100)

      setTimeout(() => {
        onOpenChange(false)
        setFile(null)
        setProgress(0)
        setIsProcessing(false)
      }, 500)
    } catch {
      clearInterval(interval)
      setProgress(0)
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFile(null)
    setProgress(0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <FileUploadCard
            file={file}
            onFileSelect={setFile}
            accept={accept}
            maxSize={maxSize}
            progress={progress}
            isProcessing={isProcessing}
          />

          {requirements && requirements.length > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs font-medium mb-2">File format requirements:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {requirements.map((req, idx) => (
                  <li key={idx}>• {req.label}{req.description && `: ${req.description}`}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-8 text-xs px-3"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90 h-8 text-xs px-3"
            onClick={handleImport}
            disabled={!file || isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Importing...
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-2" />
                {actionLabel}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
