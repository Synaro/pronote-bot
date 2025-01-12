// Ajout d'une fonction decodeHTML
String.prototype.decodeHTML = function() {
    const map = { gt: ">" /* , … */ };
    return this.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
        if ($1[0] === "#") {
            return String.fromCharCode(
                $1[1].toLowerCase() === "x"
                    ? parseInt($1.substr(2), 16)
                    : parseInt($1.substr(1), 10)
            );
        } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
        }
    });
};

// Suppression des accents
String.prototype.cleanUpSpecialChars = function() {
    return this.replace(/é|è|ê/g, "e");
};

// Ajout d'une méthode pour obtenir le numéro de la semaine
Date.prototype.getWeekNumber = function() {
    var d = new Date(
        Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
    );
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

// Pour savoir si une chaine de caractère est du json
String.prototype.isJson = function() {
    try {
        JSON.parse(this);
        return JSON.parse(this);
    } catch (e) {
        return false;
    }
};

// Ajout d'une propriété process.options
const commandLineArgs = require("command-line-args");
const optionDefinitions = [
    { name: "no-run-start", alias: "n", type: String, multiple: true },
    { name: "run-tasks", alias: "r", type: String, multiple: true }
];
process.options = commandLineArgs(optionDefinitions, { partial: true });

// Ajout d'une propriété mode vacances
process.modeVacances = require("../config").modeVacances;
process.coronaMode = require("../config").coronaMode;
