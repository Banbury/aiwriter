import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import copy from 'rollup-plugin-copy';
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
import tailwindcss from "@tailwindcss/postcss"
import css from "rollup-plugin-import-css";
import postcssimport from "postcss-import";
import dotenv from "rollup-plugin-dotenv"

export default {
  input: 'index.html',
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
        },
        "include": ["./src/**/*.ts"]
      }
    ),

    postcss({
      extract: true, 
      minimize: true,
      extensions: ['.css'],
      // inject: {
      //   insertAt: "top",
      // },
      plugins: [
        postcssimport(),
        tailwindcss(),
      ],
    }),
//    css(),
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
