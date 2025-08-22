import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Users, 
  GraduationCap, 
  Heart,
  Search,
  Filter,
  Star,
  Calendar
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const schools = [
    {
      id: 1,
      name: "Sunshine Kindergarten",
      region: "Sham Shui Po",
      students: 45,
      age: "3-5 years",
      description: "A vibrant community school serving children from low-income families. Our students show incredible enthusiasm for learning despite facing significant challenges at home.",
      impact: "Thanks to donor support, 40 children received new English books this semester.",
      recentNews: "Little Amy scored 95% on her English assessment!",
      needsLevel: "High",
      images: ["classroom1.jpg", "students1.jpg"],
      totalDonations: 12500
    },
    {
      id: 2,
      name: "Rainbow Learning Center",
      region: "Kwun Tong",
      students: 38,
      age: "4-6 years",
      description: "Located in one of Hong Kong's most densely populated areas, this school provides a safe haven for learning. Many children walk long distances to attend classes.",
      impact: "Recent donations funded 25 new tablets for interactive English learning.",
      recentNews: "Class 2A won the regional spelling bee competition!",
      needsLevel: "Critical",
      images: ["classroom2.jpg", "students2.jpg"],
      totalDonations: 8750
    },
    {
      id: 3,
      name: "Hope Valley School",
      region: "Tin Shui Wai",
      students: 52,
      age: "3-6 years",
      description: "Serving one of Hong Kong's most disadvantaged communities, this school transforms lives daily. Children here dream big despite limited resources.",
      impact: "Your donations provided nutritious lunches for 50 children for 3 months.",
      recentNews: "15 students advanced to advanced English reading groups!",
      needsLevel: "Moderate",
      images: ["classroom3.jpg", "students3.jpg"],
      totalDonations: 15300
    },
    {
      id: 4,
      name: "Bright Futures Academy",
      region: "Tuen Mun",
      students: 41,
      age: "4-5 years",
      description: "A beacon of hope in the community, fostering creativity and academic excellence. Teachers here go above and beyond to nurture each child's potential.",
      impact: "Donations funded a new computer lab with 20 workstations.",
      recentNews: "Student artwork displayed at city cultural center!",
      needsLevel: "High",
      images: ["classroom4.jpg", "students4.jpg"],
      totalDonations: 9800
    }
  ];

  const regions = ["all", "Sham Shui Po", "Kwun Tong", "Tin Shui Wai", "Tuen Mun"];

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || school.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const getNeedsColor = (level: string) => {
    switch (level) {
      case "Critical": return "bg-destructive text-destructive-foreground";
      case "High": return "bg-primary text-primary-foreground";
      case "Moderate": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Our Partner Schools</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the amazing children and dedicated educators at our partner schools across Hong Kong. 
            Each school has unique stories, challenges, and dreams that your support helps bring to life.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools or regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {region === "all" ? "All Regions" : region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredSchools.map((school) => (
            <Card key={school.id} className="card-hover border-0 shadow-soft overflow-hidden">
              <div className="aspect-video bg-gradient-warm relative">
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-white/80" />
                </div>
                <Badge 
                  className={`absolute top-4 right-4 ${getNeedsColor(school.needsLevel)}`}
                >
                  {school.needsLevel} Need
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl">{school.name}</span>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>Partner School</span>
                  </div>
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{school.region}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{school.students} students</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {school.description}
                </p>

                <div className="bg-accent/20 p-4 rounded-lg border-l-4 border-primary">
                  <p className="text-sm font-medium mb-1">Recent Impact:</p>
                  <p className="text-sm text-muted-foreground">{school.impact}</p>
                </div>

                <div className="bg-secondary/20 p-4 rounded-lg border-l-4 border-secondary">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4 text-secondary-foreground" />
                    <p className="text-sm font-medium">Latest News:</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{school.recentNews}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total Raised: </span>
                    <span className="font-bold text-primary">${school.totalDonations.toLocaleString()}</span>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-primary hover:bg-primary/90">
                        <Heart className="w-4 h-4 mr-2" />
                        Support School
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{school.name} - Donation Impact</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-primary">{school.students}</p>
                            <p className="text-sm text-muted-foreground">Children Served</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-secondary">{school.age}</p>
                            <p className="text-sm text-muted-foreground">Age Range</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold">How Your Donation Helps:</h4>
                          <div className="grid gap-2 text-sm">
                            <div className="flex justify-between p-2 bg-muted/50 rounded">
                              <span>$25 - English workbooks for 1 child/month</span>
                            </div>
                            <div className="flex justify-between p-2 bg-muted/50 rounded">
                              <span>$50 - Learning materials for small group</span>
                            </div>
                            <div className="flex justify-between p-2 bg-muted/50 rounded">
                              <span>$100 - Teacher training workshop</span>
                            </div>
                            <div className="flex justify-between p-2 bg-muted/50 rounded">
                              <span>$250 - Technology equipment upgrade</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-primary hover:bg-primary/90">
                          <Heart className="w-4 h-4 mr-2" />
                          Donate to {school.name}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No schools found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schools;