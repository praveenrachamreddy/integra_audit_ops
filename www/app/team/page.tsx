'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Calendar, Code, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

const teamMembers = [
  {
    name: 'Kenechukwu Nnakwue',
    role: 'Software Engineering Lead & Full Stack Developer',
    image: 'https://media.licdn.com/dms/image/v2/D4D35AQHUyHgpxh78-Q/profile-framedphoto-shrink_400_400/B4DZetndehHkAc-/0/1750964492453?e=1751918400&v=beta&t=ibW4nNgNaHj09aONVTseUu8IY1svI79CqMahU7ta2K0',
    bio: 'Software Engineering Lead with expertise in JavaScript/TypeScript development. Passionate about collaboration, mentorship, and building scalable regulatory technology solutions. Known as #your_tech_buddy in the developer community.',
    experience: '5+ years',
    location: 'Nigeria',
    skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'Full Stack Development', 'Software Architecture'],
    interests: ['Open Source', 'Mentorship', 'Tech Community', 'Networking'],
    social: {
      github: 'KeneHermitCoder',
      linkedin: 'kenechukwu-nnakwue-a854081b5',
      email: 'kene@regops.com'
    }
  },
  {
    name: 'Anthony Tagbo Okoye',
    role: 'Backend Developer & Systems Architect',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQExVNiXDc0gFA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1709297967935?e=1756944000&v=beta&t=lEwY2eWpDeDwXfKT0KdAun89qm1mmhjGTGyJInfAn8w',
    bio: 'Experienced backend developer specializing in scalable systems and API development. Expert in multiple programming languages with a focus on building robust regulatory compliance platforms.',
    experience: '5+ years',
    location: 'Nigeria',
    skills: ['TypeScript', 'PHP', 'Go', 'Python', 'Laravel', 'REST APIs', 'Blockchain', 'System Architecture'],
    interests: ['Blockchain Technology', 'Web Crawling', 'P2P Systems', 'DevOps'],
    social: {
      github: 'anthony-okoye',
      linkedin: 'tagbo-okoye-666819167',
      email: 'anthony@regops.com'
    }
  }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold">RegOps</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/team" className="text-foreground font-medium">
                Team
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Meet Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We&apos;re a diverse team of technologists, regulatory experts, and innovators
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative w-32 h-32 mb-4">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {member.name}
                      </h3>
                      <p className="text-primary font-semibold mb-3">
                        {member.role}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{member.experience} experience</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{member.location}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center justify-center gap-2">
                        <Code className="h-4 w-4" />
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {member.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Interests */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center justify-center gap-2">
                        <Coffee className="h-4 w-4" />
                        Interests
                      </h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {member.interests.map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://github.com/${member.social.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://linkedin.com/in/${member.social.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${member.social.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Want to Join Our Team?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We&apos;re always looking for talented individuals who are passionate about regulatory technology and making compliance easier for businesses.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8">
                Get In Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold">RegOps</span>
            </div>
            <p className="text-muted-foreground">
              Built with ❤️ using{' '}
              <a 
                href="https://bolt.new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Bolt.new
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 