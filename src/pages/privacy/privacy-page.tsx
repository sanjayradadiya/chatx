import Layout from "@/components/layout/Layout";

const PrivacyPage = () => {
  return (
    <Layout>
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-card rounded-xl shadow-sm p-6 md:p-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">1. Information We Collect</h2>
                <p className="leading-relaxed">
                  We collect several types of information from and about users of our platform, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-medium">Personal Information:</span> Name, email address, billing information, and other contact details you provide when you register or subscribe.</li>
                  <li><span className="font-medium">Usage Data:</span> Information about how you use our services, including your chat history, feature usage, and interaction patterns.</li>
                  <li><span className="font-medium">Device Information:</span> Information about the device you use to access our service, including IP address, browser type, and operating system.</li>
                  <li><span className="font-medium">Cookies and Tracking Technologies:</span> Information collected through cookies and similar technologies about your browsing behavior.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">2. How We Use Your Information</h2>
                <p className="leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and manage your account</li>
                  <li>Personalize your experience with our AI</li>
                  <li>Respond to your requests and customer service needs</li>
                  <li>Send you technical notices, updates, and security alerts</li>
                  <li>Monitor and analyze usage trends to improve our service</li>
                  <li>Detect, investigate, and prevent fraudulent or unauthorized activities</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">3. Data Protection and Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure data storage and backup procedures</li>
                </ul>
                <p className="leading-relaxed mt-2">
                  However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">4. Data Sharing and Disclosure</h2>
                <p className="leading-relaxed">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-medium">Service Providers:</span> With third-party vendors who help us provide and improve our service</li>
                  <li><span className="font-medium">Compliance with Laws:</span> When required by applicable law, regulation, legal process, or government request</li>
                  <li><span className="font-medium">Business Transfers:</span> In connection with a merger, acquisition, or sale of all or a portion of our assets</li>
                  <li><span className="font-medium">With Your Consent:</span> When you have explicitly consented to the sharing</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">5. Your Rights and Choices</h2>
                <p className="leading-relaxed">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Access to your personal data</li>
                    <li>Correction of inaccurate data</li>
                    <li>Deletion of your data (right to be forgotten)</li>
                    <li>Data portability</li>
                  </ul>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Withdrawal of consent</li>
                    <li>Restriction of processing</li>
                    <li>Objection to processing</li>
                  </ul>
                </div>
                <p className="leading-relaxed mt-2">
                  To exercise these rights, please contact us at <a href="mailto:privacy@chatx.com" className="text-primary hover:underline">privacy@chatx.com</a>.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">6. Data Retention</h2>
                <p className="leading-relaxed">
                  We retain your personal information for as long as necessary to provide you with our services and as needed to comply with our legal obligations. You can request deletion of your account and associated data at any time.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">7. Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our services are not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete that information.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">8. International Data Transfers</h2>
                <p className="leading-relaxed">
                  Your information may be transferred to, and maintained on, computers located outside of your state, country, or governmental jurisdiction where data protection laws may differ. We ensure appropriate safeguards are in place to protect your information.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">9. Changes to This Privacy Policy</h2>
                <p className="leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">10. Contact Us</h2>
                <p className="leading-relaxed">
                  If you have questions or concerns about this Privacy Policy, please contact us at <a href="mailto:privacy@chatx.com" className="text-primary hover:underline">privacy@chatx.com</a>.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Last updated: June 1, 2023</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPage; 