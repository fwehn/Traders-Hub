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

module.exports = {
    opaModel, personModel, drinksModel, drinkSentenceModel
}