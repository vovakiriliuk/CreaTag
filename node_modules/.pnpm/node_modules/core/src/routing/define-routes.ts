export class defineRoutes {
  private routes: Record<string, { handler: (page?: any) => void; page?: any }> = {};

  public addRoute(path: string, handler: (page?: any) => void, page?: any) {
    this.routes[path] = { handler, page };
  }

  public getRoutes() {
    return this.routes;
  }

  public navigate(path: string, pageOverride?: any) {
    const route = this.routes[path];
    if (route) {
      route.handler(pageOverride || route.page);
    } else {
      console.error(`No route found for path: ${path}`);
    }
  }

  public defaultPath(path: string) {
    if (!this.routes[path]) {
      this.routes[path] = {
        handler: (_pageComponent?: any) => {
          console.log(`Default route for path: ${path}`);
        },
      };
    }
  }

  private changePathNameInBrowser(path: string) {
    window.history.pushState({}, '', path);
  }

  public preventDefaultNavigation() {
    window.addEventListener('click', (event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        event.preventDefault();
        this.changePathNameInBrowser(target.pathname);
        const path = new URL(target.href).pathname;
        this.navigate(path);
      }
    });
  }
}
