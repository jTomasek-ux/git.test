let humanScore = 0
let computerScore = 0


function computerChoice() {
    let randomNumber = Math.floor(Math.random() * 3);

    if (randomNumber === 0){
        return("rock")
    }
    if (randomNumber === 1){
        return("paper")
    }
    if (randomNumber === 2){
        return("scissor")
    }
  } 

function verdict (player, computer){
    console.log("Computer chose: " + computer);
    console.log("Player chose: " + player);


    if (player === computer){
        return "Tie  Score :" + humanScore + "-" + computerScore;
    }

    else if (
        (player === "rock" && computer === "scissor") ||
        (player === "paper" && computer === "rock") ||
        ((player === "scissors" || player === "scissor") && computer === "paper")
    ){
            humanScore++;
            return "Win  Score :" + humanScore + "-" + computerScore;
    }
    
    else{
        computerScore++
        return "Lose  Score :" + humanScore + "-" + computerScore;
    }
}

function playGame(){
    for (i = 0; i < 5; i++){
        let humanSelection = prompt("Round " + (i + 1) + ": Rock, Paper, or Scissors?");
        let computerSelection = computerChoice();
        let normalizedSelection = humanSelection.toLowerCase();
        
        verdict(normalizedSelection, computerSelection)
    }
    console.log("-------------------");
    console.log("GAME OVER");
    console.log("Final Score: User " + humanScore + " - CPU " + computerScore);
}

playGame();  