// Google Auth helper
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase-auth"

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  // result.user contains user info
  return result.user
} 