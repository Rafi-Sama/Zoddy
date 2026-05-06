"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Building } from "lucide-react"
import { toast } from "sonner"

interface PaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (method: { type: string; phone?: string; last4?: string; brand?: string; bank_name?: string }) => void
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  onSuccess
}: PaymentMethodDialogProps) {
  const [loading, setLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState("bkash")

  // Form states for different payment methods
  const [bkashNumber, setBkashNumber] = useState("")
  const [nagadNumber, setNagadNumber] = useState("")
  const [rocketNumber, setRocketNumber] = useState("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  })
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    routingNumber: ""
  })

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      let paymentData: { type: string; phone?: string; last4?: string; brand?: string; bank_name?: string } = { type: selectedMethod }

      switch (selectedMethod) {
        case "bkash":
          if (!bkashNumber || bkashNumber.length !== 11) {
            toast.error("Please enter a valid bKash number")
            setLoading(false)
            return
          }
          paymentData = { type: "bkash", phone: bkashNumber }
          break

        case "nagad":
          if (!nagadNumber || nagadNumber.length !== 11) {
            toast.error("Please enter a valid Nagad number")
            setLoading(false)
            return
          }
          paymentData = { type: "nagad", phone: nagadNumber }
          break

        case "rocket":
          if (!rocketNumber || rocketNumber.length !== 11) {
            toast.error("Please enter a valid Rocket number")
            setLoading(false)
            return
          }
          paymentData = { type: "rocket", phone: rocketNumber }
          break

        case "card":
          if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
            toast.error("Please fill in all card details")
            setLoading(false)
            return
          }
          paymentData = {
            type: "card",
            last4: cardDetails.number.slice(-4),
            brand: detectCardBrand(cardDetails.number)
          }
          break

        case "bank":
          if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
            toast.error("Please fill in required bank details")
            setLoading(false)
            return
          }
          paymentData = {
            type: "bank_transfer",
            bank_name: bankDetails.bankName,
            last4: bankDetails.accountNumber.slice(-4)
          }
          break
      }

      toast.success("Payment method added successfully")
      onSuccess?.(paymentData)
      onOpenChange(false)
      resetForms()
    } catch {
      toast.error("Failed to add payment method. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForms = () => {
    setBkashNumber("")
    setNagadNumber("")
    setRocketNumber("")
    setCardDetails({ number: "", name: "", expiry: "", cvv: "" })
    setBankDetails({
      accountName: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      routingNumber: ""
    })
  }

  const detectCardBrand = (number: string): string => {
    const firstDigit = number[0]
    if (firstDigit === "4") return "Visa"
    if (firstDigit === "5") return "MasterCard"
    if (firstDigit === "3") return "AMEX"
    return "Unknown"
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4)
    }
    return v
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method for subscription billing
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="mt-4">
          <TabsList className="grid grid-cols-3 h-auto p-1">
            <TabsTrigger value="bkash" className="flex flex-col gap-1 h-auto py-2">
              <span className="text-lg">📱</span>
              <span className="text-xs">bKash</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="flex flex-col gap-1 h-auto py-2">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">Card</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex flex-col gap-1 h-auto py-2">
              <Building className="h-4 w-4" />
              <span className="text-xs">Bank</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bkash" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">bKash Payment</CardTitle>
                <CardDescription>
                  Link your bKash account for automatic payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bkash-number">bKash Number</Label>
                  <Input
                    id="bkash-number"
                    placeholder="01XXXXXXXXX"
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    maxLength={11}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your 11-digit bKash number
                  </p>
                </div>

                <div className="rounded-lg bg-pink-50 dark:bg-pink-950/20 p-3 text-sm">
                  <p className="font-medium text-pink-700 dark:text-pink-400 mb-1">How it works:</p>
                  <ol className="text-xs space-y-1 text-pink-600 dark:text-pink-300">
                    <li>1. Enter your bKash number</li>
                    <li>2. You&apos;ll receive an OTP for verification</li>
                    <li>3. Confirm the OTP to link your account</li>
                    <li>4. Payments will be auto-deducted monthly</li>
                  </ol>
                </div>

                <RadioGroup defaultValue="personal" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal">Personal Account</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="merchant" id="merchant" />
                    <Label htmlFor="merchant">Merchant Account</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Credit/Debit Card</CardTitle>
                <CardDescription>
                  Add a Visa, MasterCard, or AMEX card
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      number: formatCardNumber(e.target.value)
                    })}
                    maxLength={19}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      name: e.target.value
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Expiry Date</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        expiry: formatExpiry(e.target.value)
                      })}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      placeholder="123"
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        cvv: e.target.value.replace(/\D/g, "")
                      })}
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CreditCard className="h-3 w-3" />
                  <span>Your card information is encrypted and secure</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Bank Transfer</CardTitle>
                <CardDescription>
                  Set up automatic bank transfers for your subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Holder Name</Label>
                  <Input
                    id="account-name"
                    placeholder="John Doe"
                    value={bankDetails.accountName}
                    onChange={(e) => setBankDetails({
                      ...bankDetails,
                      accountName: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    placeholder="1234567890"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({
                      ...bankDetails,
                      accountNumber: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    placeholder="e.g., Dutch-Bangla Bank"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({
                      ...bankDetails,
                      bankName: e.target.value
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch-name">Branch Name</Label>
                    <Input
                      id="branch-name"
                      placeholder="e.g., Dhanmondi"
                      value={bankDetails.branchName}
                      onChange={(e) => setBankDetails({
                        ...bankDetails,
                        branchName: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routing-number">Routing Number</Label>
                    <Input
                      id="routing-number"
                      placeholder="Optional"
                      value={bankDetails.routingNumber}
                      onChange={(e) => setBankDetails({
                        ...bankDetails,
                        routingNumber: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-blue-600 dark:text-blue-400">
                  <p className="font-medium mb-1">Note:</p>
                  <p>Bank transfers may take 1-2 business days to process. Your subscription will be activated once payment is confirmed.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional payment methods */}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                toast.info("Nagad and Rocket payment methods coming soon!")
              }}
            >
              Looking for Nagad or Rocket? Coming soon!
            </Button>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Payment Method"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}