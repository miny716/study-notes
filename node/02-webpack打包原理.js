/**
 * https://juejin.cn/post/6844904146827476999#heading-2
 * webpack打包基本流程：
 * 1、读取入口文件的内容
 * 2、分析入口文件，递归去读取文件所依赖的模块，并生成 模块依赖图
 * 3、最终，根据模块依赖图，生成浏览器能够运行的代码
 */

const fs = require("fs");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;
const babelCore = require("@babel/core");

// 1、处理单个模块：将【入口文件代码】 转换为 对象信息。包括文件的绝对路径、依赖模块信息、模块内部经过 babel 转换的代码
const getModuleInfo = (file) => {
  /**
   * 读取文件内容，使用node模块fs
   * 输出入口文件的[字符串]格式，后续可以使用正则或者其他方法提取其中的import、export内容，对入口文件进行分析。
   */
  const body = fs.readFileSync(file, "utf-8");

  /**
   * 通过 @babel/parser，将js文件内容 解析成 js对象的形式，这种js对象叫做【抽象语法树ast】
   * ast = {
        type: 'File',
        program: {
          type: 'Program',
          body: [
            { type: 'ImportDeclaration' },
            { type: 'VariableDeclaration' },
            { type: 'FunctionDeclaration' },
            { type: 'ExportNamedDeclaration' },
          ],
        },
      }
   * 
   * 解析出来的入口文件被放倒ast.program.body数组中，后续通过对数组循环，进行数据处理
   * 
   */
  const ast = babelParser.parse(body, {
    sourceType: "module", // 表示要解析的是es6模块
  });
  /**
   * 新建deps对象，用于收集入口文件的依赖文件
   * 使用 @babel/traverse 遍历ast,处理ImportDeclaration节点，将依赖文件的【相对路径】转换为绝对路径
   */
  const deps = {};
  babelTraverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file); // 获取入口文件的路径 "src"
      // 入口文件依赖文件 node.source.value = 'react'、'react-dom'、'single-spa-react'、'./root.component.js'
      const absPath = "./" + path.join(dirname, node.source.value); // 获取依赖文件的绝对路径
      deps[node.source.value] = absPath;
    },
  });

  /**
   * 获取AST后，使用@babel/core、@babel/preset-env将 es6 语法转换为 es5 语法，以支持低端浏览器
   */
  const { code } = babelCore.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });

  /**
   * {
      "file": "src/index.js",
      "deps": {
        "react": "./src/react",
        "react-dom": "./src/react-dom",
        "single-spa-react": "./src/single-spa-react",
        "./root.component": "./src/root.component"
      },
      "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});......
    }
   */
  return { file, deps, code };
};

// 2、递归获取所有模块信息，也就是获取模块依赖图【dependencies graph】的过程。
// 该过程就是从入口模块开始，对每个模块以及依赖模块都调用getModuleInfo进行分析，最终返回一个包含所有模块的对象。
const parseModules = (file) => {
  // 定义依赖图
  const depsGraph = {};
  // 获取入口文件信息
  const entry = getModuleInfo(file);
  const temp = [entry];

  for (let i = 0; i < temp.length; i++) {
    const item = temp[i];
    const deps = item.deps;

    if (deps) {
      // 遍历模块依赖，递归获取模块信息
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }

  temp.forEach((ele) => {
    depsGraph[ele.file] = { deps: ele.deps, code: ele.code };
  });
  return depsGraph;
};

// 3、生成最终代码：把依赖图中
const bundle = (file) => {
  // 获取整个应用的 依赖图 对象
  const depsGraph = JSON.stringify(parseModules(file));
  // 将 依赖图对象中的内容 转为 可执行的代码，并以字符串的形式输出
  return `(function(graph){
    function require(file){
      var exports = {}
      function absRequire(relPath){
        return require(graph[file].deps[relPath])
      }

      (function(require, exports, code){
        eval(code)
      })(absRequire, exports, graph[file].code)

      return exports
    }

    require('${file}')
  }(depsGraph))`;
};

// 4、将生成的内容写入 JS 文件-bundle.js中，并最后在 HTML 中引入 './dist/bundle.js'文件
const content = bundle("src/index.js");
fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);
