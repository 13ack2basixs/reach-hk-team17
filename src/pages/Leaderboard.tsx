import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select components
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { 
  Trophy, 
  Medal, 
  Star, 
  Crown,
  Heart,
  Clover,
  Bean,   
  Sprout, 
  Flower, 
  TreePine 
} from "lucide-react";


const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState("all-time");
  const [category, setCategory] = useState("total");
  const [donorTypeFilter, setDonorTypeFilter] = useState("Individual"); 
  const navigate = useNavigate();

  const donors = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "/api/placeholder/100/100",
      type: "Individual",
      totalDonated: 15750,
      monthlyDonated: 500,
      donations: 24,
      joinDate: "2022-03-15",
      rank: 1,
      streak: 12,
      level: "Evergreen"
    },
    {
      id: 2,
      name: "Morgan Stanley",
      avatar: "/morganstanley.png",
      type: "Corporate",
      totalDonated: 123000,
      monthlyDonated: 350,
      donations: 18,
      joinDate: "2022-07-22",
      rank: 2,
      streak: 8,
      level: "Evergreen"
    },
    {
      id: 3,
      name: "Lisa Park",
      avatar: "/api/placeholder/100/100",
      type: "Individual",
      totalDonated: 9850,
      monthlyDonated: 400,
      donations: 15,
      joinDate: "2023-01-10",
      rank: 3,
      streak: 6,
      level: "Flowering Tree"
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "/api/placeholder/100/100",
      type: "Individual",
      totalDonated: 8200,
      monthlyDonated: 275,
      donations: 22,
      joinDate: "2022-11-05",
      rank: 4,
      streak: 9,
      level: "Flowering Tree"
    },
    {
      id: 5,
      name: "Company 2",
      avatar: "/api/placeholder/100/100",
      type: "Corporate",
      totalDonated: 75000,
      monthlyDonated: 300,
      donations: 12,
      joinDate: "2023-05-20",
      rank: 5,
      streak: 4,
      level: "Flowering Tree"
    },
    {
      id: 6,
      name: "James Liu",
      avatar: "/api/placeholder/100/100",
      type: "Individual",
      totalDonated: 6800,
      monthlyDonated: 225,
      donations: 16,
      joinDate: "2023-02-14",
      rank: 6,
      streak: 7,
      level: "Sapling"
    },
    {
      id: 7,
      name: "Company 3",
      avatar: "/api/placeholder/100/100",
      type: "Corporate",
      totalDonated: 59500,
      monthlyDonated: 200,
      donations: 11,
      joinDate: "2023-08-30",
      rank: 7,
      streak: 3,
      level: "Seed"
    },
    {
      id: 8,
      name: "Tom Anderson",
      avatar: "/api/placeholder/100/100",
      type: "Individual",
      totalDonated: 4200,
      monthlyDonated: 150,
      donations: 14,
      joinDate: "2023-06-12",
      rank: 8,
      streak: 5,
      level: "Seed"
    }
  ];

  const levels = {
    "Seed": { color: "bg-[#FBC02D] text-white", description: "Entry-level donors<br/><i>Planting the foundation for change</i>" },
    "Sapling": { color: "bg-[#4CAF50] text-white", description: "Mid-tier donors<br/><i>Steady growth and nurturing support</i> " },
    "Flowering Tree": { color: "bg-[#FF69B4] text-white", description: "High-tier donors<br/><i>Helping communities blossom</i>" },
    "Evergreen": { color: "bg-[#1B5E20] text-white", description: "Legacy donors<br/><i>Enduring strength and lasting impact</i>" }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <Trophy className="w-5 h-5 text-gray-500" />;
  };

  const filteredDonors = donors.filter(donor => 
    donor.type === donorTypeFilter
  ).filter(donor => {
    if (timeframe === "all-time" || timeframe === "this-year") {
      return true;
    } else if (timeframe === "this-month") {
      return donor.monthlyDonated > 0;
    }
    return true;
  });

  // Sort filtered donors based on selected category
  const sortedDonors = [...filteredDonors].sort((a, b) => {
    if (category === "monthly") {
      return b.monthlyDonated - a.monthlyDonated;
    } else if (category === "donations") {
      return b.donations - a.donations;
    } else { // category === "total"
      return b.totalDonated - a.totalDonated;
    }
  });

  const getProgressToNextLevel = (donated: number, level: string) => {
    const levelOrder = ["Seed", "Sapling", "Flowering Tree", "Evergreen"];
    const currentIndex = levelOrder.indexOf(level);
    if (currentIndex === levelOrder.length - 1) return 100; // Already at top level
    
    const nextLevel = levelOrder[currentIndex + 1];
    const nextThreshold = levels[nextLevel].threshold;
    const currentThreshold = levels[level].threshold;
    
    return ((donated - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  };

  return (
    <div className="min-h-screen py-8 px-6 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          Donor Leaderboard
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <Select onValueChange={setTimeframe} defaultValue="all-time">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setCategory} defaultValue="total">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total Donated</SelectItem>
              <SelectItem value="monthly">Monthly Donation</SelectItem>
              <SelectItem value="donations">Number of Donations</SelectItem>
            </SelectContent>
          </Select>

          <Tabs defaultValue="Individual" onValueChange={setDonorTypeFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Individual">Individual</TabsTrigger>
              <TabsTrigger value="Corporate">Corporate</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-6">
          {sortedDonors.map((donor, index) => (
            <Card key={donor.id} className="border-0 shadow-soft overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4"> 
                {/* Rank Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-glow ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                    {getRankIcon(donor.rank)}
                  </div>
                </div>

                {/* Left Section: Avatar, Name, Level */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <Avatar className="w-20 h-20 border-4 border-background shadow-soft flex-shrink-0">
                    <AvatarImage src={donor.avatar} alt={donor.name} />
                    <AvatarFallback className="bg-gradient-primary text-white text-xl">
                      {donor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name and Level */}
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold whitespace-nowrap">{donor.name}</h3>
                    <Badge className={`mt-2 ${levels[donor.level].color}`}>
                      <Clover className="w-3 h-3 mr-1" />
                      {donor.level}
                    </Badge>
                  </div>
                </div>

                  {/* Stats Section: All in one row */}
                <div className="flex-1 flex items-center justify-end gap-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">${donor.totalDonated.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Donated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">${donor.monthlyDonated.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{donor.donations}</p>
                    <p className="text-xs text-muted-foreground">Donations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{donor.streak} months</p>
                    <p className="text-xs text-muted-foreground">Streak</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Level Progress System */}
        <Card className="mt-8 mb-8 border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clover className="w-6 h-6 text-primary" />
              <span>Donor Level System</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(levels).map(([level, config]) => (
                <div key={level} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${config.color}`}>
                    {level === "Seed" && <Bean className="w-8 h-8" />}
                    {level === "Sapling" && <Sprout className="w-8 h-8" />}
                    {level === "Flowering Tree" && <Flower className="w-8 h-8" />}
                    {level === "Evergreen" && <TreePine className="w-8 h-8" />}
                  </div>
                  <h4 className="font-semibold mb-1">{level}</h4>
                  <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: config.description }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-8 border-t mt-8">
          <p className="text-muted-foreground mb-4">
            Ready to join our amazing community of donors?
          </p>
          <Button className="bg-gradient-primary hover:bg-primary/90" onClick={() => navigate("/schools")}> 
            <Heart className="w-4 h-4 mr-2" />
            Start Your Journey
          </Button>
        </div>

        {/* Achievement Showcase */}
        <Card className="mt-8 bg-gradient-hero text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Harvest Highlights</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-90" />
                <h4 className="font-semibold mb-1">Morgan Stanley</h4>
                <p className="text-sm opacity-90">Reached Evergreen Status</p>
              </div>
              <div>
                <Star className="w-12 h-12 mx-auto mb-2 opacity-90" />
                <h4 className="font-semibold mb-1">Monthly Cultivators</h4>
                <p className="text-sm opacity-90">5 Sapling donors hit 12-month streaks</p>
              </div>
              <div>
                <Heart className="w-12 h-12 mx-auto mb-2 opacity-90" />
                <h4 className="font-semibold mb-1">Community Milestone</h4>
                <p className="text-sm opacity-90">$100K total donations reached</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;