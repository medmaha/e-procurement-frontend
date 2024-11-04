"use server"

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOCceLl7cla3KSq2NIDz_Z3-6f3CZRi8Y",
    authDomain: "insistglobal-90aa9.firebaseapp.com",
    projectId: "insistglobal-90aa9",
    storageBucket: "insistglobal-90aa9.appspot.com",
    messagingSenderId: "394319280281",
    appId: "1:394319280281:web:2ca45161e5de619a14a008",
    measurementId: "G-M2GF3S28MT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path where the file should be saved
 * @returns Promise with download URL
 */
export async function fileUploader(file: File, path: string, metadata?:Json): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Deletes a file from Firebase Storage
 * @param path - The storage path of the file to delete
 */
export async function fileDestroyer(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
