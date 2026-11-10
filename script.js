
/* ==============================
   POKEMON EXPLORER
   Powered by PokéAPI
============================== */


/* ==============================
   HTML ELEMENTS
============================== */

const searchForm = document.getElementById("searchForm");
const pokemonInput = document.getElementById("pokemonInput");
const randomButton = document.getElementById("randomButton");

const pokemonDisplay = document.getElementById("pokemonDisplay");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const pokemonName = document.getElementById("pokemonName");
const pokemonId = document.getElementById("pokemonId");
const pokemonImage = document.getElementById("pokemonImage");
const pokemonTypes = document.getElementById("pokemonTypes");
const pokemonHeight = document.getElementById("pokemonHeight");
const pokemonWeight = document.getElementById("pokemonWeight");
const pokemonAbilities = document.getElementById("pokemonAbilities");
const pokemonStats = document.getElementById("pokemonStats");

const cryButton = document.getElementById("cryButton");


/* ==============================
   TYPE COLOURS
============================== */

const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
};


/* ==============================
   SEARCH EVENT
============================== */

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const searchValue = pokemonInput.value.trim().toLowerCase();

    if (searchValue === "") {
        errorMessage.textContent = "Please enter a Pokémon name or number!";
        errorMessage.classList.remove("hidden");
        return;
    }

    getPokemon(searchValue);

});


/* ==============================
   RANDOM POKEMON
============================== */

randomButton.addEventListener("click", function() {

    // Generate a random Pokémon ID (1-1025)
    const randomId = Math.floor(Math.random() * 1025) + 1;

    pokemonInput.value = "";

    getPokemon(randomId);

});


/* ==============================
   FETCH POKEMON DATA
============================== */

async function getPokemon(searchValue) {

    // Show loading animation
    loading.classList.remove("hidden");

    // Hide previous results and errors
    pokemonDisplay.classList.add("hidden");
    errorMessage.classList.add("hidden");

    try {

        // Retrieve live data from PokéAPI
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(searchValue)}`
        );

        // Check whether the request was successful
        if (!response.ok) {
            throw new Error("Pokémon not found");
        }

        // Convert the response into JSON
        const data = await response.json();

        // Display the retrieved Pokémon
        displayPokemon(data);

    }

    catch (error) {

        console.error("API Error:", error);

        errorMessage.textContent =
            "Pokémon not found! Please check your spelling or try another number.";

        errorMessage.classList.remove("hidden");

    }

    finally {

        // Hide loading animation
        loading.classList.add("hidden");

    }

}


/* ==============================
   DISPLAY POKEMON INFORMATION
============================== */

function displayPokemon(data) {

    // POKEMON NAME
    pokemonName.textContent = data.name.toUpperCase();


    // POKEMON ID
    pokemonId.textContent =
        "#" + String(data.id).padStart(4, "0");


    // POKEMON IMAGE
    pokemonImage.src =
        data.sprites.other["official-artwork"].front_default ||
        data.sprites.front_default;

    pokemonImage.alt = data.name;


    // POKEMON TYPES
    pokemonTypes.innerHTML = "";

    data.types.forEach(function(typeInfo) {

        const typeName = typeInfo.type.name;

        const typeBadge = document.createElement("span");

        typeBadge.classList.add("type-badge");

        typeBadge.textContent = typeName;

        pokemonTypes.appendChild(typeBadge);

    });


    // HEIGHT
    // API measures height in decimetres
    pokemonHeight.textContent =
        (data.height / 10).toFixed(1) + " m";


    // WEIGHT
    // API measures weight in hectograms
    pokemonWeight.textContent =
        (data.weight / 10).toFixed(1) + " kg";


    // ABILITIES
    pokemonAbilities.innerHTML = "";

    data.abilities.forEach(function(abilityInfo) {

        const abilityBadge = document.createElement("span");

        abilityBadge.classList.add("ability-badge");

        abilityBadge.textContent =
            abilityInfo.ability.name.replace("-", " ");

        pokemonAbilities.appendChild(abilityBadge);

    });


    // BASE STATS
    pokemonStats.innerHTML = "";

    data.stats.forEach(function(statInfo) {

        const statName = statInfo.stat.name;

        const statValue = statInfo.base_stat;

        // Create stat row
        const statRow = document.createElement("div");

        statRow.classList.add("stat-row");

        // Format stat names
        const formattedName = statName
            .replace("-", " ")
            .replace("special attack", "sp. attack")
            .replace("special defense", "sp. defense");

        // Create stat HTML
        statRow.innerHTML = `
            <span class="stat-name">
                ${formattedName.toUpperCase()}
            </span>

            <div class="stat-bar">
                <div class="stat-fill"></div>
            </div>

            <span class="stat-value">${statValue}</span>
        `;

        pokemonStats.appendChild(statRow);

        // Animate the stat bar after it appears
        const statFill = statRow.querySelector(".stat-fill");

        requestAnimationFrame(function() {
            statFill.style.width =
                Math.min((statValue / 255) * 100, 100) + "%";
        });

    });


    // CHANGE WEBSITE THEME BASED ON POKEMON TYPE
    updateTheme(data.types[0].type.name);


    // SHOW POKEMON DISPLAY
    pokemonDisplay.classList.remove("hidden");


    // STORE POKEMON CRY
    const cryUrl = data.cries?.latest || data.cries?.legacy;

    if (cryUrl) {

        cryButton.dataset.cry = cryUrl;
        cryButton.disabled = false;
        cryButton.textContent = "♫ Play Pokémon Cry";

    } else {

        delete cryButton.dataset.cry;
        cryButton.disabled = true;
        cryButton.textContent = "Cry unavailable";

    }

}


/* ==============================
   DYNAMIC WEBSITE THEMES
============================== */

function updateTheme(type) {

    const color = typeColors[type] || "#E9A8C2";

    // Update CSS variables
    document.documentElement.style.setProperty(
        "--theme-color",
        color
    );

    document.documentElement.style.setProperty(
        "--theme-light",
        color + "22"
    );

    document.documentElement.style.setProperty(
        "--primary-dark",
        color
    );

    // Change type badge colours
    document.querySelectorAll(".type-badge").forEach(function(badge) {
        badge.style.backgroundColor = color;
    });

}


/* ==============================
   POKEMON CRY SOUND
============================== */

let currentAudio = null;

cryButton.addEventListener("click", function() {

    const cryUrl = cryButton.dataset.cry;

    if (!cryUrl) {
        return;
    }

    // Stop the previous sound if it is playing
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // Create new audio from the API
    currentAudio = new Audio(cryUrl);

    currentAudio.play().catch(function(error) {
        console.error("Unable to play Pokémon cry:", error);
    });

});