import { reactDocgenTypescript } from '../src/main';
import { readFileSync } from 'fs-extra';
import * as vfile from 'to-vfile';
import * as path from 'path';
import * as remark from 'remark';

describe('greeter function', () => {
  // Assert greeter result
  it('greets a user with `Hello, {name}` message', () => {
    const componentPath = path.resolve(__dirname, 'components', 'Column');

    const { contents } = remark()
      .use(reactDocgenTypescript)
      .processSync(vfile.readSync(path.join(componentPath, 'README.md')));

    expect(contents)
      .toBe(
        readFileSync(
          path.join(componentPath, 'expect.md'),
          'utf-8',
        ),
      );
  });
});
