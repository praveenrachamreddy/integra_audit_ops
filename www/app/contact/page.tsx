'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Building,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HomepageNavbar } from '@/components/layout/homepage-navbar';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email and we&apos;ll respond within 24 hours',
    contact: 'hello@regops.ai',
    action: 'mailto:hello@regops.ai'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our team during business hours',
    contact: 'Available 9AM - 6PM PST',
    action: '#'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak directly with our team',
    contact: '+1 (555) 123-4567',
    action: 'tel:+15551234567'
  }
];

const offices = [
  {
    city: 'San Francisco',
    address: '123 Innovation Drive\nSan Francisco, CA 94105',
    timezone: 'PST (UTC-8)',
    hours: 'Mon-Fri: 9AM-6PM'
  },
  {
    city: 'Austin',
    address: '456 Tech Boulevard\nAustin, TX 78701',
    timezone: 'CST (UTC-6)',
    hours: 'Mon-Fri: 9AM-6PM'
  }
];

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'sales', label: 'Sales & Partnerships' },
  { value: 'support', label: 'Technical Support' },
  { value: 'media', label: 'Media & Press' },
  { value: 'careers', label: 'Careers' },
  { value: 'other', label: 'Other' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We&apos;ll get back to you soon.');
      setFormData({ name: '', email: '', company: '', inquiryType: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <HomepageNavbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
                Get in Touch
                <span className="text-primary block">With Our Team</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Have questions about RegOps? Want to discuss a partnership? 
                We&apos;d love to hear from you and help with your regulatory compliance needs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-muted-foreground text-lg">
                Choose the method that works best for you
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" 
                        onClick={() => method.action !== '#' && window.open(method.action)}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <method.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {method.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {method.description}
                      </p>
                      <p className="text-primary font-medium">
                        {method.contact}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Office Info */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                    <p className="text-muted-foreground">
                      Fill out the form below and we&apos;ll get back to you as soon as possible.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Your company name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inquiryType">Inquiry Type *</Label>
                        <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            {inquiryTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Tell us how we can help you..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Office Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Our Offices
                  </h2>
                  <div className="space-y-6">
                    {offices.map((office, index) => (
                      <Card key={office.city}>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary" />
                            {office.city}
                          </h3>
                          <div className="space-y-3 text-muted-foreground">
                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                              <span className="whitespace-pre-line text-sm">
                                {office.address}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="text-sm">{office.hours}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {office.timezone}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: Users, title: 'Join Our Team', description: 'View open positions', link: '/team' },
                      { icon: Lightbulb, title: 'Partner With Us', description: 'Explore partnerships', link: 'mailto:partnerships@regops.ai' },
                      { icon: MessageSquare, title: 'Media Inquiries', description: 'Press and media requests', link: 'mailto:press@regops.ai' }
                    ].map((link, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors cursor-pointer">
                        <link.icon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{link.title}</p>
                          <p className="text-sm text-muted-foreground">{link.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
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
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Common Questions
              </h2>
              <p className="text-muted-foreground text-lg">
                Quick answers to frequently asked questions
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {[
                {
                  question: 'What is your response time?',
                  answer: 'We typically respond to all inquiries within 24 hours during business days.'
                },
                {
                  question: 'Do you offer custom solutions?',
                  answer: 'Yes! We work with enterprise clients to create tailored compliance solutions.'
                },
                {
                  question: 'Can I schedule a demo?',
                  answer: 'Absolutely! Contact our sales team to schedule a personalized demo of RegOps.'
                },
                {
                  question: 'Do you provide training?',
                  answer: 'We offer comprehensive onboarding and training for all our enterprise clients.'
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
                      <h3 className="font-semibold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 