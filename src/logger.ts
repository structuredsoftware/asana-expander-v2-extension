const DEBUG_STORAGE_KEY = "asana-expander-debug";

function isDebugEnabled(): boolean {
    try {
        return window.localStorage.getItem(DEBUG_STORAGE_KEY) === "true";
    } catch {
        return false;
    }
}

export function log(message: string, context: any = null) {
    if (!isDebugEnabled()) {
        return;
    }

    if (context === null) {
        console.log(`::asana-expander:: ${message}`);
        return;
    }

    console.log(`::asana-expander:: ${message}`, context);
}
