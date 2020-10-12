import * as React from "react";
import { connect } from "react-redux";
import { IRootState } from "../../store";
import { parseStory } from "../storyParser";
import { StoryInterpreter, StoryInterpreterC } from "../storyInterpreter";

const mapStateToProps = (state: IRootState) => {
  return {
    storyToParse: state.viewEdit.storyToParse,
  };
};

type RunnerViewOwnProps = {};

type CombinedProps = RunnerViewOwnProps & ReturnType<typeof mapStateToProps>;

export class RunnerViewC extends React.Component<RunnerViewOwnProps> {
  private interpreterRef: React.RefObject<StoryInterpreterC>;

  constructor(props: RunnerViewOwnProps) {
    super(props);

    this.interpreterRef = React.createRef<StoryInterpreterC>();
  }

  public componentDidUpdate() {
    try {
      parseStory((this.props as CombinedProps).storyToParse, this.interpreterRef);
    } catch (ex) {
      if (this.interpreterRef.current && typeof ex === "string") {
        this.interpreterRef.current.setErrorMessage(ex);
      } else if (this.interpreterRef.current && ex instanceof Error) {
        this.interpreterRef.current.setErrorMessage(ex.message);
      } else {
        console.error(
          "Reference to interpreter element was undefined. An additional error follows."
        );
        console.error(ex);
      }
    }
  }

  public render() {
    return <StoryInterpreter ref={this.interpreterRef} />;
  }
}

export const RunnerView = connect(mapStateToProps)(RunnerViewC);
