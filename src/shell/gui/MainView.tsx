import { mergeStyles } from "office-ui-fabric-react/lib/Styling";
import * as React from "react";
import { EditorView } from "../../editor/EditorView";
import { RunnerView } from "../../runner/RunnerView";
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
          <div className={MainViewS.flexChild}>
            <EditorView />
          </div>
          <div className={MainViewS.flexChild}>
            <RunnerView />
          </div>
        </div>
      </>
    );
  }
}
