import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import copy from 'rollup-plugin-copy';
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
import tailwindcss from "@tailwindcss/postcss"
import postcssimport from "postcss-import";
import dotenv from "rollup-plugin-dotenv"

export default {
  input: 'index.html',
  output: {
    format: "es"
  },
  plugins: [
    html({ extractAssets: false }),

    dotenv(),

    typescript(
      {
        "compilerOptions": {
          "target": "es2018",
          "module": "esnext",
          "moduleResolution": "node",
          "noEmitOnError": true,
          "lib": ["es2017", "dom"],
          "strict": true,
          "esModuleInterop": false,
          "rootDir": "./",
          "experimentalDecorators": true,
          "strictPropertyInitialization": false,
          "sourceMap": true, 
          "inlineSources": true,
          "useDefineForClassFields": false,
          "allowSyntheticDefaultImports": true,
        },
        "include": ["./src/**/*.ts"]
      }
    ),

    postcss({
      extract: true, 
      minimize: true,
      extensions: ['.css'],
      plugins: [
        postcssimport(),
        tailwindcss(),
      ],
    }),

    terser(),

    copy({
      copyOnce: true,
      targets: [
        {
          src: 'node_modules/@shoelace-style/shoelace/dist/assets',
          dest: 'dist/assets/shoelace'
        }
      ]
    })
  ],

  output: {
    dir: 'dist',
  },

  preserveEntrySignatures: 'strict',

  watch: {
    exclude: ['node_modules/**', 'dist/**']
  },
};
