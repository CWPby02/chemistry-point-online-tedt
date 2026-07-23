// ==========================================================
// assets/js/home.js
// CPES — Home page interactivity (dynamic notices, quizzes)
// ==========================================================

import { db } from '../firebase/config.js';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadNotices();
  await loadQuizzes();
});

// ---------- Load Notices from Firestore ----------
async function loadNotices() {
  const container = document.querySelector('.notices__grid');
  if (!container) return;

  try {
    const q = query(
      collection(db, 'notices'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      container.innerHTML =
        '<p class="text-muted">No notices available at the moment.</p>';
      return;
    }

    let html = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      html += `
        <article class="notice-card">
          <div class="notice-card__icon">
            <span class="material-symbols-rounded">${data.icon || 'campaign'}</span>
          </div>
          <div class="notice-card__body">
            <span class="notice-card__tag">${data.tag || 'Update'}</span>
            <h3 class="notice-card__title">${data.title || 'Notice'}</h3>
            <p class="notice-card__desc">${data.description || ''}</p>
            <time class="notice-card__date" datetime="${data.createdAt || ''}">
              <span class="material-symbols-rounded">calendar_today</span>
              ${data.date || ''}
            </time>
          </div>
        </article>
      `;
    });
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading notices:', error);
    container.innerHTML =
      '<p class="text-muted">Unable to load notices. Please refresh.</p>';
  }
}

// ---------- Load Quizzes from Firestore ----------
async function loadQuizzes() {
  const container = document.querySelector('.features__grid');
  if (!container) return;

  try {
    const q = query(
      collection(db, 'quizzes'),
      orderBy('createdAt', 'desc'),
      limit(4)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Show static fallback if no data
      return;
    }

    let html = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      html += `
        <article class="quiz-card ${data.featured ? 'quiz-card--featured' : ''}">
          ${data.featured ? `<div class="quiz-card__badge">Popular</div>` : ''}
          <div class="quiz-card__icon">
            <span class="material-symbols-rounded">${data.icon || 'science'}</span>
          </div>
          <h3 class="quiz-card__title">${data.title || 'Quiz'}</h3>
          <p class="quiz-card__desc">${data.description || ''}</p>
          <div class="quiz-card__meta">
            <span><span class="material-symbols-rounded">schedule</span> ${data.duration || '30 min'}</span>
            <span><span class="material-symbols-rounded">quiz</span> ${data.questionsCount || 20} Qs</span>
          </div>
          <div class="quiz-card__price">₹${data.price || 0}</div>
          <a href="student/payment.html?quiz=${doc.id}" class="btn btn--primary btn--block">
            <span class="material-symbols-rounded">shopping_cart</span>
            Purchase
          </a>
        </article>
      `;
    });
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading quizzes:', error);
    // Keep static cards as fallback
  }
}