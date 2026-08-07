import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Shield } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — Healthy Worm',
  description: 'Read the Privacy Policy for Healthy Worm to understand how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="bg-accent/40 border-b border-border py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm mt-2">Last updated: August 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-foreground space-y-8 leading-relaxed text-sm">
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to <strong>Healthy Worm</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We respect your privacy and are committed to protecting personal data that you share with us through our website at <code className="bg-muted px-1 py-0.5 rounded text-foreground">healthyworm.com</code>. This Privacy Policy explains what information we collect, how it is used, and your rights.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
            <div className="text-muted-foreground space-y-2">
              <p>We may collect information in the following ways:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Newsletter Subscription:</strong> When you subscribe to our newsletter, we collect your email address.</li>
                <li><strong>Contact Form:</strong> When you send us a message, we collect your name, email address, and message content.</li>
                <li><strong>Usage & Analytics:</strong> We collect non-identifiable browser and device data (such as page views, time spent, and referral sources) via aggregated web analytics services.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <div className="text-muted-foreground space-y-2">
              <p>We use your information exclusively to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Deliver requested weekly newsletter emails and updates.</li>
                <li>Respond to your inquiries and contact submissions.</li>
                <li>Improve our website design, performance, and article content.</li>
                <li>Prevent fraudulent activity and maintain site security.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">4. Cookies & Tracking Technologies</h2>
            <p className="text-muted-foreground">
              Healthy Worm uses cookies to optimize website performance and analyze reader navigation patterns. Cookies are small text files stored on your device. You can configure your browser to reject cookies or notify you when cookies are sent; however, some site features may require cookies to function correctly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">5. Third-Party Services & Affiliate Links</h2>
            <p className="text-muted-foreground">
              Our site contains affiliate links to third-party merchant sites (such as Amazon). Clicking on these links places a referral cookie on your browser. Third-party sites have their own independent privacy policies, and we accept no responsibility or liability for their content or operations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">6. Data Retention & Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to request access to, correction of, or deletion of your personal data at any time. You can unsubscribe from our newsletter instantly by clicking the &ldquo;Unsubscribe&rdquo; link at the bottom of any email or by reaching out to us via our contact page.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">7. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions regarding this Privacy Policy, please contact us at <a href="mailto:privacy@healthyworm.com" className="text-primary underline">privacy@healthyworm.com</a> or via our contact form.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
