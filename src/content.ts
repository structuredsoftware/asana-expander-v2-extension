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

type AnyWindow = Window & {
    asanaExpanderInboxObserver?: MutationObserver;
    asanaExpanderTaskObserver?: MutationObserver;
    asanaExpanderLastUrl?: string;
};

function expandTaskPaneWithObserver(): void {
    const anyWindow = window as AnyWindow;
    expandStoryFeed();
    expandRichText();

    if (anyWindow.asanaExpanderTaskObserver) {
        return;
    }

    let debounceHandle: number | undefined;
    const observer = new MutationObserver(() => {
        if (String(window.location).match(/inbox/) !== null) {
            return;
        }
        if (debounceHandle !== undefined) {
            window.clearTimeout(debounceHandle);
        }
        debounceHandle = window.setTimeout(() => {
            expandStoryFeed();
            expandRichText();
        }, 250);
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
    anyWindow.asanaExpanderTaskObserver = observer;
}

function handleUrlChange(): void {
    const anyWindow = window as AnyWindow;
    if (String(window.location).match(/inbox/) !== null) {
        log('Expand Inbox');
            expandInbox();
        if (anyWindow.asanaExpanderTaskObserver) {
            anyWindow.asanaExpanderTaskObserver.disconnect();
            delete anyWindow.asanaExpanderTaskObserver;
        }
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

    expandTaskPaneWithObserver();
}

function startLocalUrlWatch(): void {
    const anyWindow = window as AnyWindow;
    anyWindow.asanaExpanderLastUrl = String(window.location);
    handleUrlChange();

    let debounceHandle: number | undefined;
    const observer = new MutationObserver(() => {
        if (debounceHandle !== undefined) {
            window.clearTimeout(debounceHandle);
        }
        debounceHandle = window.setTimeout(() => {
            const currentUrl = String(window.location);
            if (anyWindow.asanaExpanderLastUrl !== currentUrl) {
                anyWindow.asanaExpanderLastUrl = currentUrl;
                handleUrlChange();
            }
        }, 200);
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

startLocalUrlWatch();

browser.runtime.onMessage.addListener(async request => {
    if (!isExtensionMessage(request)) {
        return;
    }

    if (request.message === 'url-changed') {
        handleUrlChange();
    }
});
