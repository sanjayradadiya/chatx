import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About ChatX</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make AI chat technology accessible and helpful to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                ChatX was born out of a simple realization: AI chatbots were becoming more powerful, but they weren't always easy to use or accessible to everyone. We set out to change that.
              </p>
              <p className="text-muted-foreground mb-4">
                Founded in 2025, our team of AI researchers, developers, and designers has been working tirelessly to create an AI chat platform that's intuitive, secure, and genuinely helpful for day-to-day tasks.
              </p>
              <p className="text-muted-foreground">
                Today, ChatX is used by thousands of people around the world, from students and professionals to businesses and organizations of all sizes.
              </p>
            </div>
            <div className="bg-muted/40 p-8 rounded-lg">
              <div className="aspect-video bg-primary/10 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We're constantly pushing the boundaries of what's possible with AI chat technology.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Privacy</h3>
                  <p className="text-muted-foreground">
                    We believe your conversations should be secure and private, with data protection at the core.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Accessibility</h3>
                  <p className="text-muted-foreground">
                    We're committed to making AI technology accessible to everyone, regardless of technical expertise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center bg-primary/10 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Ready to Experience ChatX?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Join thousands of users who are already enjoying the benefits of AI-powered conversations.
            </p>
            <Link to="/signup">
              <Button size="lg" className="cursor-pointer">Get Started for Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage; 