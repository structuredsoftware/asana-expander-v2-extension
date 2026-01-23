import browser from 'webextension-polyfill';
import {expandInbox} from './expand-inbox';
import {expandRichText, expandStoryFeed} from './expand-task';
import {log} from './logger';

interface ExtensionMessage {
    message: string;
}

function isExtensionMessage(value: unknown): value is ExtensionMessage {
    return (
        typeof value === 'object' &&
        value !== null &&
        'message' in value &&
        typeof (value as {message?: unknown}).message === 'string'
    );
}

browser.runtime.onMessage.addListener(async request => {
    if (!isExtensionMessage(request)) {
        return;
    }

    if (request.message === 'url-changed') {
        const anyWindow = window as Window & {asanaExpanderInboxObserver?: MutationObserver};
        if (String(window.location).match(/inbox/) !== null) {
            log('Expand Inbox');
            expandInbox();
            if (!anyWindow.asanaExpanderInboxObserver) {
                let debounceHandle: number | undefined;
                const observer = new MutationObserver(() => {
                    if (debounceHandle !== undefined) {
                        window.clearTimeout(debounceHandle);
                    }
                    debounceHandle = window.setTimeout(() => {
                        expandInbox();
                    }, 250);
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
                anyWindow.asanaExpanderInboxObserver = observer;
            }
            return;
        }

        if (anyWindow.asanaExpanderInboxObserver) {
            anyWindow.asanaExpanderInboxObserver.disconnect();
            delete anyWindow.asanaExpanderInboxObserver;
        }

        expandStoryFeed();
        expandRichText();
    }
});
