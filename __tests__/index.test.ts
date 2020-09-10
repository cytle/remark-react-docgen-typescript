import * as reactDocgenTypescript from '../src';
import { ReactDocgenTypescriptRender } from '../src/types';
import { readFileSync } from 'fs-extra';
import * as vfile from 'to-vfile';
import * as path from 'path';
import * as remark from 'remark';
import { ComponentDoc } from 'react-docgen-typescript';
import * as docgen from 'react-docgen-typescript';
import * as stringWidth from 'string-width';
import * as u from 'unist-builder';
import { mdastTableBuilder } from '../src/utils';
import { Table } from 'mdast';

describe('remark use reactDocgenTypescript', () => {
  it('parse Column/README.md', () => {
    const componentPath = path.resolve(__dirname, 'components', 'Column');

    const { contents } = remark()
      .use({
        settings: { stringLength: stringWidth }
      })
      .use(reactDocgenTypescript)
      .processSync(vfile.readSync(path.join(componentPath, 'README.md')));

    expect(contents)
      .toBe(
        readFileSync(
          path.join(componentPath, 'default.md'),
          'utf-8',
        ),
      );
  });

  it('Chinese custom render', () => {
    const componentPath = path.resolve(__dirname, 'components', 'Column');

    const tableRender = (componentDoc: ComponentDoc): Table => mdastTableBuilder([
      ['属性', '描述', '类型', '默认值'],
      ...Object.values(componentDoc.props).map((vo) =>
        [
          u('strong', [u('text', vo.name)]),
          vo.description,
          u('inlineCode', vo.type.name),
          vo.defaultValue ? vo.defaultValue.value : '-',
        ]
      )
    ]);

    const render: ReactDocgenTypescriptRender = (docs) => u('root', docs.map(vo => tableRender(vo)));;
    const { contents } = remark()
      .use({
        settings: { stringLength: stringWidth }
      })
      .use(reactDocgenTypescript, { render })
      .processSync(vfile.readSync(path.join(componentPath, 'README.md')));

    expect(contents)
      .toBe(
        readFileSync(
          path.join(componentPath, 'custom.md'),
          'utf-8',
        ),
      );
  });
  it('fileParser', () => {
    const componentPath = path.resolve(__dirname, 'components', 'Column');
    const fileParser = docgen.withDefaultConfig({
      propFilter: {
        skipPropsWithName: ['prop4'],
      }
    });
    const { contents } = remark()
      .use(reactDocgenTypescript, { fileParser })
      .processSync(vfile.readSync(path.join(componentPath, 'README.md')));

    expect(contents)
      .toBe(
        readFileSync(
          path.join(componentPath, 'skipPropsProp4.md'),
          'utf-8',
        ),
      );
  });

  it('throwError', () => {
    expect(() => {
      const componentPath = path.resolve(__dirname, 'components', 'Column');
      remark()
        .use(reactDocgenTypescript)
        .processSync(vfile.readSync(path.join(componentPath, 'throwError.md')));
    })
      .toThrowError('Failed processing react component file at ./notExist.tsx. Details: Error: file does not exist');
  });

});
