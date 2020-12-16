# Chicorée-Chantal
## Commands
### Funktion
| Command 	| Variablen                      	| Funktion                                                                                                                                               	| Beispiel         	| Ergebnis                                         	|
|---------	|--------------------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------	|------------------	|--------------------------------------------------	|
| !au     	| -                              	| Mutet alle Leute in deinem Voice-Channel                                                                                                               	| -                	| -                                                	|
| !random 	| Anz. Teilnehmer, (Anz. Sieger) 	| Erstellt einen Randomizer und zieht Sieger, nachdem alle per Reaktion teilgenommen haben.                                                              	| !random 20 3     	| Es werden zufällig 3 von 20 Teilnehmern gezogen. 	|
| !saufen 	| start/stopp, (Interval)        	| Startet/Beendet den Sauftimer: Immer nach Ablauf des Intervals, wird jemand der sich in einem Voice-Channel befindet auserwählt zum Saufen.            	| !saufen start 15 	| Alle 15 Minuten wird jemand erwählt zum Saufen.  	|
| !teams  	| Anzahl der Spieler insgesamt   	| Erstellt zufällig 2 Teams aus allen, die per Reaktion Teilnehmen.                                                                                      	| !teams 6         	| Erstellt 2 Teams mit je 3 Personen.              	|
| !ww     	| Anzahl der Spieler             	| Erstellt eine Partie Werwolf und teilt jedem Spieler eine Rolle zu. Erzähler wird derjenige, der den Command geschrieben hat. (Teilnahme per Reaktion) 	| !ww 20           	| Erstellt eine Partie Werwolf mit 20 Personen     	|
| !roles  	| -                              	| Weist jedem, der noch keine Rolle hat, die niedrigste Rolle zu.                                                                                        	| -                	| -                                                	|


### "Fun"
Einfach mal verwenden und sehen, was passiert:

- `!ehre`
- `!luther`
- `!mimimi`
- `!standard`
- `!würg`

## Implementation

Um Chicorée-Chantal selbst zu implementieren, musst du eine Datei mit dem Namen `variables.json` hinzufügen.  
In diese Datei fügst du folgenden Code ein und passt ihn deinen Umständen entsprechend an:  

```json
{
  "token": "",
  "prefix": "",
  "testChannelId": "",

  "lowestRole": "",
  "saufChannelId": ""
}
```

*Um die Channel-IDs und die Rollen-IDs deines Servers zu erhalten, musst du deinen Discord Account auf den "Entwicklermodus" stellen.  
Den Token erhältst du, wenn du im [Developer-Portal](https://discord.com/developers/applications) eine Application (den Bot) erstellst.  
`prefix` meint das Zeichen under die Zeichenkette mit der Jeder Command beginnen soll (in unserem Fall das `!`).*

**Viel Spaß beim Ausprobieren!!!**