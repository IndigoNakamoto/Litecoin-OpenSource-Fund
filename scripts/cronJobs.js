import cron from 'node-cron'

// Schedule a job to run every hour. Adjust the cron syntax as needed.
cron.schedule('0 * * * *', () => {
  require('./fetchTweets.mjs')
})
