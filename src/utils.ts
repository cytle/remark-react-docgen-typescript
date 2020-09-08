import * as u from 'unist-builder';
import { AlignType, Table, StaticPhrasingContent } from 'mdast';

export const mdastTableBuilder = (
  [...rows]: Array<Array<string|StaticPhrasingContent>>,
  align: AlignType[] = [],
): Table => u(
  'table',
  { align },
  rows.map(row => u(
    'tableRow',
    row.map(vo => u(
      'tableCell',
      [typeof vo === 'string' ? u('text', vo): vo],
    )),
  )),
);
