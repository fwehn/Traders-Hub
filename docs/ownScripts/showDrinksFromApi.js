// const apiString = "http://localhost:3000/drinks";
const apiString = "http://chicoree-chantal.traders-hub.de/drinks";

function getDates(){
    //Ladder
    fetch(apiString + '/ladder')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let ladder = '<table>';

            for (let i = 0; i<10; i++){
                if (data[i] !== undefined){
                    let nicknameAddon = "";
                    if (data[i].nickname !== "" && data[i].nickname !== null && data[i].nickname !== undefined){
                        nicknameAddon = data[i].nickname + " | ";
                    }

                    ladder = ladder + '<tr class="ladderPos' + Math.min(i, 3) + '"><th>' + (i+1) + '. ' + nicknameAddon + data[i].username + '</th><th>' + data[i].totalCount + '</th><th>' + data[i].totalAlcohol.toFixed(3) + '</th></tr>';
                }else{
                    ladder = ladder + '<tr class="ladderPos' + Math.min(i, 3) + '"><th>Ausstehend</th><th>Ausstehend</th></tr>';
                }
            }
            document.getElementById("ladder").innerHTML = ladder + '</table>';
        }).catch(() => document.getElementById("list").innerHTML = "Oha! Das ist aber nicht so gut gelaufen!");


    //Buttons
    fetch(apiString)
        .then(response => response.json())
        .then(data => {
            let listOfDates = '<section class="container"><section class="dateSection">';
            for (let i in data){
                let date = data[i];
                let currentDate = date.date.split("T")[0].toString().split("-");
                listOfDates = listOfDates + '<button class="dateButton" onclick="detailsOf(&quot;' + date.date.toString() + '&quot;)"><b>' + currentDate[2].split(" ")[0] + ' ' + currentDate[1] + ' ' + currentDate[0] + '</button><br><br>';
            }
            document.getElementById("list").innerHTML = listOfDates + '</section></section>';
        }).catch(() => document.getElementById("list").innerHTML = "Oha! Das ist aber nicht so gut gelaufen!");
}

//Details
function detailsOf(dateString){
    let detailApiString = apiString + '/d/' + dateString;
    fetch(detailApiString)
        .then(response => response.json())
        .then(data => {
            let bestName;
            if (data[0].person.nickname === "" || data[0].person.nickname === null){
                bestName = data[0].person.username;
            }else{
                bestName = data[0].person.nickname + " | " + data[0].person.username;
            }

            let listOfPersons = '';
            listOfPersons = listOfPersons + '<button onclick="getDates()">Zur&uuml;ck zur &Uuml;bersicht</button><br><br>';
            listOfPersons = listOfPersons + 'Mitarbeiter/-in dieses Tages ist: <b>' + bestName + '</b> mit <b>' + data[0].alcoholAmount.toFixed(3) + '</b> l Alcohol! <br><br><br>';
            listOfPersons = listOfPersons + '<section class="wholeTable"><table class="tableOfHeaders"><tr><th>Name</th><th>Alkoholmenge in l</th><th>Detail</th></tr></table><section class="sectionForTable"><table class="tableOfPersons">';



            for (let i in data) {

                let person = data[i].person;
                let drinks = data[i].drinks;
                let drinksOfPerson = "";
                for (let j in drinks) {
                    let drink = drinks[j].split("|");
                    drinksOfPerson = drinksOfPerson + `${drink[1]}l ${drink[2]}, `;
                }


                let nicknameAddon = "";
                if (person.nickname !== "" && person.nickname !== null && person.nickname !== undefined) {
                    nicknameAddon = person.nickname + " | ";
                }
                listOfPersons = listOfPersons + '<tr class="tableRowOfPersons"><th>' + nicknameAddon + person.username + '</th><th>' + data[i].alcoholAmount.toFixed(3) + '</th><th>' + drinksOfPerson.slice(0, -2) + '</th></tr>';
            }
            listOfPersons = listOfPersons + '</table></section></section>';
            // listOfPersons = listOfPersons + '<button onclick="getDates()">Zur&uuml;ck zur &Uuml;bersicht</button><br><br>';
            document.getElementById("list").innerHTML = listOfPersons;
        }).catch(() => document.getElementById("list").innerHTML = "Oha! Das ist aber nicht so gut gelaufen!");
}
