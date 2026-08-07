import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NewsletterSection from '@/components/NewsletterSection'
import Image from 'next/image'
import { Leaf, Award, HeartHandshake, ShieldCheck, Users } from 'lucide-react'

export const metadata = {
  title: 'About Us — Healthy Worm',
  description:
    'Learn about Healthy Worm, our editorial standards, healthcare guidelines, and mission to deliver evidence-based recipes, meal plans, and fitness routines.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        {/* Header Hero */}
        <div className="bg-accent/40 border-b border-border py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              About Healthy Worm
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Empowering your daily wellness journey with science-backed nutrition, practical meal plans, effective workouts, and trusted gear reviews.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          {/* Mission */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <div className="prose-hw text-base leading-relaxed text-foreground space-y-4">
              <p>
                At <strong>Healthy Worm</strong>, we believe healthy living should be accessible, enjoyable, and sustainable for everyone. In a world full of fad diets and overwhelming fitness trends, we aim to be your reliable source of truth.
              </p>
              <p>
                Whether you are looking to build a balanced 7-day meal plan, master high-protein recipes, discover effective home workout routines, or find the right resistance bands for your home gym, our guides are crafted with simplicity and real-world results in mind.
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center sm:text-left">
              Why Readers Trust Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">Evidence-Based Insights</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our recipe macronutrients, dietary guides, and exercise protocols are grounded in nutritional science and verified fitness practices.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">Uncompromising Integrity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We maintain strict editorial independence. Product recommendations are thoroughly vetted based on quality, value, and real testing.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <HeartHandshake className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">Simplicity First</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No complex jargon or unachievable standards. We break down wellness concepts into actionable steps you can start implementing today.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-purple-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Over 12,000 active newsletter subscribers trust Healthy Worm for weekly motivation, fresh meal prep ideas, and routine updates.
                </p>
              </div>
            </div>
          </section>

          {/* Editorial Team */}
          <section className="mb-16 bg-secondary/30 rounded-3xl p-8 border border-border">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Editorial & Medical Review</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Content on Healthy Worm is curated by experienced wellness researchers and fitness enthusiasts led by Dr. Emma Torres. While our articles aim to inform and inspire, they are for educational purposes and should not replace professional medical advice. Always consult a certified healthcare professional before making major diet or workout changes.
            </p>
          </section>
        </div>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
