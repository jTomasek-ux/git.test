const hi1 = document.querySelector("#mirror")
const buttons2 = document.querySelectorAll("button")
buttons2.forEach(function(button){
    button.addEventListener("click", function(e){
        hi1.textContent = e.target.textContent
    })
})