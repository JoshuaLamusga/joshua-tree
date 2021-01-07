import { commandIds, invokeCommand } from "../../common/commands/commands";
import { getStrings } from "../../common/localization/Localization";
import { commandBarItemStyle } from "../../common/styles/controlStyles";
import { getTheme } from "office-ui-fabric-react/lib/Styling";
import { ICommandBarItemProps } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar.types";

interface IValues {
  strings: ReturnType<typeof getStrings>;
  wholeTheme: ReturnType<typeof getTheme>;
}

/** Returns command bar items associated with the runner. */
export const getRunnerCommandItems = (values: IValues): ICommandBarItemProps[] => {
  return [
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
};
