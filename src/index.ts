import * as path from 'path';
import * as visit from 'unist-util-visit';
import { Plugin } from 'unified';
import { withDefaultConfig } from 'react-docgen-typescript';
import { ReactDocgenTypescriptOptions } from './types';
import { mdastBuilder } from 'react-docgen-typescript-markdown-render';
import { Link } from 'mdast';
import * as pathExists from 'path-exists';
import * as u from 'unist-builder';

const PLUGIN_NAME = 'react-docgen-typescript';
const reactDocgenTypescript: Plugin<[ReactDocgenTypescriptOptions?]> =
  (options) => {
    const { render, fileParser, ...parseOptions} = {
      render: (docs) => u('root', mdastBuilder(docs)),
      savePropValueAsString: true,
      ...options,
    };
    const parser = fileParser || withDefaultConfig(parseOptions);
    return (tree, vfile) => {
      visit(tree, 'link', (node: Link, index, parent) => {
        try {
          /* istanbul ignore next */
          if (node.title && node.title.startsWith('react-docgen-typescript:')) {
            const p = path.resolve(vfile.dirname, node.url);
            vfile.info(`parse React Component which path is ${p}`, node.position, PLUGIN_NAME);
            if (!pathExists.sync(p)) {
              throw new Error('file does not exist');
            }
            const componentDocs = parser.parse(p);
            const docNode = render(componentDocs);
            vfile.info(`react-docgen-typescript link replaced with table at ${node.url}`, node.position, PLUGIN_NAME);
            parent.children.splice(index, 1, docNode);
          }
        } catch (error) {
          vfile.fail(`Failed processing react component file at ${node.url}. Details: ${error}`, node.position, PLUGIN_NAME);
        }
      });
    }
  };

// fix commonjs
export = reactDocgenTypescript;
