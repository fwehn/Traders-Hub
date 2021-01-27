const apiString = "http://chicoree-chantal.traders-hub.de/drinks";
let dates = [];

function getDates(){
    fetch(apiString)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let listOfDates = "";
            for (let i in data){
                dates[i] = data[i];
                let currentDate = dates[i].split("T")[0].toString().split("-");
                listOfDates = listOfDates + '<button onclick="detailsOf(&quot;' + dates[i].toString() + '&quot;)">' + currentDate[2] + " " + currentDate[1] + " " + currentDate[0] + '</button><br><br>';
            }
            document.getElementById("list").innerHTML = listOfDates;
        }).catch(() => document.getElementById("list").innerHTML = "Oha! Das ist aber nicht so gut gelaufen!");
}

function detailsOf(dateString){
    // console.log(dateString);
    let detailApiString = apiString + '/d/' + dateString;
    fetch(detailApiString)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let listOfPersons = '<button onclick="getDates()">Zur&uuml;ck zur &Uuml;bersicht</button><br><br>'

            listOfPersons = listOfPersons + 'Mitarbeiter/-in dieses Tages ist: ' + data.dailyBest.name + ' mit ' + data.dailyBest.daily + ' Drink(s)! <br><br><br>';
            listOfPersons = listOfPersons + '<table class="tableOfPersons"><tr><th>Name</th><th>Anzahl</th><th>Detail</th></tr>';


            let persons = data.persons;
            for (let i in persons){
                let drinks = persons[i].drinks;
                let drinksOfPerson = "";
                for (let j in drinks){
                    drinksOfPerson = drinksOfPerson + drinks[j].slice(0, -1) + ", ";
                }
                listOfPersons = listOfPersons + '<tr class="tableRowOfPersons"><th>' + persons[i].name + '</th><th>' + persons[i].daily + '</th><th>' + drinksOfPerson.slice(0, -2) + '</th></tr>';
            }
            document.getElementById("list").innerHTML = listOfPersons + '</table>';
        }).catch(() => document.getElementById("list").innerHTML = "Oha! Das ist aber nicht so gut gelaufen!");
}