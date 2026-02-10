// const container = document.querySelector('#container');
// const para = document.createElement('p')
// para.textContent = "Hey I'm red!";
// para.style.color = "red";
// container.appendChild(para);

// const high = document.createElement ("h3");
// high.textContent = "I’m a blue h3!";
// high.style.color = "blue";
// container.appendChild(high);

// const pinkDiv = document.createElement("div");
// pinkDiv.style.border = "1px solid black";
// pinkDiv.style.backgroundColor = "pink";

// const heigh1 = document.createElement ("h1");
// heigh1.textContent = "I'm in a div";
// heigh1.style.color = "black"
// pinkDiv.appendChild(heigh1);

// const par = document.createElement ("p");
// par.textContent = "ME TOO!";
// pinkDiv.appendChild(par);

// container.appendChild(pinkDiv);

// const btn = document.querySelector("#btn");
// btn.addEventListener("click", function(e) {
//     e.target.style.color = "red";
// });

const buttons = document.querySelectorAll("button");
// parent.addEventListener("click", function(e) {
//     e.target.style.color = "red";
// });

buttons.forEach (function(button){
    button.addEventListener("click", function(e){
        e.target.textContent = e.target.id;
    });
});