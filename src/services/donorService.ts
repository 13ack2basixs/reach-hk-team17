
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Donor {
  id?: string;
  name: string;
  email: string;
  amount: number;
  school: string;
  donorType: 'Individual' | 'Corporate';
  dateDonated: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface DonorProfile {
  id?: string;
  name: string;
  email: string;
  donorType: 'Individual' | 'Corporate';
  createdAt?: any;
  updatedAt?: any;
}

export interface Donation {
  id?: string;
  donorId: string;
  amount: number;
  school: string;
  dateDonated: string;
  createdAt?: any;
}

// Collection references
const DONORS_COLLECTION = 'donors';
const DONATIONS_COLLECTION = 'donations';

// Create a new donor profile
export const createDonorProfile = async (donorData: Omit<DonorProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log("Creating donor profile with data:", donorData);
    
    const docRef = await addDoc(collection(db, DONORS_COLLECTION), {
      ...donorData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    const newProfile = {
      id: docRef.id,
      ...donorData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("Donor profile created successfully:", newProfile);
    return newProfile;
  } catch (error) {
    console.error('Error creating donor profile:', error);
    throw new Error('Failed to create donor profile');
  }
};

// Add a new donation to an existing donor
export const addDonation = async (donationData: Omit<Donation, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), {
      ...donationData,
      createdAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...donationData,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error adding donation:', error);
    throw new Error('Failed to add donation');
  }
};

// Update an existing donation
export const updateDonation = async (donationId: string, updates: Partial<Donation>) => {
  try {
    const donationRef = doc(db, DONATIONS_COLLECTION, donationId);
    await updateDoc(donationRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating donation:', error);
    throw new Error('Failed to update donation');
  }
};

// Delete a donation
export const deleteDonation = async (donationId: string) => {
  try {
    await deleteDoc(doc(db, DONATIONS_COLLECTION, donationId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting donation:', error);
    throw new Error('Failed to delete donation');
  }
};

// Test if we can access donor collections
export const testDonorCollections = async () => {
  try {
    console.log("🧪 Testing donor collections access...");
    
    // Test donors collection
    const donorsTest = await getDocs(collection(db, DONORS_COLLECTION));
    console.log("Donors collection accessible, count:", donorsTest.size);
    
    // Test donations collection
    const donationsTest = await getDocs(collection(db, DONATIONS_COLLECTION));
    console.log("Donations collection accessible, count:", donationsTest.size);
    
    return true;
  } catch (error) {
    console.error("Error accessing donor collections:", error);
    return false;
  }
};

// Get all donors with their donations
export const getDonorsWithDonations = async (): Promise<Donor[]> => {
  try {
    console.log("Attempting to fetch donors from Firestore...");
    
    const donorsSnapshot = await getDocs(collection(db, DONORS_COLLECTION));
    console.log("Donors collection accessed successfully");
    
    const donationsSnapshot = await getDocs(collection(db, DONATIONS_COLLECTION));
    console.log("Donations collection accessed successfully");
    
    const donors: Donor[] = [];
    
    donorsSnapshot.forEach((donorDoc) => {
      const donorData = donorDoc.data() as DonorProfile;
      
      // Find all donations for this donor
      donationsSnapshot.forEach((donationDoc) => {
        const donationData = donationDoc.data() as Donation;
        
        if (donationData.donorId === donorDoc.id) {
          donors.push({
            id: donationDoc.id, // Use donation ID as the main ID
            name: donorData.name,
            email: donorData.email,
            amount: donationData.amount,
            school: donationData.school,
            donorType: donorData.donorType,
            dateDonated: donationData.dateDonated,
            createdAt: donationData.createdAt
          });
        }
      });
    });
    
    console.log(`📊 Found ${donors.length} donors with donations`);
    return donors;
  } catch (error) {
    console.error('Error fetching donors:', error);
    throw new Error('Failed to fetch donors');
  }
};

// Get donor profile by email
export const getDonorProfileByEmail = async (email: string): Promise<DonorProfile | null> => {
  try {
    console.log("🔍 Looking for donor profile with email:", email);
    
    const q = query(collection(db, DONORS_COLLECTION), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    console.log("Query result:", querySnapshot.size, "documents found");
    
    if (querySnapshot.empty) {
      console.log("No donor profile found for email:", email);
      return null;
    }
    
    const donorDoc = querySnapshot.docs[0];
    const donorData = {
      id: donorDoc.id,
      ...donorDoc.data()
    } as DonorProfile;
    
    console.log("Found donor profile:", donorData);
    return donorData;
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    throw new Error('Failed to fetch donor profile');
  }
};

// Get donations by donor email
export const getDonationsByEmail = async (email: string): Promise<Donation[]> => {
  try {
    // First get the donor profile
    const donorProfile = await getDonorProfileByEmail(email);
    if (!donorProfile) {
      return [];
    }
    
    // Then get all donations for this donor
    const q = query(
      collection(db, DONATIONS_COLLECTION), 
      where('donorId', '==', donorProfile.id),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const donations: Donation[] = [];
    
    querySnapshot.forEach((doc) => {
      donations.push({
        id: doc.id,
        ...doc.data()
      } as Donation);
    });
    
    return donations;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw new Error('Failed to fetch donations');
  }
};

// Real-time listener for donors
export const subscribeToDonors = (callback: (donors: Donor[]) => void) => {
  return onSnapshot(collection(db, DONORS_COLLECTION), async () => {
    try {
      const donors = await getDonorsWithDonations();
      callback(donors);
    } catch (error) {
      console.error('Error in real-time listener:', error);
    }
  });
};

// Search donors by name or email
export const searchDonors = async (searchTerm: string): Promise<Donor[]> => {
  try {
    const allDonors = await getDonorsWithDonations();
    
    return allDonors.filter(donor => 
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching donors:', error);
    throw new Error('Failed to search donors');
  }
};

// Filter donors by school and/or donor type
export const filterDonors = async (
  school?: string, 
  donorType?: string
): Promise<Donor[]> => {
  try {
    const allDonors = await getDonorsWithDonations();
    
    return allDonors.filter(donor => {
      const matchesSchool = !school || donor.school === school;
      const matchesType = !donorType || donor.donorType === donorType;
      
      return matchesSchool && matchesType;
    });
  } catch (error) {
    console.error('Error filtering donors:', error);
    throw new Error('Failed to filter donors');
  }
};

// Get donation statistics
export const getDonationStats = async () => {
  try {
    const donors = await getDonorsWithDonations();
    
    const totalDonations = donors.reduce((sum, donor) => sum + donor.amount, 0);
    const totalDonors = new Set(donors.map(donor => donor.email)).size;
    const averageDonation = totalDonors > 0 ? totalDonations / totalDonors : 0;
    
    // Calculate this month's donations
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const thisMonthDonations = donors.filter(donor => {
      const donationDate = new Date(donor.dateDonated);
      return donationDate.getMonth() === thisMonth && donationDate.getFullYear() === thisYear;
    }).reduce((sum, donor) => sum + donor.amount, 0);
    
    return {
      totalDonations,
      totalDonors,
      averageDonation,
      thisMonthDonations
    };
  } catch (error) {
    console.error('Error getting donation stats:', error);
    throw new Error('Failed to get donation statistics');
  }
};

// Get monthly donation data for charts
export const getMonthlyDonationData = async (months: number = 12) => {
  try {
    const donors = await getDonorsWithDonations();
    const monthlyData: { month: string; amount: number }[] = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthDonations = donors.filter(donor => {
        const donationDate = new Date(donor.dateDonated);
        return donationDate.getMonth() === date.getMonth() && 
               donationDate.getFullYear() === date.getFullYear();
      }).reduce((sum, donor) => sum + donor.amount, 0);
      
      monthlyData.push({
        month: monthName,
        amount: monthDonations
      });
    }
    
    return monthlyData;
  } catch (error) {
    console.error('Error getting monthly data:', error);
    throw new Error('Failed to get monthly donation data');
  }
};

// Get donors for leaderboard with aggregated data
export const getDonorsForLeaderboard = async (): Promise<{
  id: string;
  name: string;
  email: string;
  type: 'Individual' | 'Corporate';
  totalDonated: number;
  monthlyDonated: number;
  donations: number;
  joinDate: string;
  level: string;
  streak: number;
}[]> => {
  try {
    const allDonors = await getDonorsWithDonations();
    
    // Group donations by donor email
    const donorMap = new Map<string, {
      id: string;
      name: string;
      email: string;
      type: 'Individual' | 'Corporate';
      totalDonated: number;
      monthlyDonated: number;
      donations: number;
      joinDate: string;
      level: string;
      streak: number;
    }>();
    
    allDonors.forEach(donor => {
      const existing = donorMap.get(donor.email);
      const donationDate = new Date(donor.dateDonated);
      const now = new Date();
      const isThisMonth = donationDate.getMonth() === now.getMonth() && 
                         donationDate.getFullYear() === now.getFullYear();
      
      if (existing) {
        existing.totalDonated += donor.amount;
        existing.donations += 1;
        if (isThisMonth) {
          existing.monthlyDonated += donor.amount;
        }
        // Keep the earliest join date
        if (new Date(donor.dateDonated) < new Date(existing.joinDate)) {
          existing.joinDate = donor.dateDonated;
        }
      } else {
        const level = calculateDonorLevel(donor.amount);
        donorMap.set(donor.email, {
          id: donor.id || '',
          name: donor.name,
          email: donor.email,
          type: donor.donorType,
          totalDonated: donor.amount,
          monthlyDonated: isThisMonth ? donor.amount : 0,
          donations: 1,
          joinDate: donor.dateDonated,
          level,
          streak: 1 // Simple streak calculation - can be enhanced later
        });
      }
    });
    
    // Convert to array and sort by total donated
    const leaderboardDonors = Array.from(donorMap.values())
      .sort((a, b) => b.totalDonated - a.totalDonated)
      .map((donor, index) => ({
        ...donor,
        rank: index + 1
      }));
    
    return leaderboardDonors;
  } catch (error) {
    console.error('Error getting leaderboard donors:', error);
    throw new Error('Failed to get leaderboard data');
  }
};

// Calculate donor level based on total donations
const calculateDonorLevel = (totalDonated: number): string => {
  if (totalDonated >= 10000) return 'Evergreen';
  if (totalDonated >= 5000) return 'Flowering Tree';
  if (totalDonated >= 2000) return 'Sapling';
  return 'Seed';
};
