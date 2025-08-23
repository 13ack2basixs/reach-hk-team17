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
  Star,
  BadgeDollarSignIcon,
  Mail,
  DollarSign,
  User,
  Building,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAnnouncements } from "@/contexts/AnnouncementContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        isActive: true
      },
      {
        id: 2,
        title: "Tommy's reading progress amazes everyone!",
        content: "Tommy has improved his reading skills dramatically! He can now read simple English books independently. His confidence has grown so much.",
        studentName: "Tommy",
        school: "Rainbow Learning Center",
        date: "2024-01-14",
        isActive: true
      },
      {
        id: 3,
        title: "Emma leads her first English conversation!",
        content: "Emma took the lead in today's English conversation class! She helped other students with pronunciation and showed great leadership skills.",
        studentName: "Emma",
        school: "Hope Valley School",
        date: "2024-01-13",
        isActive: true
      }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    studentName: "",
    school: ""
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

  // Donor management state
  const [donors, setDonors] = useState([
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      amount: 500,
      school: "Sunshine Kindergarten",
      donorType: "Individual",
      dateDonated: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      amount: 750,
      school: "Rainbow Learning Center",
      donorType: "Individual",
      dateDonated: "2024-01-10",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@example.com",
      amount: 300,
      school: "Hope Valley School",
      donorType: "Individual",
      dateDonated: "2024-01-08",
    },
  ]);
  const [donorSearchTerm, setDonorSearchTerm] = useState("");
  const [selectedDonorSchool, setSelectedDonorSchool] = useState("");
  const [editingDonor, setEditingDonor] = useState(null);
  const [donorForm, setDonorForm] = useState({
    name: "",
    email: "",
    amount: "",
    school: "",
    donorType: "Individual",
    dateDonated: new Date().toISOString().split('T')[0]
  });
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDonorProfileModal, setShowDonorProfileModal] = useState(false);
  const [selectedDonorType, setSelectedDonorType] = useState("");

  // sample 12-month donation data for the chart
  const monthlyDonationData = [
    { month: 'Jan', amount: 12500 },
    { month: 'Feb', amount: 15800 },
    { month: 'Mar', amount: 14200 },
    { month: 'Apr', amount: 18900 },
    { month: 'May', amount: 16500 },
    { month: 'Jun', amount: 20100 },
    { month: 'Jul', amount: 17800 },
    { month: 'Aug', amount: 19200 },
    { month: 'Sep', amount: 22500 },
    { month: 'Oct', amount: 19800 },
    { month: 'Nov', amount: 23400 },
    { month: 'Dec', amount: 26700 }
  ];

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

  // Donor management functions
  const handleDonorSubmit = async () => {
    if (
      !donorForm.name ||
      !donorForm.email ||
      !donorForm.amount ||
      !donorForm.school
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const amount = parseFloat(donorForm.amount);

      if (editingDonor && editingDonor.id) {
        // Check if this is editing an existing donation or adding a new one
        const isEditingExistingDonation = editingDonor.id && editingDonor.amount && editingDonor.school;
        
        if (isEditingExistingDonation) {
          // Update existing donation
          const updatedDonors = donors.map((d) => 
            d.id === editingDonor.id 
              ? {
                  ...d,
                  amount: amount,
                  school: donorForm.school,
                  donorType: donorForm.donorType,
                  dateDonated: donorForm.dateDonated,
                }
              : d
          );
          
          setDonors(updatedDonors);
          
          toast({
            title: "Donation Updated!",
            description: `Donation has been updated successfully.`,
          });
        } else {
          // Add new donation to existing donor
          const newDonation = {
            id: Date.now().toString(),
            name: editingDonor.name,
            email: editingDonor.email,
            amount: amount,
            school: donorForm.school,
            donorType: donorForm.donorType,
            dateDonated: donorForm.dateDonated,
            createdAt: new Date(),
          };

          setDonors([...donors, newDonation]);

          toast({
            title: "Donation Added!",
            description: `New donation of $${amount.toLocaleString()} has been added to ${editingDonor.name}'s profile.`,
          });
        }
      } else {
        // Add new donor
        const newDonor = {
          id: Date.now().toString(),
          name: donorForm.name,
          email: donorForm.email,
          amount: amount,
          school: donorForm.school,
          donorType: donorForm.donorType,
          dateDonated: donorForm.dateDonated,
          createdAt: new Date(),
        };

        setDonors([...donors, newDonor]);

        toast({
          title: "New Donor Added!",
          description: `${donorForm.name} has been added to the donor list.`,
        });
      }

      // Reset form
      setDonorForm({
        name: "",
        email: "",
        amount: "",
        school: "",
        donorType: "Individual",
        dateDonated: new Date().toISOString().split('T')[0]
      });
      setEditingDonor(null);
    } catch (error) {
      console.error("Error saving donor:", error);
      toast({
        title: "Error",
        description: "Failed to save donor information",
        variant: "destructive",
      });
    }
  };

  const handleEditDonor = (donor) => {
    setEditingDonor(donor);
    setDonorForm({
      name: donor.name,
      email: donor.email,
      amount: donor.amount.toString(),
      school: donor.school,
      donorType: donor.donorType || "Individual",
      dateDonated: donor.dateDonated || new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteDonor = (donorId: string) => {
    setDonors(donors.filter((d) => d.id !== donorId));
    toast({
      title: "Donor Removed",
      description: "Donor has been removed from the list.",
    });
  };

  const clearAllFilters = () => {
    setSelectedDonorSchool("");
    setSelectedDonorType("");
    setDonorSearchTerm("");
  };

  // Filter donors
  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(donorSearchTerm.toLowerCase());
    const matchesSchool =
      !selectedDonorSchool || donor.school === selectedDonorSchool;
    const matchesDonorType =
      !selectedDonorType || donor.donorType === selectedDonorType;

    return matchesSearch && matchesSchool && matchesDonorType;
  });

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
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="donor-manager" className="flex items-center space-x-2">
              <BadgeDollarSignIcon className="w-4 h-4" />
              <span>Donor Management</span>
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

          {/* Donor Management Tab */}
          <TabsContent value="donor-manager">
            <Tabs defaultValue="donors" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <BadgeDollarSignIcon className="w-4 h-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="donors" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Donors</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Sub-tab */}
              <TabsContent value="overview">
                {/* Key Metrics with Month/Year Selector */}
                <Card className="border-0 shadow-soft mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <BadgeDollarSignIcon className="w-6 h-6 text-primary" />
                        <span>Key Metrics</span>
                      </CardTitle>
                      <div className="flex items-center space-x-3">
                        <select
                          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                          value={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
                        >
                          {Array.from({ length: 12 }, (_, i) => {
                            const date = new Date();
                            date.setMonth(date.getMonth() - i);
                            return (
                              <option key={i} value={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`}>
                                {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Total Donations</p>
                        <p className="text-2xl font-bold text-primary">
                          ${donors.reduce((sum, donor) => sum + donor.amount, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Total Donors</p>
                        <p className="text-2xl font-bold text-secondary">
                          {donors.length}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Average Donation</p>
                        <p className="text-2xl font-bold text-accent">
                          ${Math.round(donors.reduce((sum, donor) => sum + donor.amount, 0) / donors.length || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">This Month</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${Math.round(donors.reduce((sum, donor) => sum + donor.amount, 0) * 0.15).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* 12-Month Line Graph */}
                    <div className="h-64 bg-background rounded-lg border border-border">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyDonationData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Donations']}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={3}
                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* School Breakdown */}
                <Card className="border-0 shadow-soft mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <School className="w-6 h-6 text-primary" />
                      <span>School Breakdown</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {schools.map((school) => {
                        const schoolDonors = donors.filter(donor => donor.school === school);
                        const individualTotal = schoolDonors
                          .filter(donor => donor.donorType === 'Individual')
                          .reduce((sum, donor) => sum + donor.amount, 0);
                        const corporateTotal = schoolDonors
                          .filter(donor => donor.donorType === 'Corporate')
                          .reduce((sum, donor) => sum + donor.amount, 0);
                        const total = individualTotal + corporateTotal;
                        
                        return (
                          <div key={school} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{school}</span>
                              <span className="text-sm text-muted-foreground">
                                Total: ${total.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex h-8 bg-muted/30 rounded-lg overflow-hidden">
                              {/* Individual Bar */}
                              <div 
                                className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                                style={{ 
                                  width: `${total > 0 ? (individualTotal / total) * 100 : 0}%`,
                                  minWidth: individualTotal > 0 ? '40px' : '0'
                                }}
                              >
                                ${individualTotal.toLocaleString()}
                              </div>
                              {/* Corporate Bar */}
                              <div 
                                className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                                style={{ 
                                  width: `${total > 0 ? (corporateTotal / total) * 100 : 0}%`,
                                  minWidth: corporateTotal > 0 ? '40px' : '0'
                                }}
                              >
                                ${corporateTotal.toLocaleString()}
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>👤 Individual: ${individualTotal.toLocaleString()}</span>
                              <span>🏢 Corporate: ${corporateTotal.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-6 h-6 text-primary" />
                      <span>Recent Activity (Last 30 Days)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {donors.slice(0, 5).map((donor, index) => (
                        <div key={donor.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {donor.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-medium">{donor.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {donor.donorType} • {donor.school}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${donor.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {index === 0 ? '2 days ago' : 
                               index === 1 ? '5 days ago' : 
                               index === 2 ? '1 week ago' : 
                               index === 3 ? '2 weeks ago' : '3 weeks ago'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Donors Sub-tab */}
              <TabsContent value="donors">
                <Card className="border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-6 h-6 text-primary" />
                        <span>Donor Management</span>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {donors.length} Active Donors
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                                    {/* Search and Filter Row */}
                <div className="flex items-center justify-between mb-6">
                  {/* Search - Top Left */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search donors by name or email"
                      className="pl-10"
                      value={donorSearchTerm}
                      onChange={(e) => setDonorSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Filters and Add Donor - Top Right */}
                  <div className="flex items-center space-x-3">
                    <Button
                      variant={selectedDonorSchool || selectedDonorType ? "default" : "outline"}
                      onClick={() => setShowFilterModal(true)}
                      className="flex items-center space-x-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Filters</span>
                      {(selectedDonorSchool || selectedDonorType) && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {[selectedDonorSchool, selectedDonorType].filter(Boolean).length}
                        </Badge>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => setShowDonorModal(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Donor
                    </Button>
                  </div>
                </div>

                {/* Total - Middle */}
                <div className="text-center mb-6">
                  <Badge variant="secondary" className="text-xl px-6 py-3">
                    Total: $
                    {filteredDonors
                      .reduce((sum, donor) => sum + donor.amount, 0)
                      .toLocaleString()}
                  </Badge>
                </div>

                    {/* Donors List */}
                    <div className="space-y-4">
                      {filteredDonors.map((donor) => (
                        <Card key={donor.id} className="card-hover">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {donor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {donor.name}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <Mail className="w-4 h-4" />
                                      <span>{donor.email}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                      <School className="w-4 h-4" />
                                      <span>{donor.school}</span>
                                    </div>
                                    <span>•</span>
                                    <Badge variant="outline" className="text-xs">
                                      {donor.donorType === 'Individual' ? (
                                        <User className="w-3 h-3 mr-1" />
                                      ) : (
                                        <Building className="w-3 h-3 mr-1" />
                                      )}
                                      {donor.donorType}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-6">
                                {/* Donation Amount */}
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-green-600">
                                    ${donor.amount.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Donated
                                  </p>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingDonor(donor);
                                  setShowDonorProfileModal(true);
                                }}
                              >
                                <BadgeDollarSignIcon className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      donor.id && handleDeleteDonor(donor.id)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredDonors.length === 0 && (
                      <div className="text-center py-8">
                        <BadgeDollarSignIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          No donors found
                        </h3>
                        <p className="text-muted-foreground">
                          {donorSearchTerm || selectedDonorSchool
                            ? "Try adjusting your search criteria or add a new donor."
                            : "Start by adding your first donor using the form above."}
                        </p>
                      </div>
                    )}


                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Filter Donors</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilterModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="filter-school" className="text-base font-medium">School</Label>
                  <select
                    id="filter-school"
                    className="mt-2 w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={selectedDonorSchool}
                    onChange={(e) => setSelectedDonorSchool(e.target.value)}
                  >
                    <option value="">All Schools</option>
                    {schools.map((school) => (
                      <option key={school} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="filter-donor-type" className="text-base font-medium">Donor Type</Label>
                  <select
                    id="filter-donor-type"
                    className="mt-2 w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={selectedDonorType}
                    onChange={(e) => setSelectedDonorType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setShowFilterModal(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donor Profile Modal */}
        {showDonorProfileModal && editingDonor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Donor Profile: {editingDonor.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDonorProfileModal(false);
                    setEditingDonor(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Donor Info Header */}
              <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-muted/20 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Name:</strong> {editingDonor.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Email:</strong> {editingDonor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BadgeDollarSignIcon className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Type:</strong> {editingDonor.donorType}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Donation Summary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <School className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Schools Supported:</strong> {editingDonor.school}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Total Donated:</strong> $
                        {donors
                          .filter(donor => donor.email === editingDonor.email)
                          .reduce((sum, donor) => sum + donor.amount, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Last Donation:</strong> {new Date(editingDonor.dateDonated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donation History */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4">Donation History</h3>
                <div className="space-y-3">
                  {donors
                    .filter(donor => donor.email === editingDonor.email)
                    .map((donation, index) => (
                      <div key={donation.id} className="p-4 bg-muted/20 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{donation.school}</p>
                                <p className="text-sm text-muted-foreground">
                                  {donation.donorType} donation
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowDonorProfileModal(false);
                                  handleEditDonor(donation);
                                  setShowDonorModal(true);
                                }}
                                className="h-8 px-2"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">
                                {new Date(donation.dateDonated).toLocaleDateString()}
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">${donation.amount.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDonorProfileModal(false);
                    // For adding new donation, only populate donor identity, leave donation fields empty
                    setEditingDonor({
                      name: editingDonor.name,
                      email: editingDonor.email,
                      donorType: editingDonor.donorType
                    });
                    setDonorForm({
                      name: editingDonor.name,
                      email: editingDonor.email,
                      amount: "",
                      school: "",
                      donorType: editingDonor.donorType,
                      dateDonated: new Date().toISOString().split('T')[0]
                    });
                    setShowDonorModal(true);
                  }}
                >
                  <BadgeDollarSignIcon className="w-4 h-4 mr-2" />
                  Add New Donation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDonorProfileModal(false);
                    setEditingDonor(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Donor Modal */}
        {showDonorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {editingDonor 
                    ? (editingDonor.id && editingDonor.amount && editingDonor.school 
                        ? `Edit Donation for ${editingDonor.name}` 
                        : `Add New Donation for ${editingDonor.name}`)
                    : "Add New Donor"
                  }
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDonorModal(false);
                    setEditingDonor(null);
                    setDonorForm({
                      name: "",
                      email: "",
                      amount: "",
                      school: "",
                      donorType: "Individual",
                      dateDonated: new Date().toISOString().split('T')[0]
                    });
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Donor Name *"
                      className={`pl-10 ${editingDonor ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                      value={donorForm.name}
                      onChange={(e) =>
                        setDonorForm({
                          ...donorForm,
                          name: e.target.value,
                        })
                      }
                      readOnly={!!editingDonor}
                      disabled={!!editingDonor}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Email Address *"
                      type="email"
                      className={`pl-10 ${editingDonor ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                      value={donorForm.email}
                      onChange={(e) =>
                        setDonorForm({
                          ...donorForm,
                          email: e.target.value,
                        })
                      }
                      readOnly={!!editingDonor}
                      disabled={!!editingDonor}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Donation Amount *"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-10"
                      value={donorForm.amount}
                      onChange={(e) =>
                        setDonorForm({
                          ...donorForm,
                          amount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <select
                    className="px-3 py-2 border border-input bg-background rounded-md"
                    value={donorForm.school}
                    onChange={(e) =>
                      setDonorForm({
                        ...donorForm,
                        school: e.target.value,
                      })
                    }
                  >
                    <option value="">Select School *</option>
                    {schools.map((school) => (
                      <option key={school} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                  <select
                    className={`px-3 py-2 border border-input rounded-md ${
                      editingDonor ? 'bg-muted/50 cursor-not-allowed' : 'bg-background'
                    }`}
                    value={donorForm.donorType}
                    onChange={(e) =>
                      setDonorForm({
                        ...donorForm,
                        donorType: e.target.value,
                      })
                    }
                    disabled={!!editingDonor}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      placeholder="Date Donated"
                      className="pl-10"
                      value={donorForm.dateDonated}
                      onChange={(e) =>
                        setDonorForm({
                          ...donorForm,
                          dateDonated: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDonorModal(false);
                      setEditingDonor(null);
                      setDonorForm({
                        name: "",
                        email: "",
                        amount: "",
                        school: "",
                        donorType: "Individual",
                        dateDonated: new Date().toISOString().split('T')[0]
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      handleDonorSubmit();
                      setShowDonorModal(false);
                    }}
                  >
                    {editingDonor ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingDonor.id && editingDonor.amount && editingDonor.school ? 'Update Donation' : 'Add Donation'}
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Donor
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;