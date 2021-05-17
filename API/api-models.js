const mongoose = require('mongoose');

const opaSchema = new mongoose.Schema({
    sentence: String
}, {versionKey: false});

const opaModel = mongoose.model("Opa", opaSchema);

const drinkSentenceSchema = new mongoose.Schema({
    sentence: String
}, {versionKey: false});

const drinkSentenceModel = mongoose.model("DrinkSentences", drinkSentenceSchema);

const personSchema = new mongoose.Schema({
    discordId: String,
    name: String,
    total: Number,
    nickname: String
}, {versionKey: false});

const personModel = mongoose.model("Person", personSchema);

const personDrinkSchema = new mongoose.Schema({
    person: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    daily: Number,
    drinks: [String]
}, {versionKey: false});

const drinksSchema = new mongoose.Schema({
    date: Date,
    persons: [personDrinkSchema],
    dailyBest: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    dailyBestCounter: Number
}, {versionKey: false});

const drinksModel = mongoose.model("Drinks", drinksSchema);













const personSchemaSS2021 = new mongoose.Schema({
    _id: {type: String, required: true},
    username: String,
    nickname: String,
    totalCount: Number,
    totalAmount: Number,
    totalAlcohol: Number
}, {versionKey: false});

const personModelSS2021 = mongoose.model("Persons2021", personSchemaSS2021);

const personDrinkSchemaSS2021 = new mongoose.Schema({
    person: {type: String, ref: "Persons2021"},
    drinks: [String],
    alcoholAmount: Number
}, {_id: false, versionKey: false});

const drinksSchemaSS2021 = new mongoose.Schema({
    date: Date,
    data: [personDrinkSchemaSS2021]
}, {versionKey: false});

const drinksModelSS2021 = mongoose.model("DrinksSS2021", drinksSchemaSS2021);



















module.exports = {
    opaModel, personModel, drinksModel, drinkSentenceModel, personModelSS2021, drinksModelSS2021
}