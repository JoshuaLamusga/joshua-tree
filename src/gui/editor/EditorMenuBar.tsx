import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { commandIds, invokeCommand } from "../../common/commands/commands";
import { getStrings } from "../../common/localization/Localization";
import { localizedStrings } from "../../common/localization/LocalizedStrings";
import { dispatchSetLocale, dispatchSetTheme } from "../../common/settings/settings.reducers";
import { saveToLocalStorage } from "../../common/storage/persistence";
import {
  iconSpaceBeforeTextStyle,
  commandBarItemStyle,
  commandBarDropdownButtonStyle,
  commandBarDropdownSeparatorStyle,
  commandBarStyle,
} from "../../common/styles/controlStyles";
import { ISupportedTheme, themes } from "../../common/themes";
import { IRootState } from "../../store";
import { getTheme } from "office-ui-fabric-react/lib/Styling";
import { ICommandBarItemProps } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar.types";
import { CommandBar } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar";
import { IDropdownOption } from "office-ui-fabric-react/lib/components/Dropdown/Dropdown.types";
import { Icon } from "office-ui-fabric-react/lib/components/Icon/Icon";
import { CommandBarDropdown } from "../MenuBarDropdown";

const mapStateToProps = (state: IRootState) => {
  return {
    locale: state.settings.locale,
    reduxState: state,
    strings: getStrings(state.settings.locale),
    themeName: state.settings.theme.localizedName,
    userConsentProvided: state.persistence.userConsentProvided,
    wholeTheme: getTheme(),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setLocale: dispatchSetLocale(dispatch),
    setTheme: dispatchSetTheme(dispatch),
  };
};

export type MainCommandBarOwnProps = {};

type CombinedProps = MainCommandBarOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class EditorMenuBarC extends React.Component<MainCommandBarOwnProps> {
  public render() {
    // File-related options.
    const items: ICommandBarItemProps[] = [
      {
        className: commandBarItemStyle((this.props as CombinedProps).wholeTheme, true),
        data: commandIds.newProject,
        key: "userSettingsCommandBarFileMenuNew",
        name: (this.props as CombinedProps).strings.MenuFileNew,
        iconProps: { iconName: "FabricNewFolder" },
        onClick: () => invokeCommand(commandIds.newProject),
      },
      {
        className: commandBarItemStyle((this.props as CombinedProps).wholeTheme, true),
        data: commandIds.openProjectOrGame,
        key: "userSettingsCommandBarFileMenuOpen",
        name: (this.props as CombinedProps).strings.MenuFileOpen,
        iconProps: { iconName: "OpenFolderHorizontal" },
        onClick: () => invokeCommand(commandIds.openProjectOrGame),
      },
      {
        className: commandBarItemStyle((this.props as CombinedProps).wholeTheme),
        data: commandIds.saveProject,
        key: "userSettingsCommandBarFileMenuSave",
        name: (this.props as CombinedProps).strings.MenuFileSave,
        iconProps: { iconName: "Save" },
        onClick: () => invokeCommand(commandIds.saveProject),
      },
    ];

    // Theme and language options.
    const farItems: ICommandBarItemProps[] = [
      {
        ariaLabel: (this.props as CombinedProps).strings.TipTheme,
        key: "userSettingsCommandBarChosenTheme",
        onRender: this.renderThemeDropdown,
        buttonStyles: commandBarDropdownButtonStyle(),
      },
      {
        ariaLabel: (this.props as CombinedProps).strings.TipLanguage,
        key: "userSettingsCommandBarChosenLocale",
        onRender: this.renderLocaleDropdown,
      },
    ];

    return (
      <CommandBar
        ariaLabel={(this.props as CombinedProps).strings.TipNavigateCommandBar}
        items={items}
        farItems={farItems}
        styles={commandBarStyle}
      />
    );
  }

  /** Generates a key for options in the locale dropdown menu. */
  private getLocaleDropdownOptionKey = (localeId: string) => {
    return `userSettingsLocaleOptions${localeId}`;
  };

  /** Renders the dropdown for the locale picker control. */
  private renderLocaleDropdown = () => {
    const options: IDropdownOption[] = [];

    // Populates the available locales.
    Object.keys(localizedStrings).forEach((localeOption: string) => {
      options.push({
        data: localeOption,
        key: this.getLocaleDropdownOptionKey(localeOption),
        text: localizedStrings[localeOption as keyof typeof localizedStrings].LanguageCodeName,
      });
    });

    /** Switches all GUI to display in the user-chosen language. */
    const updateChangedLocale = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      if (option !== undefined) {
        const localeId = option.data as keyof typeof localizedStrings;
        (this.props as CombinedProps).setLocale(localeId).then(() => {
          saveToLocalStorage((this.props as CombinedProps).reduxState);
        });
      }
    };

    /** Renders the locale dropdown and name of the currently-chosen language. */
    const renderDropdownTitle = () => (
      <>
        <Icon iconName="LocaleLanguage" styles={iconSpaceBeforeTextStyle} />
        <span style={{ fontSize: `${(this.props as CombinedProps).wholeTheme.fonts.large}` }}>
          {localizedStrings[(this.props as CombinedProps).locale].LanguageCodeName}
        </span>
      </>
    );

    return (
      <CommandBarDropdown
        dropdown={{
          defaultSelectedKey: this.getLocaleDropdownOptionKey((this.props as CombinedProps).locale),
          onRenderTitle: renderDropdownTitle,
          options: options,
          onChange: updateChangedLocale,
        }}
      />
    );
  };

  /** Generates a key for options in the theme dropdown menu. */
  private getThemeDropdownOptionKey = (themeName: string) => {
    return `userSettingsThemeOptions${themeName}`;
  };

  /** Renders the dropdown for the theme picker control. */
  private renderThemeDropdown = () => {
    const options: IDropdownOption[] = [];

    // Populates the available themes.
    Object.keys(themes).forEach((themeKey: string) => {
      const theme = themes[(themeKey as unknown) as keyof typeof themes];

      options.push({
        data: theme,
        key: this.getThemeDropdownOptionKey(theme.localizedName),
        text: theme.localizedName,
      });
    });

    /** Switches all GUI to display with the chosen theme. */
    const updateChangedTheme = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      if (option !== undefined) {
        const theme = option.data as ISupportedTheme;
        (this.props as CombinedProps).setTheme(theme).then(() => {
          saveToLocalStorage((this.props as CombinedProps).reduxState);
        });
      }
    };

    /** Renders the theme dropdown and name of the currently-chosen theme. */
    const renderDropdownTitle = () => (
      <span style={{ fontSize: `${(this.props as CombinedProps).wholeTheme.fonts.large}` }}>
        {(this.props as CombinedProps).strings.ThemeDropdownText((this.props as CombinedProps).themeName)}
      </span>
    );

    return (
      <CommandBarDropdown
        dropdown={{
          defaultSelectedKey: this.getThemeDropdownOptionKey((this.props as CombinedProps).themeName),
          onRenderTitle: renderDropdownTitle,
          options: options,
          onChange: updateChangedTheme,
          styles: commandBarDropdownSeparatorStyle((this.props as CombinedProps).wholeTheme),
        }}
      />
    );
  };
}

export const EditorMenuBar = connect(mapStateToProps, mapDispatchToProps)(EditorMenuBarC);
