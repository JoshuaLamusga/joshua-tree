import { PrimaryButton, getTheme } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { idEditorInputfield } from "../../common/identifiers";
import { dispatchSaveAndRunStory, dispatchSetStory } from "../../common/redux/viewedit.reducers";
import { IRootState } from "../../store";
import { textAreaStyle } from "../../common/styles/controlStyles";

const mapStateToProps = (state: IRootState) => {
  return {
    story: state.viewEdit.story,
    theme: state.settings.theme, // Needed to re-render on theme change.
    wholeTheme: getTheme(),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    saveAndRunStory: dispatchSaveAndRunStory(dispatch),
    setStory: dispatchSetStory(dispatch),
  };
};

export type EditorViewOwnProps = {};

type CombinedProps = EditorViewOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class EditorViewC extends React.Component<EditorViewOwnProps> {
  public componentDidUpdate(prevProps: EditorViewOwnProps) {
    if ((this.props as CombinedProps).story !== (prevProps as CombinedProps).story) {
      document
        .getElementById(idEditorInputfield)
        ?.setAttribute("value", (this.props as CombinedProps).story);
    }
  }

  public render() {
    debugger;
    return (
      <>
        <textarea
          style={textAreaStyle((this.props as CombinedProps).wholeTheme)}
          id={idEditorInputfield}
          onBlur={this.updateStory}
        />
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <PrimaryButton
            styles={{ root: { display: "block" } }}
            text={"play"}
            onClick={this.runStory}
          />
        </div>
      </>
    ); // TODO: localize
  }

  private runStory = () => {
    const currentStory = (document.getElementById(idEditorInputfield) as HTMLTextAreaElement).value;
    (this.props as CombinedProps).saveAndRunStory(currentStory);
  };

  private updateStory = (ev: React.FocusEvent<HTMLTextAreaElement>) => {
    if ((this.props as CombinedProps).story !== ev.currentTarget.value) {
      (this.props as CombinedProps).setStory(ev.currentTarget.value);
    }
  };
}

export const EditorView = connect(mapStateToProps, mapDispatchToProps)(EditorViewC);
