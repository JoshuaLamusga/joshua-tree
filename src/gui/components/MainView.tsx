import * as React from "react";
import { MainCommandBar } from "./MainCommandBar";

export class MainView extends React.Component<{}> {
  public componentDidMount() {
    document.body.style.margin = "0px";
  }

  public render() {
    return <MainCommandBar />;
  }
}
