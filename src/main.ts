import * as path from 'path';
import * as visit from 'unist-util-visit';
import { Plugin } from 'unified';
import { parse, ParserOptions, ComponentDoc } from 'react-docgen-typescript';
import * as parse5 from 'parse5';
import * as fromParse5 from 'hast-util-from-parse5';
import * as isElement from 'hast-util-is-element';
import * as hasProperty from 'hast-util-has-property';
import {Parent} from 'unist';

const renderComponentApi = (componentDoc: ComponentDoc) => [
  `### ${componentDoc.displayName}

${componentDoc.description}

#### props

| prop | description | type | default | required |
| ---- | ----------- | ---- | ------- | -------- |`,
  ...Object.values(componentDoc.props).map((vo) =>
    [
      '',
      `**${vo.name}**`,
      `${vo.description}`,
      `\`${vo.type.name}\``,
      `\`${vo.defaultValue && vo.defaultValue.value}\``,
      vo.required ? ':white_check_mark:' : ':negative_squared_cross_mark:',
      '',
    ].join(' | ').trim()
  ),
  '',
].join('\n');

const createElementNodeFromHtml = (html: string) => {
  const ast = parse5.parseFragment(html, {sourceCodeLocationInfo: true})
  const hast = fromParse5(ast, {verbose: false}) as Parent;
  return hast.children[0];
}
export const reactDocgenTypescript: Plugin<[ParserOptions?]> = (options) => (tree, file) => {
    visit(tree, 'html', (node) => {
      if (typeof node.value === 'string') {
        const hast = createElementNodeFromHtml(node.value);

        if (isElement(hast, 'react-docgen-typescript') && hasProperty(hast, 'src')) {
          const { src } = hast.properties as {src: string};
          if (src) {
            const fileAbsPath = path.resolve(file.dirname, src);

            console.log(fileAbsPath);
            const docs = parse(fileAbsPath, {
                savePropValueAsString: true,
              ...options});

            node.value = docs.map(vo => renderComponentApi(vo)).join('\n');
          }
        }
      }
    });
}
