# remark-react-docgen-typescript

[remark](https://github.com/remarkjs/remark) plugin to transform React component to Markdown by  [`react-docgen-typescript`](https://github.com/styleguidist/react-docgen-typescript)

## Usage

``` sh
yarn add -D remark-react-docgen-typescript
```

``` ts
import * as remark from 'remark';
import { reactDocgenTypescript } from 'remark-react-docgen-typescript';
import * as vfile from 'to-vfile';

const doc = vfile.readSync('README.md');
console.log(remark().use(remarkReactDocgenTypescript).processSync(doc).contents);
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

<react-docgen-typescript src="./Column.tsx" />
```

Into

``` markdown
# foo-components

## API

### Column

Form column.

#### props

| prop      | description            | type                                | default | required                      |
| --------- | ---------------------- | ----------------------------------- | ------- | ----------------------------- |
| **prop1** | prop1 description      | `string`                            | `null`  | :negative_squared_cross_mark: |
| **prop2** | prop2 description      | `number`                            | `null`  | :white_check_mark:            |
| **prop3** | prop3 description      | `() => void`                        | `null`  | :white_check_mark:            |
| **prop4** | prop4 description 中文 | `"option1" | "option2" | "option3"` | `null`  | :white_check_mark:            |
```

## Options

### `remark().use(reactDocgenTypescript[, options])`

#### render

Custom document rendering

``` ts
import * as remark from 'remark';
import { reactDocgenTypescript, ReactDocgenTypescriptRender } from 'remark-react-docgen-typescript';
import * as vfile from 'to-vfile';

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

const render: ReactDocgenTypescriptRender = (docs) => docs
  .map(doc => `\`${doc.displayName}\`: ${doc.description}\n\n${tableRender(doc)}`)
  .join('\n');

const doc = vfile.readSync('README.md');
console.log(remark().use(remarkReactDocgenTypescript, { render }).processSync(doc).contents);
```
