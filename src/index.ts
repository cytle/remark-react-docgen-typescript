import * as path from 'path';
import * as visit from 'unist-util-visit';
import { Plugin } from 'unified';
import { withDefaultConfig, ParserOptions, ComponentDoc, FileParser } from 'react-docgen-typescript';
import * as parse5 from 'parse5';
import * as fromParse5 from 'hast-util-from-parse5';
import * as isElement from 'hast-util-is-element';
import * as hasProperty from 'hast-util-has-property';
import { Parent } from 'unist';
import * as markdownTable from 'markdown-table';
import * as stringLength from 'string-width';

export type ReactDocgenTypescriptRender = (docs: ComponentDoc[]) => string;

export type ReactDocgenTypescriptOptions = ParserOptions & {
  /**
   * Custom document rendering
   * @default defaultRender
   */
  render?: ReactDocgenTypescriptRender;
  fileParser?: FileParser;
};
const reactDocgenTypescript: Plugin<[ReactDocgenTypescriptOptions?]> =
  (options) => {
    const { render, fileParser, ...parseOptions} = {
      render: defaultRender,
      savePropValueAsString: true,
      ...options,
    };
    const parser = fileParser || withDefaultConfig(parseOptions);
    return (tree, file) => {
      visit(tree, 'html', (node) => {
        /* istanbul ignore next */
        if (typeof node.value === 'string') {
          const hast = createElementNodeFromHtml(node.value);

          if (isElement(hast, 'react-docgen-typescript') && hasProperty(hast, 'src')) {
            const { src } = hast.properties as {src: string};
            const fileAbsPath = path.resolve(file.dirname, src);

            const docs = parser.parse(fileAbsPath);

            node.value = render(docs);
          }
        }
      });
    }
  };

export default reactDocgenTypescript;

// fix commonjs
exports = reactDocgenTypescript;

export const defaultRender: ReactDocgenTypescriptRender = (docs) =>
  docs.map(vo => defaultComponentRender(vo)).join('\n');

export const defaultComponentRender = (componentDoc: ComponentDoc): string => `### ${componentDoc.displayName}

${componentDoc.description}

#### props

${markdownTable([
  ['prop', 'description', 'type', 'default', 'required'],
  ...Object.values(componentDoc.props).map((vo) =>
    [
      `**${vo.name}**`,
      vo.description,
      `\`${vo.type.name}\``,
      `${vo.defaultValue && vo.defaultValue.value}`,
      vo.required ? ':white_check_mark:' : ':negative_squared_cross_mark:',
    ]
  )
], { stringLength })}
`;

const createElementNodeFromHtml = (html: string) => {
  const ast = parse5.parseFragment(html, {sourceCodeLocationInfo: true})
  const hast = fromParse5(ast, {verbose: false}) as Parent;
  return hast.children[0];
}
