# remark-react-docgen-typescript

Import React component documentation by react-docgen-typescript [`react-docgen-typescript`](https://github.com/styleguidist/react-docgen-typescript)

### Usage

``` sh
yarn add -D remark-react-docgen-typescript
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

``` ts
const remark = require('remark');
const remarkReactDocgenTypescript = require('remark-react-docgen-typescript');

const doc = `# foo-components

## API

<react-docgen-typescript src="./Column.tsx" />
`;
console.log(remark().use(remarkReactDocgenTypescript).processSync(doc).contents);
```

Into

``` markdown
# foo-components

## API

### Column

Form column.

#### props

| prop | description | type | default | required |
| ---- | ----------- | ---- | ------- | -------- |
| **prop1** | prop1 description | `string` | `null` | :negative_squared_cross_mark: |
| **prop2** | prop2 description | `number` | `null` | :white_check_mark: |
| **prop3** | prop3 description | `() => void` | `null` | :white_check_mark: |
| **prop4** | prop4 description | `"option1" | "option2" | "option3"` | `null` | :white_check_mark: |
```
