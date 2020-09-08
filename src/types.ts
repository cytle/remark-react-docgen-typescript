import { Node } from 'unist';
import { ParserOptions, ComponentDoc, FileParser } from 'react-docgen-typescript';

export type ReactDocgenTypescriptRender = (docs: ComponentDoc[]) => Node;

export type ReactDocgenTypescriptOptions = ParserOptions & {
  /**
   * Custom document rendering
   * @default defaultRender
   */
  render?: ReactDocgenTypescriptRender;
  fileParser?: FileParser;
};
