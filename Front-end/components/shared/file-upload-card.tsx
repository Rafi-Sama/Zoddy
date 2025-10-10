"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, FileSpreadsheet, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadCardProps {
  file: File | null
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number
  progress?: number
  isProcessing?: boolean
  className?: string
}

export function FileUploadCard({
  file,
  onFileSelect,
  accept = ".csv,.xls,.xlsx",
  maxSize = 5,
  progress = 0,
  isProcessing = false,
  className
}: FileUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileInput = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = accept
    input.onchange = (e) => {
      const selectedFile = (e.target as HTMLInputElement).files?.[0]
      if (selectedFile) onFileSelect(selectedFile)
    }
    input.click()
  }

  if (file) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {file.name.endsWith(".csv") ? (
              <FileText className="h-8 w-8 text-blue-500" />
            ) : (
              <FileSpreadsheet className="h-8 w-8 text-green-500" />
            )}
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFileSelect(null)}
            disabled={isProcessing}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
        {isProcessing && progress > 0 && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-colors cursor-pointer",
        isDragging ? "border-accent bg-accent/10" : "border-muted-foreground/25 hover:border-accent/50",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setIsDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) onFileSelect(droppedFile)
      }}
      onClick={handleFileInput}
    >
      <CardContent className="flex flex-col items-center justify-center py-8">
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-sm font-medium mb-1">Drop your file here or click to browse</p>
        <p className="text-xs text-muted-foreground">
          Supports {accept.replace(/\./g, '').toUpperCase()} (Max {maxSize}MB)
        </p>
      </CardContent>
    </Card>
  )
}
