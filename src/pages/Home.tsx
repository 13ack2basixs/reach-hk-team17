import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, GraduationCap, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroClassroom from "@/assets/hero-classroom.jpg";
import childrenLearning from "@/assets/children-learning.jpg";
import communitySupport from "@/assets/community-support.jpg";

const Home = () => {
  const stats = [
    { icon: Users, label: "Children Served", value: "2,500+" },
    { icon: GraduationCap, label: "Partner Schools", value: "45" },
    { icon: Heart, label: "Active Donors", value: "300+" },
    { icon: Award, label: "Success Stories", value: "150+" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroClassroom})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero/90"></div>
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white animate-gentle-bounce">
              Building Brighter Futures Through Education
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Hong Kong's first charity targeting the English proficiency gap among underserved kindergarteners. 
              Together, we're giving every child the foundation they need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-glow animate-warm-glow"
              >
                <Link to="/schools" className="flex items-center space-x-2">
                  <span>Meet Our Children</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-primary"
              >
                <Link to="/leaderboard">
                  Join Our Community
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center card-hover border-0 shadow-soft">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-gradient">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Hong Kong is one of the most unequal cities, with 40,000 kindergarten students living in poverty. 
                Underfunded kindergartens receive far less support than primary or secondary schools. Project REACH 
                is the first initiative to address inequality by tackling the English proficiency gap among 
                underserved kindergarten students transitioning to Primary 1.
              </p>
              
              <div className="grid md:grid-cols-1 gap-6">
                <Card className="card-hover border-0 shadow-soft">
                  <CardContent className="pt-6 flex items-start space-x-4">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-secondary/20 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Quality Education</h3>
                      <p className="text-muted-foreground">
                        Providing comprehensive English learning programs tailored for kindergarten students.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-hover border-0 shadow-soft">
                  <CardContent className="pt-6 flex items-start space-x-4">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Community Support</h3>
                      <p className="text-muted-foreground">
                        Building a network of caring donors and volunteers invested in children's success.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-hover border-0 shadow-soft">
                  <CardContent className="pt-6 flex items-start space-x-4">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-accent/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                      <p className="text-muted-foreground">
                        Measurable improvements in English proficiency and school readiness.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={childrenLearning} 
                alt="Children learning English in classroom"
                className="rounded-2xl shadow-warm w-full"
              />
              <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${communitySupport})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero/85"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our community of passionate donors and help us create lasting impact 
              in the lives of Hong Kong's most vulnerable children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 py-6"
              >
                <Link to="/schools">
                  Explore Our Impact
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
              >
                <a href="#donate">
                  Start Donating Today
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;