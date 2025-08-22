import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Star, 
  Crown,
  Heart,
  TrendingUp,
  Award,
  Filter
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState("all-time");
  const [category, setCategory] = useState("total");

  const donors = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "/api/placeholder/100/100",
      totalDonated: 15750,
      monthlyDonated: 500,
      donations: 24,
      joinDate: "2022-03-15",
      rank: 1,
      badges: ["Champion", "Consistent Giver", "School Builder"],
      impact: "Funded 3 classrooms",
      streak: 12,
      level: "Diamond"
    },
    {
      id: 2,
      name: "Michael Wong",
      avatar: "/api/placeholder/100/100",
      totalDonated: 12300,
      monthlyDonated: 350,
      donations: 18,
      joinDate: "2022-07-22",
      rank: 2,
      badges: ["Advocate", "Tech Supporter"],
      impact: "Provided 50 tablets",
      streak: 8,
      level: "Gold"
    },
    {
      id: 3,
      name: "Lisa Park",
      avatar: "/api/placeholder/100/100",
      totalDonated: 9850,
      monthlyDonated: 400,
      donations: 15,
      joinDate: "2023-01-10",
      rank: 3,
      badges: ["Rising Star", "Monthly Hero"],
      impact: "Sponsored 20 students",
      streak: 6,
      level: "Gold"
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "/api/placeholder/100/100",
      totalDonated: 8200,
      monthlyDonated: 275,
      donations: 22,
      joinDate: "2022-11-05",
      rank: 4,
      badges: ["Steady Support", "Community Builder"],
      impact: "Built library corner",
      streak: 9,
      level: "Silver"
    },
    {
      id: 5,
      name: "Emma Thompson",
      avatar: "/api/placeholder/100/100",
      totalDonated: 7500,
      monthlyDonated: 300,
      donations: 12,
      joinDate: "2023-05-20",
      rank: 5,
      badges: ["Newcomer Champion"],
      impact: "Teacher training fund",
      streak: 4,
      level: "Silver"
    },
    {
      id: 6,
      name: "James Liu",
      avatar: "/api/placeholder/100/100",
      totalDonated: 6800,
      monthlyDonated: 225,
      donations: 16,
      joinDate: "2023-02-14",
      rank: 6,
      badges: ["Valentine's Heart", "Consistent"],
      impact: "Art supplies sponsor",
      streak: 7,
      level: "Bronze"
    },
    {
      id: 7,
      name: "Rachel Zhang",
      avatar: "/api/placeholder/100/100",
      totalDonated: 5950,
      monthlyDonated: 200,
      donations: 11,
      joinDate: "2023-08-30",
      rank: 7,
      badges: ["Fast Climber"],
      impact: "Playground equipment",
      streak: 3,
      level: "Bronze"
    },
    {
      id: 8,
      name: "Tom Anderson",
      avatar: "/api/placeholder/100/100",
      totalDonated: 4200,
      monthlyDonated: 150,
      donations: 14,
      joinDate: "2023-06-12",
      rank: 8,
      badges: ["Steady Giver"],
      impact: "Book collections",
      streak: 5,
      level: "Bronze"
    }
  ];

  const levels = {
    "Diamond": { color: "bg-primary text-primary-foreground", threshold: 15000 },
    "Gold": { color: "bg-yellow-500 text-white", threshold: 10000 },
    "Silver": { color: "bg-gray-400 text-white", threshold: 5000 },
    "Bronze": { color: "bg-amber-600 text-white", threshold: 1000 }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getProgressToNextLevel = (donated: number, level: string) => {
    const levelOrder = ["Bronze", "Silver", "Gold", "Diamond"];
    const currentIndex = levelOrder.indexOf(level);
    if (currentIndex === levelOrder.length - 1) return 100; // Already at top level
    
    const nextLevel = levelOrder[currentIndex + 1];
    const nextThreshold = levels[nextLevel].threshold;
    const currentThreshold = levels[level].threshold;
    
    return ((donated - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Community Champions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Celebrating our incredible donors who are transforming lives through education. 
            Every contribution makes a difference, and together we're building brighter futures for Hong Kong's children.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all-time">All Time</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="total">Total Donations</option>
              <option value="frequency">Donation Frequency</option>
              <option value="streak">Giving Streak</option>
            </select>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {donors.slice(0, 3).map((donor, index) => (
            <Card 
              key={donor.id} 
              className={`card-hover border-0 shadow-soft ${
                index === 0 ? 'md:order-2 transform md:scale-110' : 
                index === 1 ? 'md:order-1' : 'md:order-3'
              }`}
            >
              <CardContent className="pt-8 text-center relative">
                {/* Rank Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-glow ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                    {getRankIcon(donor.rank)}
                  </div>
                </div>

                {/* Avatar */}
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-background shadow-soft">
                  <AvatarImage src={donor.avatar} alt={donor.name} />
                  <AvatarFallback className="bg-gradient-primary text-white text-xl">
                    {donor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-xl font-bold mb-2">{donor.name}</h3>
                
                {/* Level Badge */}
                <Badge className={`mb-4 ${levels[donor.level].color}`}>
                  <Star className="w-3 h-3 mr-1" />
                  {donor.level} Donor
                </Badge>

                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      ${donor.totalDonated.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Donated</p>
                  </div>
                  
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-accent-foreground">{donor.impact}</p>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{donor.donations}</p>
                      <p className="text-muted-foreground">Donations</p>
                    </div>
                    <div>
                      <p className="font-medium">{donor.streak} months</p>
                      <p className="text-muted-foreground">Streak</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Level Progress System */}
        <Card className="mb-8 border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-primary" />
              <span>Donor Level System</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(levels).map(([level, config]) => (
                <div key={level} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${config.color}`}>
                    <Star className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold">{level}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${config.threshold.toLocaleString()}+
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Full Leaderboard */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-primary" />
                <span>Community Leaderboard</span>
              </div>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donors.map((donor) => (
                <div 
                  key={donor.id}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-smooth"
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    {getRankIcon(donor.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={donor.avatar} alt={donor.name} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {donor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold truncate">{donor.name}</h3>
                      <Badge variant="outline" className={levels[donor.level].color.replace('bg-', 'border-').replace('text-white', 'text-current')}>
                        {donor.level}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {donor.badges.slice(0, 2).map(badge => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{donor.impact}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 text-right space-y-1">
                    <p className="text-lg font-bold text-primary">
                      ${donor.totalDonated.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +${donor.monthlyDonated}/month
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Heart className="w-3 h-3 fill-primary text-primary" />
                      <span>{donor.donations} donations</span>
                    </div>
                  </div>

                  {/* Progress to Next Level */}
                  <div className="flex-shrink-0 w-24">
                    {donor.level !== "Diamond" && (
                      <div className="space-y-1">
                        <Progress 
                          value={getProgressToNextLevel(donor.totalDonated, donor.level)} 
                          className="h-2"
                        />
                        <p className="text-xs text-center text-muted-foreground">
                          Next Level
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-8 border-t mt-8">
              <p className="text-muted-foreground mb-4">
                Ready to join our amazing community of donors?
              </p>
              <Button className="bg-gradient-primary hover:bg-primary/90">
                <Heart className="w-4 h-4 mr-2" />
                Start Your Journey
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Showcase */}
        <Card className="mt-8 bg-gradient-hero text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Recent Achievements</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-90" />
                <h4 className="font-semibold mb-1">Sarah Chen</h4>
                <p className="text-sm opacity-90">Reached Diamond Status!</p>
              </div>
              <div>
                <Star className="w-12 h-12 mx-auto mb-2 opacity-90" />
                <h4 className="font-semibold mb-1">Monthly Heroes</h4>
                <p className="text-sm opacity-90">5 donors hit 12-month streaks</p>
              </div>
              <div>
                <Heart className="w-12 h-12 mx-auto mb-2 opacity-90" />
                <h4 className="font-semibold mb-1">Community Milestone</h4>
                <p className="text-sm opacity-90">$100K total donations reached!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;