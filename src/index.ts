import * as path from 'path';
import * as visit from 'unist-util-visit';
import { Plugin } from 'unified';
import { withDefaultConfig } from 'react-docgen-typescript';
import { ReactDocgenTypescriptOptions } from './types';
import { defaultRender } from './render';
import { Link } from 'mdast';

const reactDocgenTypescript: Plugin<[ReactDocgenTypescriptOptions?]> =
  (options) => {
    const { render, fileParser, ...parseOptions} = {
      render: defaultRender,
      savePropValueAsString: true,
      ...options,
    };
    const parser = fileParser || withDefaultConfig(parseOptions);
    return (tree, file) => {
      visit(tree, 'link', (node: Link, index, parent) => {
        /* istanbul ignore next */
        if (node.title && node.title.startsWith('react-docgen-typescript:')) {
          const docs = render(parser.parse(path.resolve(file.dirname, node.url)));
          parent.children.splice(index, 1, docs);
        }
      });
    }
  };

// fix commonjs
export = reactDocgenTypescript;
