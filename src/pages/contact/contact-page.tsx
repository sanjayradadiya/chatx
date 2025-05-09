import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";

const ContactPage = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions, feedback, or need assistance? We're here to help! Reach out to our team using the form below.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea 
                    id="message" 
                    className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Please describe your question or issue in detail"
                  />
                </div>
                <Button type="submit" className="w-full cursor-pointer">Send Message</Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">Other Ways to Reach Us</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-muted-foreground mt-1">Our support line is available Monday-Friday, 9 AM - 6 PM</p>
                    <p className="text-primary mt-2">+91 9999999999</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-muted-foreground mt-1">Send us an email and we'll respond within 24 hours</p>
                    <p className="text-primary mt-2">support@chatx.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 2H3v16h5v4l4-4h5l4-4V2z" /><path d="M10 8h4" /><path d="M10 12h4" /></svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-muted-foreground mt-1">Chat with our support team in real-time</p>
                    <Button variant="link" className="p-0 h-auto mt-2">Start a chat session</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t">
                <h3 className="font-medium mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center hover:bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center hover:bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center hover:bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage; 