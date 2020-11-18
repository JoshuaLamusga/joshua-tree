import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { commandIds, invokeCommand } from "../../common/commands/commands";
import { getStrings } from "../../common/localization/Localization";
import { localizedStrings } from "../../common/localization/LocalizedStrings";
import { dispatchSetLocale, dispatchSetTheme } from "../../common/settings/settings.reducers";
import { loadFromLocalStorage, saveToLocalStorage } from "../../common/storage/persistence";
import { dispatchSetUserConsentProvided } from "../../common/storage/persistence.reducers";
import {
  iconSpaceBeforeTextStyle,
  commandBarItemStyle,
  commandBarDropdownButtonStyle,
  commandBarDropdownSeparatorStyle,
  commandBarStyle,
  hiddenAndInaccessible,
} from "../../common/styles/controlStyles";
import { ISupportedTheme, themes } from "../../common/themes";
import { IRootState } from "../../store";
import { CommandBarDropdown } from "./MenuBarDropdown";
import { dispatchSetStory } from "../../common/redux/viewedit.reducers";
import { getTheme } from "office-ui-fabric-react/lib/Styling";
import { ICommandBarItemProps } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar.types";
import { CommandBar } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar";
import { IDropdownOption } from "office-ui-fabric-react/lib/components/Dropdown/Dropdown.types";
import { Icon } from "office-ui-fabric-react/lib/components/Icon/Icon";

/**
 * Browsers require a click to invoke an open file dialog, so this invokes a click on a hidden
 * input element rendered as part of the main command bar. This enables seamless functionality.
 */
export function invokeOpenCommand() {
  hiddenInputRef.current?.click();
}

/** Browsers require a click event on an input control, which is automatically done via this one. */
const hiddenInputRef = React.createRef<HTMLInputElement>();

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
    setConsent: dispatchSetUserConsentProvided(dispatch),
    setLocale: dispatchSetLocale(dispatch),
    setStory: dispatchSetStory(dispatch),
    setTheme: dispatchSetTheme(dispatch),
  };
};

export type MainCommandBarOwnProps = {};

type CombinedProps = MainCommandBarOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class MenuBarC extends React.Component<MainCommandBarOwnProps> {
  /** Applies all user setting stored in local storage, if consent was provided. */
  public componentDidMount() {
    if ((this.props as CombinedProps).userConsentProvided) {
      this.applyLocalStorage();
    }
  }

  public render() {
    // File-related options.
    const items: ICommandBarItemProps[] = [
      {
        className: commandBarItemStyle((this.props as CombinedProps).wholeTheme, true),
        data: commandIds.mainMenuFileNew,
        key: "userSettingsCommandBarFileMenuNew",
        name: (this.props as CombinedProps).strings.MenuFileNew,
        iconProps: { iconName: "FabricNewFolder" },
        onClick: () => invokeCommand(commandIds.mainMenuFileNew),
      },
      {
        className: commandBarItemStyle((this.props as CombinedProps).wholeTheme, true),
        data: commandIds.mainMenuFileOpen,
        key: "userSettingsCommandBarFileMenuOpen",
        name: (this.props as CombinedProps).strings.MenuFileOpen,
        iconProps: { iconName: "OpenFolderHorizontal" },
        onClick: () => invokeCommand(commandIds.mainMenuFileOpen),
      },
      {
        className: commandBarItemStyle((this.props as CombinedProps).wholeTheme),
        data: commandIds.mainMenuFileSave,
        key: "userSettingsCommandBarFileMenuSave",
        name: (this.props as CombinedProps).strings.MenuFileSave,
        iconProps: { iconName: "Save" },
        onClick: () => invokeCommand(commandIds.mainMenuFileSave),
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

    /** Loads the given file to a string for parsing. */
    const handleFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const chosenFiles = ev.target.files;

      if (chosenFiles) {
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          const result = fileReader.result as string;
          (this.props as CombinedProps).setStory(result);
        };

        fileReader.readAsText(chosenFiles[0]);
      }
    };

    return (
      <>
        <input className={hiddenAndInaccessible} onChange={handleFile} ref={hiddenInputRef} type="file" />
        <CommandBar
          ariaLabel={(this.props as CombinedProps).strings.TipNavigateCommandBar}
          items={items}
          farItems={farItems}
          styles={commandBarStyle}
        />
      </>
    );
  }

  /** Updates redux with content loaded from local storage. */
  private applyLocalStorage = () => {
    const state = loadFromLocalStorage();
    if (state !== null) {
      if (state.localeId in localizedStrings) {
        (this.props as CombinedProps).setLocale(state.localeId);
      }

      if (themes[state.themeName] !== null) {
        (this.props as CombinedProps).setTheme(themes[state.themeName]);
      }
    }
  };

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
      const theme = themes[themeKey as keyof typeof themes];

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

export const MenuBar = connect(mapStateToProps, mapDispatchToProps)(MenuBarC);
