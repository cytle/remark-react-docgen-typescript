import reactDocgenTypescript, { ReactDocgenTypescriptRender } from '../src';
import { readFileSync } from 'fs-extra';
import * as vfile from 'to-vfile';
import * as path from 'path';
import * as remark from 'remark';
import { ComponentDoc } from 'react-docgen-typescript';
import * as markdownTable from 'markdown-table';
import stringWith from 'string-width';
import * as docgen from 'react-docgen-typescript';

describe('remark use reactDocgenTypescript', () => {
  it('parse Column/README.md', () => {
    const componentPath = path.resolve(__dirname, 'components', 'Column');

    const { contents } = remark()
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
    const tableRender = (doc: ComponentDoc) => markdownTable([
      ['属性', '描述', '类型', '默认值'],
      ...Object.values(doc.props).map((vo) =>
        [
          `**${vo.name}**`,
          vo.description,
          `\`${vo.type.name}\``,
          vo.defaultValue ? vo.defaultValue.value : '-',
        ]
      )
    ], {
      stringLength: stringWith,
    });
    const renderComponentApi = (doc: ComponentDoc) => `\`${doc.displayName}\`: ${doc.description}\n\n${tableRender(doc)}`;
    const render: ReactDocgenTypescriptRender = (docs) => docs.map(doc => renderComponentApi(doc)).join('\n');
    const { contents } = remark()
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
});
