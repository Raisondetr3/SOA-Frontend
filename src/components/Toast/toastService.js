export const showToast = (message, type = 'info', duration = 3000) => {
    window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message, type, duration }
    }));
};