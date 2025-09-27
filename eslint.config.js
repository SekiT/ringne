const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: "eslint-config-airbnb-base",

    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },

    settings: {
        "import/resolver": {
            alias: [["@", "./"], ["dependencies", "./dependencies"]],
        },
    },

    rules: {
        "no-unused-expressions": ["error", {
            allowTaggedTemplates: true,
        }],

        "object-shorthand": ["error", "properties"],
        "func-names": ["error", "as-needed"],

        "import/no-extraneous-dependencies": ["error", {
            devDependencies: ["test/**", "rollup-config/**"],
            optionalDependencies: false,
        }],
    },
}, globalIgnores(["**/bundle.js"])]);
