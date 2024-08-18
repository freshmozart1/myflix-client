import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import esLintConfigPrettier from "eslint-config-prettier";

export default [
    { files: ["**/*.{js,mjs,cjs,jsx}"] },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            pluginReact
        },
        rules: {
            "react/react-in-jsx-scope": 0
        }
    },
    esLintConfigPrettier
];