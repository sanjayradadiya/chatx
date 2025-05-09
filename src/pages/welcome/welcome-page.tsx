import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SUBSCRIPTION_PLANS } from "@/config/constant";

// Sample image path - replace with actual image path
const AI_CHAT_IMAGE = "/ai-chat-illustration.svg";

const WelcomePage = () => {

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/chatx.png" alt="ChatX Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">ChatX</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/login" className="text-sm hover:underline">Login</Link>
            <Link to="/signup">
              <Button size="sm">Register</Button>
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to ChatX – Your Personal AI Companion
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Chat smarter, faster, and more efficiently with AI. Upgrade anytime to unlock more power.
              </p>
              <div className="flex gap-4">
                <Link to="/pricing">
                  <Button size="lg">View Plans</Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline">Get Started</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={AI_CHAT_IMAGE}
                alt="AI Chat Interface"
                className="w-full max-w-lg h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful AI Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the next generation of AI-powered conversation with our cutting-edge features.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <Card className="border border-border">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                  </div>
                  <CardTitle>Instant AI Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get immediate responses to your questions with our lightning-fast AI chat system.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border border-border">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <CardTitle>Personalized Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our AI adapts to your style and preferences, creating truly personalized conversations.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border border-border">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your conversations are encrypted and private, ensuring your data stays secure.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="border border-border">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  </div>
                  <CardTitle>Flexible Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Choose from multiple subscription tiers to find the perfect plan for your needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select the perfect plan for your needs, from casual use to power users.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {SUBSCRIPTION_PLANS.map((plan, index) => (
                <Card key={index} className={`border ${plan.isPopular ? 'border-primary' : 'border-border'} relative justify-between`}>
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        /month
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className={`flex items-start gap-2 ${!feature.includes ? 'text-muted-foreground' : ''}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="m9 11 3 3L22 4" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/login" className="w-full cursor-pointer">
                      <Button variant={"default"} className="w-full cursor-pointer">
                        Get Started
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">ChatX</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm hover:underline">Home</Link></li>
                <li><Link to="/pricing" className="text-sm hover:underline">Pricing</Link></li>
                <li><Link to="/about" className="text-sm hover:underline">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-sm hover:underline">Terms of Use</Link></li>
                <li><Link to="/privacy" className="text-sm hover:underline">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-sm hover:underline">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-sm hover:underline">FAQs</Link></li>
                <li><Link to="/contact" className="text-sm hover:underline">Contact Us</Link></li>
                <li><Link to="/help" className="text-sm hover:underline">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <div className="flex space-x-3">
                    <a href="#" className="hover:text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    </a>
                    <a href="#" className="hover:text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                    </a>
                    <a href="#" className="hover:text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ChatX. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage; 