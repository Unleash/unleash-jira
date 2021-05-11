# Forge Hello World

This project contains a Forge app written in Javascript that allows you to communicate with the [Unleash feature toggle system](https://getunleash.ai) in a Jira Issue panel.

## Requirements

- Node v12

- See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.


## Quick start

- Tell the app where to find your unleash installation by using Forge variables
  - `forge variables:set -e production UNLEASH_API_URL YOUR_UNLEASH_URL`

- [Set up an API user in unleash](https://docs.getunleash.io/user-management)

- Copy API key from unleash and set an encrypted variable for Forge.
  - `forge variables:set -e production --encrypted UNLEASH_API_KEY YOUR_API_KEY`

- Install your app in your Atlassian site by running:
```
forge install -e production
```
- This will prompt you for the URL to your atlassian installation and install the application in production mode.

## Support

- For problems with Forge see [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
- For problems with this plugin visit our [Slack community](https://join.slack.com/t/unleash-community/shared_invite/zt-8b6l1uut-LL67kLpIXm9bcN3~6RVaRQ)
