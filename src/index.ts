import * as path from 'path';
import * as visit from 'unist-util-visit';
import { Plugin } from 'unified';
import { withDefaultConfig } from 'react-docgen-typescript';
import { ReactDocgenTypescriptOptions } from './types';
import { defaultRender } from './render';
import { Link } from 'mdast';

const PLUGIN_NAME = 'react-docgen-typescript';
const reactDocgenTypescript: Plugin<[ReactDocgenTypescriptOptions?]> =
  (options) => {
    const { render, fileParser, ...parseOptions} = {
      render: defaultRender,
      savePropValueAsString: true,
      ...options,
    };
    const parser = fileParser || withDefaultConfig(parseOptions);
    return (tree, vfile) => {
      visit(tree, 'link', (node: Link, index, parent) => {
        try {
          /* istanbul ignore next */
          if (node.title && node.title.startsWith('react-docgen-typescript:')) {
            const doc = parser.parse(path.resolve(vfile.dirname, node.url));
            const docNode = render(doc);
            vfile.info('react-docgen-typescript link replaced with table', node.position, PLUGIN_NAME);
            parent.children.splice(index, 1, docNode);
          }
        } catch (error) {
          vfile.message(`Failed processing react component file at ${node.url}. Details: ${error}`, node.position, PLUGIN_NAME);
        }
      });
    }
  };

// fix commonjs
export = reactDocgenTypescript;
