# Asana Expander v2 Browser Extension

> [!Note]
> This extension was started by [Stefan Zweifel](https://github.com/stefanzweifel) at
> https://github.com/stefanzweifel/asana-expander-extension but is no longer being maintained there.
> Development is now being continued again in this repo.

---

Asana Expander v2 is a browser extension that automatically expands hidden content across Asana task panes and Inbox notifications.

It removes the extra clicking needed to read full content in common Asana workflows, including standard task views, Home task panes, search-result task panes, and Inbox items. It also keeps task expansions working when Asana swaps task content inside a persistent details overlay, such as when drilling from a parent task into a subtask.

Current features include:

- expanding long Inbox notification text
- expanding project sections to reveal custom fields
- expanding the full subtasks list
- expanding the full comments and activity feed list
- expanding long comment text
- enabling or disabling each feature from the popup UI

## Installation

- [Chrome Extension](https://chrome.google.com/webstore/detail/asana-expander/goplcobjbaafmhoadgihbepeejbajbki)
- [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/asana-expander/)

## Development

Ensure you have

- [Node.js](https://nodejs.org) 18 or later installed

Then run the following:

- `npm install` to install dependencies
- `npm run dev` to start the development server
- `npm run build-chrome` to build chrome extension
- `npm run build-ff` to build firefox addon
- `npm run build-all` to build both targets into `./dist/chrome` and `./dist/firefox`

### Chrome

1. Go to the browser address bar and enter `chrome://extensions`
2. In the top right corner, enable `Developer Mode`
3. Click on the `Load Unpacked` button
4. Select the `./dist/chrome` folder

### Firefox

1. Create a ZIP file of the contents of `./dist/firefox` (not of the folder itself)
2. Go to the browser address bar and enter `about:debugging#/runtime/this-firefox`
3. Click on the `Load Temporary Add-on...` button
4. Select the zipped file created in step 1 (e.g. `./dist/firefox/firefox.zip`)

## Distribute

### Chrome

1. Run `npm run build-chrome`
1. Create a ZIP file of the contents of `./dist/chrome` (not of the folder itself)
1. Navigate to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/u/2/webstore/devconsole/)
1. Upload new version

### Firefox

1. Run `npm run build-ff`
1. Create a ZIP file of the contents of `./dist/firefox` (not of the folder itself)
1. Navigate to the [Mozilla Add-on Developer Hub ](https://addons.mozilla.org/en-US/developers/)
1. Upload new version

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
