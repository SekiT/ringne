export default () => ({
  name: 'unbreak-template',
  transform(code) {
    return {
      code: code.replace(/`[^`]*`/g, (template) => template.replace(/\n/g, '')),
    };
  },
});
