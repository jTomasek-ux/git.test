let humanScore = document.createElement("h3")
let computerScore = document.createElement("h3")
let rozsudek = document.createElement("h3")
const container = document.querySelector(".container")
const buttons = document.querySelectorAll("button")


container.append(rozsudek, humanScore, computerScore)
rozsudek.textContent = "remíza"
humanScore.textContent = "0"
computerScore.textContent = "0"





function playGame(){

    function getComputerSelection() {
    let randomNumber = Math.floor(Math.random() * 3);

    if (randomNumber === 0){
        return "Rock";
    }
    if (randomNumber === 1){
        return "Paper";
    }
    if (randomNumber === 2){
        return "S   cissor";
    }
    } 

    buttons.forEach(function(button){
        button.addEventListener("click", function(e){
            const computerSelection = getComputerSelection();
            humanSelection = button.id
            console.log(humanSelection)
            console.log(computerSelection)
        })
    });


   function verdict (humanSelection, computerSelection){

    if (humanSelection === computerSelection){
        rozsudek.textContent = "Remíza";
    }

    else if (
        (humanSelection === "Rock" && computerSelection === "scissor") ||
        (humanSelection === "Paper" && computerSelection === "rock") ||
        ((humanSelection === "Scissor" || humanSelection === "scissor") && computerSelection === "paper")
    ){
            humanScore++;
            return "Win  Score :" + humanScore + "-" + computerScore;
    }
    
    else{
        computerScore++
        return "Lose  Score :" + humanScore + "-" + computerScore;
    }
}
     
}

let humanSelection = 0

playGame();