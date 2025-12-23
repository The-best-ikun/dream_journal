const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {
  // Ignore README files
  eleventyConfig.ignores.add("README*");
  eleventyConfig.ignores.add("**/README*");

  // Add collections
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob("src/posts/*.md").sort(function(a, b) {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("projects", function(collection) {
    return collection.getFilteredByGlob("src/projects/*.md").sort(function(a, b) {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("gallery", function(collection) {
    return collection.getFilteredByGlob("src/gallery/*.md").sort(function(a, b) {
      return b.date - a.date;
    });
  });

  // Date formatting
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  // CSS minification
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // HTML minification - disable for development, gentle for production
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if(outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: false,
        removeComments: false,
        collapseWhitespace: false,
        minifyCSS: false,
        minifyJS: false,
        removeAttributeQuotes: false,
        removeEmptyAttributes: false,
        sortClassName: false
      });
      return minified;
    }
    return content;
  });

  // Pass through copy
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("src/posts/images");
  eleventyConfig.addPassthroughCopy("src/projects/images");
  eleventyConfig.addPassthroughCopy("src/gallery/images");

  // Markdown plugins
  const markdownIt = require("markdown-it");
  const markdownItAnchor = require("markdown-it-anchor");
  const options = {
    html: true,
    breaks: true,
    linkify: true
  };
  const opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAnchor, opts));

  return {
    templateFormats: [
      "md",
      "njk",
      "html"
    ],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
      layouts: "_layouts"
    },
     // 2. 开启前缀功能,有自定义域名或者本地运行不需要它，直接使用git page要用它
    // pathPrefix: "/dream_journal/"
  };
};
