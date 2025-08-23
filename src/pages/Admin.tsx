import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Send, 
  Users, 
  GraduationCap, 
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  Bot,
  Sparkles,
  FileImage,
  School,
  Megaphone,
  Calendar,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAnnouncements } from "@/contexts/AnnouncementContext";

const Admin = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [blogPrompt, setBlogPrompt] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState("");

  // Announcement state
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Lily passed her first English test!",
      content: "We're so proud of Lily from Sunshine Kindergarten! She scored 95% on her first English vocabulary test. Her hard work and dedication are truly inspiring.",
      studentName: "Lily",
      school: "Sunshine Kindergarten",
      date: "2024-01-15",
      isActive: true,
      priority: "high"
    },
    {
      id: 2,
      title: "Tommy's reading progress amazes everyone!",
      content: "Tommy has improved his reading skills dramatically! He can now read simple English books independently. His confidence has grown so much.",
      studentName: "Tommy",
      school: "Rainbow Learning Center",
      date: "2024-01-14",
      isActive: true,
      priority: "medium"
    },
    {
      id: 3,
      title: "Emma leads her first English conversation!",
      content: "Emma took the lead in today's English conversation class! She helped other students with pronunciation and showed great leadership skills.",
      studentName: "Emma",
      school: "Hope Valley School",
      date: "2024-01-13",
      isActive: true,
      priority: "medium"
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    studentName: "",
    school: "",
    priority: "medium"
  });
        
  const [students] = useState([
    {
      id: 1,
      name: "Emma Wong",
      school: "Sunshine Kindergarten",
      class: "K2A",
      region: "Sham Shui Po",
      englishGrade: 85,
      mathGrade: 78,
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      name: "Tommy Chen",
      school: "Rainbow Learning Center", 
      class: "K1B",
      region: "Kwun Tong",
      englishGrade: 92,
      mathGrade: 88,
      lastUpdated: "2024-01-14"
    },
    {
      id: 3,
      name: "Lisa Park",
      school: "Hope Valley School",
      class: "K3A", 
      region: "Tin Shui Wai",
      englishGrade: 76,
      mathGrade: 82,
      lastUpdated: "2024-01-13"
    }
  ]);

  const schools = ["Sunshine Kindergarten", "Rainbow Learning Center", "Hope Valley School", "Bright Futures Academy"];
  const regions = ["Sham Shui Po", "Kwun Tong", "Tin Shui Wai", "Tuen Mun"];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedImages(files);
    toast({
      title: "Images Uploaded",
      description: `${files.length} image(s) uploaded successfully`,
    });
  };

  const handleGenerateBlog = async () => {
    if (!blogPrompt || uploadedImages.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please upload images and provide a description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI blog generation
    setTimeout(() => {
      const generatedContent = `# A Heartwarming Day at Our Partner School

${blogPrompt}

## The Magic of Learning

Today was filled with incredible moments as we witnessed the power of education in action. The children's enthusiasm and curiosity remind us why REACH's mission is so important.

### Key Highlights:

- **Interactive Learning**: Students engaged with new English vocabulary through fun activities
- **Creative Expression**: Art and storytelling combined to help children express themselves
- **Community Support**: Thanks to generous donors, we provided new learning materials

### Student Achievements:

Our dedicated teachers noticed remarkable progress in several areas:
- Improved pronunciation and confidence in speaking English
- Better reading comprehension skills
- Increased participation in classroom discussions

### Looking Forward:

With continued support from our amazing donor community, we can expand these programs to reach even more children. Every donation truly makes a difference in these young lives.

*"Education is the most powerful weapon which you can use to change the world."* - Nelson Mandela

Thank you for being part of this incredible journey of transformation!`;

      setGeneratedBlog(generatedContent);
      setIsGenerating(false);
      toast({
        title: "Blog Generated Successfully!",
        description: "Your AI-generated blog post is ready for review",
      });
    }, 3000);
  };

  const publishBlog = () => {
    toast({
      title: "Blog Published!",
      description: "Your story has been shared with the community",
    });
    setGeneratedBlog("");
    setBlogPrompt("");
    setUploadedImages([]);
  };

  // Announcement management functions
  const addAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.studentName || !newAnnouncement.school) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const announcement = {
      id: Date.now(),
      ...newAnnouncement,
      date: new Date().toISOString().split('T')[0],
      isActive: true
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: "",
      content: "",
      studentName: "",
      school: "",
      priority: "medium"
    });

    toast({
      title: "Announcement Added!",
      description: "Your announcement has been published",
    });
  };

  const toggleAnnouncementStatus = (id: number) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, isActive: !announcement.isActive }
        : announcement
    ));
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been removed",
    });
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Manage content, track student progress, and create engaging stories for your community.
          </p>
        </div>

        <Tabs defaultValue="blog-creator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="blog-creator" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>Blog Creator</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4" />
              <span>Announcements</span>
            </TabsTrigger>
            <TabsTrigger value="student-grades" className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>Student Grades</span>
            </TabsTrigger>
            <TabsTrigger value="content-manager" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Content Manager</span>
            </TabsTrigger>
          </TabsList>

          {/* Blog Creator Tab */}
          <TabsContent value="blog-creator">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span>AI Blog Generator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label htmlFor="images" className="text-base font-medium">Upload Images</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Drop images here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Support for JPG, PNG, WEBP files
                        </p>
                      </label>
                    </div>
                    
                    {uploadedImages.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Uploaded Images:</p>
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm bg-muted/50 p-2 rounded">
                            <FileImage className="w-4 h-4" />
                            <span className="flex-1 truncate">{file.name}</span>
                            <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description Input */}
                  <div>
                    <Label htmlFor="prompt" className="text-base font-medium">Describe the Story</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Tell us about the images... What happened? Who was involved? What made this moment special? The more details you provide, the richer the generated story will be."
                      value={blogPrompt}
                      onChange={(e) => setBlogPrompt(e.target.value)}
                      className="mt-2 min-h-[120px] resize-none"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Example: "Today's English class was amazing! The children were learning animal names using picture cards. Emma raised her hand enthusiastically to answer questions, and Tommy helped his classmate with pronunciation."
                    </p>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={handleGenerateBlog}
                    disabled={isGenerating || !blogPrompt || uploadedImages.length === 0}
                    className="w-full bg-gradient-primary hover:bg-primary/90"
                  >
                    {isGenerating ? (
                      <>
                        <Bot className="w-4 h-4 mr-2 animate-spin" />
                        Generating Amazing Story...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Blog Story
                      </>
                    )}
                  </Button>

                  {isGenerating && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Processing images...</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preview Section */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-6 h-6 text-secondary" />
                      <span>Generated Story Preview</span>
                    </div>
                    {generatedBlog && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button onClick={publishBlog} size="sm" className="bg-secondary hover:bg-secondary/90">
                          <Send className="w-4 h-4 mr-2" />
                          Publish
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedBlog ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-muted/30 p-6 rounded-lg border">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {generatedBlog}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Your generated story will appear here</p>
                      <p className="text-sm">Upload images and add a description to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add New Announcement */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Megaphone className="w-6 h-6 text-primary" />
                    <span>Add New Announcement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="announcement-title" className="text-base font-medium">Announcement Title *</Label>
                    <Input
                      id="announcement-title"
                      placeholder="e.g., Lily passed her first English test!"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="announcement-content" className="text-base font-medium">Announcement Content *</Label>
                    <Textarea
                      id="announcement-content"
                      placeholder="Share the details of this achievement or milestone..."
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      className="mt-2 min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student-name" className="text-base font-medium">Student Name *</Label>
                      <Input
                        id="student-name"
                        placeholder="e.g., Lily"
                        value={newAnnouncement.studentName}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, studentName: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="school" className="text-base font-medium">School *</Label>
                      <select
                        id="school"
                        value={newAnnouncement.school}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, school: e.target.value})}
                        className="mt-2 w-full px-3 py-2 border border-input bg-background rounded-md"
                      >
                        <option value="">Select School</option>
                        {schools.map(school => (
                          <option key={school} value={school}>{school}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-base font-medium">Priority Level</Label>
                    <select
                      id="priority"
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                      className="mt-2 w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>

                  <Button 
                    onClick={addAnnouncement}
                    className="w-full bg-gradient-primary hover:bg-primary/90"
                  >
                    <Megaphone className="w-4 h-4 mr-2" />
                    Publish Announcement
                  </Button>
                </CardContent>
              </Card>

              {/* Manage Announcements */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-secondary" />
                    <span>Manage Announcements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <Card key={announcement.id} className="card-hover">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-lg">{announcement.title}</h3>
                                <Badge 
                                  variant={announcement.priority === "high" ? "default" : "secondary"}
                                  className={announcement.priority === "high" ? "bg-red-500" : ""}
                                >
                                  {announcement.priority}
                                </Badge>
                                <Badge variant={announcement.isActive ? "default" : "outline"}>
                                  {announcement.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {announcement.content}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(announcement.date).toLocaleDateString()}</span>
                                </div>
                                <span>•</span>
                                <span>{announcement.studentName} - {announcement.school}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toggleAnnouncementStatus(announcement.id)}
                              >
                                {announcement.isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deleteAnnouncement(announcement.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Student Grades Tab */}
          <TabsContent value="student-grades">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    <span>Student Grade Management</span>
                  </div>
                  <Button className="bg-gradient-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search students..." className="pl-10" />
                  </div>
                  <select className="px-3 py-2 border border-input bg-background rounded-md">
                    <option value="">All Schools</option>
                    {schools.map(school => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                  <select className="px-3 py-2 border border-input bg-background rounded-md">
                    <option value="">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  <select className="px-3 py-2 border border-input bg-background rounded-md">
                    <option value="">All Classes</option>
                    <option value="K1A">K1A</option>
                    <option value="K1B">K1B</option>
                    <option value="K2A">K2A</option>
                    <option value="K2B">K2B</option>
                    <option value="K3A">K3A</option>
                    <option value="K3B">K3B</option>
                  </select>
                </div>

                {/* Quick Add Grade Form */}
                <Card className="mb-6 bg-accent/10 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Grade Entry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-6 gap-4">
                      <Input placeholder="Student Name" />
                      <select className="px-3 py-2 border border-input bg-background rounded-md">
                        <option value="">Select School</option>
                        {schools.map(school => (
                          <option key={school} value={school}>{school}</option>
                        ))}
                      </select>
                      <Input placeholder="Class (e.g., K2A)" />
                      <Input placeholder="English Grade" type="number" min="0" max="100" />
                      <Input placeholder="Math Grade" type="number" min="0" max="100" />
                      <Button className="bg-secondary hover:bg-secondary/90">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Students Table */}
                <div className="space-y-4">
                  {students.map((student) => (
                    <Card key={student.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{student.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <School className="w-4 h-4" />
                                  <span>{student.school}</span>
                                </div>
                                <span>•</span>
                                <span>Class {student.class}</span>
                                <span>•</span>
                                <span>{student.region}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            {/* Grades Display */}
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">{student.englishGrade}</p>
                              <p className="text-xs text-muted-foreground">English</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-secondary">{student.mathGrade}</p>
                              <p className="text-xs text-muted-foreground">Math</p>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            Last updated: {new Date(student.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Manager Tab */}
          <TabsContent value="content-manager">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-primary" />
                    <span>School Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New School
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit School Information
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload School Images
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-6 h-6 text-secondary" />
                    <span>Content Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Manage Blog Categories
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Donor Badge Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Send className="w-4 h-4 mr-2" />
                    Email Templates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;