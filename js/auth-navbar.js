import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBnUvXTtSshLM3hSNovbPFZn0fkQ5AhDso",
    authDomain: "sero-39908.firebaseapp.com",
    projectId: "sero-39908",
    storageBucket: "sero-39908.firebasestorage.app",
    messagingSenderId: "967686052659",
    appId: "1:967686052659:web:e9a3a1ed61ff1014b63c46",
    measurementId: "G-K0R928TK2X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for DOM to load fully just in case
document.addEventListener('DOMContentLoaded', () => {

    // Find the Nav Button by its href and class
    const navBtn = document.querySelector('a[href="signup.html"]');
    const menuLinks = document.querySelector('.navbar12_menu-links');

    // Listen for Auth State Changes
    onAuthStateChanged(auth, (user) => {
        if (user && navBtn) {
            // User is signed in.
            const displayName = user.displayName || user.email.split('@')[0];

            navBtn.textContent = displayName;
            navBtn.href = "profile.html";
            navBtn.style.cursor = "pointer";
            navBtn.title = "View your profile";

            // Inject a sign-out option into the navbar links (once)
            if (menuLinks && !document.getElementById('nav-signout')) {
                const signoutLink = document.createElement('a');
                signoutLink.id = 'nav-signout';
                signoutLink.className = 'navbar12_link w-inline-block';
                signoutLink.href = '#';
                signoutLink.style.cssText = 'opacity: 0.4;';
                signoutLink.innerHTML = '<div class="navbar12_link-label" style="color:#fff;font-size:13px;">Sign out</div>';
                signoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    signOut(auth).then(() => window.location.reload()).catch(console.error);
                });
                menuLinks.appendChild(signoutLink);
            }
        }
    });

});
