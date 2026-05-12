import { PageBuilder } from '@creatag/core';

export const AboutPage = new PageBuilder()
  .setTitle('About Us')
  .setDescription('Learn more about our company and team.')
  .setContent({
    tag: 'div',
    class: 'about-page',
    children: [
      {
        tag: 'h1',
        class: 'about-title',
        text: 'About Us',
      },
      {
        tag: 'p',
        class: 'about-description',
        text: 'We are a team of passionate developers building CreaTag.',
      },
    ],
  })
  .build();
