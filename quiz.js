let flagicon = document.querySelector(".flag-icon");
let flagPlaceHolder = document.querySelector(".flag-placeholder");
let questionh2 = document.querySelector(".questionh2");
let variants = document.querySelectorAll(".option");
let timer = document.querySelector(".timer");
let nextbtn = document.querySelector(".nextbtn");
let questioncount = document.querySelector(".question-count");
let resultcard = document.querySelector(".result-card");
let streaktext = document.querySelector(".fire-icon");
let scoretext = document.querySelector(".score");
let resultscore = document.querySelector(".score-section h1");
let correcttext = document.querySelector(".stat-box .green");
let wrongtext = document.querySelector(".stat-box .red");
let resultstreaktext = document.querySelector(".stat-box .orange");
let playAgainBtn = document.querySelector(".play-btn");
let quizCard = document.querySelector(".quiz-card");
let modeBtn = document.querySelector(".mode-btn");

let totalQuestions = parseInt(localStorage.getItem("quizQuestionCount")) || 10;
let gamemode = localStorage.selectedMode;
let correctname = "";
let t = 10;
let question = 0;
let streak = 0;
let score = 0;
let streaks = [];
let correctAnswersCount = 0;
let timerInterval;
let startTime;
let allQuizCountries = [];

function startTimer() {
    clearInterval(timerInterval);
    t = 10;
    timer.innerHTML = t;
    timerInterval = setInterval(() => {
        if (t > 0) {
            t--;
            timer.innerHTML = t;
        } else {
            clearInterval(timerInterval);
            check("TIMEOUT", null);

            if (question >= totalQuestions) {
                nextbtn.innerHTML = "View Results";
            } else {
                nextbtn.innerHTML = "Next question";
            }
            nextbtn.style.display = "block";
        }
    }, 1000);
}

function quiz(gamemode) {
    if (question >= totalQuestions) {
        quizCard.style.display = "none";
        resultcard.style.display = "block";
        if (streak > 0) streaks.push(streak);
        resultscore.innerHTML = score;
        correcttext.innerHTML = `${correctAnswersCount}/${totalQuestions}`;
        wrongtext.innerHTML = `${totalQuestions - correctAnswersCount}/${totalQuestions}`;
        resultstreaktext.innerHTML = `${streaks.length > 0 ? Math.max(...streaks) : 0}`;
        return;
    }

    if (allQuizCountries.length === 0) {
        fetch("https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP Error: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                allQuizCountries = data.filter(c =>
                    c.name?.common &&
                    c.flags?.png &&
                    c.capital?.length &&
                    c.currencies
                );

                setupQuestion(gamemode);
            })
            .catch(err => {
                console.error("API Error:", err);

                questionh2.innerHTML =
                    "Failed to load country data. Please refresh the page.";
            });
    } else {
        setupQuestion(gamemode);
    }
}

function setupQuestion(gamemode) {
    question++;
    questioncount.innerHTML = `Question ${question} / ${totalQuestions}`;
    startTimer();

    let countries = countrygenerated(allQuizCountries.length);
    let data = allQuizCountries;

    correctname = data[countries[0]].name.common;
    let correctindex = countries[0];
    countries.sort(() => Math.random() - 0.5);

    switch (gamemode) {
        case "flag":
            if (flagPlaceHolder) flagPlaceHolder.style.display = "block";
            questionh2.innerHTML = "Which country does this flag belong to?";
            flagicon.style.backgroundImage = `url(${data[correctindex].flags.png})`;
            break;
        case "capital":
            if (flagPlaceHolder) flagPlaceHolder.style.display = "none";
            questionh2.innerHTML = `Which country is "${data[correctindex].capital[0]}" the capital of?`;
            break;
        case "currency":
            if (flagPlaceHolder) flagPlaceHolder.style.display = "none";
            let currencyObj = Object.values(data[correctindex].currencies)[0];
            let currencyName = currencyObj ? currencyObj.name : "N/A";
            questionh2.innerHTML = `Which country's currency is the "${currencyName}" ?`;
            break;
    }

    variants.forEach((a, i) => {
        a.innerHTML = data[countries[i]].name.common;
        a.style.pointerEvents = "auto";
    });
    startTime = performance.now();
}

function countrygenerated(maxLimit) {
    let country = [];
    while (country.length < 4) {
        const x = Math.floor(Math.random() * maxLimit);
        if (!country.includes(x)) {
            country.push(x);
        }
    }
    return country;
}

variants.forEach(a => {
    a.addEventListener("click", () => {
        check(a.innerHTML, a);

        if (question >= totalQuestions) {
            nextbtn.innerHTML = "View Results";
        } else {
            nextbtn.innerHTML = "Next question";
        }
        nextbtn.style.display = "block";
    });
});

nextbtn.addEventListener("click", () => {
    nextbtn.style.display = "none";
    variants.forEach(a => a.classList.remove("correct", "wrong"));
    quiz(gamemode);
});

function check(choose, element) {
    let endTime = performance.now();
    t = -1;
    clearInterval(timerInterval);

    if (choose === correctname && choose !== "TIMEOUT") {
        let diff = endTime - startTime;
        let responseTime = Math.max(0, ((10000 - diff) / 10)).toFixed();
        score += +responseTime;
        scoretext.innerHTML = `Score ${score}`;
        streak++;
        correctAnswersCount++;
    } else {
        if (streak > 0) {
            streaks.push(streak);
        }
        streak = 0;
    }

    streaktext.innerHTML = `🔥 ×${streak}`;

    variants.forEach(a => {
        a.style.pointerEvents = "none";
        if (a.innerHTML === correctname) {
            a.classList.add("correct");
        } else if (a.innerHTML === choose) {
            a.classList.add("wrong");
        }
    });
}

playAgainBtn.addEventListener("click", () => {
    question = 0;
    score = 0;
    streak = 0;
    correctAnswersCount = 0;
    streaks = [];
    t = 10;
    scoretext.innerHTML = `Score 0`;
    streaktext.innerHTML = `🔥 ×0`;
    questioncount.innerHTML = `Question 1 / ${totalQuestions}`;
    resultcard.style.display = "none";
    quizCard.style.display = "block";
    nextbtn.style.display = "none";
    nextbtn.innerHTML = "Next question";
    variants.forEach(a => {
        a.classList.remove("correct", "wrong");
        a.style.pointerEvents = "auto";
    });
    quiz(gamemode);
});

modeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

quiz(gamemode);