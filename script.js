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

function initializeMemoryGame() {
    const trigger = document.getElementById("memory-game-trigger");
    const modal = document.getElementById("memory-game-modal");
    const closeButton = document.getElementById("memory-game-close");
    const levelLabel = document.getElementById("memory-game-level");
    const statusLabel = document.getElementById("memory-game-status");
    const restartButton = document.getElementById("memory-game-restart");
    const tiles = Array.from(document.querySelectorAll(".memory-tile"));

    if (!trigger || !modal || !closeButton || !levelLabel || !statusLabel || !restartButton || tiles.length !== 4) {
        console.error("Memory Game tidak dapat dimulai: elemen game tidak lengkap.");
        return;
    }

    let level = 1;
    let sequence = [];
    let inputIndex = 0;
    let acceptingInput = false;
    let gameTimers = [];

    function schedule(callback, delay) {
        const timer = window.setTimeout(() => {
            gameTimers = gameTimers.filter((activeTimer) => activeTimer !== timer);
            callback();
        }, delay);
        gameTimers.push(timer);
    }

    function clearGameTimers() {
        gameTimers.forEach((timer) => window.clearTimeout(timer));
        gameTimers = [];
        tiles.forEach((tile) => tile.classList.remove("is-lit"));
    }

    function setInputEnabled(enabled) {
        acceptingInput = enabled;
        tiles.forEach((tile) => {
            tile.disabled = !enabled;
        });
    }

    function playSequence(index = 0) {
        if (index >= sequence.length) {
            schedule(() => {
                setInputEnabled(true);
                statusLabel.textContent = "Giliran Anda. Ulangi urutan kotaknya.";
            }, 250);
            return;
        }

        schedule(() => {
            const tile = tiles[sequence[index]];
            tile.classList.add("is-lit");
            schedule(() => {
                tile.classList.remove("is-lit");
                schedule(() => playSequence(index + 1), 140);
            }, 240);
        }, index === 0 ? 300 : 0);
    }

    function startLevel() {
        clearGameTimers();
        sequence = Array.from({ length: level + 2 }, () => Math.floor(Math.random() * tiles.length));
        inputIndex = 0;
        levelLabel.textContent = `Level: ${level} / 50`;
        statusLabel.textContent = "Perhatikan urutan kotak...";
        restartButton.hidden = true;
        setInputEnabled(false);
        playSequence();
    }

    function endGame(won) {
        setInputEnabled(false);
        if (won) {
            statusLabel.textContent = "Luar biasa! Semua 50 level berhasil diselesaikan.";
            restartButton.textContent = "Main Lagi dari Level 1";
        } else {
            statusLabel.textContent = `Game over di Level ${level}. Coba ingat polanya sekali lagi.`;
            restartButton.textContent = "Ulangi dari Level 1";
        }
        restartButton.hidden = false;
    }

    function handleTileInput(event) {
        if (!acceptingInput) {
            return;
        }

        const selectedTile = Number(event.currentTarget.dataset.tile);
        if (selectedTile !== sequence[inputIndex]) {
            endGame(false);
            return;
        }

        const tile = event.currentTarget;
        tile.classList.add("is-lit");
        schedule(() => tile.classList.remove("is-lit"), 160);
        inputIndex++;

        if (inputIndex === sequence.length) {
            setInputEnabled(false);
            if (level === 50) {
                endGame(true);
                return;
            }

            level++;
            levelLabel.textContent = `Level: ${level} / 50`;
            statusLabel.textContent = "Benar! Bersiap untuk level berikutnya...";
            schedule(startLevel, 700);
        }
    }

    function openGame() {
        const navMenu = document.getElementById("nav-menu");
        const hamburgerButton = document.getElementById("hamburger-btn");
        if (navMenu && hamburgerButton) {
            navMenu.classList.add("hidden");
            navMenu.classList.remove("flex");
            hamburgerButton.setAttribute("aria-expanded", "false");
            hamburgerButton.setAttribute("aria-label", "Buka menu navigasi");
        }

        modal.hidden = false;
        document.body.classList.add("memory-game-open");
        level = 1;
        closeButton.focus();
        startLevel();
    }

    function closeGame() {
        clearGameTimers();
        setInputEnabled(false);
        modal.hidden = true;
        document.body.classList.remove("memory-game-open");
        const hamburgerButton = document.getElementById("hamburger-btn");
        if (hamburgerButton) {
            hamburgerButton.focus();
        }
    }

    trigger.addEventListener("click", openGame);
    closeButton.addEventListener("click", closeGame);
    restartButton.addEventListener("click", () => {
        level = 1;
        startLevel();
    });
    tiles.forEach((tile) => tile.addEventListener("click", handleTileInput));
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeGame();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            closeGame();
        }
    });
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
    initializeMemoryGame();
});