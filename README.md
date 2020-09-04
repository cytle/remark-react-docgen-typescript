# remark-react-docgen-typescript

Import React component documentation by react-docgen-typescript [`react-docgen-typescript`](https://github.com/styleguidist/react-docgen-typescript)

### Usage

``` sh
yarn add -D remark-react-docgen-typescript
```

The Component `Column.tsx`

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
export class Column extends Component<IColumnProps, {}> {
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

## Apis

<react-docgen-typescript src="./Column.tsx" />
`;
console.log(remark().use(remarkReactDocgenTypescript).process(doc).contents);
```

Into

``` markdown
# foo-components

## Apis

### Column

Form column.

#### props

| prop | type | default | required | description |
|---- | :----: | :-------: | :--------: | -----------|
| **prop1** | `string` | `null` | :x: | prop1 description |
| **prop2** | `number` | `null` | :x: | prop2 description |
| **prop3** | `() => void` | `null` | :x: | prop3 description |
| **prop4** | `"option1" | "option2" | "option3"` | `null` | :x: | prop4 description |
```
