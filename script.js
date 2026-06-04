let rqbtn = document.querySelector(".rqbtn");
let gamemodes = ["flag", "capital", "currency"];
let gm = "";
let quizContainer = document.getElementById("quiz-container");

rqbtn.addEventListener("click", (e) => {
    e.preventDefault();

    let nm = Math.floor(Math.random() * 3);

    gm = gamemodes[nm];

    localStorage.setItem("selectedMode", gm);

    window.location.href = "quiz.html";
});

quizContainer.addEventListener("click", function (event) {

    const clickedCard = event.target.closest(".sec2div");

    if (clickedCard) {

        gm = clickedCard.id;

        localStorage.setItem("selectedMode", gm);

        window.location.href = "quiz.html";
    }
});

const countriesContainer = document.getElementById("countries-container");
const showMoreBtn = document.getElementById("showMoreBtn");
const showLessBtn = document.getElementById("showLessBtn");
const countrySearch = document.getElementById("countrySearch");

let allCountries = [];
let filteredCountries = [];

fetch("https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags")
    .then(res => res.json())
    .then(data => {

        allCountries = data.filter(country => {

            const hasFlag =
                country.flags &&
                country.flags.png &&
                country.flags.png.trim() !== "";

            const hasCapital =
                country.capital &&
                country.capital.length > 0 &&
                country.capital[0];

            const hasCurrency =
                country.currencies &&
                Object.keys(country.currencies).length > 0;

            const excluded = ["Afghanistan"];

            return hasFlag && hasCapital && hasCurrency && !excluded.includes(country.name.common);
        });

        allCountries.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );

        filteredCountries = [...allCountries];

        renderCountries(filteredCountries.slice(0, 6));
    })
    .catch(err => console.log(err));

function renderCountries(countries) {

    countriesContainer.innerHTML = "";

    countries.forEach(country => {

        const currency =
            Object.values(country.currencies)[0]?.name || "N/A";

        countriesContainer.innerHTML += `
            <div class="country-card">

                <img
                    src="${country.flags.png}"
                    alt="${country.name.common}"
                    onerror="this.closest('.country-card').remove()"
                >

                <div class="country-info">

                    <h3>${country.name.common}</h3>

                    <p>
                        <strong>Capital:</strong>
                        ${country.capital[0]}
                    </p>

                    <p>
                        <strong>Currency:</strong>
                        ${currency}
                    </p>

                </div>

            </div>
        `;
    });
}

showMoreBtn.addEventListener("click", () => {

    renderCountries(filteredCountries);

    showMoreBtn.style.display = "none";
    showLessBtn.style.display = "inline-block";
});

showLessBtn.addEventListener("click", () => {

    renderCountries(filteredCountries.slice(0, 6));

    showLessBtn.style.display = "none";
    showMoreBtn.style.display = "inline-block";

    countriesContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

countrySearch.addEventListener("input", (e) => {

    const value = e.target.value.trim().toLowerCase();

    if (value === "") {

        filteredCountries = [...allCountries];

        renderCountries(filteredCountries.slice(0, 6));

        showMoreBtn.style.display = "inline-block";
        showLessBtn.style.display = "none";

        return;
    }

    filteredCountries = allCountries.filter(country => {

        const currency =
            Object.values(country.currencies)[0]?.name?.toLowerCase() || "";

        return (
            country.name.common.toLowerCase().includes(value) ||
            country.capital[0].toLowerCase().includes(value) ||
            currency.includes(value)
        );
    });

    renderCountries(filteredCountries);

    showMoreBtn.style.display = "none";
    showLessBtn.style.display = "none";
});