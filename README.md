<h1>
    Discord Webhook for Github Pull Request Webhook
    <br/>
    <img src="https://img.shields.io/static/v1?label=PRs&message=welcomes&color=blue"/>
</h1>

## Tech Stack

<p>
    <img src="https://img.shields.io/static/v1?label=&message=Javascript&color=yellow"/>
    <img src="https://img.shields.io/static/v1?label=&message=Typescript&color=blue"/>
    <img src="https://img.shields.io/static/v1?label=&message=Restify&color=blueviolet"/>
    <img src="https://img.shields.io/static/v1?label=&message=day.js&color=orange"/>
    <img src="https://img.shields.io/static/v1?label=&message=axios&color=lightgrey"/>
    <img src="https://img.shields.io/static/v1?label=&message=dotenv&color=success"/>
</p>

## What's this repo for?

- It's a [Resity](https://github.com/restify/node-restify) nodejs api server for discord channel notification when trigger github pull request.

- GET http method ```/health``` can check the server alive.

- POST http method ```/pr``` will receive the request from github webhook and notify message to discord channel.

- Variable ```pushEventList``` filter which event you want to trigger notify from github webhook pull request event. If your event not include in enum file, you add in ```src/enums/action.ts``` file.

- The three things will be checked before sending discord notification:
  
  1. Is the request is pull request event?
  2. Is the pull request event action included in variable ```pushEventList```?
  3. Is github webhook secret same as ```.env``` file setting?

## Setting Steps

1. Install node package by ```yarn```

    ```bash
    yarn install
    ```

2. Generate discord channel webhook

    Generate discord webhook url from the channel you want to notify github pull request event, and set it in next step environment attribute.

3. Create your `.env` file

    Multiple environment: `.env`, `.env.production`.

    Please creates both file in project root, and contains each attribute as below:

    ```env
    PORT=<server port>
    GITHUB_WEBHOOK_SECRET=<github hook secret>
    DISCORD_WEBHOOK=<discord channel webhook url>
    TIMEZONE=<your server console timezone (ex. Asia/Shanghai)>
    ```

    ```GITHUB_WEBHOOK_SECRET``` will set in github webhook create page at step 6, and it will be valid in pr post http method.

4. Build production code

    ```bash
    yarn build
    ```

5. Start server

    ```bash
    yarn start
    ```

6. Create github webhook for pull request
    In github repo webhook creating page ```Setting > Webhooks > Add webhook```, setting as below:

    - Payload URL: ```<IP or Domain>/pr``` ex. ```http://10.10.10.10:<produciton port>/pr``` or ```https://example.com/pr```.
    - Content type: ```application/json```.
    - Secret: Same as step 3 environment attribute ```GITHUB_WEBHOOK_SECRET``` you setting.
    - Which events would you like to trigger this webhook?: Please only select ```Pull requests``` field. (```Push``` field will select default, please deselect it!)
    - Action: Please select if you want this webhook work immediately.

7. Run it!

    Create your pull request in the repo and see the notify in discord channel.

---

## Others

- If you need any helps, please create an issue in repo and describe the problem clearly.

- If you want to add feature improving the serve diversity, please create the pull request in repo.
