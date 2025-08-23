// src/pages/Blogs.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  Tag,
} from "lucide-react";

// 🔥 Firestore
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

type StoryDoc = {
  title: string;
  summary: string; // shown as excerpt
  bodyHtml: string;
  category: string;
  tags: string[];
  images: { url: string; alt?: string }[];
  readingMinutes: number;
  author?: string;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number };
  views?: number;
  likes?: number;
};

type Story = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string; // formatted for UI
  readTime: string; // "5 min read"
  views: number;
  likes: number;
  image?: string; // url
  tags: string[];
};

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 🔥 Live data from Firestore
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch once on mount
  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const list: Story[] = [];
        snap.forEach((d) => {
          const data = d.data() as StoryDoc;

          // defensively normalize
          const title = data.title ?? "Untitled";
          const summary = data.summary ?? "";
          const category =
            data.category ?? "Student Stories";
          const tags = Array.isArray(data.tags) ? data.tags : [];
          const readingMinutes =
            typeof data.readingMinutes === "number" ? data.readingMinutes : 5;
          const author = data.author ?? "REACH Team";
          const views = typeof data.views === "number" ? data.views : 0;
          const likes = typeof data.likes === "number" ? data.likes : 0;

          // createdAt can be missing or a Timestamp or a POJO
          let dateStr = "";
          if (data.createdAt && "toDate" in (data.createdAt as any)) {
            dateStr = (data.createdAt as Timestamp).toDate().toLocaleDateString();
          } else if (
            data.createdAt &&
            typeof (data.createdAt as any).seconds === "number"
          ) {
            dateStr = new Date(
              (data.createdAt as any).seconds * 1000
            ).toLocaleDateString();
          } else {
            dateStr = new Date().toLocaleDateString();
          }

          list.push({
            id: d.id,
            title,
            excerpt: summary, // map summary to excerpt
            content: data.bodyHtml ?? "",
            category,
            author,
            date: dateStr,
            readTime: `${readingMinutes} min read`,
            views,
            likes,
            image: data.images?.[0]?.url, // first image for card
            tags,
          });
        });

        setStories(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(
    () => [
      "all",
      "Student Stories",
      "Program Updates",
      "Success Stories",
      "Community",
      "Educational Insights",
      "Events",
    ],
    []
  );

  // Use real Firestore stories (not hard-coded)
  const filteredPosts = useMemo(() => {
    const safeStories = stories ?? [];
    return safeStories.filter((post) => {
      const s = searchTerm.trim().toLowerCase();
      const matchesSearch =
        s.length === 0 ||
        post.title.toLowerCase().includes(s) ||
        post.excerpt.toLowerCase().includes(s) ||
        post.tags.some((t) => t.toLowerCase().includes(s));

      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [stories, searchTerm, selectedCategory]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Student Stories": "bg-primary text-primary-foreground",
      "Program Updates": "bg-secondary text-secondary-foreground",
      "Success Stories": "bg-accent text-accent-foreground",
      Community: "bg-muted text-muted-foreground",
      "Educational Insights": "bg-primary/80 text-primary-foreground",
      Events: "bg-secondary/80 text-secondary-foreground",
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
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading / Empty states */}
        {loading && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">Loading stories…</h3>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        )}

        {/* Featured Post */}
        {!loading && filteredPosts.length > 0 && (
          <Card className="mb-12 card-hover border-0 shadow-soft overflow-hidden">
            <div className="md:flex">
              {/* Featured media - now shows real image with fallback */}
              <div className="md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden">
                {filteredPosts[0].image ? (
                  <img
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-warm" />
                )}
                <div className="absolute inset-0 bg-black/20" />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  Featured Story
                </Badge>
              </div>

              <div className="md:w-1/2 p-8">
                <Badge
                  className={`mb-4 ${getCategoryColor(
                    filteredPosts[0].category
                  )}`}
                >
                  {filteredPosts[0].category}
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  {filteredPosts[0].title}
                </h2>
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
                      <span>{filteredPosts[0].date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{filteredPosts[0].readTime}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/stories/${filteredPosts[0].id}`}>
                  <Button className="bg-gradient-primary hover:bg-primary/90">
                    Read Full Story
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Grid */}
        {!loading && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <Card
                  key={post.id}
                  className="card-hover border-0 shadow-soft overflow-hidden"
                >
                  {/* Card image - now shows real thumbnail with fallback */}
                  <div className="aspect-video relative overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-warm" />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
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
                    <CardTitle className="text-xl leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
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

                      <Link to={`/stories/${post.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:bg-primary/10"
                        >
                          Read More
                        </Button>
                      </Link>
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
          </>
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
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
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
