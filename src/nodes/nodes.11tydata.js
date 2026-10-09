export default {
  layout: 'node.njk',
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/n/${data.page.fileSlug}/`),
    eleventyExcludeFromCollections: (data) => !!data.draft,
  },
};
