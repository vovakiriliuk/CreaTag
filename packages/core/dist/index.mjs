// src/app.ts
var App = class {
  components = [];
  add(component) {
    this.components.push(component);
    return this;
  }
  mount(rootSelector) {
    const root = document.querySelector(rootSelector);
    if (!root) {
      console.warn(`Root element ${rootSelector} not found`);
      return;
    }
    root.innerHTML = "";
    this.components.forEach((comp) => {
      const nodes = comp.render();
      nodes.forEach((node) => root.appendChild(node));
    });
  }
};
var createApp = () => new App();

// src/constructor/pageBuilder.ts
var PageBuilder = class {
  title = "";
  description = "";
  content = null;
  setTitle(title) {
    this.title = title;
    return this;
  }
  setDescription(description) {
    this.description = description;
    return this;
  }
  setContent(content) {
    this.content = content;
    return this;
  }
  build() {
    if (typeof document !== "undefined") {
      if (this.title) document.title = this.title;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (this.description) {
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.name = "description";
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", this.description);
      }
    }
    return {
      title: this.title,
      description: this.description,
      content: this.content || { tag: "div", class: "", children: [] }
    };
  }
};

// src/constructor/signal.ts
var activeEffect = null;
var Signal = class {
  _value;
  subscribers = /* @__PURE__ */ new Set();
  constructor(initialValue) {
    this._value = initialValue;
  }
  get value() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
    return this._value;
  }
  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }
  notify() {
    this.subscribers.forEach((sub) => sub());
  }
};
var signal = (value) => new Signal(value);
var effect = (fn) => {
  activeEffect = fn;
  fn();
  activeEffect = null;
};

// src/constructor/styles.ts
function camelToKebab(str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
function injectStyles(className, styles, selector = `.${className}`) {
  if (typeof document === "undefined") return;
  let css = `${selector} { `;
  const nested = [];
  for (const [prop, val] of Object.entries(styles)) {
    if (typeof val === "object" && val !== null) {
      const nestedSelector = prop.startsWith("&") ? prop.replace("&", selector) : `${selector} ${prop}`;
      nested.push({ selector: nestedSelector, styles: val });
    } else {
      css += `${camelToKebab(prop)}: ${val}; `;
    }
  }
  css += " } ";
  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);
  nested.forEach((n) => injectStyles(className, n.styles, n.selector));
}
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// src/constructor/builder.ts
var Builder = class {
  tags;
  nodes = [];
  constructor(tags) {
    this.tags = tags;
  }
  render() {
    this.nodes = this.tags.map((tag) => this.createNode(tag));
    return this.nodes;
  }
  createNode(tag) {
    const el = document.createElement(tag.tag);
    el.className = tag.class;
    if (tag.style) {
      let hasNested = false;
      for (const [prop, value] of Object.entries(tag.style)) {
        if (typeof value === "object" && value !== null) {
          hasNested = true;
        } else {
          el.style[prop] = value;
        }
      }
      if (hasNested) {
        const instanceId = Math.random().toString(36).slice(2, 7);
        const instanceClass = `ct-inst-${instanceId}`;
        el.classList.add(instanceClass);
        injectStyles(instanceClass, tag.style);
      }
    }
    if (tag.props) {
      for (const [key, value] of Object.entries(tag.props)) {
        if (key.startsWith("on") && typeof value === "function") {
          const eventName = key.toLowerCase().substring(2);
          el.addEventListener(eventName, value);
        } else {
          this.bindReactive(value, (val) => {
            if (key === "value" && el instanceof HTMLInputElement) {
              el.value = val;
            } else if (val === void 0 || val === null) {
              el.removeAttribute(key);
            } else {
              el.setAttribute(key, String(val));
            }
          });
        }
      }
    }
    if (tag.text !== void 0) {
      this.bindReactive(tag.text, (val) => {
        el.textContent = val;
      });
    }
    if (tag.children !== void 0) {
      this.bindReactive(tag.children, (children) => {
        if (!children || Array.isArray(children) && children.length === 0) {
          if (tag.text === void 0) {
            el.innerHTML = "";
          }
          return;
        }
        el.innerHTML = "";
        children.forEach((childTag) => {
          el.appendChild(this.createNode(childTag));
        });
      });
    }
    return el;
  }
  bindReactive(reactive, updateFn) {
    if (typeof reactive === "function") {
      effect(() => {
        updateFn(reactive());
      });
    } else {
      updateFn(reactive);
    }
  }
};

// src/constructor/definer.ts
var Definer = class {
  define(tagName, styles) {
    const id = Math.random().toString(36).slice(2, 7);
    const className = `ct-${tagName}-${id}`;
    injectStyles(className, styles);
    const factory = ((propsOrTextOrChildren, children) => {
      let tagProps;
      let text;
      let childTags;
      let instanceStyle;
      if (typeof propsOrTextOrChildren === "string" || typeof propsOrTextOrChildren === "function") {
        text = propsOrTextOrChildren;
        childTags = children;
      } else if (Array.isArray(propsOrTextOrChildren)) {
        childTags = propsOrTextOrChildren;
      } else if (typeof propsOrTextOrChildren === "object" && propsOrTextOrChildren !== null) {
        const p = propsOrTextOrChildren;
        if (p.tag && p.class) {
          childTags = [p];
        } else {
          tagProps = p.props;
          text = p.text;
          childTags = p.children;
          instanceStyle = p.style || p.styles;
          const {
            text: _t,
            children: _c,
            props: _p,
            tag: _tg,
            class: _cl,
            style: _s,
            styles: _ss,
            ...rest
          } = p;
          if (Object.keys(rest).length > 0) {
            tagProps = { ...tagProps, ...rest };
          }
        }
      }
      return {
        tag: tagName,
        class: className,
        props: tagProps,
        text,
        children: childTags,
        style: instanceStyle
      };
    });
    factory.extend = (newStyles) => {
      return this.define(tagName, deepMerge(styles, newStyles));
    };
    return factory;
  }
};

// src/constructor/styleBuilder.ts
var StyleBuilder = class _StyleBuilder {
  _selector = "";
  static _reserved = /* @__PURE__ */ new Set([
    "_selector",
    "setSelector",
    "set",
    "merge",
    "hover",
    "focus",
    "active",
    "build",
    "toCSS",
    "inject",
    "toString",
    "create",
    "_generateCSS"
  ]);
  constructor(initialStyles) {
    if (initialStyles) {
      Object.entries(initialStyles).forEach(([key, value]) => {
        this[key] = value instanceof _StyleBuilder ? value.build() : value;
      });
    }
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (typeof prop === "symbol") {
          return Reflect.get(target, prop, receiver);
        }
        if (_StyleBuilder._reserved.has(prop)) {
          const val = target[prop];
          return typeof val === "function" ? val.bind(receiver) : val;
        }
        if (prop in target) {
          return target[prop];
        }
        return (value) => {
          target[prop] = value instanceof _StyleBuilder ? value.build() : value;
          return receiver;
        };
      }
    });
  }
  setSelector(selector) {
    this._selector = selector;
    return this;
  }
  set(prop, value) {
    this[prop] = value instanceof _StyleBuilder ? value.build() : value;
    return this;
  }
  hover(styles) {
    return this["&:hover"](styles);
  }
  focus(styles) {
    return this["&:focus"](styles);
  }
  active(styles) {
    return this["&:active"](styles);
  }
  merge(other) {
    const s = other instanceof _StyleBuilder ? other.build() : other;
    const merged = deepMerge(this.build(), s);
    Object.keys(merged).forEach((key) => {
      this[key] = merged[key];
    });
    return this;
  }
  build() {
    const styles = {};
    Object.keys(this).forEach((key) => {
      if (key !== "_selector") {
        styles[key] = this[key];
      }
    });
    return styles;
  }
  toCSS(selector = this._selector) {
    return this._generateCSS(selector, this.build());
  }
  _generateCSS(selector, styles) {
    let css = selector ? `${selector} { ` : "";
    const nested = [];
    for (const [prop, val] of Object.entries(styles)) {
      if (typeof val === "object" && val !== null) {
        const nestedSelector = prop.startsWith("&") ? prop.replace("&", selector) : selector ? `${selector} ${prop}` : prop;
        nested.push(this._generateCSS(nestedSelector, val));
      } else {
        css += `${camelToKebab(prop)}: ${val}; `;
      }
    }
    if (selector) css += "} ";
    return css + nested.join(" ");
  }
  inject(selectorOrRules, maybeStyles) {
    if (!selectorOrRules) {
      injectStyles("", this.build(), this._selector);
      return;
    }
    if (typeof selectorOrRules === "string") {
      const s = maybeStyles instanceof _StyleBuilder ? maybeStyles.build() : maybeStyles || {};
      injectStyles("", s, selectorOrRules);
    } else {
      Object.entries(selectorOrRules).forEach(([selector, s]) => {
        const stylesObj = s instanceof _StyleBuilder ? s.build() : s;
        injectStyles("", stylesObj, selector);
      });
    }
  }
  toString() {
    return this.toCSS();
  }
  static create(initial) {
    return new _StyleBuilder(initial);
  }
  static inject(selectorOrRules, maybeStyles) {
    if (typeof selectorOrRules === "string") {
      const s = maybeStyles instanceof _StyleBuilder ? maybeStyles.build() : maybeStyles || {};
      injectStyles("", s, selectorOrRules);
    } else {
      Object.entries(selectorOrRules).forEach(([selector, s]) => {
        const stylesObj = s instanceof _StyleBuilder ? s.build() : s;
        injectStyles("", stylesObj, selector);
      });
    }
  }
};

// src/routing/define-routes.ts
var defineRoutes = class {
  routes = {};
  addRoute(path, handler, page) {
    this.routes[path] = { handler, page };
  }
  getRoutes() {
    return this.routes;
  }
  navigate(path, pageOverride) {
    const route = this.routes[path];
    if (route) {
      route.handler(pageOverride || route.page);
    } else {
      console.error(`No route found for path: ${path}`);
    }
  }
  defaultPath(path) {
    if (!this.routes[path]) {
      this.routes[path] = {
        handler: (_pageComponent) => {
          console.log(`Default route for path: ${path}`);
        }
      };
    }
  }
  changePathNameInBrowser(path) {
    window.history.pushState({}, "", path);
  }
  preventDefaultNavigation() {
    window.addEventListener("click", (event) => {
      const target = event.target;
      if (target.tagName === "A" && target.href) {
        event.preventDefault();
        this.changePathNameInBrowser(target.pathname);
        const path = new URL(target.href).pathname;
        this.navigate(path);
      }
    });
  }
};

// src/routing/guards/beforeEach.ts
var BeforeEachGuard = (callback) => {
  window.addEventListener("beforeunload", (event) => {
    const to = window.location.pathname;
    const from = document.referrer ? new URL(document.referrer).pathname : "";
    const result = callback(to, from);
    if (result instanceof Promise) {
      result.then((shouldNavigate) => {
        if (!shouldNavigate) {
          event.preventDefault();
          event.returnValue = "";
        }
      });
    } else if (!result) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
};

// src/routing/guards/afterEach.ts
var afterEachGuard = (callback) => {
  window.addEventListener("unload", (_event) => {
    const to = window.location.pathname;
    const from = document.referrer ? new URL(document.referrer).pathname : "";
    const result = callback(to, from);
    if (result instanceof Promise) {
      result.then(() => {
      });
    }
  });
};

// src/types/style-types/light-theme/Text-light-style.ts
var TextLightStyle = {
  fontSize: "1.2rem",
  color: "#ccc"
};

// src/components/ui/Text.ts
var Text = new Definer().define("p", TextLightStyle);

// src/composables/creaWindowSize.ts
var creaWindowSize = () => {
  const width = signal(typeof window !== "undefined" ? window.innerWidth : 1024);
  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      width.value = window.innerWidth;
    });
  }
  return { width };
};

// src/types/style-types/light-theme/Navbar-light-style.ts
var NavbarLightStyle = {
  backgroundColor: "#1a1a1a",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 2rem",
  height: "60px",
  position: "relative",
  zIndex: 1e3
};
var NavLinksStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  listStyle: "none",
  margin: 0,
  padding: 0
};
var MobileMenuStyle = {
  position: "absolute",
  top: "60px",
  left: 0,
  right: 0,
  backgroundColor: "#1a1a1a",
  flexDirection: "column",
  padding: "1rem 2rem",
  borderTop: "1px solid #333",
  display: "flex",
  gap: "15px"
};

// src/types/style-types/light-theme/Burger-light-style.ts
var BurgerLightStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  width: "30px",
  height: "25px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
  zIndex: 10,
  "& div": {
    width: "30px",
    height: "3px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    transition: "all 0.3s linear",
    position: "relative",
    transformOrigin: "1px"
  }
};

// src/types/style-types/light-theme/Link-light-style.ts
var LinkLightStyle = {
  color: "#ffffff",
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: "500",
  transition: "color 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    color: "#646cff"
  }
};

// src/components/flexable/Navbar.ts
var d = new Definer();
var NavBase = d.define("nav", NavbarLightStyle);
var NavLinks = d.define("ul", NavLinksStyle);
var MobileMenu = d.define("div", MobileMenuStyle);
var BurgerBtn = d.define("button", BurgerLightStyle);
var BurgerLine = d.define("div", {});
var Brand = d.define("a", {
  fontSize: "1.5rem",
  fontWeight: "bold",
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer"
});
var Navbar = (props) => {
  const { width } = creaWindowSize();
  const isOpen = signal(false);
  return NavBase({
    style: props.style,
    children: () => {
      const isMobile = width.value <= 768;
      const desktopLinks = NavLinks(
        props.links.map((link) => ({
          tag: "li",
          class: "",
          children: [
            {
              tag: "a",
              class: "",
              props: { href: link.href },
              text: link.text,
              style: LinkLightStyle
            }
          ]
        }))
      );
      const burger = BurgerBtn({
        onClick: () => {
          isOpen.value = !isOpen.value;
        },
        children: [
          BurgerLine({ style: isOpen.value ? { transform: "rotate(45deg)" } : {} }),
          BurgerLine({
            style: isOpen.value ? { opacity: "0", transform: "translateX(20px)" } : {}
          }),
          BurgerLine({ style: isOpen.value ? { transform: "rotate(-45deg)" } : {} })
        ]
      });
      const mobileMenu = isOpen.value ? MobileMenu(
        props.links.map((link) => ({
          tag: "a",
          class: "",
          props: { href: link.href },
          text: link.text,
          style: LinkLightStyle,
          children: []
        }))
      ) : null;
      const children = [
        Brand({ text: props.brand.text, props: { href: props.brand.href } }),
        isMobile ? burger : desktopLinks
      ];
      if (isMobile && mobileMenu) {
        children.push(mobileMenu);
      }
      return children;
    }
  });
};

// src/types/style-types/light-theme/Button-light-style.ts
var ButtonLightStyle = {
  padding: "0.6rem 1.2rem",
  fontSize: "1rem",
  fontWeight: "500",
  backgroundColor: "#646cff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "border-color 0.25s",
  margin: "10px 0",
  "&:hover": {
    backgroundColor: "#747bff"
  }
};

// src/components/ui/Button.ts
var Button = new Definer().define("button", ButtonLightStyle);
var ButtonComponent = class {
  button;
  constructor(text, onClick) {
    this.button = Button({ text, onClick });
  }
  getElement() {
    return this.button;
  }
};

// src/types/style-types/light-theme/Input-light-style.ts
var InputLightStyle = {
  padding: "0.5rem",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  transition: "border-color 0.25s",
  "&:focus": {
    borderColor: "#646cff",
    outline: "none"
  }
};

// src/components/ui/Input.ts
var Input = new Definer().define("input", InputLightStyle);
var InputComponent = class {
  input;
  inputTypeSignal;
  constructor(props) {
    this.inputTypeSignal = signal(props.inputType || "text");
    this.input = Input({
      props: {
        type: () => this.inputTypeSignal.value,
        placeholder: props.placeholder,
        value: props.value,
        onInput: (e) => {
          if (props.onInput) {
            props.onInput(e.target.value);
          }
        }
      }
    });
  }
  setInputType(type) {
    this.inputTypeSignal.value = type;
  }
  getElement() {
    return this.input;
  }
};

// src/components/ui/Ul.ts
var d2 = new Definer();
var Ul = class {
  ul;
  children;
  constructor(children, style) {
    this.children = children;
    this.ul = d2.define("ul", style || {})(this.children);
  }
  getElement() {
    return this.ul;
  }
};

// src/components/ui/Li.ts
var d3 = new Definer();
var Li = (props) => {
  return d3.define("li", props.style || {})(props.children);
};

// src/types/style-types/light-theme/Headers-light-style.ts
var HeadersLightStyle = {
  h1: {
    color: "#333",
    fontSize: "2.5rem",
    marginBottom: "1rem"
  },
  h2: {
    color: "#555",
    fontSize: "2rem",
    marginBottom: "0.75rem"
  },
  h3: {
    color: "#777",
    fontSize: "1.75rem",
    marginBottom: "0.5rem"
  },
  h4: {
    color: "#999",
    fontSize: "1.5rem",
    marginBottom: "0.25rem"
  },
  h5: {
    color: "#bbb",
    fontSize: "1.25rem",
    marginBottom: "0.125rem"
  },
  h6: {
    color: "#ddd",
    fontSize: "1rem",
    marginBottom: "0.0625rem"
  }
};

// src/components/ui/Hn.ts
var Hn = class {
  hn;
  headerLevel;
  text;
  constructor(headerLevel, text, style) {
    this.headerLevel = headerLevel;
    this.text = text;
    const tagger = `h${this.headerLevel}`;
    const d4 = new Definer();
    this.hn = d4.define(tagger, style || HeadersLightStyle[tagger])(this.text);
  }
  getElement() {
    return this.hn;
  }
};

// src/stores/createStore.ts
var Store = class {
  state;
  listeners = /* @__PURE__ */ new Set();
  constructor(initialState) {
    this.state = initialState;
  }
  getState() {
    return this.state;
  }
  setState(newState) {
    this.state = newState;
    this.notify();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  notify() {
    this.listeners.forEach((listener) => listener());
  }
};
function createStore(initialState) {
  return new Store(initialState);
}

// src/stores/utils/persist.ts
var Persist = class {
  storageKey;
  constructor(storageKey) {
    this.storageKey = storageKey;
  }
  saveState(state) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(this.storageKey, serializedState);
    } catch (err) {
      console.error("Error saving state to localStorage", err);
    }
  }
  loadState() {
    try {
      const serializedState = localStorage.getItem(this.storageKey);
      if (serializedState === null) {
        return void 0;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error("Error loading state from localStorage", err);
      return void 0;
    }
  }
  clearState() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (err) {
      console.error("Error clearing state from localStorage", err);
    }
  }
};
function createPersist(storageKey) {
  return new Persist(storageKey);
}

// src/stores/utils/selectors.ts
var Selectors = class {
  selectors = {};
  addSelector(selectorName, selectorFn) {
    this.selectors[selectorName] = selectorFn;
  }
  getSelector(selectorName) {
    return this.selectors[selectorName];
  }
  select(selectorName, state) {
    const selectorFn = this.getSelector(selectorName);
    if (selectorFn) {
      return selectorFn(state);
    }
    throw new Error(`Selector ${selectorName} not found`);
  }
};

// src/stores/reducer.ts
var Reducer = class {
  reducers = {};
  addReducer(actionType, reducerFn) {
    this.reducers[actionType] = reducerFn;
  }
  getReducer(actionType) {
    return this.reducers[actionType];
  }
  reduce(state, action) {
    const reducerFn = this.getReducer(action.type);
    if (reducerFn) {
      return reducerFn(state, action.payload);
    }
    return state;
  }
};
function createReducer() {
  return new Reducer();
}

// src/stores/middleware.ts
var Middleware = class {
  middlewares = [];
  use(middleware) {
    this.middlewares.push(middleware);
  }
  execute(context) {
    this.middlewares.forEach((middleware) => middleware(context));
  }
};
function createMiddleware() {
  return new Middleware();
}
export {
  App,
  BeforeEachGuard,
  Builder,
  BurgerLightStyle,
  ButtonComponent,
  ButtonLightStyle,
  Definer,
  HeadersLightStyle,
  Hn,
  InputComponent,
  InputLightStyle,
  Li,
  LinkLightStyle,
  Middleware,
  MobileMenuStyle,
  NavLinksStyle,
  Navbar,
  NavbarLightStyle,
  PageBuilder,
  Persist,
  Reducer,
  Selectors,
  Signal,
  Store,
  StyleBuilder,
  Text,
  TextLightStyle,
  Ul,
  afterEachGuard,
  creaWindowSize,
  createApp,
  createMiddleware,
  createPersist,
  createReducer,
  createStore,
  defineRoutes,
  effect,
  signal
};
