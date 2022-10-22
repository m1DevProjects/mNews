let Parser = require('rss-parser');
let parser = new Parser();

module.exports = function(options){
    this.feedName = options.name;
    this.feedUri = options.feedUri;
    this.title = null;
    this.description = null;
    this.items = null;
    this.getFeed = async () => {
        const { title, description, items } = await parser.parseURL(this.feedUri);
        this.title = title;
        this.description = description;
        this.items = items;
    }
    this.getItems = async () => {
        if(this.feed === null) await this.getFeed();
        return this.feed.items;
    }
}