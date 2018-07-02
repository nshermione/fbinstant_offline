# Instant Games Server Demo

This demo contains code that demonstrates common scenarios in a backend service that supports an Instant Game client: a game bot and a storage service.

## Pre-requisites
1. npm ([Install npm](https://docs.npmjs.com/cli/install))
1. (optional) [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) - this demo is optimized for [Heroku](heroku.com) hosting, but the code can be hosted on other cloud-based services as well.


## Install Dependencies
```bash
$ npm install
```

## Deploy to Heroku
```bash
$ heroku login
...
$ heroku create
...
$ git push heroku master
...
```

## Configuration
### 1. Add Postgresql to your Heroku app
Go to Heroku Add-ons and add [Heroku Postgresql](https://elements.heroku.com/addons/heroku-postgresql) to your application.

### 2. Configure environment variables
Go to your App Settings on Heroku and click on **Reveal Config Vars**. You should already have one called `DATABASE_URL` because of your Postgres installation. Add two more:
1. `BOT_VERIFY_TOKEN`: create a memorable word. You'll use that to validate webhooks with your Messenger Bot
1. `APP_SECRET`: paste your App Secret. This can be found in your App's settings page.
1. `PAGE_ACCESS_TOKEN`: leave blank for now.

### 3. Create a Facebook page that will host your bot

1. Follow the instructions on the [Game Bot setup guide](https://developers.facebook.com/docs/games/instant-games/getting-started/bot-setup) to setup a Facebook page that will host your game bot
1. When associating the Webhooks, under the **Verify Token** field, input the memorable word you created for `BOT_VERIFY_TOKEN` above
1. Once webhooks are configured, copy your Page's access token into the `PAGE_ACCESS_TOKEN` environment variable of your Heroku app.

All done! Your Backend service is configured!

## Running the client-side code
Follow the instructions in the README.md of the client-side counterpart of this demo:

https://github.com/edgarjcfn/fbinstant-communication