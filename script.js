const userCountry = document.getElementById('country');
const button = document.getElementById('submit');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');

async function fetchCountryInfo(countryName) {
    const API_URL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Country not found. Please try again.");
        }
        const data = await response.json();
        showCountry(data[0]);
    } catch (error) {
        console.error("There was a problem fetching the data:", error);
        countryInfo.innerHTML = `<p style="color:red;">${error.message}</p>`; 
    }
}

function showCountry(country) {
    countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <ul>
        <li>Capital: ${country.capital ? country.capital[0] : "N/A"}</li>
        <li>Region: ${country.region}</li> 
        <li>Population: ${country.population.toLocaleString()}</li>
        <img src="${country.flags.png}">
        </ul>
    `;

    if (country.borders) {
        displayBorderingCountries(country.borders);
    } else {
        borderingCountries.innerHTML = "<p>No bordering countries available.</p>";
    }
}

async function displayBorderingCountries(borders) {
    borderingCountries.innerHTML = "<ul><li>Bordering Countries:</li></ul>";

    for (const border of borders) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
            const borderCountry = await response.json();
            const countryData = borderCountry[0];

            borderingCountries.innerHTML += `
            <ul>
                <li>${countryData.name.common}</li>
                <img src="${countryData.flags.png}">
            </ul>
            `;
        } catch (error) {
            console.error("Error fetching bordering country:", error);
        }
    }
}

// Event listener for button click
button.addEventListener("click", function () {
    const countryName = userCountry.value.trim();
    if (countryName) {
        fetchCountryInfo(countryName);
    } else {
        alert("Please enter a country name.");
    }
});
