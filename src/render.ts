import * as markdownTable from 'markdown-table';
import * as stringLength from 'string-width';
import { ReactDocgenTypescriptRender } from './types';
import { ComponentDoc } from 'react-docgen-typescript';

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
