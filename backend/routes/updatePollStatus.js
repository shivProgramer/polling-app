const cron = require("node-cron");
const { updateExpiredPolls } = require("./cronjob");

// Log message when the cron job is initialized
console.log("Cron job initialized. Poll updates will run every minute.");

// Schedule the cron job to run every minute
cron.schedule("* * * * *", async () => {
  console.log("Running cron job to update expired polls...");
  await updateExpiredPolls();
});

module.exports = cron;
