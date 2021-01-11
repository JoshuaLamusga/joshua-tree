import * as React from "react";
import { connect } from "react-redux";
import { IRootState } from "../../store";

const mapStateToProps = (state: IRootState) => {
  return {};
};

type RunnerSettingsOwnProps = {};
type CombinedProps = RunnerSettingsOwnProps & ReturnType<typeof mapStateToProps>;

export class RunnerSettingsC extends React.Component<RunnerSettingsOwnProps> {
  public render() {
    return <p>Runner settings</p>;
  }
}

export const RunnerSettings = connect(mapStateToProps)(RunnerSettingsC);
