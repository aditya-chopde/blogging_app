'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="bg-accent/40 border-b border-border py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Contact Us</h1>
            <p className="text-muted-foreground text-sm mt-2">We would love to hear from you. Send us a message below.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {submitted ? (
            <div className="bg-card border border-border rounded-3xl p-8 text-center max-w-md mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Message Sent!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Thank you for contacting Healthy Worm. We have received your message and will respond within 24 to 48 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({ name: '', email: '', subject: '', message: '' })
                }}
                className="text-xs font-semibold bg-accent text-accent-foreground px-5 py-2.5 rounded-full hover:bg-accent/80 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Recipe feedback / Editorial inquiry"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here…"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-6 py-3 rounded-full transition-colors self-start disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
