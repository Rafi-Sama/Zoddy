"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Edit, PlusCircle, Trash2 } from 'lucide-react'

interface StockHistoryItem {
  id: number
  date: string
  time: string
  product: string
  sku?: string
  type: 'edited' | 'added' | 'deleted'
  user: string
  // For edited products
  changes?: {
    field: string
    oldValue: string | number
    newValue: string | number
  }[]
  // For added products
  initialData?: {
    sku: string
    category: string
    initialStock: number
    price: number
  }
  // For deleted products
  finalData?: {
    sku: string
    category: string
    finalStock: number
    cost?: number
    price?: number
    reason: string
  }
}

interface StockHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  history: StockHistoryItem[]
}

export function StockHistoryModal({ open, onOpenChange, history }: StockHistoryModalProps) {
  const editedItems = history.filter(item => item.type === 'edited')
  const addedItems = history.filter(item => item.type === 'added')
  const deletedItems = history.filter(item => item.type === 'deleted')

  const renderEditHistory = () => (
    <div className="space-y-1.5">
      {editedItems.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No edit history yet
        </div>
      ) : (
        editedItems.map((item) => (
          <Card key={item.id} className="border-l-2 border-l-purple-500 hover:bg-muted/30 transition-colors">
            <CardContent className="px-2.5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Edit className="h-3 w-3 text-purple-600 shrink-0" />
                  <span className="font-semibold text-xs truncate">{item.product}</span>
                  {item.sku && (
                    <span className="text-[9px] text-muted-foreground font-mono">({item.sku})</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground shrink-0">
                  <span>{item.date}</span>
                  <span>{item.time}</span>
                  <span className="font-medium">{item.user}</span>
                </div>
              </div>
              {item.changes && item.changes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.changes.map((change, idx) => (
                    <div key={idx} className="inline-flex items-center gap-1 text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                      <span className="font-medium capitalize text-muted-foreground">{change.field}:</span>
                      <span className="text-red-600">{change.oldValue}</span>
                      <span>→</span>
                      <span className="text-green-600 font-medium">{change.newValue}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )

  const renderAddHistory = () => (
    <div className="space-y-1.5">
      {addedItems.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No products added yet
        </div>
      ) : (
        addedItems.map((item) => (
          <Card key={item.id} className="border-l-2 border-l-green-500 hover:bg-muted/30 transition-colors">
            <CardContent className="px-2.5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <PlusCircle className="h-3 w-3 text-green-600 shrink-0" />
                  <span className="font-semibold text-xs truncate">{item.product}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground shrink-0">
                  <span>{item.date}</span>
                  <span>{item.time}</span>
                  <span className="font-medium">{item.user}</span>
                </div>
              </div>
              {item.initialData && (
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="ml-1 font-medium font-mono">{item.initialData.sku}</span>
                  </span>
                  <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                    <span className="text-muted-foreground">Cat:</span>
                    <span className="ml-1 font-medium">{item.initialData.category}</span>
                  </span>
                  <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                    <span className="text-muted-foreground">Stock:</span>
                    <span className="ml-1 font-medium">{item.initialData.initialStock}</span>
                  </span>
                  <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="ml-1 font-medium">৳{item.initialData.price}</span>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )

  const renderDeleteHistory = () => (
    <div className="space-y-1.5">
      {deletedItems.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No products deleted yet
        </div>
      ) : (
        deletedItems.map((item) => (
          <Card key={item.id} className="border-l-2 border-l-red-500 hover:bg-muted/30 transition-colors">
            <CardContent className="px-2.5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Trash2 className="h-3 w-3 text-red-600 shrink-0" />
                  <span className="font-semibold text-xs truncate">{item.product}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground shrink-0">
                  <span>{item.date}</span>
                  <span>{item.time}</span>
                  <span className="font-medium">{item.user}</span>
                </div>
              </div>
              {item.finalData && (
                <div className="space-y-2 mt-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="ml-1 font-medium font-mono">{item.finalData.sku}</span>
                    </span>
                    <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                      <span className="text-muted-foreground">Cat:</span>
                      <span className="ml-1 font-medium">{item.finalData.category}</span>
                    </span>
                    <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                      <span className="text-muted-foreground">Stock:</span>
                      <span className="ml-1 font-medium">{item.finalData.finalStock}</span>
                    </span>
                    <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="ml-1 font-medium">{item.finalData.cost}</span>
                    </span>
                    <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="ml-1 font-medium">{item.finalData.price}</span>
                    </span>
                  </div>
                  <div className="text-[9px] bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">
                    <span className="text-muted-foreground">Reason:</span>
                    <span className="ml-1 font-medium text-orange-800">{item.finalData.reason}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-base">Product History</DialogTitle>
          <DialogDescription className="text-xs">
            Track all product changes, additions, and deletions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all" className="text-xs">
              All ({history.length})
            </TabsTrigger>
            <TabsTrigger value="edited" className="text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Edited ({editedItems.length})
            </TabsTrigger>
            <TabsTrigger value="added" className="text-xs">
              <PlusCircle className="h-3 w-3 mr-1" />
              Added ({addedItems.length})
            </TabsTrigger>
            <TabsTrigger value="deleted" className="text-xs">
              <Trash2 className="h-3 w-3 mr-1" />
              Deleted ({deletedItems.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[450px] pr-4">
            <TabsContent value="all" className="mt-0">
              <div className="space-y-1.5">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No activity history yet
                  </div>
                ) : (
                  history.map((item) => {
                    if (item.type === 'edited') {
                      return (
                        <Card key={item.id} className="border-l-2 border-l-purple-500 hover:bg-muted/30 transition-colors">
                          <CardContent className="px-2.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <Edit className="h-3 w-3 text-purple-600 shrink-0" />
                                <span className="font-semibold text-xs truncate">{item.product}</span>
                                {item.sku && (
                                  <span className="text-[9px] text-muted-foreground font-mono">({item.sku})</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[9px] text-muted-foreground shrink-0">
                                <span>{item.date}</span>
                                <span>{item.time}</span>
                                <span className="font-medium">{item.user}</span>
                              </div>
                            </div>
                            {item.changes && item.changes.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {item.changes.map((change, idx) => (
                                  <div key={idx} className="inline-flex items-center gap-1 text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                    <span className="font-medium capitalize text-muted-foreground">{change.field}:</span>
                                    <span className="text-red-600">{change.oldValue}</span>
                                    <span>→</span>
                                    <span className="text-green-600 font-medium">{change.newValue}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    } else if (item.type === 'added') {
                      return (
                        <Card key={item.id} className="border-l-2 border-l-green-500 hover:bg-muted/30 transition-colors">
                          <CardContent className="px-2.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <PlusCircle className="h-3 w-3 text-green-600 shrink-0" />
                                <span className="font-semibold text-xs truncate">{item.product}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[9px] text-muted-foreground shrink-0">
                                <span>{item.date}</span>
                                <span>{item.time}</span>
                                <span className="font-medium">{item.user}</span>
                              </div>
                            </div>
                            {item.initialData && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                  <span className="text-muted-foreground">SKU:</span>
                                  <span className="ml-1 font-medium font-mono">{item.initialData.sku}</span>
                                </span>
                                <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                  <span className="text-muted-foreground">Cat:</span>
                                  <span className="ml-1 font-medium">{item.initialData.category}</span>
                                </span>
                                <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                  <span className="text-muted-foreground">Stock:</span>
                                  <span className="ml-1 font-medium">{item.initialData.initialStock}</span>
                                </span>
                                <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                  <span className="text-muted-foreground">Price:</span>
                                  <span className="ml-1 font-medium">৳{item.initialData.price}</span>
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    } else if (item.type === 'deleted') {
                      return (
                        <Card key={item.id} className="border-l-2 border-l-red-500 hover:bg-muted/30 transition-colors">
                          <CardContent className="px-2.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <Trash2 className="h-3 w-3 text-red-600 shrink-0" />
                                <span className="font-semibold text-xs truncate">{item.product}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[9px] text-muted-foreground shrink-0">
                                <span>{item.date}</span>
                                <span>{item.time}</span>
                                <span className="font-medium">{item.user}</span>
                              </div>
                            </div>
                            {item.finalData && (
                              <div className="space-y-2 mt-1">
                                <div className="flex flex-wrap gap-2">
                                  <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                    <span className="text-muted-foreground">SKU:</span>
                                    <span className="ml-1 font-medium font-mono">{item.finalData.sku}</span>
                                  </span>
                                  <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                    <span className="text-muted-foreground">Cat:</span>
                                    <span className="ml-1 font-medium">{item.finalData.category}</span>
                                  </span>
                                  <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                    <span className="text-muted-foreground">Stock:</span>
                                    <span className="ml-1 font-medium">{item.finalData.finalStock}</span>
                                  </span>
                                  {item.finalData.cost && (
                                    <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                      <span className="text-muted-foreground">Cost:</span>
                                      <span className="ml-1 font-medium">৳{item.finalData.cost}</span>
                                    </span>
                                  )}
                                  {item.finalData.price && (
                                    <span className="inline-flex items-center text-[9px] bg-muted/50 rounded px-1.5 py-0.5">
                                      <span className="text-muted-foreground">Price:</span>
                                      <span className="ml-1 font-medium">৳{item.finalData.price}</span>
                                    </span>
                                  )}
                                </div>
                                <div className="text-[9px] bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">
                                  <span className="text-muted-foreground">Reason:</span>
                                  <span className="ml-1 font-medium text-orange-800">{item.finalData.reason}</span>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    }
                    return null
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="edited" className="mt-0">
              {renderEditHistory()}
            </TabsContent>

            <TabsContent value="added" className="mt-0">
              {renderAddHistory()}
            </TabsContent>

            <TabsContent value="deleted" className="mt-0">
              {renderDeleteHistory()}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-between items-center pt-3 border-t">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span>Edited: {editedItems.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>Added: {addedItems.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span>Deleted: {deletedItems.length}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs px-3"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
