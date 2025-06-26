import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface UserProfile {
  uid: string
  email: string
  name: string
  age: number
  fears: string[]
  stressFactors: string[]
  hobbies: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface JournalEntry {
  id?: string
  uid: string
  content: string
  prompt?: string
  createdAt: Timestamp
}

export interface MoodEntry {
  id?: string
  uid: string
  mood: number
  notes?: string
  createdAt: Timestamp
}

export interface ChatMessage {
  id?: string
  uid: string
  role: "user" | "assistant"
  content: string
  createdAt: Timestamp
}

// User Profile Functions
export async function createUserProfile(uid: string, email: string, profileData: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid)
  const userData: UserProfile = {
    uid,
    email,
    name: profileData.name || "",
    age: profileData.age || 0,
    fears: profileData.fears || [],
    stressFactors: profileData.stressFactors || [],
    hobbies: profileData.hobbies || [],
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  }

  await setDoc(userRef, userData)
  return userData
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile
  }
  return null
}

export async function updateUserProfile(uid: string, profileData: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    ...profileData,
    updatedAt: serverTimestamp(),
  })
}

// Journal Functions
export async function saveJournalEntry(uid: string, content: string, prompt?: string) {
  const journalRef = collection(db, "journal_entries")
  const entryData: Omit<JournalEntry, "id"> = {
    uid,
    content,
    prompt,
    createdAt: serverTimestamp() as Timestamp,
  }

  const docRef = await addDoc(journalRef, entryData)
  return { id: docRef.id, ...entryData }
}

export async function getUserJournalEntries(uid: string, limit = 50): Promise<JournalEntry[]> {
  const journalRef = collection(db, "journal_entries")
  const q = query(journalRef, where("uid", "==", uid), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as JournalEntry[]
}

// Mood Functions
export async function saveMoodEntry(uid: string, mood: number, notes?: string) {
  const moodRef = collection(db, "mood_entries")
  const entryData: Omit<MoodEntry, "id"> = {
    uid,
    mood,
    notes,
    createdAt: serverTimestamp() as Timestamp,
  }

  const docRef = await addDoc(moodRef, entryData)
  return { id: docRef.id, ...entryData }
}

export async function getUserMoodEntries(uid: string, limit = 30): Promise<MoodEntry[]> {
  const moodRef = collection(db, "mood_entries")
  const q = query(moodRef, where("uid", "==", uid), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MoodEntry[]
}

// Chat Functions
export async function saveChatMessage(uid: string, role: "user" | "assistant", content: string) {
  const chatRef = collection(db, "chat_messages")
  const messageData: Omit<ChatMessage, "id"> = {
    uid,
    role,
    content,
    createdAt: serverTimestamp() as Timestamp,
  }

  const docRef = await addDoc(chatRef, messageData)
  return { id: docRef.id, ...messageData }
}

export async function getUserChatHistory(uid: string, limit = 50): Promise<ChatMessage[]> {
  const chatRef = collection(db, "chat_messages")
  const q = query(chatRef, where("uid", "==", uid), orderBy("createdAt", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[]
}
