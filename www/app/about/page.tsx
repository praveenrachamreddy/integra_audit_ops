'use client';

import HomepageNavbar from '@/components/layout/homepage-navbar';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { Shield, Users, Zap, Award, Target, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const values = [
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'We prioritize the security of your data and maintain the highest standards of compliance and transparency.',
  },
  {
    icon: Users,
    title: 'User-Centric',
    description: 'Every feature is designed with our users in mind, ensuring intuitive and efficient regulatory workflows.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We leverage cutting-edge AI technology to revolutionize how regulatory compliance is managed.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from product quality to customer service.',
  },
];

const stats = [
  { number: '10,000+', label: 'Permits Processed' },
  { number: '500+', label: 'Organizations Served' },
  { number: '99.9%', label: 'Uptime Reliability' },
  { number: '50+', label: 'Jurisdictions Covered' },
];

export default function AboutPage() {
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
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Simplifying Regulatory 
                  <span className="text-primary"> Compliance</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                  RegOps was founded with a simple mission: to make regulatory compliance 
                  accessible, efficient, and stress-free for organizations of all sizes.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Target className="h-6 w-6 text-primary" />
                      <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      We believe that regulatory compliance shouldn't be a barrier to innovation and growth. 
                      Our AI-powered platform transforms complex regulatory processes into streamlined, 
                      automated workflows that save time, reduce costs, and minimize risk.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      By leveraging advanced artificial intelligence and machine learning, we help 
                      organizations navigate the ever-changing landscape of regulations with confidence 
                      and ease.
                    </p>
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
                        <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Built with Purpose
                        </h3>
                        <p className="text-muted-foreground">
                          Empowering organizations to focus on what matters most
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Values
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full text-center">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <value.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {value.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Trusted by Organizations Worldwide
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our platform has helped thousands of organizations streamline their compliance processes
              </p>
            </motion.div>

            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 