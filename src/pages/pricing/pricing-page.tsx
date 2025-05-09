import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SUBSCRIPTION_PLANS } from "@/config/constant";
import Layout from "@/components/layout/Layout";

const PricingPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Choose the Right Plan for You</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our flexible pricing options designed to fit your needs. From casual users to power users, we have a plan for everyone.
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
                      <li key={index} className="flex items-start gap-2">
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
                  <Link to="/signup" className="w-full cursor-pointer">
                    <Button variant={"default"} className="w-full cursor-pointer">
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="space-y-2">
                <h3 className="font-semibold">Can I change my plan later?</h3>
                <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">How does billing work?</h3>
                <p className="text-muted-foreground">You're billed monthly or yearly depending on your subscription plan. You can cancel anytime.</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Do you offer refunds?</h3>
                <p className="text-muted-foreground">Yes, we offer a 14-day money-back guarantee for all paid plans.</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Do I need a credit card to sign up?</h3>
                <p className="text-muted-foreground">No credit card is required for the free plan. Paid plans require payment information.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingPage; 