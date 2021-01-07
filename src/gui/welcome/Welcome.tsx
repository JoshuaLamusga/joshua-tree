// TODO: localize Play and New buttons

import { DefaultButton } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { commandIds, invokeCommand } from "../../common/commands/commands";
import { routes } from "../../common/routing/Routing";
import { welcomeButtonStyle } from "../../common/styles/controlStyles";
import { IRootState } from "../../store";

const mapStateToProps = (state: IRootState) => {
  return {
    theme: state.settings.theme,
  };
};

type WelcomeOwnProps = {};
type CombinedProps = WelcomeOwnProps & RouteComponentProps & ReturnType<typeof mapStateToProps>;

export class WelcomeC extends React.Component<CombinedProps> {
  public render() {
    const buttonStyle = welcomeButtonStyle((this.props as CombinedProps).theme.theme);
    return (
      <div
        style={{
          alignContent: "center",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DefaultButton onClick={this.onClickLoadGame} styles={buttonStyle}>
            Open & Play
          </DefaultButton>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DefaultButton onClick={this.onClickLoadProject} styles={buttonStyle}>
            Open & Edit
          </DefaultButton>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DefaultButton onClick={this.onClickNew} styles={buttonStyle}>
            New
          </DefaultButton>
        </div>
      </div>
    );
  }

  private onClickLoadGame = () => {
    invokeCommand(commandIds.openProjectOrGame, {
      data: {
        data: () => {
          this.props.history.push(routes.play);
        },
      },
    });
  };

  private onClickLoadProject = () => {
    invokeCommand(commandIds.openProjectOrGame, {
      data: {
        data: () => {
          this.props.history.push(routes.edit);
        },
      },
    });
  };

  private onClickNew = () => {
    invokeCommand(commandIds.newProject, { data: this.props.history });
    this.props.history.push(routes.edit);
  };
}

export const Welcome = connect(mapStateToProps)(withRouter(WelcomeC));
