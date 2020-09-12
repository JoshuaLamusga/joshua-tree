import { IStyle, mergeStyles } from "office-ui-fabric-react/lib/Styling";
import * as React from "react";
import { MenuBar } from "./MenuBar";

const MainViewS: { [key: string]: string } = {
  flex: mergeStyles({ display: "flex" }),
  flexChild: mergeStyles({ flexGrow: 1 }),
};

export class MainView extends React.Component<{}> {
  public componentDidMount() {
    document.body.style.margin = "0px";
  }

  public render() {
    return (
      <>
        <MenuBar />
        <div className={MainViewS.flex}>
          <div className={MainViewS.flexChild}>FOO</div>
          <div className={MainViewS.flexChild}>BAR</div>
        </div>
      </>
    );
  }
}
