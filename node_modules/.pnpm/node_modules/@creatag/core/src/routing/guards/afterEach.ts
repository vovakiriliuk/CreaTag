export const afterEachGuard = (callback: (to: string, from: string) => void | Promise<void>) => {
  window.addEventListener('unload', (_event) => {
    const to = window.location.pathname;
    const from = document.referrer ? new URL(document.referrer).pathname : '';
    const result = callback(to, from);
    if (result instanceof Promise) {
      result.then(() => {
        // No need to prevent unload, just execute the callback
      });
    }
  });
};
