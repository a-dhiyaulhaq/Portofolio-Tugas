// --- 1. Typing Animation Effect ---
const words = ["information system student", "Lover of Technology", "Data Enthusiast", "Front-End Learning", "UI/UX Explorer", "Tech Export", "Problem Solver", "Code Newbie"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing-text");

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typingSpeed = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}

// --- 2. Dynamic Background Stars Generator ---
function createStars() {
    const starsContainer = document.getElementById("stars-container");
    const starCount = 80;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        // Random positions and sizes
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;

        // Random animation delay & duration
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;

        starsContainer.appendChild(star);
    }
}

// --- 3. Portfolio Tab Switcher ---
function switchTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.add('hidden'));

    // Deactivate all tab buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('text-gray-400');
    });

    // Show selected content & set active button
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`tab-${tabName}`);
    activeBtn.classList.add('active');
    activeBtn.classList.remove('text-gray-400');
}

// --- 4. Contact Form Handler ---
function handleFormSubmit(event) {
    event.preventDefault();
    alert("Terima kasih! Pesan Anda telah terkirim.");
    event.target.reset();
}

// Initialize functions when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    typeEffect();
    createStars();
});