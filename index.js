const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter(/* { skipFirstLoad: true } */);
const feeds = require('./feeds');
require('dotenv').config();
const ms = require('ms');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const striptags = require('striptags');
const events = [];

feeds.forEach(f => {
    const { type, provider, link, webhookUrl } = f;
    feeder.add({
        url: link,
        refresh: 2000,
        eventName: `${provider}${type}`
    });
    events.push({
        eventName: `${f.provider}${f.type}`,
        type,
        provider,
        webhookClient: new WebhookClient({ url: webhookUrl })
    })
})

events.forEach(e => {
    feeder.on(e.eventName, (item) => {
        const { title, pubdate, description, link, enclosures } = item;
        const embed = new EmbedBuilder()
	        .setColor([0, 255, 0])
            .setTitle(title)
            .setDescription(striptags(description).replace('&quot;', ''))
            .setTimestamp(pubdate)
            .setURL(link)
            .setFooter({ text: 'mNews', iconURL: 'https://i.imgur.com/YkwM5EL.png' });
        if(enclosures && enclosures[0].url) embed.setThumbnail(enclosures[0].url);
        else embed.setThumbnail('https://i.imgur.com/YkwM5EL.png')
        e.webhookClient.send({
            username: 'mNews',
            avatarURL: 'https://i.imgur.com/YkwM5EL.png',
            embeds: [embed],
        });
    });
})

feeder.on('error', console.error);