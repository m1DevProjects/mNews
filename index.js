const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter({ skipFirstLoad: true });
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
        if(enclosures && enclosures[0] && enclosures[0].url) embed.setThumbnail(enclosures[0].url);
        if(!enclosures[0].url || !enclosures) embed.setThumbnail('https://i.imgur.com/YkwM5EL.png')
        let message = ' ';
        if(e.type === 'swiat') message += `<@1033820877592211486>\n`
        if(e.type === 'polska') message += `<@1033820908734922781>\n`
        if(e.type === 'technologie') message += `<@1033820943354691687>\n`
        if(e.type === 'sport') message += `<@1033820928259391518>\n`
        if(e.provider === 'Polsat News') message += `<@1033820638504292353>\n`
        if(e.provider === 'Interia') message += `<@1033820693390962779>\n`
        if(e.provider === 'TVN24') message += `<@1033820717038448680>\n`
        e.webhookClient.send({
            username: 'mNews',
            avatarURL: 'https://i.imgur.com/YkwM5EL.png',
            embeds: [embed],
            content: message
        });
    });
})

feeder.on('error', console.error);