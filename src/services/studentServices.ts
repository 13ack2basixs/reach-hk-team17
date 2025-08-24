import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { updatesService } from "./updateServices";

export interface Student {
  id?: string;
  name: string;
  school: string;
  class: string;
  english: number;
  region: string;
  lastUpdated?: Timestamp | Date;
  createdAt?: Timestamp | Date;
}

const STUDENTS_COLLECTION = "student_grades";

// Student CRUD operations
export const studentService = {
  // Add new student
  async addStudent(student: Omit<Student, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
        ...student,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding student:", error);
      throw error;
    }
  },

  // Get all students
  async getStudents(): Promise<Student[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, STUDENTS_COLLECTION), orderBy("lastUpdated"))
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          school: data.school || "",
          class: data.class || "",
          english: data.english || 0,
          region: data.region || "",
          lastUpdated: data.lastUpdated || Timestamp.now(),
          createdAt: data.createdAt || Timestamp.now(),
        } as Student;
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  // Update student grades
  async updateStudentGrades(
    studentId: string,
    updates: { english?: number },
    currentStudent?: Student
  ): Promise<void> {
    try {
      const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
      await updateDoc(studentRef, {
        ...updates,
        lastUpdated: Timestamp.now(),
      });

      // Auto-create pending announcements for significant improvements (15+ points)
      if (currentStudent) {
        const significantImprovement = 15;

        if (
          updates.english &&
          updates.english - currentStudent.english >= significantImprovement
        ) {
          const improvement = updates.english - currentStudent.english;
          await updatesService.addPendingUpdate({
            type: "Student Achievement",
            description: `${currentStudent.name} from ${currentStudent.school} improved their English grade from ${currentStudent.english} to ${updates.english} (+${improvement} points)! Your donations are making a real difference in their learning journey.`,
            studentName: currentStudent.name,
            school: currentStudent.school,
          });
        }
      }
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  },

  // Delete student
  async deleteStudent(studentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  },

  // Real-time listener for students
  subscribeToStudents(callback: (students: Student[]) => void) {
    const q = query(
      collection(db, STUDENTS_COLLECTION),
      orderBy("lastUpdated", "desc")
    );
    return onSnapshot(
      q,
      (querySnapshot) => {
        const students = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            school: data.school || "",
            class: data.class || "",
            english: data.english || 0,
            region: data.region || "",
            lastUpdated: data.lastUpdated || Timestamp.now(),
            createdAt: data.createdAt || Timestamp.now(),
          } as Student;
        });
        callback(students);
      },
      (error) => {
        console.error("Error in students listener:", error);
        if (error.code === "permission-denied") {
          console.error(
            "Permission denied. Please check your Firestore security rules."
          );
        }
      }
    );
  },
};
