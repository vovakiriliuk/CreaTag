export class Middleware {
  private middlewares: Function[] = [];

  use(middleware: Function) {
    this.middlewares.push(middleware);
  }

  execute(context: any) {
    this.middlewares.forEach((middleware) => middleware(context));
  }
}

export function createMiddleware() {
  return new Middleware();
}
