import dependencies from 'dependencies';

const { wire } = dependencies.hyperhtml;

export const view = (defaultProps, renderFunction) => {
  const renderImpl = renderFunction(wire());
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
