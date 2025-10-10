"use client"

import * as React from "react"
import { useState } from "react"
import { Upload, FileSpreadsheet, FileText, Download, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Order {
  id: string
  customer: {
    name: string
    phone: string
    address: string
  }
  date: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  amount: number
  status: string
  paymentStatus: string
  delivery: string
}

interface ImportOrdersModalProps {
  onImport: (data: Order[]) => void
  trigger?: React.ReactNode
}

export function ImportOrdersModal({ onImport, trigger }: ImportOrdersModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xls|xlsx)$/)) {
      toast.error("Invalid file type", {
        description: "Please upload a CSV or Excel file"
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File too large", {
        description: "Please upload a file smaller than 5MB"
      })
      return
    }

    setFile(file)
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setProgress(0)

    // Simulate import progress
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
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock imported data
      const today = new Date()
      const mockImportedData = [
        {
          id: "#IMP001",
          customer: { name: "Imported Customer 1", phone: "+880 1712-111111", address: "Imported Address 1" },
          date: `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`,
          items: [{ name: "Imported Product", quantity: 1, price: 1000 }],
          amount: 1000,
          status: "pending",
          paymentStatus: "pending",
          delivery: "Standard"
        }
      ]

      clearInterval(interval)
      setProgress(100)

      setTimeout(() => {
        onImport(mockImportedData)
        toast.success("Import successful!", {
          description: `Imported ${mockImportedData.length} orders from ${file.name}`
        })
        setIsOpen(false)
        setFile(null)
        setProgress(0)
      }, 500)
    } catch {
      clearInterval(interval)
      toast.error("Import failed", {
        description: "There was an error importing your file. Please check the format and try again."
      })
    } finally {
      setImporting(false)
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Import Orders
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Orders</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to import multiple orders at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          {!file ? (
            <Card
              className={cn(
                "border-2 border-dashed transition-colors cursor-pointer",
                dragActive ? "border-accent bg-accent/10" : "border-muted-foreground/25 hover:border-accent/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">Drop your file here or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports CSV, XLS, XLSX (Max 5MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  {file.name.endsWith('.csv') ? (
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
                {!importing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Progress Bar */}
          {importing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing orders...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  setFile(null)
                  setProgress(0)
                }}
                disabled={importing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || importing}
                className="bg-accent hover:bg-accent/90"
              >
                {importing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Importing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Import Orders
                  </>
                )}
              </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}