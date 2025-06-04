// Game data from the provided JSON
const gameData = {
  gameWords: {
    english: [
      {"word": "PROSTATE", "hint": "Small gland below the bladder in men", "tip": "Men over 50 should get regular prostate screenings to detect issues early."},
      {"word": "EXERCISE", "hint": "Physical activity for health", "tip": "Aim for 150 minutes of moderate exercise weekly for optimal health."},
      {"word": "WELLNESS", "hint": "Overall state of health and well-being", "tip": "Mental health is just as important as physical health for overall wellness."},
      {"word": "DIABETES", "hint": "Condition affecting blood sugar levels", "tip": "Regular check-ups help prevent and manage diabetes effectively."},
      {"word": "STRENGTH", "hint": "Physical power and muscle capacity", "tip": "Strength training builds muscle mass and bone density as men age."}
    ],
    spanish: [
      {"word": "BIENESTAR", "hint": "Estado de salud física y mental", "tip": "El bienestar incluye salud física, mental y social en equilibrio."},
      {"word": "EJERCICIO", "hint": "Actividad física para la salud", "tip": "30 minutos de ejercicio diario mejoran significativamente la salud masculina."},
      {"word": "GIMNASIO", "hint": "Lugar para hacer ejercicio", "tip": "El entrenamiento regular en gimnasio reduce el riesgo de enfermedades crónicas."},
      {"word": "NUTRICION", "hint": "Alimentación saludable", "tip": "Una dieta balanceada es clave para mantener la salud masculina óptima."},
      {"word": "COLESTEROL", "hint": "Sustancia en la sangre que afecta el corazón", "tip": "Los niveles altos de colesterol aumentan significativamente el riesgo cardíaco."}
    ]
  },
  gameSettings: {
    totalRounds: 10,
    maxWrongGuesses: 7,
    languages: ["english", "spanish"],
    theme: "Men's Health June Wellness"
  }
};

// Game state
let currentRound = 1;
let score = 0;
let currentWord = "";
let currentHint = "";
let currentTip = "";
let currentLanguage = "";
let guessedLetters = [];
let wrongGuesses = [];
let gameResults = [];

// DOM elements
const currentRoundEl = document.getElementById('currentRound');
const scoreEl = document.getElementById('score');
const currentLanguageEl = document.getElementById('currentLanguage');
const hintTextEl = document.getElementById('hintText');
const wordDisplayEl = document.getElementById('wordDisplay');
const wrongLettersEl = document.getElementById('wrongLetters');
const keyboardEl = document.getElementById('keyboard');
const gameMessageEl = document.getElementById('gameMessage');
const messageTitleEl = document.getElementById('messageTitle');
const messageTextEl = document.getElementById('messageText');
const tipTextEl = document.getElementById('tipText');
const nextButtonEl = document.getElementById('nextButton');
const finalScoreEl = document.getElementById('finalScore');
const finalScoreValueEl = document.getElementById('finalScoreValue');
const scoreBreakdownEl = document.getElementById('scoreBreakdown');

// Initialize game
function initGame() {
  createKeyboard();
  startRound();
}

// Create virtual keyboard
function createKeyboard() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  keyboardEl.innerHTML = '';
  
  letters.forEach(letter => {
    const button = document.createElement('button');
    button.className = 'key';
    button.textContent = letter;
    button.onclick = () => guessLetter(letter);
    button.id = `key-${letter}`;
    keyboardEl.appendChild(button);
  });
}

// Start a new round
function startRound() {
  // Reset round state
  guessedLetters = [];
  wrongGuesses = [];
  
  // Determine language (alternating: odd rounds = English, even rounds = Spanish)
  currentLanguage = currentRound % 2 === 1 ? 'english' : 'spanish';
  
  // Get word for current round
  const wordIndex = Math.floor((currentRound - 1) / 2);
  const wordData = gameData.gameWords[currentLanguage][wordIndex];
  currentWord = wordData.word;
  currentHint = wordData.hint;
  currentTip = wordData.tip;
  
  // Update UI
  updateRoundInfo();
  updateWordDisplay();
  updateWrongLetters();
  resetKeyboard();
  resetHangman();
}

// Update round information
function updateRoundInfo() {
  currentRoundEl.textContent = currentRound;
  scoreEl.textContent = score;
  currentLanguageEl.textContent = currentLanguage === 'english' ? 'English' : 'Español';
  hintTextEl.textContent = currentHint;
}

// Update word display with blanks and revealed letters
function updateWordDisplay() {
  wordDisplayEl.innerHTML = '';
  
  for (let letter of currentWord) {
    const letterSlot = document.createElement('div');
    letterSlot.className = 'letter-slot';
    
    if (guessedLetters.includes(letter)) {
      letterSlot.textContent = letter;
      letterSlot.classList.add('revealed');
    }
    
    wordDisplayEl.appendChild(letterSlot);
  }
}

// Update wrong letters display
function updateWrongLetters() {
  wrongLettersEl.textContent = wrongGuesses.join(' ');
  if (wrongGuesses.length > 0) {
    document.querySelector('.wrong-letters').classList.add('shake');
    setTimeout(() => {
      document.querySelector('.wrong-letters').classList.remove('shake');
    }, 500);
  }
}

// Reset keyboard state
function resetKeyboard() {
  const keys = document.querySelectorAll('.key');
  keys.forEach(key => {
    key.disabled = false;
    key.className = 'key';
  });
}

// Reset hangman drawing
function resetHangman() {
  const hangmanParts = document.querySelectorAll('.hangman-part');
  hangmanParts.forEach((part, index) => {
    if (index === 0) return; // Keep gallows visible
    part.classList.remove('visible');
  });
}

// Handle letter guess
function guessLetter(letter) {
  // Disable the key
  const keyEl = document.getElementById(`key-${letter}`);
  keyEl.disabled = true;
  
  if (currentWord.includes(letter)) {
    // Correct guess
    guessedLetters.push(letter);
    keyEl.classList.add('correct');
    updateWordDisplay();
    
    // Check if word is complete
    if (isWordComplete()) {
      setTimeout(() => endRound(true), 500);
    }
  } else {
    // Wrong guess
    wrongGuesses.push(letter);
    keyEl.classList.add('wrong');
    updateWrongLetters();
    updateHangman();
    
    // Check if game is lost
    if (wrongGuesses.length >= gameData.gameSettings.maxWrongGuesses) {
      setTimeout(() => endRound(false), 500);
    }
  }
}

// Check if word is completely guessed
function isWordComplete() {
  return currentWord.split('').every(letter => guessedLetters.includes(letter));
}

// Update hangman drawing
function updateHangman() {
  const partIndex = wrongGuesses.length;
  if (partIndex <= gameData.gameSettings.maxWrongGuesses) {
    const part = document.querySelector(`.hangman-part[data-part="${partIndex}"]`);
    if (part) {
      part.classList.add('visible');
    }
  }
}

// End current round
function endRound(won) {
  // Record result
  gameResults.push({
    round: currentRound,
    word: currentWord,
    language: currentLanguage,
    won: won
  });
  
  if (won) {
    score++;
    messageTitleEl.textContent = currentLanguage === 'english' ? 'Excellent!' : '¡Excelente!';
    messageTextEl.textContent = currentLanguage === 'english' ? 
      `You guessed "${currentWord}" correctly!` : 
      `¡Adivinaste "${currentWord}" correctamente!`;
  } else {
    messageTitleEl.textContent = currentLanguage === 'english' ? 'Game Over' : 'Juego Terminado';
    messageTextEl.textContent = currentLanguage === 'english' ? 
      `The word was "${currentWord}"` : 
      `La palabra era "${currentWord}"`;
  }
  
  // Show health tip
  tipTextEl.textContent = currentTip;
  
  // Show message
  gameMessageEl.classList.add('show');
  
  // Update next button text
  if (currentRound >= gameData.gameSettings.totalRounds) {
    nextButtonEl.textContent = currentLanguage === 'english' ? 'View Final Score' : 'Ver Puntuación Final';
  } else {
    nextButtonEl.textContent = currentLanguage === 'english' ? 'Next Round' : 'Siguiente Ronda';
  }
}

// Proceed to next round
function nextRound() {
  gameMessageEl.classList.remove('show');
  
  if (currentRound >= gameData.gameSettings.totalRounds) {
    showFinalScore();
  } else {
    currentRound++;
    startRound();
  }
}

// Show final score screen
function showFinalScore() {
  finalScoreValueEl.textContent = score;
  
  // Create score breakdown
  scoreBreakdownEl.innerHTML = '<h3>Round Results:</h3>';
  
  gameResults.forEach(result => {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'round-result';
    
    resultDiv.innerHTML = `
      <span class="round-number">Round ${result.round}</span>
      <span class="round-word">${result.word}</span>
      <span class="round-status ${result.won ? 'win' : 'lose'}">${result.won ? 'WIN' : 'LOSE'}</span>
    `;
    
    scoreBreakdownEl.appendChild(resultDiv);
  });
  
  finalScoreEl.classList.add('show');
}

// Restart game
function restartGame() {
  // Reset game state
  currentRound = 1;
  score = 0;
  gameResults = [];
  
  // Hide final score screen
  finalScoreEl.classList.remove('show');
  
  // Start new game
  startRound();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Keyboard support
document.addEventListener('keydown', (event) => {
  const letter = event.key.toUpperCase();
  if (letter >= 'A' && letter <= 'Z') {
    const keyEl = document.getElementById(`key-${letter}`);
    if (keyEl && !keyEl.disabled) {
      guessLetter(letter);
    }
  }
});

// Prevent default behavior for space and enter keys to avoid page scrolling
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault();
  }
});