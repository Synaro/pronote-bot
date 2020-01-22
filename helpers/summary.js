const { CronJob } = require("cron");
const fetchEleve = require("../pronote/fetchEleve");
const InstaUser = require("../instagram/InstaUser");
const logger = require("./logger");

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

module.exports.init = async (ig) => {
    const autoSummary = async (usernames) => {
        // Si c'est samedi ou dimanche
        if(new Date().getDay() === 5 || new Date().getDay() === 6){
            return;
        }
        let startAt = Date.now();
        logger.log("Starting summary messages.", "info");
        // Load all credentials
        let credentials = require("../credentials.json");
        // keep only those who have notif enabled
        credentials = (usernames ? credentials.filter((c) => usernames.includes(c.username)) : credentials.filter((c) => c.notif));
        // For each user
        await asyncForEach(credentials, async (cred) => {
            let userStartAt = Date.now();
            logger.log("Summary messages for "+cred.username+" started.", "info");
            let student = await fetchEleve(cred).catch(() => {});
            if(!student) return;
            let summary = student.getSummary(true);
            if(summary){
                let user = new InstaUser(cred.insta, ig);
                user.send(summary);
                logger.log("Summary message sent to "+cred.username, "info");
            }
            logger.log("Summary messages for "+cred.username+" ended in "+(Date.now()-userStartAt)+"ms.", "info");
        });
        logger.log("Summary messages ended in "+(Date.now()-startAt)+"ms.", "info");
    };
    // Notifier quand le bot se lance
    if (process.options["checkforsum"]){
        autoSummary(process.options["checkforsum"]);
    }
    // Notifier à 19h15
    new CronJob("00 15 19 * * *", autoSummary, null, true, "Europe/Paris");
};