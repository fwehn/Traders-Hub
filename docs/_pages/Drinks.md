---
permalink: /drinks/
title: "Drinks"
---



Hier ist eine Auflistung aller Drinks, die auf diesem Server getrunken und eingetragen wurden.  
Du willst auch hier stehen? Dann halte dich ran!  
Mit `!prost <Name-deines-Getränks>` in einem [Discord-Textkanal](./Discord.md) deiner Wahl, kannst du dein Getränk aufschreiben lassen.  
(Bei gleicher Schreibweise der Getränke, werden diese automatisch addiert!)  
Mit `!drinks` kannst du dir dann den aktuellen Tagesstand in Discord anzeigen lassen.

<body class="layout--single" onload="getDates()">
<section>
<p id="ladder">loading data...</p>
<p id="list">loading data...</p>

<script src="./../ownScripts/showDrinksFromApi.js"></script>
<style>
    .container{
        height: 300px;
        position: relative;
    }

    .ladderPos0{
        color: gold;
    }

    .ladderPos1{
        color: silver;
    }

    .ladderPos2{
        color: saddlebrown;
    }

    .dateSection {
        width: 100%;
        height: 100%;
        position: relative;
        -ms-transform: translate(-50%, -50%);
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .dateSection::-webkit-scrollbar {
        display: none;
    }

    .dateButton{
        width: 100%;
        height: 30px;
        text-align: center;
    }

    .tableOfHeaders {
        width: 100%;
        display: table;
        background-color: #eaeaea;
        color: #252a34;
        height: 30px;
    }

    .headerRow th{
        width: calc(100%/3);
        background-color: #eaeaea;
        color: #252a34;
        border-color: #eaeaea;
        display: table-cell;
        height: 30px;
    }

    .sectionForTable{
        width: 100%;
        overflow-y: scroll;
        height: 300px;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        display: block;
    }

    .sectionForTable::-webkit-scrollbar {
        display: none;
    }

    .tableOfPersons {
        width: 100%;
        display: table;
        border-left: 1px solid;
        border-right: 1px solid;
        background-color: #eaeaea;
    }

    .tableRowOfPersons th{
        width: calc(100%/3);
        background-color: #252a34;
        color: #eaeaea;
        display: table-cell;
    }
</style>
</section>
</body>
