# mNews
### A simple app to gather gaming news and reviews from all over the internet, and display them in a simple form!

### To-do list:
    - Dashboard
    - Better displaying news
    - Easier adding new feeds

### How to add new feeds?
###### You can either add feeds directly to existing files, or create a new one, just like this example:
```js
module.exports = {
    name: 'Name of the module',
    feeds: [
        {
            name: 'Name of the feed',
            uri: 'Feed URL'
        }
    ]
}
```