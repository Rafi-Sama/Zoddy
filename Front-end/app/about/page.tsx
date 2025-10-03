"use client"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Heart,
  Lightbulb,
  Building2,
  Handshake,
  Linkedin,
  Calendar,
  MapPin,
  Users,
  Globe,
  Award,
  Target,
  Mail,
  Shield
} from "lucide-react"
export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              About <span className="text-primary">Zoddy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We&apos;re on a mission to empower small businesses across Bangladesh with
              data-driven growth tools that were once only available to large corporations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Founded in 2023
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dhaka, Bangladesh
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                5,000+ Businesses Served
              </div>
            </div>
          </div>
          {/* Our Story */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-display text-center mb-8">Our Story</h2>
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground">
                    Zoddy was born from a simple observation: small businesses in Bangladesh
                    were struggling with the same challenges that data analytics could solve,
                    but these solutions were too complex and expensive.
                  </p>
                  <p className="text-muted-foreground">
                    Our founders, having worked with both local small businesses and
                    international corporations, saw the gap. They decided to build something
                    specifically for Bangladeshs entrepreneurial spirit - simple, affordable,
                    and incredibly powerful.
                  </p>
                  <p className="text-muted-foreground">
                    Today, were proud to serve over 5,000 small businesses across all
                    8 divisions of Bangladesh, helping them make data-driven decisions
                    that drive real growth.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="text-center p-6">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-bold text-2xl">150%</h3>
                  <p className="text-sm text-muted-foreground">Average Revenue Growth</p>
                </Card>
                <Card className="text-center p-6">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-bold text-2xl">5,000+</h3>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </Card>
                <Card className="text-center p-6">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-bold text-2xl">64</h3>
                  <p className="text-sm text-muted-foreground">Districts Covered</p>
                </Card>
                <Card className="text-center p-6">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-bold text-2xl">98%</h3>
                  <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                </Card>
              </div>
            </div>
          </div>
          {/* Mission, Vision, Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-display text-center mb-12">
              Our Mission, Vision & Values
            </h2>
            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="text-center p-8">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Mission</h3>
                <p className="text-muted-foreground">
                  To democratize business intelligence for small businesses in Bangladesh,
                  making powerful analytics accessible and affordable for everyone.
                </p>
              </Card>
              <Card className="text-center p-8">
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Vision</h3>
                <p className="text-muted-foreground">
                  A Bangladesh where every small business owner has the tools and insights
                  to compete globally and contribute to our nations economic growth.
                </p>
              </Card>
              <Card className="text-center p-8">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Values</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>🇧🇩 Bangladesh First</p>
                  <p>🤝 Customer Success</p>
                  <p>💡 Innovation</p>
                  <p>🔒 Trust & Transparency</p>
                  <p>🌱 Sustainable Growth</p>
                </div>
              </Card>
            </div>
          </div>
          {/* Our Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-display text-center mb-12">Meet Our Team</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {[
                {
                  name: "Md. Rahman Ali",
                  role: "CEO & Co-Founder",
                  bio: "Former tech lead at international fintech. Passionate about Bangladeshs digital transformation.",
                  experience: "10+ years",
                  linkedin: "#"
                },
                {
                  name: "Fatima Begum",
                  role: "CTO & Co-Founder",
                  bio: "Data scientist with expertise in business intelligence. Building scalable solutions for SMEs.",
                  experience: "8+ years",
                  linkedin: "#"
                },
                {
                  name: "Karim Ahmed",
                  role: "Head of Product",
                  bio: "UX expert focused on making complex analytics simple and intuitive for business owners.",
                  experience: "6+ years",
                  linkedin: "#"
                },
                {
                  name: "Nasir Uddin",
                  role: "Head of Customer Success",
                  bio: "Dedicated to ensuring every customer achieves their business goals with Zoddy.",
                  experience: "5+ years",
                  linkedin: "#"
                }
              ].map((member, i) => (
                <Card key={i} className="text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {member.name.split( ').map(n => n[0]).join(')}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-3">{member.bio}</p>
                  <Badge variant="secondary" className="text-xs mb-3">{member.experience}</Badge>
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          {/* Our Commitment to Bangladesh */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-display text-center mb-12">
              Our Commitment to Bangladesh
            </h2>
            <div className="grid gap-8 lg:grid-cols-2 items-center max-w-6xl mx-auto">
              <div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Building2 className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">Local First</h3>
                      <p className="text-muted-foreground">
                        All our development happens in Bangladesh, creating tech jobs
                        and keeping expertise within our borders.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Users className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">Community Support</h3>
                      <p className="text-muted-foreground">
                        We provide free training and support to help small business
                        owners understand and leverage data analytics.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Handshake className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">Partnership Ecosystem</h3>
                      <p className="text-muted-foreground">
                        We partner with local banks, payment providers, and business
                        associations to create an integrated growth ecosystem.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Shield className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">Data Sovereignty</h3>
                      <p className="text-muted-foreground">
                        Your business data stays in Bangladesh, hosted on local
                        infrastructure with world-class security standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="text-xl font-bold mb-4 text-center">Made in Bangladesh 🇧🇩</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Local Employees</span>
                    <Badge variant="secondary">100%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Infrastructure</span>
                    <Badge variant="secondary">Bangladesh-based</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Support</span>
                    <Badge variant="secondary">24/7 Local</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Training Sessions</span>
                    <Badge variant="secondary">200+ Monthly</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          {/* Awards & Recognition */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-display text-center mb-12">
              Awards & Recognition
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {[
                {
                  title: "Best Startup 2024",
                  organization: "Bangladesh Startup Awards",
                  year: "2024"
                },
                {
                  title: "Digital Innovation Award",
                  organization: "BASIS National ICT Awards",
                  year: "2024"
                },
                {
                  title: "SME Partner of the Year",
                  organization: "Bangladesh Bank",
                  year: "2023"
                },
                {
                  title: "Rising Star",
                  organization: "TechCrunch Startup Spotlight",
                  year: "2023"
                }
              ].map((award, i) => (
                <Card key={i} className="text-center p-6">
                  <Award className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-bold text-sm mb-1">{award.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{award.organization}</p>
                  <Badge variant="outline">{award.year}</Badge>
                </Card>
              ))}
            </div>
          </div>
          {/* Join Our Mission */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold font-display mb-4">Join Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you&apos;re a small business owner, a developer, or someone passionate
              about Bangladesh&apos;s economic growth, there&apos;s a place for you in our journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Users className="h-4 w-4 mr-2" />
                Try Zoddy Free
              </Button>
              <Button variant="outline" size="lg">
                <Building2 className="h-4 w-4 mr-2" />
                Join Our Team
              </Button>
              <Button variant="outline" size="lg">
                <Handshake className="h-4 w-4 mr-2" />
                Partner With Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}