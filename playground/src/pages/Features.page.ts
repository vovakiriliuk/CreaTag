import { Li, PageBuilder, Ul, StyleBuilder, Hn } from '@creatag/core';

export const FeaturesPage = new PageBuilder()
  .setTitle('Features')
  .setDescription(
    'Discover the powerful features of CreaTag that make it the ultimate tool for building web applications.',
  )
  .setContent({
    tag: 'div',
    class: 'features-page',
    children: [
      new Hn(1, { text: 'CreaTag Features', class: 'features-title' }).getElement(),
      new Ul([
        Li({ children: 'Intuitive Page Builder for easy page creation.' }),
        Li({ children: 'Powerful Definer for creating reusable components.' }),
        Li({ children: 'Reactive Signals for dynamic UI updates.' }),
        Li({ children: 'Flexible Routing System for seamless navigation.' }),
        Li({ children: 'Extensible Component Library for rapid development.' }),
      ]).getElement(),
    ],
  })

  .build();

const featuresStyle = new StyleBuilder().setSelector('.features-page').merge({
  padding: '4rem 2rem',
  maxWidth: '800px',
  margin: '0 auto',
  textAlign: 'center',
});

const featuresTitleStyle = new StyleBuilder().setSelector('.features-title').merge({
  fontSize: '2.5rem',
  marginBottom: '2rem',
  color: '#646cff',
});

featuresStyle.inject();
featuresTitleStyle.inject();
