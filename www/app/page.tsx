'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield, Zap, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HomepageNavbar from '@/components/layout/homepage-navbar';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/lib/store/auth-store';

const features = [
  {
    icon: Shield,
    title: 'Smart Permit Management',
    description: 'Automate permit applications and track compliance status with AI-powered insights.',
  },
  {
    icon: Zap,
    title: 'Audit Genie',
    description: 'Intelligent compliance auditing that identifies risks before they become problems.',
  },
  {
    icon: Users,
    title: 'Collaborative Workflows',
    description: 'Streamline team collaboration with shared workspaces and real-time updates.',
  },
];

const benefits = [
  'Reduce compliance costs by up to 60%',
  'Automate 80% of routine regulatory tasks',
  'Real-time regulatory change notifications',
  'Comprehensive audit trails and reporting',
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <HomepageNavbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="outline" className="mb-6">
                  🚀 Powered by AI • Built for Compliance
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Regulatory Operations,{' '}
                  <span className="text-primary">Simplified</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                  Transform your regulatory compliance workflow with AI-powered automation. 
                  Stay ahead of regulations, reduce risks, and focus on what matters most - growing your business.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button size="lg" onClick={handleGetStarted} className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleLearnMore}>
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything you need for regulatory compliance
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our comprehensive platform handles every aspect of regulatory operations, 
                from permit management to compliance auditing.
              </p>
            </motion.div>

            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Why choose RegOps?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Join thousands of companies who trust RegOps to handle their regulatory compliance needs.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-primary mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button size="lg" onClick={handleGetStarted}>
                      Start Your Free Trial
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
                    <div className="h-full w-full rounded-xl bg-background border shadow-2xl flex items-center justify-center">
                      <div className="text-center">
                        <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Enterprise Ready
                        </h3>
                        <p className="text-muted-foreground">
                          SOC 2 compliant with enterprise-grade security
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32 bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to transform your compliance workflow?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join thousands of companies already using RegOps to streamline their regulatory operations.
              </p>
              <div className="mt-8">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={handleGetStarted}
                  className="group"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}