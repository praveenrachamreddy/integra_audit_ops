'use client';

import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Building,
  Crown,
  Clock,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HomepageNavbar from '@/components/layout/homepage-navbar';

const pricingPlans = [
  {
    name: 'Starter',
    icon: Zap,
    price: '$49',
    period: '/month',
    description: 'Perfect for small businesses getting started with compliance',
    features: [
      { name: 'Up to 10 permit applications', included: true },
      { name: 'Basic compliance tracking', included: true },
      { name: 'Email support', included: true },
      { name: 'Standard document templates', included: true },
      { name: 'Basic reporting', included: true },
      { name: 'AI-powered assistance', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Custom integrations', included: false },
      { name: 'Priority support', included: false }
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Professional',
    icon: Shield,
    price: '$149',
    period: '/month',
    description: 'Ideal for growing companies with complex compliance needs',
    features: [
      { name: 'Unlimited permit applications', included: true },
      { name: 'Advanced compliance tracking', included: true },
      { name: 'Priority email & chat support', included: true },
      { name: 'Custom document templates', included: true },
      { name: 'Advanced reporting & analytics', included: true },
      { name: 'AI-powered assistance', included: true },
      { name: 'Audit automation', included: true },
      { name: 'API access', included: true },
      { name: 'Custom integrations', included: false }
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    icon: Crown,
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations',
    features: [
      { name: 'Everything in Professional', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: '24/7 phone support', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'On-premise deployment', included: true },
      { name: 'Advanced security features', included: true },
      { name: 'Custom training & onboarding', included: true },
      { name: 'SLA guarantees', included: true },
      { name: 'White-label options', included: true }
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

const features = [
  {
    category: 'Core Features',
    items: [
      'SmartPermit Application System',
      'AuditGenie Compliance Monitoring',
      'AI-Powered Regulatory Assistant',
      'Document Management System',
      'Real-time Status Tracking'
    ]
  },
  {
    category: 'Integrations',
    items: [
      'Government Portal Connections',
      'CRM System Integration',
      'Document Storage Platforms',
      'Communication Tools',
      'Third-party APIs'
    ]
  },
  {
    category: 'Security & Compliance',
    items: [
      'SOC 2 Type II Certified',
      'End-to-end Encryption',
      'GDPR Compliant',
      'Regular Security Audits',
      'Data Backup & Recovery'
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomepageNavbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="outline" className="mb-6 text-lg py-2 px-4">
                <Clock className="h-4 w-4 mr-2" />
                Coming Soon
              </Badge>
              <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
                Simple, Transparent
                <span className="text-primary block">Pricing</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Choose the perfect plan for your business. All plans include our core 
                compliance features with 14-day free trial.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full border-0 shadow-xl ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                    <CardHeader className="text-center pb-8">
                      <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                      }`}>
                        <plan.icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
                      <div className="mt-6">
                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                        {plan.period && (
                          <span className="text-muted-foreground">{plan.period}</span>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            {feature.included ? (
                              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        disabled
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                What&apos;s Included
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                All plans include our comprehensive suite of regulatory compliance tools 
                designed to streamline your workflows.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: 'When will pricing be available?',
                  answer: 'We&apos;re currently in development and will announce pricing details soon. Sign up for our newsletter to be the first to know about pricing and launch updates.'
                },
                {
                  question: 'Will there be a free trial?',
                  answer: 'Yes! We plan to offer a 14-day free trial for all plans so you can experience the full power of RegOps before committing.'
                },
                {
                  question: 'Can I change plans later?',
                  answer: 'Absolutely. You&apos;ll be able to upgrade or downgrade your plan at any time to match your business needs.'
                },
                {
                  question: 'What about enterprise features?',
                  answer: 'Our Enterprise plan will include custom integrations, dedicated support, on-premise deployment options, and more. Contact us to discuss your specific requirements.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Get Notified When We Launch
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Be among the first to experience RegOps when we go live. 
                    Early adopters will get exclusive benefits and special pricing.
                  </p>
                  <Button size="lg" asChild>
                    <a href="mailto:notify@regops.ai">
                      <Mail className="h-4 w-4 mr-2" />
                      Notify Me
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
} 