let rqbtn = document.querySelector(".rqbtn")
let gamemodes = ["flag", "capital", "border", "currency"]
let gm = ''
let quizContainer = document.getElementById('quiz-container');

rqbtn.addEventListener("click", (e) => {
    e.preventDefault()
    let nm = Math.floor(Math.random() * 4);
    gm = gamemodes[nm]
    localStorage.setItem("selectedMode", gm);
    window.location.href = "quiz.html";
})

quizContainer.addEventListener('click', function (event) {
    const clickedCard = event.target.closest('.sec2div');
    if (clickedCard) {
        gm = clickedCard.id;
        localStorage.setItem("selectedMode", gm);
        window.location.href = "quiz.html";
    }
});

