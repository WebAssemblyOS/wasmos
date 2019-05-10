/**
 * This package handles all configurations with setting up the kernel.
 */

// import { init, fs } from "../fs";
// import * as ts from "ntypescript";
// import * as os from "../os";

export async function bootup() {
  // await init();
  setupReslover(window);
  setupTypescript(window);

}

function setupReslover(window: any) {
  const systemJSPrototype = window.System.constructor.prototype;
  const resolve = systemJSPrototype.resolve
  systemJSPrototype.resolve

}

function setupTypescript(window: any) {
  const systemJSPrototype = window.System.constructor.prototype;
  const instantiate = systemJSPrototype.instantiate;
  systemJSPrototype.instantiate = async function(url, parent) {
    if (!['.js', '.ts'].indexOf(url.slice(-3)))
      return instantiate.call(this, url, parent);
    const loader = this;
    return fetch(url)
      .then(function(res) {
        if (!res.ok)
          throw new Error('Fetch error: ' + res.status + ' ' + res.statusText + (parent ? ' loading from  ' + parent : ''));
        return res.text();
      })
      .then(function(source) {
        return loader.transform.call(this, url, JSON.parse(source));
      })
      .then(function(source) {
        return [[], function(_export) {
          return {
            setters: [],
            execute: function() {
              _export(source);
            }
          }
        }]
      });
  };


}

/*
 * SystemJS format Babel transformer
 */

// import * as babel from '@babel/core';
// import babelPluginSyntaxDynamicImport from '@babel/plugin-syntax-dynamic-import';
// import babelPluginSyntaxImportMeta from '@babel/plugin-syntax-import-meta';
// import babelPluginTransformModulesSystemJS from '@babel/plugin-transform-modules-systemjs';
// import babelPluginTransformTypescript from "@babel/plugin-transform-typescript";

// const plugins = [
//   babelPluginSyntaxDynamicImport,
//   babelPluginSyntaxImportMeta,
//   babelPluginTransformModulesSystemJS,
//   babelPluginTransformTypescript
// ];

function setupBabel(window: any) {
  // const systemJSPrototype = window.System.constructor.prototype;
  // const transform = systemJSPrototype.transform;
  // systemJSPrototype.transform = function(url, source) {
  //   // composition of transform is done based on assuming every format
  //   // returns its own System.register. So we don't "compose" transforms
  //   // but rather treat transforms "fallbacks" where they can select themselves
  //   return Promise.resolve(transform.call(this, url, source))
  //     .then(function(_source) {
  //       console.log("setting up " + url);
  //       // if there was translation done, then stop
  //       if (source !== _source)
  //         return _source;

  //       return new Promise((resolve, reject) => {
  //         babel.transform(source, {
  //           plugins: plugins,
  //           sourceMaps: 'inline',
  //           sourceFileName: url.split('/').pop()
  //         }, function(err, result) {
  //           if (err)
  //             reject(err);
  //           else
  //             resolve(result);
  //         });
  //       })
  //         .then(function(result: any) {
  //           return result.code;
  //         });
  //     })
  // };
}
