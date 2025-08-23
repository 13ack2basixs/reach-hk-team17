import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, GraduationCap, Heart, Award, Info, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import reachFrontpage from "@/assets/reach-frontpage.jpg";
import childrenLearning from "@/assets/children-learn.jpg";
import communitySupport from "@/assets/community.jpg";

const Home = () => {
  const stats = [
    { icon: Users, label: "Children Served", value: "2,500+" },
    { icon: GraduationCap, label: "Partner Schools", value: "45" },
    { icon: Heart, label: "Active Donors", value: "300+" },
    { icon: Award, label: "Success Stories", value: "150+" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover"
          style={{ 
            backgroundImage: `url(${reachFrontpage})`,
            backgroundPosition: 'center 35%'
          }}
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
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-glow animate-warm-glow"
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

             {/* Vision Section */}
       <section className="py-20 px-6 bg-muted/20">
         <div className="container mx-auto">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-4xl font-bold mb-8 text-gradient">Our Vision</h2>
               <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                 Hong Kong is one of the most unequal
                 cities, with 40,000 kindergarten
                 students living in poverty.
                 Underfunded kindergartens receive
                 far less support than primary or
                 secondary schools, with 29 closures in
                 2025-2026, the highest in a decade.
                 Project Reach is the first initiative to
                 address inequality by tackling the
                 English proficiency gap among
                 underserved kindergarten students
                 transitioning to Primary 1.
               </p>
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

       {/* Mission Section */}
       <section className="py-20 px-6">
         <div className="container mx-auto">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-4xl font-bold mb-8 text-gradient">Our Mission</h2>
               <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                 Project Reach aims to become part of the kindergarten
                 curriculum for schools in need across Hong Kong. We
                 strive to create the first database tracking English
                 proficiency of underserved K3 students to improve
                 programmes and raise awareness of early childhood
                 poverty. Additionally, we aim to secure funding from
                 primary schools to continue supporting students as they
                 transition into Primary 1.
               </p>
              
                <div className="grid md:grid-cols-1 gap-6">
                 <Card className="card-hover border-0 shadow-soft">
                   <CardContent className="pt-6 flex items-start space-x-4">
                     <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                       <Target className="w-6 h-6 text-primary" />
                     </div>
                     <div className="flex-1">
                       <h3 className="text-xl font-semibold mb-2">What We Do</h3>
                       <p className="text-muted-foreground mb-4">
                         Discover our comprehensive programs, teaching methodologies, and how we create lasting impact in children's lives.
                       </p>
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => scrollToSection('what-we-do')}
                         className="text-primary hover:text-primary-foreground"
                       >
                         Learn More
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
                 
                 <Card className="card-hover border-0 shadow-soft">
                   <CardContent className="pt-6 flex items-start space-x-4">
                     <div className="w-12 h-12 flex-shrink-0 rounded-full bg-accent/20 flex items-center justify-center">
                       <TrendingUp className="w-6 h-6 text-accent-foreground" />
                     </div>
                     <div className="flex-1">
                       <h3 className="text-xl font-semibold mb-2">Our Impacts</h3>
                       <p className="text-muted-foreground mb-4">
                         See the real difference we're making through success stories, statistics, and measurable outcomes.
                       </p>
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => scrollToSection('our-impacts')}
                         className="text-accent-foreground hover:text-accent"
                       >
                         Learn More
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
                 
                 <Card className="card-hover border-0 shadow-soft">
                   <CardContent className="pt-6 flex items-start space-x-4">
                     <div className="w-12 h-12 flex-shrink-0 rounded-full bg-secondary/20 flex items-center justify-center">
                       <Info className="w-6 h-6 text-secondary-foreground" />
                     </div>
                     <div className="flex-1">
                       <h3 className="text-xl font-semibold mb-2">About Us</h3>
                       <p className="text-muted-foreground mb-4">
                         Learn about the dedicated team behind REACH's mission to bridge the English proficiency gap.
                       </p>
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => scrollToSection('about-us')}
                         className="text-secondary hover:text-secondary-foreground"
                       >
                         Learn More
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               </div>
            </div>
            
            <div className="relative">
              <img 
                src={communitySupport} 
                alt="Children learning English in classroom"
                className="rounded-2xl shadow-warm w-full"
              />
              <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

        {/* What We Do Section */}
        <section id="what-we-do" className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-gradient">What We Do</h2>
            </div>
            
            {/* Problem Statement */}
            <div className="mb-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">The Challenge We Face</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Hong Kong is one of the most unequal cities in the world. We have 40,000
                    kindergarten students living below the poverty line. 8,000 of them coming
                    from families living in bedspace apartments, sub-divided flats or root top
                    huts. 5,000 children aged 3 - 5 cannot even afford 3 meals a day. For these
                    children, it's no longer about "winning at the starting line".
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Project Reach has worked with close to 400 K3 kindergarten students from 6
                    kindergartens and community centers in the past. Less than 20% of our
                    students could recognise all 26 alphabets when they first joined our
                    programme. In addition, they were significantly behind in terms of vocabulary
                    knowledge and sight words recognition.
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Parental involvement is another crucial aspect to children's
                    personal development. Many parents lack the knowledge or
                    confidence to get involved. A lot are also rarely present at
                    home to give children clear guidance or instructions and have
                    their grandparents or guardians take care of them instead.
                  </p>
                </div>
                <div className="relative">
                  <img 
                    src={childrenLearning} 
                    alt="Children in need of educational support"
                    className="rounded-2xl shadow-warm w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-8 rounded-2xl mb-8">
                <h4 className="text-xl font-semibold mb-4">The Kindergarten Crisis</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Kindergartens in Hong Kong are undersubsidised
                  especially compared to primary and secondary
                  schools. 29 kindergartens closed down in 2025-2026
                  – the most in a decade. From lack of funding and
                  support from NGOs, public and private sectors,
                  kindergartens are unable to offer any additional
                  resources for students in need.
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-primary mb-4">
                  Without proper interventions, these children would forever be fallen behind,
                  both academically and developmentally, as early as they enter Primary 1.
                </p>
                <p className="text-lg font-semibold text-destructive mb-4">
                  Many of them would never catch up.
                </p>
                <p className="text-lg font-semibold text-primary">
                  It is a vicious cycle. It exponentially increases the inequality gap in Hong Kong.
                </p>
                <p className="text-xl font-semibold text-secondary mt-6">
                  These children deserve the rights to be led to the starting line so that they can
                  be given equal opportunities to lead a better life.
                </p>
              </div>
            </div>
            
            {/* Our Interventions */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-6 text-gradient">Our Project Interventions</h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Project REACH aims to tackle Hong Kong's inequality
                  gap at its core through 3 interventions:
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="card-hover border-0 shadow-soft">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-center">1. EMPOWERING STUDENTS</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      We provide a minimum of 20 hours of weekly, premium English programmes targeting
                      to bridge the English proficiency gaps of K3 kindergarten students coming from some
                      of the poorest districts in Hong Kong. Our curriculum is designed based on renowned
                      story books worldwide.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="card-hover border-0 shadow-soft">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Users className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-center">2. EMPOWERING PARENTS</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Students are given home learning booklets for them to practise at home after each
                      class. Detailed written instructions with videos are provided to parents each week on
                      how to help their children complete the home learning booklets.
                    </p>
                                         <p className="text-sm text-muted-foreground text-center">
                       Parents are requested to submit completed work to Project REACH for grading. Our
                       previous programmes have increased parent-children interaction by {'>'}3,000 hours.
                     </p>
                  </CardContent>
                </Card>
                
                <Card className="card-hover border-0 shadow-soft">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-center">3. EMPOWERING KINDERGARTENS WITH DATA AND TECHNOLOGY</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      All participating students will utilise the Project Reach learning app, a
                      proprietary platform created and owned by Project Reach, to complete
                      their pre- and post-programme assessments.
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                      The app will provide immediate feedback to students, and all learning data
                      will be collected, analysed, and shared with our kindergarten partners.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Our Curriculum */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4 text-gradient">Our Proprietary Curriculum</h3>
                <p className="text-lg text-muted-foreground">
                  Developed by Columbia and Harvard-trained educators, our curriculum comprises five key
                  elements to prepare underserved children for Primary 1 proficiency requirements:
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                  <h4 className="font-semibold text-primary mb-2">Phonics Foundation</h4>
                  <p className="text-sm text-muted-foreground">
                    Systematic phonics instruction for letter recognition and sound blending
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                  <h4 className="font-semibold text-secondary mb-2">Vocabulary Building</h4>
                  <p className="text-sm text-muted-foreground">
                    Age-appropriate vocabulary development through interactive activities
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                  <h4 className="font-semibold text-accent mb-2">Sight Words</h4>
                  <p className="text-sm text-muted-foreground">
                    High-frequency word recognition for reading fluency
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                  <h4 className="font-semibold text-primary mb-2">Conversational Skills</h4>
                  <p className="text-sm text-muted-foreground">
                    Practical English communication for daily interactions
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                  <h4 className="font-semibold text-secondary mb-2">Assessment & Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Regular evaluation and progress tracking through our app
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

               {/* Our Impacts Section */}
        <section id="our-impacts" className="py-20 px-6 bg-muted/20">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-gradient">Our Impacts</h2>
            </div>
            
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="text-center card-hover border-0 shadow-soft">
                <CardContent className="pt-8 pb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">~73%</h3>
                  <h4 className="text-lg font-semibold mb-2">INCREASED PHONEMIC AWARENESS</h4>
                  <p className="text-sm text-muted-foreground">
                    Significant improvement in students' ability to recognize and manipulate sounds in words
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center card-hover border-0 shadow-soft">
                <CardContent className="pt-8 pb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Award className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">~39%</h3>
                  <h4 className="text-lg font-semibold mb-2">INCREASED SIGHT WORD RECOGNITION</h4>
                  <p className="text-sm text-muted-foreground">
                    Enhanced ability to recognize high-frequency words instantly for improved reading fluency
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Academic Performance */}
            <div className="mb-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Academic Performance & Socioemotional Development</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Our students exhibited significant improvement
                    that exceeded our expectations in both academic
                    performance and socioemotional development.
                    Parental feedback also highlighted noticeable
                    gains in their children's confidence and English
                    language skills. These strongly suggest that our
                    programme has successfully strengthened
                    students' foundational English reading abilities
                    and sparked their interest in the subject, which is
                    likely to have a beneficial effect on their future
                    studies in primary education.
                  </p>
                </div>
                <div className="relative">
                  <img 
                    src={childrenLearning} 
                    alt="Students showing improved confidence and skills"
                    className="rounded-2xl shadow-warm w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
                </div>
              </div>
            </div>
            
            {/* Parental Feedback */}
            <div className="bg-white p-8 rounded-2xl shadow-soft mb-16">
              <h3 className="text-2xl font-semibold mb-6 text-center">Parental Feedback</h3>
              <p className="text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
                Parents report that our programme has significantly enhanced their children's language development
                while strengthening family bonds. Children now demonstrate greater interest in English, recognize more
                vocabulary, spontaneously use simple phrases, and show increased confidence in their language abilities.
                Our project has created valuable opportunities for parent-child interaction through shared reading,
                homework sessions, and English conversations at home.
              </p>
            </div>
            
            {/* Teaching Approach */}
            <div className="mb-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <img 
                    src={communitySupport} 
                    alt="Child-friendly teaching approach with engaging materials"
                    className="rounded-2xl shadow-warm w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-secondary/10 rounded-2xl"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-6">What Distinguishes Our Programme</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    What distinguishes this programme from typical
                    "cramming-style" English classes is its child-friendly
                    teaching approach, featuring engaging gestures, colorful
                    materials, and systematic progression. Teachers
                    particularly appreciate how the encouraging environment
                    has transformed their students into self-motivated
                    learners who proactively engage with English without
                    prompting, creating a sustainable foundation for ongoing
                    language development and parent-child connection.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6">See What Teachers Think of Our Programme</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover firsthand testimonials from educators who have witnessed the transformative impact 
                of our programme on their students' learning journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-primary hover:bg-primary/90">
                  <Link to="/blogs">Read Teacher Testimonials</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/blogs">View Past Programme Reports</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

               {/* Meet Our Team Section */}
        <section id="about-us" className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-gradient">Meet Our Team</h2>
            </div>
            
            {/* Vivian Chung */}
            <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-2xl font-semibold">Vivian Chung</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Co-Founder</span>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Vivian Chung is an award-winning education specialist with 20+ years of experience teaching
                  English reading and writing through the use of story books. She holds an MA in Psychology in
                  Education from Columbia University and is the Director of Story Jungle Education Centre and
                  the Founder of REACH Charity. She serves as a Reading Consultant & Teacher Trainer for
                  kindergartens, primary and secondary schools throughout Hong Kong and is a top-rated
                  Parents Seminar Speaker promoting home literacy and shared reading strategies. In 2021,
                  Vivian received the Women of Excellence award from the South China Media Group honouring
                  her work and contributions in the field of education.
                </p>
              </div>
              
              <div className="relative">
                <img 
                  src={childrenLearning} 
                  alt="Vivian Chung - Co-Founder"
                  className="rounded-2xl shadow-warm w-full"
                />
                <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
              </div>
            </div>

            {/* Quincy Tse */}
            <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
              <div className="relative lg:order-2">
                <img 
                  src={childrenLearning} 
                  alt="Quincy Tse - Co-founder"
                  className="rounded-2xl shadow-warm w-full"
                />
                <div className="absolute inset-0 bg-gradient-secondary/10 rounded-2xl"></div>
              </div>
              
              <div className="lg:order-1">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-2xl font-semibold">Quincy Tse</h3>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">Co-founder</span>
                </div>
                <div className="mb-4">
                  <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">Director of Outreach</span>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Quincy Tse has 15 years of experience in global Fintechs specialising in offering financial data
                  and analytics, and web-based applications for financial institutions. Quincy also served as
                  Director of Special Projects at a Fortune 500 company where he was responsible for project
                  management, International Public Relations and Government Affairs.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Outside work, Quincy has over 18 years of experience co-running education charities. Prior to
                  REACH, he spent 9 years as Council Member of Access HK, a charity which provides English
                  tuition to underprivileged primary school students in Hong Kong. He earned his BSc in
                  Mathematics and Statistics from Imperial College London, and MSc in Statistics from University
                  College London.
                </p>
              </div>
            </div>

            {/* Sally Ng */}
            <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-2xl font-semibold">Sally Ng</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Co-founder</span>
                </div>
                <div className="mb-4">
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">Honorary Education Consultant</span>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Sally Ng joined Story Jungle Education Centre as a Native English teacher in 2007 and is
                  currently the Education Consultant. She conducts lessons for students in the United Kingdom,
                  United States, and Hong Kong and serves as a consultant to students applying to university and
                  parents who wish to send their children to school in the UK. Born in the UK, Sally completed her
                  high school education in a prestigious UK boarding school and graduated from the University
                  of London. Having spent a number of years studying in St. Mary's Canossian School, she is
                  familiar with the Hong Kong school system and understands through first-hand experience the
                  struggles that Hong Kong students encounter.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Sally has one-of-a-kind teaching style where she has shone a new light on English learning to
                  many students who were not fans of English at first. She is also an expert in developing
                  curriculum that is effective and enjoyable for students as she understands the efficacy of
                  positivity in motivating and helping students build confidence in English learning. Having vast
                  experience in the teaching field, she is quick to recognise and accommodate the individual
                  needs of each student even in a class setting.
                </p>
              </div>
              
              <div className="relative">
                <img 
                  src={childrenLearning} 
                  alt="Sally Ng - Co-founder"
                  className="rounded-2xl shadow-warm w-full"
                />
                <div className="absolute inset-0 bg-gradient-accent/10 rounded-2xl"></div>
              </div>
            </div>

            {/* Myolie Lau */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="relative lg:order-2">
                <img 
                  src={childrenLearning} 
                  alt="Myolie Lau - Director of Education and Outreach"
                  className="rounded-2xl shadow-warm w-full"
                />
                <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
              </div>
              
              <div className="lg:order-1">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-2xl font-semibold">Myolie Lau</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Director of Education and Outreach</span>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Myolie Lau first joined REACH in 2022. In her previous educational experiences, she worked as
                  an English NET Teacher and spent most of her time with kindergarten students. She is in charge
                  of planning and implementing English learning programs for children. She also helps establish
                  and maintains relationships with partners, as well as assisting with proposal writing, fundraising
                  activities, outreach, and partnership discussions.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  As she understands that learning English might be a challenge for some children, she hopes to
                  teach and guide them to discover and appreciate the beauty of English. She hopes that with the
                  help of storybooks, kids could start to embrace this amazing language and step out of their
                  comfort zone.
                </p>
                
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl mb-6">
                  <p className="text-muted-foreground italic leading-relaxed">
                    "It is my belief that the best gift for children is reading as it enables
                    learning and accessibility to knowledge, opportunities and ideas. My hope
                    is that all of my students can obtain this power and use it to anchor
                    their foundation, so that each and every one of them can grow to
                    incredible heights, allowing them the widest and greatest visions in life."
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-soft">
                  <h4 className="font-semibold text-primary mb-3">Our Core Belief</h4>
                  <p className="text-muted-foreground mb-4">
                    Every child deserves quality education regardless
                    of socioeconomic background and gender.
                  </p>
                  <p className="text-muted-foreground">
                    Given the right opportunity and resources, I firmly believe that
                    every single child can shine, thrive, and live their lives to the fullest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Partners Section */}
        <section className="py-20 px-6 bg-muted/20">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-gradient">Our Official Partners</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We collaborate with dedicated organizations, sponsors, and institutions to create lasting impact 
                in children's education across Hong Kong.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-primary">Sponsors</h3>
                <div className="bg-white p-8 rounded-xl shadow-soft min-h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-secondary">Partnering Organizations</h3>
                <div className="bg-white p-8 rounded-xl shadow-soft min-h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-accent">Institutions</h3>
                <div className="bg-white p-8 rounded-xl shadow-soft min-h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Call to Action */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${childrenLearning})` }}
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
                <Link to="/donate">
                  Start Donating Today
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;