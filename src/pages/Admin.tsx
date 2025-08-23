import { useState, useEffect } from "react";
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
  X,
  RefreshCw
} from "lucide-react";


import { studentService, Student } from "@/services/studentServices";
import { useNotifications } from "../contexts/NotificationContext";
import { Timestamp } from "firebase/firestore";
import { CheckCircle, Loader2 } from "lucide-react";
import { updatesService, Update } from "@/services/updateServices";
import { uploadImages, saveStory, addTailwindClassesToHtml } from "@/services/blogService";
import { callGenerateBlog } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { toast, useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAnnouncements } from "@/contexts/AnnouncementContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  createDonorProfile, 
  addDonation, 
  updateDonation, 
  deleteDonation, 
  getDonorsWithDonations, 
  getDonorProfileByEmail,
  getDonationsByEmail,
  subscribeToDonors,
  searchDonors,
  filterDonors,
  getDonationStats,
  getMonthlyDonationData,
  testDonorCollections,
  type Donor,
  type DonorProfile,
  type Donation
} from "@/services/donorService";


type Generated = {
  title: string;
  summary: string;
  bodyHtml: string;
  tags: string[];
  category: string;
  readingMinutes: number;
};

const Admin = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [blogPrompt, setBlogPrompt] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState("");
  const navigate = useNavigate();

  const { logout } = useAuth();
  // Where the uploaded images end up (download URLs for preview/publish)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  // Keep existing string preview, but also store the structured result:
  const [generated, setGenerated] = useState<Generated | null>(null);

  // Real Firebase state management
  const [saving, setSaving] = useState(false);
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

  const schools = ["Sunshine Kindergarten", "Rainbow Learning Center", "Hope Valley School", "Bright Futures Academy"];
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

  // Donor management state
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [donorSearchTerm, setDonorSearchTerm] = useState("");
  const [selectedDonorSchool, setSelectedDonorSchool] = useState("");
  const [editingDonor, setEditingDonor] = useState(null);
  const [donorForm, setDonorForm] = useState({
    name: "",
    email: "",
    amount: "",
    school: "",
    donorType: "Individual" as "Individual" | "Corporate",
    dateDonated: new Date().toISOString().split('T')[0]
  });
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDonorProfileModal, setShowDonorProfileModal] = useState(false);
  const [selectedDonorType, setSelectedDonorType] = useState("");

  // sample 12-month donation data for the chart
  const [monthlyDonationData, setMonthlyDonationData] = useState([
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
  ]);

  // Firebase statistics state
  const [donationStats, setDonationStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    averageDonation: 0,
    thisMonthDonations: 0
  });

  // Firebase integration
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log("🔥 Testing Firebase connection...");
        setLoading(true);
        
        // Test Firebase connection first
        console.log("🔍 Testing basic Firestore access...");
        
        // Test if we can access donor collections
        const collectionsTest = await testDonorCollections();
        if (!collectionsTest) {
          throw new Error("Cannot access donor collections - check Firestore rules");
        }
        
        const testConnection = await getDonorsWithDonations();
        console.log("✅ Firebase connection successful:", testConnection);
        
        const [donorsData, monthlyData, stats] = await Promise.all([
          getDonorsWithDonations(),
          getMonthlyDonationData(),
          getDonationStats()
        ]);
        
        setDonors(donorsData);
        setMonthlyDonationData(monthlyData);
        setDonationStats(stats);
      } catch (error) {
        console.error('❌ Error fetching initial data:', error);
        toast({
          title: "Firebase Connection Error",
          description: `Failed to connect to Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

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
    
      try {
        setIsGenerating(true);
        setGenerated(null);
        setGeneratedBlog(""); // clear the right pane
    
        // 1) Upload images to Firebase Storage and collect public URLs
        const uploaded = await uploadImages(uploadedImages);
        const urls = uploaded.map((u) => u.url);
        setUploadedImageUrls(urls);
    
        // 2) Call your Cloud Function (OpenAI behind the scenes)
        const res = await callGenerateBlog({
          prompt: blogPrompt,
          imageUrls: urls,
        });
    
        if (!res.success || !res.blog) {
          throw new Error(res.error || "Generation failed");
        }
    
        // 3) Save the structured blog AND set your current preview string with HTML
    
        res.blog.bodyHtml = addTailwindClassesToHtml(res.blog.bodyHtml);
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
          images: uploadedImageUrls.map((url) => ({ url })),
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

    // Set up real-time listener
    const unsubscribe = subscribeToDonors((updatedDonors) => {
      setDonors(updatedDonors);
      
      // Refresh chart data when donors change
      const refreshChartData = async () => {
        try {
          const [newMonthlyData, newStats] = await Promise.all([
            getMonthlyDonationData(),
            getDonationStats()
          ]);
          setMonthlyDonationData(newMonthlyData);
          setDonationStats(newStats);
        } catch (error) {
          console.error('Error refreshing chart data:', error);
        }
      };
      
      refreshChartData();
    });

    return () => unsubscribe();
  }, []);

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

    try {
      setIsGenerating(true);
      setGenerated(null);
      setGeneratedBlog(""); // clear the right pane

      // 1) Upload images to Firebase Storage and collect public URLs
      const uploaded = await uploadImages(uploadedImages);
      const urls = uploaded.map((u) => u.url);
      setUploadedImageUrls(urls);

      // 2) Call your Cloud Function (OpenAI behind the scenes)
      const res = await callGenerateBlog({
        prompt: blogPrompt,
        imageUrls: urls,
      });

      if (!res.success || !res.blog) {
        throw new Error(res.error || "Generation failed");
      }

      // 3) Save the structured blog AND set your current preview string with HTML

      res.blog.bodyHtml = addTailwindClassesToHtml(res.blog.bodyHtml);
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
        images: uploadedImageUrls.map((url) => ({ url })),
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
          await updateDonation(editingDonor.id, {
            amount: amount,
            school: donorForm.school,
            dateDonated: donorForm.dateDonated,
          });
          
          toast({
            title: "Donation Updated!",
            description: `Donation has been updated successfully.`,
          });
        } else {
          console.log("➕ Adding new donation to existing donor:", editingDonor.email);
          // Add new donation to existing donor
          let donorProfile;
          try {
            donorProfile = await getDonorProfileByEmail(editingDonor.email);
            console.log("📋 Donor profile result:", donorProfile);
            
            if (!donorProfile) {
              console.log("❌ Donor profile not found for:", editingDonor.email);
              throw new Error('Donor profile not found');
            }
          } catch (error) {
            console.error("❌ Error in getDonorProfileByEmail:", error);
            throw error;
          }

          await addDonation({
            donorId: donorProfile.id!,
            amount: amount,
            school: donorForm.school,
            dateDonated: donorForm.dateDonated,
          });

          toast({
            title: "Donation Added!",
            description: `New donation of $${amount.toLocaleString()} has been added to ${editingDonor.name}'s profile.`,
          });
        }
      } else {
        console.log("🆕 Adding new donor...");
        // Check if donor profile already exists
        const existingProfile = await getDonorProfileByEmail(donorForm.email);
        console.log("🔍 Existing profile check:", existingProfile);
        
        if (existingProfile) {
          // Add donation to existing profile
          await addDonation({
            donorId: existingProfile.id!,
            amount: amount,
            school: donorForm.school,
            dateDonated: donorForm.dateDonated,
          });

          toast({
            title: "Donation Added!",
            description: `New donation of $${amount.toLocaleString()} has been added to ${donorForm.name}'s profile.`,
          });
        } else {
          console.log("🏗️ Creating new donor profile for:", donorForm.email);
          // Create new donor profile and add donation
          const newProfile = await createDonorProfile({
            name: donorForm.name,
            email: donorForm.email,
            donorType: donorForm.donorType,
          });
          console.log("✅ New profile created:", newProfile);

          await addDonation({
            donorId: newProfile.id!,
            amount: amount,
            school: donorForm.school,
            dateDonated: donorForm.dateDonated,
          });

          toast({
            title: "New Donor Added!",
            description: `${donorForm.name} has been added to the donor list with a donation of $${amount.toLocaleString()}.`,
          });
        }
      }

      // Reset form
      setDonorForm({
        name: "",
        email: "",
        amount: "",
        school: "",
        donorType: "Individual" as "Individual" | "Corporate",
        dateDonated: new Date().toISOString().split('T')[0]
      });
      setEditingDonor(null);
    } catch (error) {
      console.error("Error saving donor:", error);
      
      // Show more detailed error information
      let errorMessage = "Failed to save donor information";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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

  const handleDeleteDonor = async (donationId: string) => {
    try {
      await deleteDonation(donationId);
      toast({
        title: "Donation Removed",
        description: "Donation has been removed from the list.",
      });
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast({
        title: "Error",
        description: "Failed to delete donation",
        variant: "destructive",
      });
    }
  };

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
        await studentService.updateStudentGrades(existingStudent.id.toString(), {
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
  
  const clearAllFilters = () => {
    setSelectedDonorSchool("");
    setSelectedDonorType("");
    setDonorSearchTerm("");
  };

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

  // Filter donors with Firebase
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);

  // Update filtered donors when search or filters change
  useEffect(() => {
    const updateFilteredDonors = async () => {
      try {
        let results = donors;
        
        // Apply search filter
        if (donorSearchTerm.trim()) {
          results = await searchDonors(donorSearchTerm);
        }
        
        // Apply additional filters
        if (selectedDonorSchool || selectedDonorType) {
          results = await filterDonors(selectedDonorSchool, selectedDonorType);
        }
        
        setFilteredDonors(results);
      } catch (error) {
        console.error('Error filtering donors:', error);
        setFilteredDonors(donors); // Fallback to all donors
      }
    };

    updateFilteredDonors();
  }, [donors, donorSearchTerm, selectedDonorSchool, selectedDonorType]);

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
            <Tabs defaultValue="overview" className="space-y-4">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const [newMonthlyData, newStats] = await Promise.all([
                              getMonthlyDonationData(),
                              getDonationStats()
                            ]);
                            setMonthlyDonationData(newMonthlyData);
                            setDonationStats(newStats);
                            toast({
                              title: "Chart Refreshed",
                              description: "Chart data has been updated",
                            });
                          } catch (error) {
                            console.error('Error refreshing chart:', error);
                            toast({
                              title: "Error",
                              description: "Failed to refresh chart data",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Chart
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Total Donations</p>
                        <p className="text-2xl font-bold text-primary">
                          ${donationStats.totalDonations.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Total Donors</p>
                        <p className="text-2xl font-bold text-secondary">
                          {donationStats.totalDonors}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Average Donation</p>
                        <p className="text-2xl font-bold text-accent">
                          ${Math.round(donationStats.averageDonation).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">This Month</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${donationStats.thisMonthDonations.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* 12-Month Line Graph */}
                    <div className="h-64 bg-background rounded-lg border border-border">
                      {/* Debug info - remove this later */}
                      <div className="p-2 text-xs text-muted-foreground bg-muted/20 rounded mb-2">
                        Chart data: {monthlyDonationData.length} months | 
                        Total: ${monthlyDonationData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </div>
                      
                      {monthlyDonationData.length > 0 ? (
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
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Loading chart data...</p>
                        </div>
                      </div>
                    )}
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
                      {donors
                        .sort((a, b) => new Date(b.dateDonated).getTime() - new Date(a.dateDonated).getTime())
                        .slice(0, 5)
                        .map((donor) => {
                          const donationDate = new Date(donor.dateDonated);
                          const now = new Date();
                          const diffTime = Math.abs(now.getTime() - donationDate.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          
                          let timeAgo = '';
                          if (diffDays === 1) timeAgo = '1 day ago';
                          else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
                          else if (diffDays < 30) timeAgo = `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
                          else timeAgo = `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
                          
                          return (
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
                                  {timeAgo}
                                </p>
                              </div>
                            </div>
                          );
                        })}
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
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading donors...</p>
                      </div>
                    ) : (
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
                    )}

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
                                   {student.englishGrade}
                                 </p>
                                 <p className="text-xs text-muted-foreground">
                                   English
                                 </p>
                               </div>
                               <div className="text-center">
                                 <p className="text-2xl font-bold text-secondary">
                                   {student.mathGrade}
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
                                  onClick={() => handleEditStudent({
                                    ...student,
                                    id: student.id.toString(),
                                    english: student.englishGrade,
                                    math: student.mathGrade,
                                    lastUpdated: new Date(student.lastUpdated)
                                  } as Student)}
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
                        donorType: e.target.value as "Individual" | "Corporate",
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
                    onClick={async () => {
                      try {
                        await handleDonorSubmit();
                        setShowDonorModal(false);
                      } catch (error) {
                        console.error('Error submitting donor:', error);
                      }
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