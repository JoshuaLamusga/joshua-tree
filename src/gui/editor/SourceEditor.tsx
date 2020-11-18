import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { idEditorInputfield } from "../../common/identifiers";
import { dispatchSaveAndRunStory, dispatchSetStory } from "../../common/redux/viewedit.reducers";
import { IRootState } from "../../store";

const mapStateToProps = (state: IRootState) => {
  return {
    story: state.viewEdit.story,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    saveAndRunStory: dispatchSaveAndRunStory(dispatch),
    setStory: dispatchSetStory(dispatch),
  };
};

export type SourceEditorOwnProps = {};

type CombinedProps = SourceEditorOwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class SourceEditorC extends React.Component<SourceEditorOwnProps> {
  public render() {
    return (
      <>
        <textarea id={idEditorInputfield} onBlur={this.updateStory} />
      </>
    );
  }

  private updateStory = (ev: React.FocusEvent<HTMLTextAreaElement>) => {
    if ((this.props as CombinedProps).story !== ev.currentTarget.value) {
      (this.props as CombinedProps).setStory(ev.currentTarget.value);
    }
  };
}

export const SourceEditor = connect(mapStateToProps, mapDispatchToProps)(SourceEditorC);
