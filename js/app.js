const total_cases = document.querySelector('.total-cases .value');
const new_cases = document.querySelector('.total-cases .new-value');
const recovered_cases = document.querySelector('.recovered .value');
const new_recovered_cases = document.querySelector('.recovered .new-value');
const death_cases = document.querySelector('.death-cases .value');
const new_death_cases = document.querySelector('.death-cases .new-value');
const country_name = document.querySelector('.country .name');
const ctx = document.getElementById('axes_linear_chart').getContext('2d');

const base_url = 'https://api.covid19api.com/dayone/country/';


//APP variables
let app_data = [],
    cases_list = [],
    recovered_list = [],
    deaths_list = [],
    dates = [];

// COUNTRY CODE 
const country_code = geoplugin_countryCode();
let user_country;
country_list.forEach(country => {
    if (country_code == country.code) {
        user_country = country.name;
    }
})

function fetchData(country) {
    user_country = country;
    country_name.innerHTML = "Loading...";

    (cases_list = []),
        (recovered_list = []),
        (deaths_list = []),
        (dates = []),
        (formatedDates = []);

    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    const api_fetch = async (country) => {

        const var_url1 = '/status/confirmed/live';
        const var_url2 = '/status/recovered/live';
        const var_url3 = '/status/deaths/live';

        // fetching the total confirmed cases
        const url1 = base_url + country + var_url1;
        await fetch(url1, requestOptions)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                data.forEach((entry) => {
                    dates.push(entry.Date);
                    cases_list.push(entry.Cases);
                });
            })
            .catch((error) => {
                console.log(`error is :- ${error}`);
            })



        // fectching the total recovered cases
        const url2 = base_url + country + var_url2;
        await fetch(url2, requestOptions)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                data.forEach((entry) => {
                    recovered_list.push(entry.Cases);
                });
            })
            .catch((error) => {
                console.log(`error is :- ${error}`);
            })



        // fetching the total cases  
        const url3 = base_url + country + var_url3;
        await fetch(url3, requestOptions)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                data.forEach((entry) => {
                    deaths_list.push(entry.Cases);
                });
            })
            .catch((error) => {
                console.log(`error is :- ${error}`);
            })


        updateUI();


    };

    api_fetch(country);
}

fetchData(user_country);


// updating the UI

function updateUI() {
    updateStats();
    axesLinearChart();
}

function updateStats() {


    const total_case = cases_list[cases_list.length - 1];
    const new_confirmed_cases = total_case - cases_list[cases_list.length - 2];

    const total_recovered = recovered_list[recovered_list.length - 1];
    const new_recovered_cases =
        total_recovered - recovered_list[recovered_list.length - 2];

    const total_deaths = deaths_list[deaths_list.length - 1];
    const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];

    country_name.innerHTML = user_country;

    total_cases.innerHTML = total_case == undefined ? 0 : total_case;
    new_cases.innerHTML = `+${new_confirmed_cases}`;

    recovered_cases.innerHTML = total_recovered == undefined ? 0 : total_recovered;
    new_recovered_cases.innerHTML = `+${new_recovered_cases}`;


    death_cases.innerHTML = total_deaths == undefined ? 0 : total_deaths;
    new_death_cases.innerHTML = `+${new_deaths_cases}`;

}

// update chart

let my_chart;
function axesLinearChart(){
    if(my_chart){
        my_chart.destroy();
    }
    my_chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Cases',
                data: cases_list,
                fill: false,
                borderColor : "#FFF",
                backgroundColor: "#FFF",
                borderWidth : 1
            },{
                label: 'Recovered',
                data: recovered_list,
                fill: false,
                borderColor : "#009688",
                backgroundColor: "#009688",
                borderWidth : 1
            },{
                label: 'Deaths',
                data: deaths_list,
                fill: false,
                borderColor : "#f44336",
                backgroundColor: "#f44336",
                borderWidth : 1
            }],
            labels: dates
        },
        options: {
            responsive: true,
            maintainAspectRatio : false
        }
    });
}