import * as React from "react";

/**
 * Column properties.
 */
interface IColumnProps {
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
class Column extends React.Component<IColumnProps> {
  render() {
    return <div>Test</div>;
  }
}

export default Column;
