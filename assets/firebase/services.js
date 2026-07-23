// ==========================================================
// assets/firebase/services.js (FULL VERSION)
// ==========================================================

import {
  doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc,
  collection, query, where, orderBy, limit, Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

import {
  signInWithEmailAndPassword, signOut
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

import { auth, db, storage } from './config.js';

// ---------- COLLECTION NAMES ----------
const COLLECTIONS = {
  ADMINS: 'admins',
  QUIZZES: 'quizzes',
  QUESTIONS: 'questions',
  STUDENTS: 'students',
  RESULTS: 'results',
  PAYMENT: 'payment',
  NOTICES: 'notices'
};

// ---------- AUTH ----------
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ---------- QUIZZES ----------
export const getAllQuizzes = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.QUIZZES), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const quizzes = [];
    snapshot.forEach((doc) => {
      quizzes.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: quizzes };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getQuizById = async (quizId) => {
  try {
    const docRef = doc(db, COLLECTIONS.QUIZZES, quizId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Quiz not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addQuiz = async (quizData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.QUIZZES), {
      ...quizData,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateQuiz = async (quizId, quizData) => {
  try {
    const docRef = doc(db, COLLECTIONS.QUIZZES, quizId);
    await updateDoc(docRef, {
      ...quizData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    // Also delete all questions of this quiz
    const q = query(collection(db, COLLECTIONS.QUESTIONS), where('quizId', '==', quizId));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    await deleteDoc(doc(db, COLLECTIONS.QUIZZES, quizId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ---------- QUESTIONS ----------
export const getQuestionsByQuizId = async (quizId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.QUESTIONS),
      where('quizId', '==', quizId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    const questions = [];
    snapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: questions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.QUESTIONS), {
      ...questionData,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateQuestion = async (questionId, questionData) => {
  try {
    const docRef = doc(db, COLLECTIONS.QUESTIONS, questionId);
    await updateDoc(docRef, questionData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.QUESTIONS, questionId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ---------- STUDENTS ----------
export const getAllStudents = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.STUDENTS), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const students = [];
    snapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: students };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getStudentByEmail = async (email) => {
  try {
    const q = query(collection(db, COLLECTIONS.STUDENTS), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return { success: false, error: 'Student not found' };
    let student = null;
    snapshot.forEach((doc) => {
      student = { id: doc.id, ...doc.data() };
    });
    return { success: true, data: student };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addStudent = async (studentData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.STUDENTS), {
      ...studentData,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ---------- PAYMENTS ----------
export const getAllPayments = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.PAYMENT), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const payments = [];
    snapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: payments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const verifyPayment = async (transactionId, quizId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PAYMENT),
      where('transactionId', '==', transactionId),
      where('quizId', '==', quizId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: false, error: 'Transaction not found' };
    }
    let paymentData = null;
    snapshot.forEach((doc) => {
      paymentData = { id: doc.id, ...doc.data() };
    });
    if (paymentData.verified) {
      return { success: false, error: 'Payment already verified' };
    }
    const docRef = doc(db, COLLECTIONS.PAYMENT, paymentData.id);
    await updateDoc(docRef, {
      verified: true,
      verifiedAt: new Date().toISOString()
    });
    return { success: true, data: { ...paymentData, verified: true } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addPayment = async (paymentData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PAYMENT), {
      ...paymentData,
      verified: false,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ---------- RESULTS ----------
export const getAllResults = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.RESULTS), orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const saveResult = async (resultData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.RESULTS), {
      ...resultData,
      submittedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getResultById = async (resultId) => {
  try {
    const docRef = doc(db, COLLECTIONS.RESULTS, resultId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Result not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ---------- NOTICES ----------
export const getAllNotices = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.NOTICES), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const notices = [];
    snapshot.forEach((doc) => {
      notices.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: notices };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addNotice = async (noticeData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.NOTICES), {
      ...noticeData,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteNotice = async (noticeId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.NOTICES, noticeId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ---------- Export ----------
export { COLLECTIONS };