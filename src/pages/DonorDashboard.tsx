import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  TrendingUp,
  Award,
  Bell,
  Star,
  Calendar,
  DollarSign,
  Users,
  BookOpen,
  GraduationCap,
  Trophy,
  Target,
  Gift,
  Mail,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "../contexts/NotificationContext";

const DonorDashboard = () => {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    state: notificationState,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // Mock donor data
  const donorData = {
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    type: "Individual", // Added type field
    joinDate: "2022-03-15",
    totalDonated: 2450,
    monthlyDonation: 150,
    level: "Gold",
    rank: 12,
    streak: 8,
    donations: 16,
    badges: ["Monthly Hero", "Consistent Giver", "School Supporter"],
    nextLevel: "Flowering Tree",
    nextLevelAmount: 5000,
    impactStats: {
      studentsHelped: 45,
      booksProvided: 120,
      classroomsFunded: 2,
      teachersSupported: 8,
    },
    upcomingGoals: [
      {
        title: "Library Corner Fund",
        description: "Help create a cozy reading space at Hope Valley School",
        target: 500,
        raised: 340,
        backers: 12,
      },
      {
        title: "Teacher Training Program",
        description:
          "Support professional development for kindergarten teachers",
        target: 1000,
        raised: 650,
        backers: 25,
      },
    ],
  };

  const handleLogin = () => {
    if (email) {
      setIsLoggedIn(true);
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      Diamond: "bg-primary text-primary-foreground",
      Gold: "bg-yellow-500 text-white",
      Silver: "bg-gray-400 text-white",
      Bronze: "bg-amber-600 text-white",
    };
    return colors[level] || "bg-muted text-muted-foreground";
  };

  const isRecentNotification = (date: string): boolean => {
    const notificationDate = new Date(date);
    const now = new Date();
    const timeDiff = now.getTime() - notificationDate.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 24; // Consider notifications from last 24 hours as "recent"
  };

  const getImpactIcon = (type: string) => {
    switch (type) {
      case "Student Achievement":
        return <GraduationCap className="w-5 h-5 text-primary" />;
      case "Program Update":
        return <BookOpen className="w-5 h-5 text-secondary" />;
      case "Milestone Reached":
        return <Trophy className="w-5 h-5 text-accent" />;
      default:
        return <Heart className="w-5 h-5 text-primary" />;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-6">
        <Card className="w-full max-w-md border-0 shadow-soft">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gradient">
              Donor Portal
            </CardTitle>
            <p className="text-muted-foreground">
              Access your donation impact and updates
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium mb-2 block">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This is the email you used when making your donation
              </p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!email}
              className="w-full bg-gradient-primary hover:bg-primary/90"
            >
              <Mail className="w-4 h-4 mr-2" />
              Access My Dashboard
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                First time donating?{" "}
                <Button variant="link" className="p-0 h-auto text-primary">
                  Start your journey here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-4 border-background shadow-soft">
                <AvatarImage
                  src="/api/placeholder/100/100"
                  alt={donorData.name}
                />
                <AvatarFallback className="bg-gradient-primary text-white text-xl">
                  {donorData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gradient">
                  Welcome back, {donorData.name}!
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={getLevelColor(donorData.level)}>
                    <Star className="w-3 h-3 mr-1" />
                    {donorData.level} Donor
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Member since {new Date(donorData.joinDate).getFullYear()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" className="relative">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {notificationState.unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                    {notificationState.unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="impact">My Impact</TabsTrigger>
            <TabsTrigger value="updates" className="relative">
              Updates
              {notificationState.unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                  {notificationState.unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-soft">
                <CardContent className="pt-6 text-center">
                  <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    ${donorData.totalDonated}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Donated</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {donorData.impactStats.studentsHelped}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Students Helped
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardContent className="pt-6 text-center">
                  <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">#{donorData.rank}</p>
                  <p className="text-sm text-muted-foreground">
                    Community Rank
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{donorData.streak}</p>
                  <p className="text-sm text-muted-foreground">Month Streak</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress to Next Level */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-primary" />
                  <span>Progress to {donorData.nextLevel} Level</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Current: ${donorData.totalDonated}</span>
                    <span>Goal: ${donorData.nextLevelAmount}</span>
                  </div>
                  <Progress
                    value={
                      (donorData.totalDonated / donorData.nextLevelAmount) * 100
                    }
                    className="h-3"
                  />
                  <p className="text-sm text-muted-foreground">
                    ${donorData.nextLevelAmount - donorData.totalDonated} more
                    to reach {donorData.nextLevel} status!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-secondary" />
                  <span>Your Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {donorData.badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>{badge}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            {/* Impact Summary */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-soft text-center">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-3xl font-bold text-primary">
                    {donorData.impactStats.studentsHelped}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Students Supported
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft text-center">
                <CardContent className="pt-6">
                  <BookOpen className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <p className="text-3xl font-bold text-secondary">
                    {donorData.impactStats.booksProvided}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Books Provided
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft text-center">
                <CardContent className="pt-6">
                  <GraduationCap className="w-12 h-12 text-accent mx-auto mb-4" />
                  <p className="text-3xl font-bold text-accent">
                    {donorData.impactStats.classroomsFunded}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Classrooms Funded
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft text-center">
                <CardContent className="pt-6">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-3xl font-bold text-primary">
                    {donorData.impactStats.teachersSupported}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Teachers Supported
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Impact Visualization */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Your Donation Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-2">
                      Every <span className="font-bold text-primary">$25</span>{" "}
                      you donate provides:
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="font-semibold">English workbooks</p>
                      <p className="text-sm text-muted-foreground">
                        for 1 child/month
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <p className="font-semibold">Interactive lessons</p>
                      <p className="text-sm text-muted-foreground">
                        small group learning
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <GraduationCap className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="font-semibold">Learning materials</p>
                      <p className="text-sm text-muted-foreground">
                        educational supplies
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Updates Tab - Now showing Firebase updates */}
          <TabsContent value="updates" className="space-y-6">
            {/* Header with actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Real-time Updates</h3>
              <div className="flex items-center space-x-2">
                {notificationState.unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark All as Read ({notificationState.unreadCount})
                  </Button>
                )}
                <Badge variant="outline">
                  {notificationState.notifications.length} total updates
                </Badge>
              </div>
            </div>

            {/* Loading state */}
            {notificationState.loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading your updates...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notificationState.notifications.length === 0 ? (
                  <Card className="border-0 shadow-soft">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Updates Yet
                      </h3>
                      <p className="text-muted-foreground">
                        Updates about student progress and program milestones
                        will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  notificationState.notifications.map((notification) => {
                    const isRecent =
                      notification.isRecent ||
                      isRecentNotification(notification.date || "");
                    return (
                      <Card
                        key={notification.id}
                        className={`border-0 shadow-soft transition-all ${
                          !notification.read
                            ? "bg-primary/5 border-l-4 border-l-primary"
                            : ""
                        } ${
                          isRecent ? "ring-2 ring-yellow-200 bg-yellow-50" : ""
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              {getImpactIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">
                                    {notification.type}
                                  </Badge>
                                  {!notification.read && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      New
                                    </Badge>
                                  )}
                                  {isRecent && (
                                    <Badge className="bg-yellow-500 text-white text-xs">
                                      ✨ Recent
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {notification.date
                                        ? formatNotificationDate(
                                            notification.date
                                          )
                                        : "Recently"}
                                    </span>
                                  </div>
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleMarkAsRead(notification.id)
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm leading-relaxed mb-3">
                                {notification.message ||
                                  notification.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-3">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-700 font-medium">
                                  Impact Delivered
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="space-y-6">
              {donorData.upcomingGoals.map((goal, index) => (
                <Card key={index} className="border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="w-6 h-6 text-primary" />
                        <span>{goal.title}</span>
                      </div>
                      <Badge variant="outline">{goal.backers} supporters</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {goal.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Raised: ${goal.raised}</span>
                        <span>Goal: ${goal.target}</span>
                      </div>
                      <Progress
                        value={(goal.raised / goal.target) * 100}
                        className="h-3"
                      />
                      <p className="text-sm text-muted-foreground">
                        ${goal.target - goal.raised} remaining to reach the goal
                      </p>
                    </div>

                    <Button className="w-full mt-4 bg-gradient-primary hover:bg-primary/90">
                      <Gift className="w-4 h-4 mr-2" />
                      Contribute to This Goal
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DonorDashboard;
