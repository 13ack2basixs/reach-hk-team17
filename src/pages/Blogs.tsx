import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  Search,
  Clock,
  Tag
} from "lucide-react";

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "A Day in the Life at Sunshine Kindergarten",
      excerpt: "Follow little Emma through her exciting day of English learning, from morning songs to afternoon storytelling. Her journey showcases the incredible progress our students make every single day.",
      content: "The morning sun streams through the colorful windows of Sunshine Kindergarten as Emma, 4, arrives with her bright red backpack...",
      category: "Student Stories",
      author: "REACH Team",
      date: "2024-01-15",
      readTime: "5 min read",
      views: 245,
      likes: 32,
      image: "emma-story.jpg",
      tags: ["student-life", "success-story", "english-learning"]
    },
    {
      id: 2,
      title: "Breaking Barriers: How Technology Transforms Learning",
      excerpt: "Discover how our new tablet program is revolutionizing English education for underserved children. Interactive apps and digital storytelling are opening new worlds of possibilities.",
      content: "When Rainbow Learning Center received 25 new tablets last month, teacher Miss Chen knew this would change everything...",
      category: "Program Updates",
      author: "Sarah Wong",
      date: "2024-01-12",
      readTime: "7 min read",
      views: 189,
      likes: 28,
      image: "tech-learning.jpg",
      tags: ["technology", "innovation", "digital-learning"]
    },
    {
      id: 3,
      title: "From Shy to Confident: Tommy's Transformation",
      excerpt: "Meet Tommy, who started as a quiet observer and blossomed into a confident English speaker. His story demonstrates the power of patient, caring education in transforming young lives.",
      content: "Six months ago, Tommy barely whispered a word in class. Today, he's leading story time with confidence and joy...",
      category: "Success Stories",
      author: "Miss Chen",
      date: "2024-01-08",
      readTime: "4 min read",
      views: 312,
      likes: 45,
      image: "tommy-story.jpg",
      tags: ["confidence", "transformation", "speaking-skills"]
    },
    {
      id: 4,
      title: "Community Champions: Meet Our Volunteer Teachers",
      excerpt: "Our dedicated volunteers are the heart of REACH. Learn about the passionate individuals who donate their time and expertise to help children succeed.",
      content: "Behind every successful student is a caring teacher. Meet the incredible volunteers who make our mission possible...",
      category: "Community",
      author: "REACH Team",
      date: "2024-01-05",
      readTime: "6 min read",
      views: 167,
      likes: 23,
      image: "volunteers.jpg",
      tags: ["volunteers", "community", "teaching"]
    },
    {
      id: 5,
      title: "The Science of Early Language Learning",
      excerpt: "Explore the research behind our teaching methods. Understanding how young minds acquire language helps us create more effective programs for our students.",
      content: "Research shows that children ages 3-6 have a unique window for language acquisition. Our programs are designed to maximize this critical period...",
      category: "Educational Insights",
      author: "Dr. Lisa Park",
      date: "2024-01-02",
      readTime: "8 min read",
      views: 134,
      likes: 19,
      image: "research.jpg",
      tags: ["research", "language-learning", "education"]
    },
    {
      id: 6,
      title: "Celebrating Success: Winter Program Graduation",
      excerpt: "Twenty-five students celebrated their completion of our intensive winter English program. Their achievements showcase the incredible potential in every child.",
      content: "The gymnasium filled with proud families as 25 young graduates walked across the stage, certificates in hand...",
      category: "Events",
      author: "REACH Team",
      date: "2023-12-28",
      readTime: "3 min read",
      views: 298,
      likes: 41,
      image: "graduation.jpg",
      tags: ["graduation", "celebration", "achievement"]
    }
  ];

  const categories = [
    "all",
    "Student Stories", 
    "Program Updates", 
    "Success Stories", 
    "Community", 
    "Educational Insights",
    "Events"
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      "Student Stories": "bg-primary text-primary-foreground",
      "Program Updates": "bg-secondary text-secondary-foreground",
      "Success Stories": "bg-accent text-accent-foreground",
      "Community": "bg-muted text-muted-foreground",
      "Educational Insights": "bg-primary/80 text-primary-foreground",
      "Events": "bg-secondary/80 text-secondary-foreground"
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Stories of Hope</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the incredible journeys of our students, teachers, and community members. 
            Every story showcases the transformative power of education and your generous support.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories, topics, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md min-w-[180px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <Card className="mb-12 card-hover border-0 shadow-soft overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 aspect-video md:aspect-auto bg-gradient-warm relative">
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Eye className="w-16 h-16 text-white/80" />
                </div>
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  Featured Story
                </Badge>
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className={`mb-4 ${getCategoryColor(filteredPosts[0].category)}`}>
                  {filteredPosts[0].category}
                </Badge>
                <h2 className="text-3xl font-bold mb-4">{filteredPosts[0].title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{filteredPosts[0].author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(filteredPosts[0].date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{filteredPosts[0].readTime}</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-gradient-primary hover:bg-primary/90">
                  Read Full Story
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post.id} className="card-hover border-0 shadow-soft overflow-hidden">
              <div className="aspect-video bg-gradient-warm relative">
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white/80" />
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{post.views}</span>
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                    <span>{post.likes}</span>
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight">{post.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No stories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-16 bg-gradient-hero text-white border-0">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to receive the latest stories and updates from REACH directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address"
                className="bg-white text-foreground"
              />
              <Button 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blogs;