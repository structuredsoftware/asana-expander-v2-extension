# Asana Expander v2 Browser Extension

> [!Note]
> This extension was started by [Stefan Zweifel](https://github.com/stefanzweifel) at
> https://github.com/stefanzweifel/asana-expander-extension but is no longer being maintained there.
> Development is now being continued again in this repo.

---

Asana Expander v2 is a browser extension to automatically expand comments and threads in Asana, including Inbox items.

Do you also hate to click on those "See more" links in Asana, just to see the last sentence of a longer comment? Or did you also miss an important comment in a longer comment thread in an Asana Task?

This extension solves this problem by automatically clicking on those links whenever you open a task with many comments, view longer comments, or scroll through Inbox notifications.

## Installation

- [Chrome Extension](https://chrome.google.com/webstore/detail/asana-expander/goplcobjbaafmhoadgihbepeejbajbki)
- [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/asana-expander/)

## Development

Ensure you have

- [Node.js](https://nodejs.org) 18 or later installed

Then run the following:

- `npm run install` to install dependencies.
- `npm run dev` to start the development server
- `npm run build-chrome` to build chrome extension
- `npm run build-ff` to build firefox addon
- `npm run build-all` to build both targets into `./dist/chrome` and `./dist/firefox`

### Chrome

- Go to the browser address bar and type `chrome://extensions`
- Check the `Developer Mode` button to enable it.
- Click on the `Load Unpacked Extension…` button.
- Select `./dist/chrome`.

### Firefox

- Go to the browser address bar and type `about:debugging#/runtime/this-firefox`
- Click on the `Load Temporary Add-on...` button.
- Select `./dist/firefox/manifest.json` file.

## Distribute

### Chrome

- Run `npm run build-chrome`
- Create ZIP of the contents of `./dist/chrome` (so `manifest.json` is at the zip root)
- Navigate to Chrome Web Store Developer Dashboard
- Upload new version to Dashboard

### Firefox

- Run `npm run build-ff`
- Create ZIP of the contents of `./dist/firefox` (so `manifest.json` is at the zip root)
- Navigate to [addons.mozilla.org](https://addons.mozilla.org/en-US/developers/addon/asana-expander/versions/submit/)
- Upload new version

### Build both

- Run `npm run build-all` to produce both `./dist/chrome` and `./dist/firefox`

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Stefan Zweifel](https://github.com/stefanzweifel)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
