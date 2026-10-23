export default {
  layout: 'node.njk',
  scripts: ['/js/video.js'],
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/n/${data.page.fileSlug}/`),
    eleventyExcludeFromCollections: (data) => !!data.draft,
  },
};
