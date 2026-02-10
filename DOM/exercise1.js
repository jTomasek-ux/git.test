const cardContainer = document.querySelector("#card-container")

const div = document.createElement("div")
div.style.backgroundColor = "pink"
div.style.border = "1px solid blue"
div.textContent = "I am div";
div.style.color = "black"

const heading = document.createElement("h3")
heading.textContent = "My Dynamic Card"

const paragraph = document.createElement("p")
paragraph.textContent = "I was created entirely by JavaScript!"

div.append(heading, paragraph)

cardContainer.appendChild(div)

const buttons = document.querySelectorAll("button")
buttons.forEach(function(button){
    button.addEventListener("click", function(e){
        e.target.style.backgroundColor = e.target.id
    })
})