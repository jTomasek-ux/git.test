let humanScore = document.createElement("h3")
let computerScore = document.createElement("h3")
const container = document.querySelector(".container")
const buttons = document.querySelectorAll("button")


container.append(humanScore, computerScore)

humanScore = 0
computerScore = 0


function computerSelection() {
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
let humanSelection = 0

function playGame(){
    buttons.forEach(function(button){
        button.addEventListener("click", function(e){
            e.target.button.style.color = "red"
            e.target.humanSelection.textContent = button.textContent

        })
    });
        
        verdict(humanSelection, computerSelection)
}

playGame();  