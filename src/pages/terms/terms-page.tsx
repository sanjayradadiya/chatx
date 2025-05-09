import Layout from "@/components/layout/Layout";

const TermsPage = () => {
  return (
    <Layout>
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our service.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-card rounded-xl shadow-sm p-6 md:p-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">1. Agreement to Terms</h2>
                <p className="leading-relaxed">
                  By accessing or using ChatX, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of the terms, you do not have permission to access the service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">2. Description of Service</h2>
                <p className="leading-relaxed">
                  ChatX provides an AI-powered conversational platform that allows users to interact with artificial intelligence assistants. Our service is provided "as is" and "as available" without any warranties, expressed or implied.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">3. User Accounts</h2>
                <p className="leading-relaxed">
                  When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately of any breach of security or unauthorized use of your account.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">4. Subscription Plans and Payment</h2>
                <p className="leading-relaxed">
                  Some features of our service require payment for access. By subscribing to a paid plan, you agree to pay all fees associated with your chosen subscription plan. Charges are billed in advance on either a monthly or annual basis, depending on your selected plan.
                </p>
                <p className="leading-relaxed">
                  All payments are non-refundable except as expressly provided in these Terms or when required by law. You may cancel your subscription at any time, but no refunds will be provided for any unused portion of the term.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">5. Acceptable Use Policy</h2>
                <p className="leading-relaxed">
                  You agree not to use ChatX to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others</li>
                  <li>Send spam or unsolicited messages</li>
                  <li>Distribute malware or engage in malicious activities</li>
                  <li>Attempt to gain unauthorized access to any portion of our service</li>
                  <li>Use the service to generate harmful or abusive content</li>
                  <li>Interfere with the proper functioning of the service</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">6. Intellectual Property</h2>
                <p className="leading-relaxed">
                  The service and its original content, features, and functionality are owned by ChatX and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">7. User-Generated Content</h2>
                <p className="leading-relaxed">
                  By submitting content to ChatX, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content in connection with providing and improving our services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">8. Termination</h2>
                <p className="leading-relaxed">
                  We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will cease immediately.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">9. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  In no event shall ChatX, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">10. Changes to Terms</h2>
                <p className="leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">11. Governing Law</h2>
                <p className="leading-relaxed">
                  These Terms shall be governed by the laws of the jurisdiction in which the company is registered, without regard to its conflict of law provisions.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">12. Contact Us</h2>
                <p className="leading-relaxed">
                  If you have questions or concerns about these Terms, please contact us at <a href="mailto:terms@chatx.com" className="text-primary hover:underline">terms@chatx.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage; 