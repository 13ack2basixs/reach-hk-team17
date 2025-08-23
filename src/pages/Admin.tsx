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
  LogOut
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { studentService, Student } from "@/services/studentServices";
import { useNotifications } from "../contexts/NotificationContext";
import { Timestamp } from "firebase/firestore";
import { CheckCircle, Loader2 } from "lucide-react";
import { updatesService, Update } from "@/services/updateServices";
import { uploadImages, saveStory } from "@/services/blogService";
import { callGenerateBlog } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// The structured blog we get back from the Cloud Function
type Generated = {
  title: string;
  summary: string;
  bodyHtml: string;
  tags: string[];
  category: string;
  readingMinutes: number;
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [blogPrompt, setBlogPrompt] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState("");
  // Where the uploaded images end up (download URLs for preview/publish)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  // Keep existing string preview, but also store the structured result:
  const [generated, setGenerated] = useState<Generated | null>(null);

  // Real Firebase state management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [programUpdates, setProgramUpdates] = useState<Update[]>([]);
  const [newUpdate, setNewUpdate] = useState({
    type: "Program Update" as const,
    title: "",
    message: "",
    school: "",
    impactMetric: "",
  });

  // Quick Grade Entry Form State
  const [quickGradeForm, setQuickGradeForm] = useState({
    studentName: "",
    school: "",
    class: "",
    englishGrade: "",
    mathGrade: "",
  });

  // Load students from Firebase
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const studentsData = await studentService.getStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error("Error loading students:", error);
        toast({
          title: "Error",
          description: "Failed to load students data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudents();

    // Set up real-time listener
    const unsubscribe = studentService.subscribeToStudents((studentsData) => {
      setStudents(studentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = !selectedSchool || student.school === selectedSchool;
    const matchesRegion = !selectedRegion || student.region === selectedRegion;

    return matchesSearch && matchesSchool && matchesRegion;
  });

  // Handle form submission
  const handleQuickGradeSubmit = async () => {
    if (
      !quickGradeForm.studentName ||
      !quickGradeForm.school ||
      !quickGradeForm.englishGrade ||
      !quickGradeForm.mathGrade
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const englishGrade = parseInt(quickGradeForm.englishGrade);
      const mathGrade = parseInt(quickGradeForm.mathGrade);

      // Check if student already exists
      const existingStudent = students.find(
        (s) =>
          s.name.toLowerCase() === quickGradeForm.studentName.toLowerCase() &&
          s.school === quickGradeForm.school
      );

      if (existingStudent && existingStudent.id) {
        // Update existing student
        await studentService.updateStudentGrades(existingStudent.id, {
          english: englishGrade,
          math: mathGrade,
        });

        toast({
          title: "Student Updated!",
          description: `${quickGradeForm.studentName}'s grades have been updated and donors will be notified!`,
        });
      } else {
        // Add new student
        await studentService.addStudent({
          name: quickGradeForm.studentName,
          school: quickGradeForm.school,
          class: quickGradeForm.class,
          english: englishGrade,
          math: mathGrade,
          region: "Tin Shui Wai",
        });

        toast({
          title: "New Student Added!",
          description: `${quickGradeForm.studentName} has been added and donors will be notified!`,
        });
      }

      // Reset form
      setQuickGradeForm({
        studentName: "",
        school: "",
        class: "",
        englishGrade: "",
        mathGrade: "",
      });
    } catch (error) {
      console.error("Error saving student:", error);
      toast({
        title: "Error",
        description: "Failed to save student data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const checkForAchievements = async (
    student: Student,
    previousGrades: { english: number; math: number }
  ) => {
    const englishImprovement = student.english - previousGrades.english;
    const mathImprovement = student.math - previousGrades.math;

    // Check for significant achievements
    if (student.english >= 95 || student.math >= 95) {
      // Excellent performance achievement
      await updatesService.addUpdate({
        type: "Student Achievement",
        description: `${student.name} (${student.school}) scored ${
          student.english >= 95
            ? student.english + "% in English"
            : student.math + "% in Math"
        }! Thanks to your support, students are reaching new heights.`,
        createdAt: Timestamp.now(),
      });
    } else if (englishImprovement >= 5 || mathImprovement >= 5) {
      // Significant improvement achievement
      const subject = englishImprovement >= 5 ? "English" : "Math";
      const improvement =
        englishImprovement >= 5 ? englishImprovement : mathImprovement;

      await updatesService.addUpdate({
        type: "Student Achievement",
        description: `${student.name} (${student.school}) improved their ${subject} grade by ${improvement} points! Your donations are making a real difference in children's learning journey.`,
        createdAt: Timestamp.now(),
      });
    }
  };

  const schools = [
    "Sunshine Kindergarten",
    "Rainbow Learning Center",
    "Hope Valley School",
    "Bright Futures Academy",
  ];
  const regions = ["Sham Shui Po", "Kwun Tong", "Tin Shui Wai", "Tuen Mun"];

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setQuickGradeForm({
      studentName: student.name,
      school: student.school,
      class: student.class,
      englishGrade: student.english.toString(),
      mathGrade: student.math.toString(),
    });
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent || !editingStudent.id) return;

    const englishGrade = parseInt(quickGradeForm.englishGrade);
    const mathGrade = parseInt(quickGradeForm.mathGrade);
    const previousGrades = {
      english: editingStudent.english,
      math: editingStudent.math,
    };

    try {
      setSaving(true);
      await studentService.updateStudentGrades(editingStudent.id, {
        english: englishGrade,
        math: mathGrade,
      });

      // Check for achievements after updating
      const updatedStudent = {
        ...editingStudent,
        english: englishGrade,
        math: mathGrade,
      };
      await checkForAchievements(updatedStudent, previousGrades);

      toast({
        title: "Student Updated!",
        description: `${editingStudent.name}'s grades have been updated and donors will be notified!`,
      });

      setEditingStudent(null);
      setQuickGradeForm({
        studentName: "",
        school: "",
        class: "",
        englishGrade: "",
        mathGrade: "",
      });
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
}


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
    try {
      setIsGenerating(true);
      setGenerated(null);
      setGeneratedBlog(""); // clear the right pane

      // 1) Upload images to Firebase Storage and collect public URLs
      const uploaded = await uploadImages(uploadedImages);
      const urls = uploaded.map(u => u.url);
      setUploadedImageUrls(urls);

      // 2) Call your Cloud Function (OpenAI behind the scenes)
      const res = await callGenerateBlog({ prompt: blogPrompt, imageUrls: urls });

      if (!res.success || !res.blog) {
        throw new Error(res.error || "Generation failed");
      }

      // 3) Save the structured blog AND set your current preview string with HTML
      setGenerated(res.blog);
      const html = `
        <h2 class="text-xl font-semibold mb-2">${res.blog.title}</h2>
        <p class="text-sm text-muted-foreground mb-4">${res.blog.summary}</p>
        ${res.blog.bodyHtml}
        <div class="mt-4 text-xs text-muted-foreground">
          Category: ${res.blog.category} • ${res.blog.readingMinutes} min read
        </div>
      `;
      setGeneratedBlog(html);
      toast({
        title: "Blog Generated Successfully!",
        description: "Your AI-generated blog post is ready for review",
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Generation failed",
        description: e?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const publishBlog = async () => {
    if (!generated) {
      toast({
        title: "Nothing to publish",
        description: "Generate a story first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save to Firestore `stories` collection
      const id = await saveStory({
        title: generated.title,
        summary: generated.summary,
        bodyHtml: generated.bodyHtml,
        tags: generated.tags,
        category: generated.category,
        readingMinutes: generated.readingMinutes,
        images: uploadedImageUrls.map(url => ({ url })),
        author: "REACH Team",
      });

      toast({
        title: "Blog Published!",
        description: `Story ID: ${id}`,
      });

      // Reset UI
      setGeneratedBlog("");
      setGenerated(null);
      setBlogPrompt("");
      setUploadedImages([]);
      setUploadedImageUrls([]);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Publish failed",
        description: e?.message || "Could not save the story",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage content, track student progress, and create engaging stories
            for your community.
          </p>
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gradient">Admin Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Manage content, track student progress, and create engaging stories for your community.
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        <Tabs defaultValue="blog-creator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="blog-creator"
              className="flex items-center space-x-2"
            >
              <Bot className="w-4 h-4" />
              <span>Blog Creator</span>
            </TabsTrigger>
            <TabsTrigger
              value="student-grades"
              className="flex items-center space-x-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Grades</span>
            </TabsTrigger>
            <TabsTrigger
              value="content-manager"
              className="flex items-center space-x-2"
            >
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
                    <Label htmlFor="images" className="text-base font-medium">
                      Upload Images
                    </Label>
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
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm bg-muted/50 p-2 rounded"
                          >
                            <FileImage className="w-4 h-4" />
                            <span className="flex-1 truncate">{file.name}</span>
                            <Badge variant="outline">
                              {(file.size / 1024).toFixed(1)} KB
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description Input */}
                  <div>
                    <Label htmlFor="prompt" className="text-base font-medium">
                      Describe the Story
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder="Tell us about the images... What happened? Who was involved? What made this moment special? The more details you provide, the richer the generated story will be."
                      value={blogPrompt}
                      onChange={(e) => setBlogPrompt(e.target.value)}
                      className="mt-2 min-h-[120px] resize-none"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Example: "Today's English class was amazing! The children
                      were learning animal names using picture cards. Emma
                      raised her hand enthusiastically to answer questions, and
                      Tommy helped his classmate with pronunciation."
                    </p>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateBlog}
                    disabled={
                      isGenerating || !blogPrompt || uploadedImages.length === 0
                    }
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
                        <Button
                          onClick={publishBlog}
                          size="sm"
                          className="bg-secondary hover:bg-secondary/90"
                        >
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
                      {/* Render the generated HTML safely into your styled container */}
                      <div
                        className="font-sans text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: generatedBlog }}
                      />
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
                    <Input
                      placeholder="Search students..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-3 py-2 border border-input bg-background rounded-md"
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                  >
                    <option value="">All Schools</option>
                    {schools.map((school) => (
                      <option key={school} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-3 py-2 border border-input bg-background rounded-md"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="">All Regions</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
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
                <Card
                  className={`mb-6 ${
                    editingStudent
                      ? "bg-blue-50 border-blue-200"
                      : "bg-accent/10 border-accent/20"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>
                        {editingStudent
                          ? `Editing ${editingStudent.name}`
                          : "Quick Grade Entry"}
                      </span>
                      {editingStudent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingStudent(null);
                            setQuickGradeForm({
                              studentName: "",
                              school: "",
                              class: "",
                              englishGrade: "",
                              mathGrade: "",
                            });
                          }}
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-6 gap-4">
                      <Input
                        placeholder="Student Name"
                        value={quickGradeForm.studentName}
                        onChange={(e) =>
                          setQuickGradeForm({
                            ...quickGradeForm,
                            studentName: e.target.value,
                          })
                        }
                        disabled={!!editingStudent} // Disable name editing when editing existing student
                      />
                      <select
                        className="px-3 py-2 border border-input bg-background rounded-md"
                        value={quickGradeForm.school}
                        onChange={(e) =>
                          setQuickGradeForm({
                            ...quickGradeForm,
                            school: e.target.value,
                          })
                        }
                        disabled={!!editingStudent} // Disable school editing when editing existing student
                      >
                        <option value="">Select School</option>
                        {schools.map((school) => (
                          <option key={school} value={school}>
                            {school}
                          </option>
                        ))}
                      </select>
                      <Input
                        placeholder="Class (e.g., K2A)"
                        value={quickGradeForm.class}
                        onChange={(e) =>
                          setQuickGradeForm({
                            ...quickGradeForm,
                            class: e.target.value,
                          })
                        }
                        disabled={!!editingStudent} // Disable class editing when editing existing student
                      />
                      <Input
                        placeholder="English Grade"
                        type="number"
                        min="0"
                        max="100"
                        value={quickGradeForm.englishGrade}
                        onChange={(e) =>
                          setQuickGradeForm({
                            ...quickGradeForm,
                            englishGrade: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Math Grade"
                        type="number"
                        min="0"
                        max="100"
                        value={quickGradeForm.mathGrade}
                        onChange={(e) =>
                          setQuickGradeForm({
                            ...quickGradeForm,
                            mathGrade: e.target.value,
                          })
                        }
                      />
                      <Button
                        className="bg-secondary hover:bg-secondary/90"
                        onClick={
                          editingStudent
                            ? handleUpdateStudent
                            : handleQuickGradeSubmit
                        }
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : editingStudent ? (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Update & Notify
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save & Notify
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Students Table */}
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading students...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <Card key={student.id} className="card-hover">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {student.name}
                                </h3>
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
                                <p className="text-2xl font-bold text-primary">
                                  {student.english}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  English
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-secondary">
                                  {student.math}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Math
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditStudent(student)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {!loading && filteredStudents.length === 0 && (
                  <div className="text-center py-8">
                    <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No students found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedSchool
                        ? "Try adjusting your search criteria or add a new student."
                        : "Start by adding your first student using the form above."}
                    </p>
                  </div>
                )}
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
