import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; 
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
  TreePine,
  Loader2,
  DollarSign,
  Users,
  Building
} from "lucide-react";
import { getDonorsForLeaderboard } from "@/services/donorService";


const Leaderboard = () => {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const navigate = useNavigate();

  // Fetch donors data from Firebase
  const fetchDonors = async () => {
    try {
      setLoading(true);
      const leaderboardDonors = await getDonorsForLeaderboard();
      setDonors(leaderboardDonors);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching donors:', err);
      setError('Failed to load donor data');
      // Fallback to empty array
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();

    // Set up auto-refresh every 5 minutes to keep data current
    const interval = setInterval(fetchDonors, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const levels = {
    "Seed": { color: "bg-[#EADAC1] text-white", description: "Entry-level donors<br/><i>Planting the foundation for change</i>" },
    "Sapling": { color: "bg-[#A7D7B5] text-white", description: "Mid-tier donors<br/><i>Steady growth and nurturing support</i> " },
    "Flowering Tree": { color: "bg-[#7FB77E] text-white", description: "High-tier donors<br/><i>Helping communities blossom</i>" },
    "Evergreen": { color: "bg-[#355E3B] text-white", description: "Legacy donors<br/><i>Enduring strength and lasting impact</i>" }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <Trophy className="w-5 h-5 text-gray-500" />;
  };



  // Sort donors by total donated for leaderboard ranking
  const sortedDonors = [...donors].sort((a, b) => b.totalDonated - a.totalDonated);



  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">
           Donor Leaderboard
        </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrate our amazing community of donors who are making a real difference in children's education
          </p>
        </div>

        {error && (
          <div className="text-center mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={fetchDonors} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Summary Statistics */}
        {!loading && donors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-soft text-center">
              <CardContent className="pt-6">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{donors.length}</p>
                <p className="text-sm text-secondary">Total Donors</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-soft text-center">
              <CardContent className="pt-6">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">
                  ${donors.reduce((sum, donor) => sum + donor.totalDonated, 0).toLocaleString()}
                </p>
                <p className="text-sm text-secondary">Total Raised</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-soft text-center">
              <CardContent className="pt-6">
                <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">
                  ${donors.reduce((sum, donor) => sum + donor.monthlyDonated, 0).toLocaleString()}
                </p>
                <p className="text-sm text-secondary">This Month</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-soft text-center">
              <CardContent className="pt-6">
                <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">
                  {donors.filter(d => d.level === 'Evergreen').length}
                </p>
                <p className="text-sm text-secondary">Evergreen Donors</p>
              </CardContent>
            </Card>
          </div>
        )}



        <div className="flex flex-col flex-wrap items-center justify-center mb-8">
          <Button 
            variant="outline" 
            onClick={fetchDonors}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {lastUpdated && (
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

          <Tabs defaultValue="individuals" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individuals" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Individual Donors</span>
              </TabsTrigger>
              <TabsTrigger value="corporate" className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Corporate Donors</span>
              </TabsTrigger>
            </TabsList>

            {/* Individual Donors Tab */}
            <TabsContent value="individuals" className="space-y-8">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading individual donors...</p>
                </div>
              ) : (
                <>
                  {/* Top 3 Podium for Individuals */}
                  {sortedDonors.filter(d => d.type === 'Individual').length >= 3 && (
                    <div className="mb-12 relative">
                      
                      <h2 className="text-3xl font-bold text-center mb-8 text-primary">
                        Top Individual Donors
                      </h2>
                      
                      <div className="flex items-end justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center order-2 md:order-1">
                          <div className="relative mb-4">
                            <div className="w-20 h-20 md:w-24 md:h-24 
                                            bg-gradient-to-b from-amber-300 to-orange-500 
                                            rounded-full flex items-center justify-center 
                                            shadow-lg border-4 border-amber-200">
                              <Medal className="w-8 h-8 md:w-10 md:h-10 text-orange-700" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 
                                            bg-amber-600 rounded-full flex items-center 
                                            justify-center text-white font-bold text-sm">
                              2
                            </div>
                          </div>
                          
                          <div className="text-center mb-4">
                            <h3 className="font-bold text-lg">
                              {sortedDonors.filter(d => d.type === 'Individual')[1]?.name || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-muted-foreground">Individual</p>
                            <Badge className={`mt-2 ${levels['Flowering Tree']?.color}`}>
                              <Clover className="w-3 h-3 mr-1" />
                              Flowering Tree
                            </Badge>
                          </div>
                          
                          <div className="bg-amber-300 dark:bg-gray-800 rounded-lg p-4 text-center min-w-[120px] md:min-w-[140px]">
                            <p className="text-2xl font-bold">
                              ${sortedDonors.filter(d => d.type === 'Individual')[1]?.totalDonated.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs">Total Donated</p>
                          </div>
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center order-1 md:order-2">
                          <div className="relative mb-4">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-b from-green-300 to-green-500 rounded-full flex items-center justify-center shadow-xl border-4 border-green-200 transform scale-110">
                              <Crown className="w-10 h-10 md:w-12 md:h-12 text-green-700" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              1
                            </div>
                          </div>
                          
                          <div className="text-center mb-4">
                            <h3 className="font-bold text-xl">
                              {sortedDonors.filter(d => d.type === 'Individual')[0]?.name || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-muted-foreground">Individual</p>
                            <Badge className={`mt-2 ${levels['Evergreen']?.color}`}>
                              <Clover className="w-3 h-3 mr-1" />
                              Evergreen
                            </Badge>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg p-4 text-center min-w-[140px] md:min-w-[160px] border-2 border-green-300">
                            <p className="text-3xl font-bold">
                              ${sortedDonors.filter(d => d.type === 'Individual')[0]?.totalDonated.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs">Total Donated</p>
                          </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center order-3">
                          <div className="relative mb-4">
                            <div className="w-20 h-20 md:w-24 md:h-24 
                                            bg-gradient-to-b from-orange-600 to-orange-800 
                                            rounded-full flex items-center justify-center 
                                            shadow-lg border-4 border-orange-600">
                              <Medal className="w-8 h-8 md:w-10 md:h-10 text-orange-100" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 
                                            bg-orange-600 rounded-full flex items-center 
                                            justify-center text-white font-bold text-sm">
                              3
                            </div>
                          </div>
                          
                          <div className="text-center mb-4">
                            <h3 className="font-bold text-base">
                              {sortedDonors.filter(d => d.type === 'Individual')[2]?.name || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-muted-foreground">Individual</p>
                            <Badge className={`mt-2 ${levels['Sapling']?.color}`}>
                              <Clover className="w-3 h-3 mr-1" />
                              Sapling
                            </Badge>
                          </div>

                          <div className="bg-orange-400 dark:bg-amber-900 rounded-lg p-4 text-center min-w-[100px] md:min-w-[120px]">
                            <p className="text-xl font-bold">
                              ${sortedDonors.filter(d => d.type === 'Individual')[2]?.totalDonated.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs">Total Donated</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Remaining Individual Donors (4-10) */}
                  {sortedDonors.filter(d => d.type === 'Individual').slice(3, 10).length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-center text-muted-foreground">
                        Other Individual Donors
                      </h3>
                      <div className="space-y-4">
                        {sortedDonors.filter(d => d.type === 'Individual').slice(3, 10).map((donor, index) => (
                          <Card key={donor.id} className="rounded-lg bg-card text-card-foreground shadow-sm text-center card-hover border-0 shadow-soft hover:scale-[1.02]">
                            <CardContent className="p-4 flex items-center gap-4 relative"> 
                              {/* Rank Badge */}
                              <div className="absolute -top-3 transform -translate-x-7">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-glow text-white font-bold text-sm">
                                  {index + 4}
                  </div>
                </div>

                {/* Left Section: Avatar, Name, Level */}
                <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-4 border-background shadow-soft flex-shrink-0">
                    <AvatarImage src={donor.avatar} alt={donor.name} />
                                  <AvatarFallback className="bg-gradient-primary text-white text-lg">
                      {donor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                                  <h3 className="text-lg font-bold whitespace-nowrap">{donor.name}</h3>
                    <Badge className={`mt-2 ${levels[donor.level].color}`}>
                      <Clover className="w-3 h-3 mr-1" />
                      {donor.level}
                    </Badge>
                  </div>
                </div>

                              {/* Stats Section */}
                <div className="flex-1 flex items-center justify-end gap-6">
                  <div className="text-center">
                                  <p className="text-lg font-bold text-primary">${donor.totalDonated.toLocaleString()}</p>
                                  <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                                  <p className="text-base font-bold text-green-600">${donor.monthlyDonated.toLocaleString()}</p>
                                  <p className="text-xs text-muted-foreground">Monthly</p>
                  </div>
                  <div className="text-center">
                                  <p className="text-base font-bold">{donor.donations}</p>
                    <p className="text-xs text-muted-foreground">Donations</p>
                  </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Individual Donors */}
                  {sortedDonors.filter(d => d.type === 'Individual').length === 0 && (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No individual donors found</h3>
                      <p className="text-muted-foreground">
                        Individual donors will appear here once they make donations.
                      </p>
                  </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Corporate Donors Tab */}
            <TabsContent value="corporate" className="space-y-8">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading corporate donors...</p>
                </div>
              ) : (
                <>
                  {/* Top 3 Podium for Corporate */}
                  {sortedDonors.filter(d => d.type === 'Corporate').length >= 3 && (
                    <div className="mb-12 relative">
                      
                      <h2 className="text-3xl font-bold text-center mb-8 text-secondary">
                        Top Corporate Donors
                      </h2>
                      
                      <div className="flex items-end justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center order-2 md:order-1">
                          <div className="relative mb-4">
                            <div className="w-20 h-20 md:w-24 md:h-24 
                                            bg-gradient-to-b from-amber-300 to-orange-500 
                                            rounded-full flex items-center justify-center 
                                            shadow-lg border-4 border-amber-200">
                              <Medal className="w-8 h-8 md:w-10 md:h-10 text-orange-700" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 
                                            bg-amber-600 rounded-full flex items-center 
                                            justify-center text-white font-bold text-sm">
                              2
                            </div>
                          </div>
                          
                          <div className="text-center mb-4">
                            <h3 className="font-bold text-lg">
                              {sortedDonors.filter(d => d.type === 'Corporate')[1]?.name || 'Anonymous Corp'}
                            </h3>
                            <p className="text-sm text-muted-foreground">Corporate</p>
                            <Badge className={`mt-2 ${levels[sortedDonors.filter(d => d.type === 'Corporate')[0]?.level || 'Seed']?.color}`}>
                              <Clover className="w-3 h-3 mr-1" />
                              {sortedDonors.filter(d => d.type === 'Corporate')[0]?.level || 'Seed'}
                            </Badge>
                          </div>
                          
                          <div className="bg-amber-300 dark:bg-gray-800 rounded-lg p-4 text-center min-w-[120px] md:min-w-[140px]">
                            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                              ${sortedDonors.filter(d => d.type === 'Corporate')[1]?.totalDonated.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Donated</p>
                          </div>
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center order-1 md:order-2">
                          <div className="relative mb-4">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-b from-green-300 to-green-500 rounded-full flex items-center justify-center shadow-xl border-4 border-green-200 transform scale-110">
                              <Crown className="w-10 h-10 md:w-12 md:h-12 text-green-700" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              1
                            </div>
                          </div>
                          
                          <div className="text-center mb-4">
                            <h3 className="font-bold text-xl">
                              {sortedDonors.filter(d => d.type === 'Corporate')[0]?.name || 'Anonymous Corp'}
                            </h3>
                            <p className="text-sm text-muted-foreground">Corporate</p>
                            <Badge className={`mt-2 ${levels[sortedDonors.filter(d => d.type === 'Corporate')[0]?.level || 'Seed']?.color}`}>
                              <Clover className="w-3 h-3 mr-1" />
                              {sortedDonors.filter(d => d.type === 'Corporate')[0]?.level || 'Seed'}
                            </Badge>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg p-4 text-center min-w-[140px] md:min-w-[160px] border-2 border-green-300">
                            <p className="text-3xl font-bold">
                              ${sortedDonors.filter(d => d.type === 'Corporate')[0]?.totalDonated.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs">Total Donated</p>
                          </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center order-3">
                          <div className="relative mb-4">
                            <div className="w-20 h-20 md:w-24 md:h-24 
                                            bg-gradient-to-b from-orange-600 to-orange-800 
                                            rounded-full flex items-center justify-center 
                                            shadow-lg border-4 border-orange-600">
                              <Medal className="w-8 h-8 md:w-10 md:h-10 text-orange-100" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 
                                            bg-orange-600 rounded-full flex items-center 
                                            justify-center text-white font-bold text-sm">
                              3
                            </div>
                          </div>
                          
                          <div className="text-center mb-4">
                            <h3 className="font-bold text-base">
                              {sortedDonors.filter(d => d.type === 'Corporate')[2]?.name || 'Anonymous Corp'}
                            </h3>
                            <p className="text-sm text-muted-foreground">Corporate</p>
                            <Badge className={`mt-2 ${levels['Flowering Tree']?.color}`}>
                              <Clover className="w-3 h-3 mr-1" />
                                Flowering Tree
                            </Badge>
                          </div>

                          <div className="bg-orange-400 dark:bg-amber-900 rounded-lg p-4 text-center min-w-[100px] md:min-w-[120px]">
                            <p className="text-2xl font-bold">
                              ${sortedDonors.filter(d => d.type === 'Corporate')[2]?.totalDonated.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs">Total Donated</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Remaining Corporate Donors (4-10) */}
                  {sortedDonors.filter(d => d.type === 'Corporate').slice(3, 10).length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-center text-muted-foreground">
                        Other Corporate Donors
                      </h3>
                      <div className="space-y-4">
                        {sortedDonors.filter(d => d.type === 'Corporate').slice(3, 10).map((donor, index) => (
                          <Card key={donor.id} className="border-0 shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                            <CardContent className="p-4 flex items-center gap-4 relative"> 
                              {/* Rank Badge */}
                              <div className="absolute -top-3 transform -translate-x-7">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-glow text-white font-bold text-sm">
                                  {index + 4}
                                </div>
                              </div>

                              {/* Left Section: Avatar, Name, Level */}
                              <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-4 border-background shadow-soft flex-shrink-0">
                                  <AvatarImage src={donor.avatar} alt={donor.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-lg">
                                    {donor.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0">
                                  <h3 className="text-lg font-bold whitespace-nowrap">{donor.name}</h3>
                                  <Badge className={`mt-2 ${levels[donor.level].color}`}>
                                    <Clover className="w-3 h-3 mr-1" />
                                    {donor.level}
                                  </Badge>
                                </div>
                              </div>

                              {/* Stats Section */}
                              <div className="flex-1 flex items-center justify-end gap-6">
                                <div className="text-center">
                                  <p className="text-lg font-bold text-primary">${donor.totalDonated.toLocaleString()}</p>
                                  <p className="text-xs text-muted-foreground">Total</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-base font-bold text-green-600">${donor.monthlyDonated.toLocaleString()}</p>
                                  <p className="text-xs text-muted-foreground">Monthly</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-base font-bold">{donor.donations}</p>
                                  <p className="text-xs text-muted-foreground">Donations</p>
                                </div>
                              </div>
              </CardContent>
            </Card>
          ))}
                      </div>
                    </div>
                  )}

                  {/* No Corporate Donors */}
                   {sortedDonors.filter(d => d.type === 'Corporate').length === 0 && (
                     <div className="text-center py-12">
                       <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                       <h3 className="text-xl font-semibold mb-2">No corporate donors found</h3>
                       <p className="text-muted-foreground">
                         Corporate donors will appear here once they make donations.
                       </p>
                     </div>
                   )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Level Progress System */}
        <Card className="mt-8 mb-8 border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-center justify-center">
              <Clover className="w-8 h-8 text-green-600" />
              <span className="text-2xl">Donor Level System</span>
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Grow with us! Each donation brings you closer to the next level
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(levels).map(([level, config]) => (
                <div key={level} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${config.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    {level === "Seed" && <Bean className="w-10 h-10" />}
                    {level === "Sapling" && <Sprout className="w-10 h-10" />}
                    {level === "Flowering Tree" && <Flower className="w-10 h-10" />}
                    {level === "Evergreen" && <TreePine className="w-10 h-10" />}
                  </div>
                  <h4 className="font-bold text-lg mb-2">{level}</h4>
                  <div className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: config.description }} />
                  
                  {/* Level Threshold */}
                  <div className="mt-3 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                    <p className="text-xs font-medium">
                      {level === "Seed" && "Start your journey"}
                      {level === "Sapling" && "Reach $2,000"}
                      {level === "Flowering Tree" && "Reach $5,000"}
                      {level === "Evergreen" && "Reach $10,000+"}
                    </p>
                  </div>
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


    </div>
  );
};

export default Leaderboard;