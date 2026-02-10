const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const roundResultEl = document.getElementById("round-result");
const lastRoundEl = document.getElementById("last-round");
const resetButton = document.getElementById("reset");
const choiceButtons = document.querySelectorAll(".choice");

let playerScore = 0;
let computerScore = 0;
const WINNING_SCORE = 5;

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function playRound(playerSelection, computerSelection) {
  if (playerSelection === computerSelection) {
    return "draw";
  }

  const winsAgainst = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };

  return winsAgainst[playerSelection] === computerSelection ? "win" : "lose";
}

function updateScores(result) {
  if (result === "win") {
    playerScore += 1;
  } else if (result === "lose") {
    computerScore += 1;
  }

  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

function setRoundMessage(result, playerChoice, computerChoice) {
  roundResultEl.classList.remove("win", "lose", "draw");

  if (result === "win") {
    roundResultEl.textContent = "You win this round!";
    roundResultEl.classList.add("win");
  } else if (result === "lose") {
    roundResultEl.textContent = "You lose this round.";
    roundResultEl.classList.add("lose");
  } else {
    roundResultEl.textContent = "It's a draw.";
    roundResultEl.classList.add("draw");
  }

  lastRoundEl.textContent = `You chose ${playerChoice}, computer chose ${computerChoice}.`;
}

function checkForGameOver() {
  if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
    const playerWon = playerScore > computerScore;

    roundResultEl.textContent = playerWon
      ? "You won the game! 🎉"
      : "The computer won the game. 💻";
    roundResultEl.classList.remove("draw");
    roundResultEl.classList.add(playerWon ? "win" : "lose");

    // Disable choices when game is over
    choiceButtons.forEach((btn) => {
      btn.disabled = true;
      btn.style.opacity = "0.5";
      btn.style.cursor = "default";
    });

    lastRoundEl.textContent = "Press Reset Game to play again.";
  }
}

function handleChoiceClick(event) {
  if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
    return;
  }

  const playerChoice = event.currentTarget.dataset.choice;
  const computerChoice = getComputerChoice();
  const result = playRound(playerChoice, computerChoice);

  updateScores(result);
  setRoundMessage(result, playerChoice, computerChoice);
  checkForGameOver();
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  playerScoreEl.textContent = "0";
  computerScoreEl.textContent = "0";

  roundResultEl.textContent = "Make your move!";
  roundResultEl.classList.remove("win", "lose", "draw");
  lastRoundEl.textContent = "";

  choiceButtons.forEach((btn) => {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });
}

choiceButtons.forEach((button) => {
  button.addEventListener("click", handleChoiceClick);
});

resetButton.addEventListener("click", resetGame);

