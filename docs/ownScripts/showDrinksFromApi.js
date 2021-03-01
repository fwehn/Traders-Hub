const apiString = "http://chicoree-chantal.traders-hub.de/drinks";
// const apiString = "http://localhost:2712/drinks";

function getDates(){

    //Ladder
    fetch(apiString + '/ladder')
        .then(response => response.json())
        .then(data => {
            let ladder = '<table>';
            // console.log(data);
            let newArray = new Array(10);

            for (let i = 0; i<10; i++){
                console.log(Math.min(i, 3));
                if (data[i] !== undefined){
                    let nicknameAddon = "";
                    if (data[i].nickname !== "" && data[i].nickname !== null && data[i].nickname !== undefined){
                        nicknameAddon = data[i].nickname + " | ";
                    }

                    ladder = ladder + '<tr class="ladderPos' + Math.min(i, 3) + '"><th>' + (i+1) + '. ' + nicknameAddon + data[i].name + '</th><th>' + data[i].total + '</th></tr>';
                }else{
                    ladder = ladder + '<tr class="ladderPos' + Math.min(i, 3) + '"><th>Ausstehend</th><th>Ausstehend</th></tr>';
                }
            }
            // console.log(newArray);
            document.getElementById("ladder").innerHTML = ladder + '</table>';
        }).catch(() => document.getElementById("list").innerHTML = "Oha! Das ist aber nicht so gut gelaufen!");


    //Buttons
    fetch(apiString)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            let listOfDates = '<section class="container"><section class="dateSection">';
            for (let i in data){
                console.log(i)
                let date = data[i];
                console.log(date);
                let currentDate = date.date.split("T")[0].toString().split("-");

                let nicknameAddon = "";
                if (date.dailyBestNickname !== "" && date.dailyBestNickname !== null && date.dailyBestNickname !== undefined){
                    nicknameAddon = date.dailyBestNickname + " | ";
                }

                listOfDates = listOfDates + '<button class="dateButton" onclick="detailsOf(&quot;' + date.date.toString() + '&quot;)"><b>' + currentDate[2] + ' ' + currentDate[1] + ' ' + currentDate[0] + '</b>   Beste/-r ist <b>' + nicknameAddon + date.dailyBest + '</b> mit <b>' + date.dailyBestCounter + '</b> Drinks!' + '</button><br><br>';
            }
            document.getElementById("list").innerHTML = listOfDates + '</section></section>';
        }).catch(() => document.getElementById("list").innerHTML = "Oha! Das ist aber nicht so gut gelaufen!");
}

//Details
function detailsOf(dateString){
    // console.log(dateString);
    let detailApiString = apiString + '/d/' + dateString;
    fetch(detailApiString)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let listOfPersons = '';
            listOfPersons = listOfPersons + '<button onclick="getDates()">Zur&uuml;ck zur &Uuml;bersicht</button><br><br>';
            listOfPersons = listOfPersons + 'Mitarbeiter/-in dieses Tages ist: <b>' + data.dailyBest.name + '</b> mit <b>' + data.dailyBestCounter + '</b> Drink(s)! <br><br><br>';
            listOfPersons = listOfPersons + '<section class="wholeTable"><table class="tableOfHeaders"><tr><th>Name</th><th>Anzahl</th><th>Detail</th></tr></table><section class="sectionForTable"><table class="tableOfPersons">';


            let persons = data.persons;
            for (let i in persons){
                console.log(persons[i]);
                let drinks = persons[i].drinks;
                let drinksOfPerson = "";
                for (let j in drinks){
                    drinksOfPerson = drinksOfPerson + drinks[j].slice(0, -1) + ", ";
                }

                let nicknameAddon = "";
                if (persons[i].person.nickname !== "" && persons[i].person.nickname !== null && persons[i].person.nickname !== undefined){
                    nicknameAddon = persons[i].person.nickname + " | ";
                }

                listOfPersons = listOfPersons + '<tr class="tableRowOfPersons"><th>' + nicknameAddon + persons[i].person.name + '</th><th>' + persons[i].daily + '</th><th>' + drinksOfPerson.slice(0, -2) + '</th></tr>';
            }
            listOfPersons = listOfPersons + '</table></section></section>';
            // listOfPersons = listOfPersons + '<button onclick="getDates()">Zur&uuml;ck zur &Uuml;bersicht</button><br><br>';
            document.getElementById("list").innerHTML = listOfPersons;
        }).catch(() => document.getElementById("list").innerHTML = "Oha! Das ist aber nicht so gut gelaufen!");
}