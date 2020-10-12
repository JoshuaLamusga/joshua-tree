import { mergeStyles } from "office-ui-fabric-react/lib/Styling";
import * as React from "react";
import { EditorView } from "../../parsing/editor/EditorView";
import { RunnerView } from "../../parsing/runner/RunnerView";
import { MenuBar } from "./MenuBar";
import { idEditorWrapper, idRunnerWrapper } from "../../common/identifiers";

const MainViewS = {
  flex: mergeStyles({ display: "flex", alignItems: "stretch" }),
  editorWrapper: mergeStyles({ height: "90vh", margin: "0 4px 0 0", width: "50vw" }),
  runnerWrapper: mergeStyles({
    border: "1px solid black",
    margin: "0 0 0 4px",
    width: "50vw",
    overflowY: "scroll",
  }),
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
          <div id={idEditorWrapper} className={MainViewS.editorWrapper}>
            <EditorView />
          </div>
          <div id={idRunnerWrapper} className={MainViewS.runnerWrapper}>
            <RunnerView />
          </div>
        </div>
      </>
    );
  }
}
