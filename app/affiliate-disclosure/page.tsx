import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShoppingBag, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Affiliate Disclosure — Healthy Worm',
  description: 'Read the FTC-compliant affiliate disclosure for Healthy Worm regarding affiliate product links and reviews.',
}

export default function AffiliateDisclosurePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="bg-accent/40 border-b border-border py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Affiliate Disclosure</h1>
            <p className="text-muted-foreground text-sm mt-2">FTC Compliance & Editorial Transparency</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-foreground space-y-8 leading-relaxed text-sm">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-foreground mb-2">Summary Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Healthy Worm</strong> is a reader-supported publication. Some links on our website (such as product review buttons, equipment callouts, and recommend banners) are affiliate links. If you click on an affiliate link and make a purchase, we may receive a small referral commission at <strong>no additional cost to you</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Amazon Associates Program</h2>
            <p className="text-muted-foreground">
              Healthy Worm is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated sites.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Our Commitment to Honesty</h2>
            <div className="text-muted-foreground space-y-3">
              <p>
                We value your trust above all else. Affiliate commissions do not influence our editorial independence, article rankings, or product reviews.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>We only feature equipment, ingredients, and fitness gear that we believe deliver genuine value to our readers.</li>
                <li>Products featured as &ldquo;Our Top Pick&rdquo; or within review guides are selected based on editorial merit, quality, and user feedback.</li>
                <li>You are under no obligation to use our affiliate links when purchasing products.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Questions & Contact</h2>
            <p className="text-muted-foreground">
              If you have any questions regarding our affiliate relationships or disclosures, please feel free to reach out via our contact page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
