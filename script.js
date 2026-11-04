// --- 1. Typing Animation Effect ---
const words = ["information system student", "Lover of Technology", "Data Enthusiast", "Front-End Learning", "UI/UX Explorer", "Tech Export", "Problem Solver", "Code Newbie"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing-text");
const nameTypingElement = document.getElementById("name-typing-text");

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

function typeNameEffect() {
    if (!nameTypingElement) {
        return;
    }

    const name = nameTypingElement.textContent;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    nameTypingElement.textContent = "";
    let charIndex = 0;

    function typeNextCharacter() {
        nameTypingElement.textContent = name.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex < name.length) {
            setTimeout(typeNextCharacter, 85);
        }
    }

    typeNextCharacter();
}

function updateDigitalClock() {
    const clockElement = document.getElementById("digital-clock");
    if (!clockElement) {
        return;
    }

    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    clockElement.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    clockElement.dateTime = now.toISOString();
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
    typeNameEffect();
    updateDigitalClock();
    setInterval(updateDigitalClock, 1000);
});