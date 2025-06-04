// Game data with updated challenging vocabulary
const gameData = {
  rounds: [
    {
      round: 1,
      language: "English",
      word: "PROSTATE",
      hint: "A gland that produces fluid for semen and is important for male reproductive health",
      tip: "Regular prostate screenings are recommended for men over 50, or earlier if there's family history of prostate cancer."
    },
    {
      round: 2,
      language: "Spanish", 
      word: "BIENESTAR",
      hint: "Estado de satisfacción física, mental y social completa",
      tip: "El bienestar masculino incluye ejercicio regular, alimentación balanceada y chequeos médicos preventivos."
    },
    {
      round: 3,
      language: "English",
      word: "AZOOSPERMIA", 
      hint: "The absence of sperm in the semen, a male fertility condition",
      tip: "Men experiencing fertility issues should consult a urologist for proper evaluation and treatment options."
    },
    {
      round: 4,
      language: "Spanish",
      word: "HIPOGONADISMO",
      hint: "Deficiencia en la producción de hormonas sexuales masculinas", 
      tip: "Los niveles bajos de testosterona pueden afectar la energía, el estado de ánimo y la salud ósea."
    },
    {
      round: 5,
      language: "English",
      word: "CRYPTORCHIDISM",
      hint: "A condition where one or both testes fail to descend into the scrotum",
      tip: "Early detection and treatment of undescended testes is important to prevent fertility complications."
    },
    {
      round: 6,
      language: "Spanish", 
      word: "CRIPTORQUIDIA",
      hint: "Condición donde los testículos no descienden al escroto durante el desarrollo",
      tip: "Esta condición debe tratarse antes de los 2 años para prevenir problemas de fertilidad futuros."
    },
    {
      round: 7,
      language: "English",
      word: "HYPOGONADISM",
      hint: "A condition where the body produces insufficient sex hormones", 
      tip: "Symptoms include fatigue, decreased muscle mass, and mood changes - treatable with medical supervision."
    },
    {
      round: 8,
      language: "Spanish",
      word: "ESPERMATOGENESIS", 
      hint: "El proceso de formación y desarrollo de los espermatozoides",
      tip: "Este proceso puede verse afectado por el estrés, la mala alimentación y el sedentarismo."
    },
    {
      round: 9,
      language: "English",
      word: "STRENGTH",
      hint: "Physical power and endurance, crucial for healthy aging in men",
      tip: "Strength training helps maintain muscle mass and bone density as men age, reducing injury risk."
    },
    {
      round: 10,
      language: "Spanish",
      word: "COLESTEROL", 
      hint: "Sustancia grasa que en exceso puede causar problemas cardiovasculares",
      tip: "Mantener niveles saludables de colesterol previene enfermedades cardíacas, la principal causa de muerte en hombres."
    }
  ]
};

// Game state
let currentRound = 0;
let score = 0;
let wrongGuesses = 0;
let guessedLetters = [];
let currentWord = '';
let revealedLetters = [];
let roundResults = [];

// DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const roundCompleteScreen = document.getElementById('round-complete-screen');
const gameOverScreen = document.getElementById('game-over-screen');

// Game elements
const roundTitle = document.getElementById('round-title');
const scoreDisplay = document.getElementById('score-display');
const roundProgress = document.getElementById('round-progress');
const wordHint = document.getElementById('word-hint');
const wordDisplay = document.getElementById('word-display');
const lettersGrid = document.getElementById('letters-grid');
const wrongCount = document.getElementById('wrong-count');
const hangmanParts = document.querySelectorAll('.hangman-part');

// Round complete elements
const roundResult = document.getElementById('round-result');
const completedWord = document.getElementById('completed-word');
const healthTipText = document.getElementById('health-tip-text');
const nextRoundBtn = document.getElementById('next-round-btn');

// Game over elements
const finalScore = document.getElementById('final-score');
const roundsSummary = document.getElementById('rounds-summary');

// Start the game
function startGame() {
  currentRound = 0;
  score = 0;
  roundResults = [];
  
  welcomeScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  gameScreen.classList.add('screen-transition');
  
  startRound();
}

// Start a new round
function startRound() {
  const round = gameData.rounds[currentRound];
  currentWord = round.word;
  wrongGuesses = 0;
  guessedLetters = [];
  revealedLetters = new Array(currentWord.length).fill(false);
  
  // Update UI
  roundTitle.textContent = `Round ${round.round} - ${round.language}`;
  scoreDisplay.textContent = `Score: ${score}/${currentRound}`;
  roundProgress.textContent = `${round.round}/10`;
  wordHint.textContent = round.hint;
  wrongCount.textContent = '0';
  
  // Reset hangman drawing
  hangmanParts.forEach(part => part.classList.remove('visible'));
  
  // Create word display
  createWordDisplay();
  
  // Create letters grid
  createLettersGrid(round.language);
}

// Create word display with blanks
function createWordDisplay() {
  wordDisplay.innerHTML = '';
  
  for (let i = 0; i < currentWord.length; i++) {
    const letterSlot = document.createElement('div');
    letterSlot.className = 'letter-slot';
    letterSlot.id = `letter-${i}`;
    
    if (currentWord[i] === ' ') {
      letterSlot.style.border = 'none';
      letterSlot.style.width = '20px';
    }
    
    wordDisplay.appendChild(letterSlot);
  }
}

// Create letters grid based on language
function createLettersGrid(language) {
  lettersGrid.innerHTML = '';
  
  let letters;
  if (language === 'Spanish') {
    letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  } else {
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }
  
  letters.forEach(letter => {
    const letterBtn = document.createElement('button');
    letterBtn.className = 'letter-btn';
    letterBtn.textContent = letter;
    letterBtn.onclick = () => guessLetter(letter);
    lettersGrid.appendChild(letterBtn);
  });
}

// Handle letter guess
function guessLetter(letter) {
  if (guessedLetters.includes(letter)) return;
  
  guessedLetters.push(letter);
  const letterBtn = event.target;
  letterBtn.disabled = true;
  
  if (currentWord.includes(letter)) {
    // Correct guess
    letterBtn.classList.add('correct');
    
    // Reveal letters
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === letter) {
        revealedLetters[i] = true;
        const letterSlot = document.getElementById(`letter-${i}`);
        letterSlot.textContent = letter;
        letterSlot.classList.add('revealed');
      }
    }
    
    // Check if word is complete
    if (revealedLetters.every((revealed, index) => revealed || currentWord[index] === ' ')) {
      roundComplete(true);
    }
  } else {
    // Wrong guess
    letterBtn.classList.add('incorrect');
    wrongGuesses++;
    wrongCount.textContent = wrongGuesses;
    
    // Show hangman part
    if (wrongGuesses <= hangmanParts.length) {
      hangmanParts[wrongGuesses - 1].classList.add('visible');
    }
    
    // Check if game over
    if (wrongGuesses >= 6) {
      roundComplete(false);
    }
  }
}

// Handle round completion
function roundComplete(success) {
  const round = gameData.rounds[currentRound];
  
  if (success) {
    score++;
    roundResult.textContent = 'Round Complete! 🎉';
    roundResult.style.color = 'var(--color-success)';
  } else {
    roundResult.textContent = 'Round Failed 😞';
    roundResult.style.color = 'var(--color-error)';
    
    // Reveal the word
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] !== ' ') {
        const letterSlot = document.getElementById(`letter-${i}`);
        letterSlot.textContent = currentWord[i];
        letterSlot.style.color = 'var(--color-error)';
      }
    }
  }
  
  // Store round result
  roundResults.push({
    round: round.round,
    word: round.word,
    language: round.language,
    success: success
  });
  
  completedWord.textContent = `"${round.word}"`;
  healthTipText.textContent = round.tip;
  
  // Update next round button
  if (currentRound === gameData.rounds.length - 1) {
    nextRoundBtn.textContent = 'View Results';
    nextRoundBtn.onclick = showGameOver;
  } else {
    nextRoundBtn.textContent = 'Next Round';
    nextRoundBtn.onclick = nextRound;
  }
  
  // Show round complete screen
  setTimeout(() => {
    gameScreen.classList.add('hidden');
    roundCompleteScreen.classList.remove('hidden');
    roundCompleteScreen.classList.add('screen-transition');
  }, 1000);
}

// Move to next round
function nextRound() {
  currentRound++;
  
  roundCompleteScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  gameScreen.classList.add('screen-transition');
  
  startRound();
}

// Show game over screen
function showGameOver() {
  const percentage = Math.round((score / gameData.rounds.length) * 100);
  finalScore.textContent = `Final Score: ${score}/${gameData.rounds.length} (${percentage}%)`;
  
  // Create rounds summary
  roundsSummary.innerHTML = '';
  roundResults.forEach(result => {
    const item = document.createElement('div');
    item.className = `round-summary-item ${result.success ? 'success' : 'failure'}`;
    
    item.innerHTML = `
      <span class="round-info">Round ${result.round} (${result.language}): ${result.word}</span>
      <span class="result">${result.success ? '✓' : '✗'}</span>
    `;
    
    roundsSummary.appendChild(item);
  });
  
  roundCompleteScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  gameOverScreen.classList.add('screen-transition');
}

// Restart the game
function restartGame() {
  // Reset all screens
  gameOverScreen.classList.add('hidden');
  roundCompleteScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
  welcomeScreen.classList.add('screen-transition');
  
  // Reset game state
  currentRound = 0;
  score = 0;
  wrongGuesses = 0;
  guessedLetters = [];
  currentWord = '';
  revealedLetters = [];
  roundResults = [];
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners and initialize any necessary elements
  console.log('Men\'s Health Hangman game loaded successfully!');
});