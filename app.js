const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const fs = require('fs');
const Ascii = require('ascii-table');
const FeedManager = require('./utils/newFeed');
const rssFeeds = [];
(async () => {
    const Table = new Ascii(`Feeds`);
    const feedFiles = [];
    fs.readdirSync('./feeds/').forEach(file => feedFiles.push(`./feeds/${file}`));
    feedFiles.forEach(async (f) => {
        const feed = require(f);
        if(feed.feeds === undefined) return Table.addRow(feed.name, f.split('/')[7], 'Failed', 'No feeds found!')
        if(feed.feeds.length < 1) Table.addRow(feed.name, f.split('/')[7], 'Failed', 'No feeds found!')
        feed.feeds.forEach(async (fed) => {
            const manager = new FeedManager({ name: fed.name, feedUri: fed.uri });
            rssFeeds.push(manager)
            await Table.addRow(feed.name, fed.name, `Successful`)
        })
    });
    console.log(Table.toString());
    rssFeeds.forEach(async rss => {
        await rss.getFeed();
    })
})();
module.exports = rssFeeds;