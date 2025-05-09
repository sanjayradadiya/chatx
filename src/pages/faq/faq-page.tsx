import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";

const FaqPage = () => {
  const faqs = [
    {
      question: "What is ChatX?",
      answer: "ChatX is an AI-powered chat platform that allows you to have natural conversations with advanced AI. It can help with creative writing, answering questions, generating ideas, and more."
    },
    {
      question: "How does ChatX work?",
      answer: "ChatX uses state-of-the-art AI language models to understand your messages and generate human-like responses. The system learns from conversations to provide better, more personalized experiences over time."
    },
    {
      question: "Is ChatX free to use?",
      answer: "ChatX offers a free basic plan with limited features and usage. For full access to all features and higher usage limits, we offer Pro and Premium subscription plans."
    },
    {
      question: "Can I use ChatX for my business?",
      answer: "Yes! Many businesses use ChatX for customer support, content creation, brainstorming, and more. Our Premium plan is designed with features specifically helpful for business users."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your account settings. After cancellation, you'll continue to have access to your paid features until the end of your billing period."
    },
    {
      question: "Is there a limit to how much I can chat?",
      answer: "Free accounts have a monthly message limit. Pro accounts have a higher limit, and Premium accounts have unlimited messages. Usage limits are reset at the beginning of each billing cycle."
    },
    {
      question: "Can I export my chat history?",
      answer: "Yes, ChatX allows you to export your conversation history in various formats, including text and PDF."
    },
  ];

  const handleVisitHelpCenter = () => {
    toast.success("This feature is not available yet.", {
      duration: 3000,
      position: "top-center",
    });
  }
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to the most common questions about ChatX and how to make the most of your experience.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Our support team is ready to help you with any other questions you might have about ChatX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="default" className="cursor-pointer">Contact Support</Button>
              </Link>
              <Button variant="outline" className="cursor-pointer" onClick={handleVisitHelpCenter}>Visit Help Center</Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FaqPage; 