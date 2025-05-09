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
                <h2 className="text-2xl font-semibold text-primary">Information We Collect</h2>
                <p className="leading-relaxed">
                  We collect several types of information from and about users of our platform, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-medium">Personal Information:</span> Name, email address, billing information, and other contact details you provide when you register or subscribe.</li>
                  <li><span className="font-medium">Usage Data:</span> Information about how you use our services, including your chat history, feature usage, and interaction patterns.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">How We Use Your Information</h2>
                <p className="leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and manage your account</li>
                  <li>Personalize your experience with our AI</li>
                  <li>Respond to your requests and customer service needs</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Data Protection and Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure data storage and backup procedures</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Data Sharing and Disclosure</h2>
                <p className="leading-relaxed">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-medium">Service Providers:</span> With third-party vendors who help us provide and improve our service</li>
                  <li><span className="font-medium">Compliance with Laws:</span> When required by applicable law, regulation, legal process, or government request</li>

                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Data Retention</h2>
                <p className="leading-relaxed">
                  We retain your personal information for as long as necessary to provide you with our services and as needed to comply with our legal obligations. You can request deletion of your account and associated data at any time.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Changes to This Privacy Policy</h2>
                <p className="leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Contact Us</h2>
                <p className="leading-relaxed">
                  If you have questions or concerns about this Privacy Policy, please contact us at <a href="mailto:privacy@chatx.com" className="text-primary hover:underline">privacy@chatx.com</a>.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPage; 