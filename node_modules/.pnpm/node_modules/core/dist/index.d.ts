type Reactive<T> = T | (() => T);
interface StyleObject {
    [property: string]: string | number | StyleObject;
}
interface TagProps {
    [key: string]: any;
    style?: StyleObject;
    styles?: StyleObject;
    onClick?: (e: Event) => void;
    onInput?: (e: Event) => void;
    onChange?: (e: Event) => void;
}
type Tag = {
    tag: string;
    class: string;
    style?: StyleObject;
    [style: string]: any;
    props?: TagProps;
    text?: Reactive<string>;
    children?: Reactive<Tag[]>;
    links?: {
        text: string;
        href: string;
    }[];
};

declare class Builder {
    private tags;
    private nodes;
    constructor(tags: Tag[]);
    render(): HTMLElement[];
    private createNode;
    private bindReactive;
}

declare class App {
    private components;
    add(component: Builder): this;
    mount(rootSelector: string): void;
}
declare const createApp: () => App;

interface PageData {
    title: string;
    description: string;
    content: Tag | Tag[];
}
declare class PageBuilder {
    private title;
    private description;
    private content;
    setTitle(title: string): this;
    setDescription(description: string): this;
    setContent(content: Tag | Tag[]): this;
    build(): PageData;
}

type TagFactory = ((propsOrTextOrChildren?: (Partial<Tag> & TagProps) | string | Tag[], children?: Tag[]) => Tag) & {
    extend: (newStyles: StyleObject) => TagFactory;
};
declare class Definer {
    define(tagName: string, styles: StyleObject): TagFactory;
}

type Listener = () => void;
declare class Signal<T> {
    private _value;
    private subscribers;
    constructor(initialValue: T);
    get value(): T;
    set value(newValue: T);
    private notify;
}
declare const signal: <T>(value: T) => Signal<T>;
declare const effect: (fn: Listener) => void;

declare class StyleBuilder {
    private _selector;
    private static readonly _reserved;
    constructor(initialStyles?: StyleObject);
    private _generateCSS;
    static create(initial?: StyleObject): StyleBuilder;
    static inject(selectorOrRules: string | Record<string, StyleObject | StyleBuilder>, maybeStyles?: StyleObject | StyleBuilder): void;
}
interface StyleBuilder {
    [key: string]: any;
    setSelector(selector: string): this;
    inject(selectorOrRules?: string | Record<string, StyleObject | StyleBuilder>, maybeStyles?: StyleObject | StyleBuilder): void;
    set(prop: string, value: string | number | StyleObject): this;
    hover(styles: StyleObject | StyleBuilder): this;
    focus(styles: StyleObject | StyleBuilder): this;
    active(styles: StyleObject | StyleBuilder): this;
    merge(other: StyleObject | StyleBuilder): this;
    build(): StyleObject;
    toCSS(selector?: string): string;
    toString(): string;
}

declare class defineRoutes {
    private routes;
    addRoute(path: string, handler: (page?: any) => void, page?: any): void;
    getRoutes(): Record<string, {
        handler: (page?: any) => void;
        page?: any;
    }>;
    navigate(path: string, pageOverride?: any): void;
    defaultPath(path: string): void;
    private changePathNameInBrowser;
    preventDefaultNavigation(): void;
}

declare const BeforeEachGuard: (callback: (to: string, from: string) => boolean | Promise<boolean>) => void;

declare const afterEachGuard: (callback: (to: string, from: string) => void | Promise<void>) => void;

declare const Text: TagFactory;

declare const Navbar: (props: {
    brand: {
        text: string;
        href: string;
    };
    links: {
        text: string;
        href: string;
    }[];
    style?: any;
}) => Tag;

declare class ButtonComponent {
    private button;
    constructor(text: string, onClick?: () => void);
    getElement(): Tag;
}

declare class InputComponent {
    private input;
    private inputTypeSignal;
    constructor(props: {
        inputType?: string;
        placeholder?: string;
        value?: Reactive<string>;
        onInput?: (value: string) => void;
    });
    setInputType(type: string): void;
    getElement(): Tag;
}

declare class Ul {
    private ul;
    private children;
    constructor(children: any[], style?: any);
    getElement(): any;
}

declare const Li: (props: {
    children: any;
    style?: any;
}) => Tag;

declare class Hn {
    private hn;
    private headerLevel;
    private text;
    constructor(headerLevel: number, text: string, style?: any);
    getElement(): any;
}

declare const ButtonLightStyle: {
    padding: string;
    fontSize: string;
    fontWeight: string;
    backgroundColor: string;
    color: string;
    border: string;
    borderRadius: string;
    cursor: string;
    transition: string;
    margin: string;
    '&:hover': {
        backgroundColor: string;
    };
};

declare const InputLightStyle: {
    padding: string;
    fontSize: string;
    border: string;
    borderRadius: string;
    transition: string;
    '&:focus': {
        borderColor: string;
        outline: string;
    };
};

type TextLightStyle = {
    fontSize?: string;
    color?: string;
};
declare const TextLightStyle: TextLightStyle;

declare const NavbarLightStyle: {
    backgroundColor: string;
    color: string;
    display: string;
    justifyContent: string;
    alignItems: string;
    padding: string;
    height: string;
    position: "relative";
    zIndex: number;
};
declare const NavLinksStyle: {
    display: string;
    alignItems: string;
    gap: string;
    listStyle: string;
    margin: number;
    padding: number;
};
declare const MobileMenuStyle: {
    position: "absolute";
    top: string;
    left: number;
    right: number;
    backgroundColor: string;
    flexDirection: "column";
    padding: string;
    borderTop: string;
    display: string;
    gap: string;
};

declare const BurgerLightStyle: {
    display: string;
    flexDirection: "column";
    justifyContent: string;
    width: string;
    height: string;
    background: string;
    border: string;
    cursor: string;
    padding: number;
    zIndex: number;
    '& div': {
        width: string;
        height: string;
        backgroundColor: string;
        borderRadius: string;
        transition: string;
        position: "relative";
        transformOrigin: string;
    };
};

declare const LinkLightStyle: {
    color: string;
    textDecoration: string;
    fontSize: string;
    fontWeight: string;
    transition: string;
    cursor: string;
    '&:hover': {
        color: string;
    };
};

type HeaderStyle = {
    color: string;
    fontSize: string;
    marginBottom: string;
};
declare const HeadersLightStyle: {
    [key: string]: HeaderStyle;
};

declare class Store<T> {
    private state;
    private listeners;
    constructor(initialState: T);
    getState(): T;
    setState(newState: T): void;
    subscribe(listener: () => void): () => boolean;
    private notify;
}
declare function createStore<T>(initialState: T): Store<T>;

declare class Persist {
    private storageKey;
    constructor(storageKey: string);
    saveState(state: any): void;
    loadState(): any;
    clearState(): void;
}
declare function createPersist(storageKey: string): Persist;

declare class Selectors {
    private selectors;
    addSelector(selectorName: string, selectorFn: Function): void;
    getSelector(selectorName: string): Function;
    select(selectorName: string, state: any): any;
}

declare class Reducer {
    private reducers;
    addReducer(actionType: string, reducerFn: Function): void;
    getReducer(actionType: string): Function;
    reduce(state: any, action: {
        type: string;
        payload?: any;
    }): any;
}
declare function createReducer(): Reducer;

declare class Middleware {
    private middlewares;
    use(middleware: Function): void;
    execute(context: any): void;
}
declare function createMiddleware(): Middleware;

declare const creaWindowSize: () => {
    width: Signal<number>;
};

export { App, BeforeEachGuard, Builder, BurgerLightStyle, ButtonComponent, ButtonLightStyle, Definer, HeadersLightStyle, Hn, InputComponent, InputLightStyle, Li, LinkLightStyle, Middleware, MobileMenuStyle, NavLinksStyle, Navbar, NavbarLightStyle, PageBuilder, type PageData, Persist, type Reactive, Reducer, Selectors, Signal, Store, StyleBuilder, type StyleObject, type Tag, type TagFactory, type TagProps, Text, TextLightStyle, Ul, afterEachGuard, creaWindowSize, createApp, createMiddleware, createPersist, createReducer, createStore, defineRoutes, effect, signal };
