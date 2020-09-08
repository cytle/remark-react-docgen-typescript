import { ParserOptions, ComponentDoc, FileParser } from 'react-docgen-typescript';

export type ReactDocgenTypescriptRender = (docs: ComponentDoc[]) => string;

export type ReactDocgenTypescriptOptions = ParserOptions & {
  /**
   * Custom document rendering
   * @default defaultRender
   */
  render?: ReactDocgenTypescriptRender;
  fileParser?: FileParser;
};
