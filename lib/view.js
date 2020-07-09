import dependencies from 'dependencies';

const { render, html } = dependencies.lighterhtml;
const { DocumentFragment } = dependencies.globals;

export const view = (defaultProps, renderFunction) => {
  const fragment = new DocumentFragment();
  const renderImpl = (props) => render(fragment, renderFunction(html)(props));
  let props = defaultProps;
  return {
    render: () => renderImpl(props),
    update: (updaterFunction) => {
      props = { ...props, ...updaterFunction(props) };
      renderImpl(props);
    },
  };
};

const kebabCase = (s) => s.replace(/[A-Z]/g, (upperChar) => `-${upperChar.toLowerCase()}`);

export const toCssText = (styleObject) => (
  Object.entries(styleObject).reduce((acc, [key, value]) => `${acc}${kebabCase(key)}:${value};`, '')
);
