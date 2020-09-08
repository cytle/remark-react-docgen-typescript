import { Node } from "unist";
import { ReactDocgenTypescriptRender } from './types';
import { ComponentDoc } from 'react-docgen-typescript';
import * as u from 'unist-builder';
import { mdastTableBuilder } from './utils';
import { Table } from 'mdast';

export const defaultRender: ReactDocgenTypescriptRender = (docs) => u('root', docs.map(vo => defaultComponentDocRender(vo)));

export const defaultComponentDocRender = (componentDoc: ComponentDoc): Node => u('root', [
  u('heading', {depth:3}, [u('text', componentDoc.displayName)]),
  u('text', componentDoc.description),
  u('heading', {depth:4}, [u('text', 'props')]),
  defaultComponentDocTableRender(componentDoc),
]);

export const defaultComponentDocTableRender = (componentDoc: ComponentDoc): Table => mdastTableBuilder([
  ['prop', 'description', 'type', 'default', 'required'],
  ...Object.values(componentDoc.props).map((vo) =>
    [
      u('strong', [u('text', vo.name)]),
      vo.description,
      u('inlineCode', vo.type.name),
      `${vo.defaultValue && vo.defaultValue.value}`,
      vo.required ? ':white_check_mark:' : ':negative_squared_cross_mark:',
    ]
  )
]);
