import * as React from "react";
import { idEditorWrapper, idRunnerWrapper } from "../../common/identifiers";
import { mainViewWrapperStyle, mainViewEditorStyle, mainViewRunnerStyle } from "../../common/styles/controlStyles";
import { connect } from "react-redux";
import { IRootState } from "../../store";
import { EditorView } from "../editor/EditorView";
import { MenuBar } from "../menu/MenuBar";
import { RunnerView } from "../runner/RunnerView";

const mapStateToProps = (state: IRootState) => {
  return {
    theme: state.settings.theme,
  };
};

export type MainViewOwnProps = {};

type CombinedProps = MainViewOwnProps & ReturnType<typeof mapStateToProps>;

export class MainViewC extends React.Component<MainViewOwnProps> {
  public componentDidMount() {
    document.body.style.margin = "0px";
  }

  public render() {
    return (
      <>
        <MenuBar />
        <div className={mainViewWrapperStyle}>
          <div id={idEditorWrapper} className={mainViewEditorStyle}>
            <EditorView />
          </div>
          <div id={idRunnerWrapper} style={mainViewRunnerStyle((this.props as CombinedProps).theme.theme) as object}>
            <RunnerView />
          </div>
        </div>
      </>
    );
  }
}

export const MainView = connect(mapStateToProps)(MainViewC);
