[![TypeScript version][ts-badge]][typescript-4-0]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fcytle%2Fremark-react-docgen-typescript%2Fbadge&style=flat)](https://actions-badge.atrox.dev/cytle/remark-react-docgen-typescript/goto)


# remark-react-docgen-typescript

[remark](https://github.com/remarkjs/remark) plugin to transform React component to Markdown by  [`react-docgen-typescript`](https://github.com/styleguidist/react-docgen-typescript)

## Getting Started

``` sh
yarn add -D remark-react-docgen-typescript
```

``` ts
import * as remark from 'remark';
import * as reactDocgenTypescript from 'remark-react-docgen-typescript';
import * as vfile from 'to-vfile';

const doc = vfile.readSync('README.md');
console.log(remark().use(reactDocgenTypescript).processSync(doc).contents);
```

The Component [`Column.tsx`](./__tests__/components/Column/Column.tsx)

``` tsx
import * as React from "react";
import { Component } from "react";

/**
 * Column properties.
 */
export interface IColumnProps {
  /** prop1 description */
  prop1?: string;
  /** prop2 description */
  prop2: number;
  /**
   * prop3 description
   */
  prop3: () => void;
  /** prop4 description */
  prop4: "option1" | "option2" | "option3";
}

/**
 * Form column.
 */
export class Column extends Component<IColumnProps> {
  render() {
    return <div>Test</div>;
  }
}
```

Convert the following Markdown:

``` markdown
# foo-components

## API

[Column](./Column.tsx "react-docgen-typescript:")
```

Into

``` markdown
# foo-components

## API

### Column

Form column.

#### Props

| Name               | Type                                | Default value | Description              |
| ------------------ | ----------------------------------- | ------------- | ------------------------ |
| prop1              | string                              | "red"         | prop1 description        |
| prop2 _(required)_ | number                              |               | prop2 description        |
| prop3 _(required)_ | () => void                          |               | prop3 description a \| b |
| prop4 _(required)_ | "option1" \| "option2" \| "option3" |               | prop4 description 中文   |
```

## Options

### `remark().use(reactDocgenTypescript[, options])`

#### render

Custom document rendering

``` ts
import * as remark from 'remark';
import * as reactDocgenTypescript from 'remark-react-docgen-typescript';
import { ReactDocgenTypescriptRender } from 'remark-react-docgen-typescript/build/types';
import * as vfile from 'to-vfile';
import * as stringWidth from 'string-width';
import { componentDocTableMdastBuilder } from 'react-docgen-typescript-markdown-render';

const tableRender = (componentDoc: ComponentDoc): Table => componentDocTableMdastBuilder(componentDoc, [
  { title: '属性', render: (vo) => u('strong', [u('text', vo.name)]) },
  { title: '描述', render: (vo) => vo.description,},
  { title: '类型', render: (vo) => u('inlineCode', vo.type.name) },
  { title: '默认值', render: (vo) => vo.defaultValue ? vo.defaultValue.value : '-' },
]);

const render: ReactDocgenTypescriptRender = (docs) => u('root', docs.map(vo => tableRender(vo)));;

const doc = vfile.readSync('README.md');

const { contents } = remark()
  .use({
    settings: { stringLength: stringWidth }
  })
  .use(reactDocgenTypescript, { render })
  .processSync(doc);
console.log(contents);
```

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/master/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-4.0-blue.svg
[typescript-4-0]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2012.13-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v12.x/docs/api/
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/jsynowiec/node-typescript-boilerplate/blob/master/LICENSE
