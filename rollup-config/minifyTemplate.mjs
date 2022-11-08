export default () => ({
  name: 'minify-template',
  transform(code) {
    return {
      code: code.replace(/`[^`]*`/g, (template) => template
        .replace(/\n/g, '')
        .replace(/  +/g, ' ')
        .replace(/> /g, '>')
        .replace(/ </g, '<')),
    };
  },
});
