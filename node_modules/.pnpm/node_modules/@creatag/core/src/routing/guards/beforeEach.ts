export const BeforeEachGuard = (
  callback: (to: string, from: string) => boolean | Promise<boolean>,
) => {
  window.addEventListener('beforeunload', (event) => {
    const to = window.location.pathname;
    const from = document.referrer ? new URL(document.referrer).pathname : '';
    const result = callback(to, from);
    if (result instanceof Promise) {
      result.then((shouldNavigate) => {
        if (!shouldNavigate) {
          event.preventDefault();
          event.returnValue = '';
        }
      });
    } else if (!result) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
};
