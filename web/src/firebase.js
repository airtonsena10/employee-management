// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBmyS-OXduPlnhXQ3RC9bddYMfABgJn_Pk',
  authDomain: 'employeeapi-62ad2.firebaseapp.com',
  projectId: 'employeeapi-62ad2',
  storageBucket: 'employeeapi-62ad2.appspot.com',
  messagingSenderId: '639008948799',
  appId: '1:639008948799:web:2d36bff255230994d4ee8a',
  measurementId: 'G-KD5X2MW376',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const storage = getStorage(app)
