"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ShieldCheck,
  Lock,
  Truck,
  Check,
  CreditCard,
  Smartphone,
  Building2,
  ArrowLeft,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"

const DISCOUNT = 200
const SHIPPING = 99
const TAX_RATE = 0.18
const FREE_SHIPPING_THRESHOLD = 1999

type Step = "shipping" | "payment" | "confirmation"

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const [step, setStep] = useState<Step>("shipping")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card")

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  })

  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })

  const [upiId, setUpiId] = useState("")
  const [orderPlaced, setOrderPlaced] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING
  const tax = Math.round(subtotal * TAX_RATE)
  const grandTotal = subtotal - DISCOUNT + shippingCost + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderPlaced(true)
    setStep("confirmation")
    clearCart()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen bg-[#faf5f3] font-sans text-neutral-800">
      {/* Announcement bar */}
      <div className="bg-[#8B4513] px-4 py-2.5 text-center text-xs text-white">
        {"♡ Vegan \u2022 100% cruelty free & plant powered | "}
        <span className="font-semibold">Dermatest Tested</span>
        {" \u2013 Safe for sensitive skin"}
      </div>

      {/* Header */}
      <header className="border-b border-[#f0d8c8] bg-[#faf5f3]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" aria-label="AURAFIRM home">
            <Image
              src="https://res.cloudinary.com/df01whs60/image/upload/v1782242359/AURAFIRM_logo_PNG_160x_drciiz.avif"
              alt="AURAFIRM logo"
              width={140}
              height={50}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
            <ShieldCheck className="h-4 w-4 text-[#c9744e]" />
            100% Secure Checkout
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-800">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/cart" className="hover:text-neutral-800">Cart</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-neutral-700">Checkout</span>
        </nav>

        {/* Progress steps */}
        {!orderPlaced && (
          <div className="mb-8 flex items-center gap-0">
            {(["shipping", "payment"] as const).map((s, i) => {
              const isActive = step === s
              const isDone =
                (s === "shipping" && step === "payment") ||
                (s === "shipping" && step === "confirmation") ||
                (s === "payment" && step === "confirmation")
              return (
                <div key={s} className="flex flex-1 items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        isDone
                          ? "bg-[#6b8f5e] text-white"
                          : isActive
                          ? "bg-[#c9744e] text-white"
                          : "bg-[#f0d8c8] text-neutral-500"
                      }`}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span
                      className={`text-xs font-semibold capitalize ${
                        isActive ? "text-[#c9744e]" : isDone ? "text-[#6b8f5e]" : "text-neutral-400"
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                  {i < 1 && (
                    <div className="mx-3 flex-1 border-t-2 border-dashed border-[#f0d8c8]" />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Confirmation screen */}
        {orderPlaced && (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-[#f0d8c8] bg-white p-10 text-center shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eef5eb]">
              <Check className="h-10 w-10 text-[#6b8f5e]" />
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-800">Order Placed Successfully!</h1>
            <p className="max-w-sm text-sm text-neutral-500 leading-relaxed">
              Thank you for shopping with Aurafirm. Your order has been confirmed and will be shipped within 24 hours. You will receive a confirmation email shortly.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="rounded-xl bg-[#c9744e] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#b86244]"
              >
                Continue Shopping
              </Link>
              <button className="rounded-xl border border-[#c9744e] px-8 py-3 text-sm font-bold text-[#c9744e] transition-colors hover:bg-[#fdf6f2]">
                Track Order
              </button>
            </div>
          </div>
        )}

        {!orderPlaced && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
            {/* LEFT: Form */}
            <div>
              {step === "shipping" && (
                <form onSubmit={handleShippingSubmit} className="rounded-2xl border border-[#f0d8c8] bg-white p-6 shadow-sm">
                  <h2 className="text-base font-extrabold text-neutral-900">Shipping Information</h2>
                  <p className="mt-0.5 text-xs text-neutral-500">Enter your delivery details</p>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        First Name <span className="text-[#c9744e]">*</span>
                      </label>
                      <input
                        required
                        value={form.firstName}
                        onChange={(e) => updateForm("firstName", e.target.value)}
                        placeholder="Aanya"
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        Last Name <span className="text-[#c9744e]">*</span>
                      </label>
                      <input
                        required
                        value={form.lastName}
                        onChange={(e) => updateForm("lastName", e.target.value)}
                        placeholder="Sharma"
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        Email <span className="text-[#c9744e]">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        placeholder="aanya@example.com"
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        Phone <span className="text-[#c9744e]">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        Address <span className="text-[#c9744e]">*</span>
                      </label>
                      <input
                        required
                        value={form.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                        placeholder="House/Flat No., Street, Area"
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        City <span className="text-[#c9744e]">*</span>
                      </label>
                      <input
                        required
                        value={form.city}
                        onChange={(e) => updateForm("city", e.target.value)}
                        placeholder="Mumbai"
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        State <span className="text-[#c9744e]">*</span>
                      </label>
                      <input
                        required
                        value={form.state}
                        onChange={(e) => updateForm("state", e.target.value)}
                        placeholder="Maharashtra"
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        Pincode <span className="text-[#c9744e]">*</span>
                      </label>
                      <input
                        required
                        value={form.pincode}
                        onChange={(e) => updateForm("pincode", e.target.value)}
                        placeholder="400001"
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">Country</label>
                      <select
                        value={form.country}
                        onChange={(e) => updateForm("country", e.target.value)}
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      >
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href="/cart"
                      className="flex items-center gap-1.5 text-sm text-[#c9744e] transition-colors hover:text-[#b86244]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Cart
                    </Link>
                    <button
                      type="submit"
                      className="ml-auto rounded-xl bg-[#8B4513] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#7a3c10]"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="rounded-2xl border border-[#f0d8c8] bg-white p-6 shadow-sm">
                  <h2 className="text-base font-extrabold text-neutral-900">Payment</h2>
                  <p className="mt-0.5 text-xs text-neutral-500">Choose your payment method</p>

                  {/* Payment method tabs */}
                  <div className="mt-5 flex gap-3">
                    {(
                      [
                        { id: "card", icon: CreditCard, label: "Card" },
                        { id: "upi", icon: Smartphone, label: "UPI" },
                        { id: "netbanking", icon: Building2, label: "Net Banking" },
                      ] as const
                    ).map(({ id, icon: Icon, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-xs font-semibold transition-colors ${
                          paymentMethod === id
                            ? "border-[#c9744e] bg-[#fdf6f2] text-[#c9744e]"
                            : "border-[#e3c8bb] text-neutral-600 hover:border-[#c9744e]/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Card form */}
                  {paymentMethod === "card" && (
                    <div className="mt-5 grid grid-cols-1 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-neutral-700">
                          Card Number <span className="text-[#c9744e]">*</span>
                        </label>
                        <input
                          required
                          value={cardForm.number}
                          onChange={(e) =>
                            setCardForm((p) => ({ ...p, number: e.target.value }))
                          }
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-neutral-700">
                          Cardholder Name <span className="text-[#c9744e]">*</span>
                        </label>
                        <input
                          required
                          value={cardForm.name}
                          onChange={(e) =>
                            setCardForm((p) => ({ ...p, name: e.target.value }))
                          }
                          placeholder="AANYA SHARMA"
                          className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-neutral-700">
                            Expiry <span className="text-[#c9744e]">*</span>
                          </label>
                          <input
                            required
                            value={cardForm.expiry}
                            onChange={(e) =>
                              setCardForm((p) => ({ ...p, expiry: e.target.value }))
                            }
                            placeholder="MM / YY"
                            maxLength={7}
                            className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-neutral-700">
                            CVV <span className="text-[#c9744e]">*</span>
                          </label>
                          <input
                            required
                            value={cardForm.cvv}
                            onChange={(e) =>
                              setCardForm((p) => ({ ...p, cvv: e.target.value }))
                            }
                            placeholder="123"
                            maxLength={4}
                            type="password"
                            className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI form */}
                  {paymentMethod === "upi" && (
                    <div className="mt-5">
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        UPI ID <span className="text-[#c9744e]">*</span>
                      </label>
                      <input
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      />
                    </div>
                  )}

                  {/* Net banking */}
                  {paymentMethod === "netbanking" && (
                    <div className="mt-5">
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        Select Bank <span className="text-[#c9744e]">*</span>
                      </label>
                      <select
                        required
                        className="w-full rounded-lg border border-[#e3c8bb] bg-[#fdf6f2] px-3 py-2.5 text-sm text-neutral-800 outline-none focus:border-[#c9744e] focus:ring-1 focus:ring-[#c9744e]/30"
                      >
                        <option value="">Choose your bank...</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#eef5eb] px-3 py-2 text-xs text-[#6b8f5e]">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    Your payment information is encrypted and secure.
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="flex items-center gap-1.5 text-sm text-[#c9744e] transition-colors hover:text-[#b86244]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="ml-auto flex items-center gap-2 rounded-xl bg-[#8B4513] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#7a3c10]"
                    >
                      <Lock className="h-4 w-4" />
                      Place Order · ₹{grandTotal.toLocaleString("en-IN")}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT: Order summary */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-[#f0d8c8] bg-white p-5 shadow-sm">
                <h3 className="text-sm font-extrabold text-neutral-900">Order Summary</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-[#fbede5]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain mix-blend-multiply p-1"
                        />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9744e] text-[9px] font-bold text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-semibold text-neutral-800">{item.name}</p>
                        <p className="text-[10px] text-neutral-500">{item.subtitle}</p>
                      </div>
                      <span className="text-xs font-semibold text-neutral-800">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="my-3 border-t border-dashed border-[#f0d8c8]" />

                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Discount</span>
                    <span className="font-semibold text-[#c9744e]">-₹{DISCOUNT}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Shipping</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? (
                        <span className="text-[#6b8f5e]">Free</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tax (18%)</span>
                    <span className="font-semibold">₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="my-3 border-t border-[#f0d8c8]" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-neutral-900">Total</span>
                  <span className="text-xl font-extrabold text-[#c9744e]">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Shipping to */}
              {step === "payment" && form.city && (
                <div className="rounded-xl border border-[#f0d8c8] bg-white p-4 text-xs">
                  <div className="flex items-start gap-2">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#c9744e]" />
                    <div>
                      <p className="font-bold text-neutral-800">Shipping to</p>
                      <p className="mt-1 text-neutral-500">
                        {form.firstName} {form.lastName}
                        <br />
                        {form.address}
                        <br />
                        {form.city}, {form.state} {form.pincode}
                        <br />
                        {form.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
