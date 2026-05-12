import { defineRoutes, signal } from '@creatag/core';
import { AboutPage } from './pages/About.page';
import { FeaturesPage } from './pages/Features.page';
import { homeContent } from './pages/Home.page';

export const currentPageContent = signal<any>(homeContent);

const routes = new defineRoutes();
routes.addRoute('/', () => {
  currentPageContent.value = homeContent;
  document.title = 'CreaTag - Home';
});

routes.addRoute(
  '/about',
  (page: any) => {
    currentPageContent.value = page.content;
    document.title = 'CreaTag - About Us';
  },
  AboutPage,
);

routes.addRoute('/pricing', () => {
  console.log('Pricing route');
});
routes.addRoute(
  '/features',
  () => {
    currentPageContent.value = FeaturesPage.content;
    document.title = 'CreaTag - Features';
  },
  FeaturesPage,
);

routes.defaultPath('/');
routes.preventDefaultNavigation();

const currentPath = window.location.pathname;
routes.navigate(currentPath === '/' ? '/' : currentPath);
