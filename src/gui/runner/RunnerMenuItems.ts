import { commandIds, invokeCommand } from "../../common/commands/commands";
import { getStrings } from "../../common/localization/Localization";
import { commandBarItemStyle } from "../../common/styles/controlStyles";
import { getTheme } from "office-ui-fabric-react/lib/Styling";
import { ICommandBarItemProps } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar.types";
import { RouteComponentProps } from "react-router-dom";

interface IValues {
  history: RouteComponentProps["history"];
  strings: ReturnType<typeof getStrings>;
  wholeTheme: ReturnType<typeof getTheme>;
}

/** Returns command bar items associated with the runner. */
export const getRunnerCommandItems = (values: IValues) => {
  const items: ICommandBarItemProps[] = [
    {
      className: commandBarItemStyle(values.wholeTheme, true),
      data: commandIds.openProjectOrGame,
      key: "userSettingsCommandBarFileMenuOpen",
      name: values.strings.MenuFileOpen,
      iconProps: { iconName: "OpenFolderHorizontal" },
      onClick: () => invokeCommand(commandIds.openProjectOrGame),
    },
    {
      className: commandBarItemStyle(values.wholeTheme),
      data: commandIds.saveProjectOrGame,
      key: "userSettingsCommandBarFileMenuSave",
      name: values.strings.MenuFileSave,
      iconProps: { iconName: "Save" },
      onClick: () => invokeCommand(commandIds.saveProjectOrGame),
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      className: commandBarItemStyle(values.wholeTheme),
      data: commandIds.switchMode,
      key: "userSettingsCommandBarFileMenuSwitchMode",
      tooltipHostProps: { content: values.strings.MenuFileSwitch },
      iconOnly: true,
      iconProps: { iconName: "Switch" },
      onClick: () => invokeCommand(commandIds.switchMode, { data: { history: values.history } }),
    },
  ];

  return { items, farItems };
};
