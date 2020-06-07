import {
  CommandBar,
  getTheme,
  ICommandBarItemProps,
  Icon,
  IDropdownOption,
  mergeStyles,
} from "office-ui-fabric-react";
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
import { ISupportedTheme, themes } from "../../common/theming/themes";
import { IRootState } from "../../store";
import { CommandBarDropdown } from "./CommandBarDropdown";

/**
 * Browsers require a click to invoke an open file dialog, so this invokes a click on a hidden
 * input element rendered as part of the main command bar. This enables seamless functionality.
 */
export function invokeOpenCommand() {
  hiddenInputRef.current?.click();
}

const hiddenInputRef = React.createRef<HTMLInputElement>();

const mapStateToProps = (state: IRootState) => {
  return {
    locale: state.settings.locale,
    reduxState: state,
    strings: getStrings(state.settings.locale),
    theme: getTheme(),
    themeName: state.settings.theme.localizedName,
    userConsentProvided: state.persistence.userConsentProvided,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setConsent: dispatchSetUserConsentProvided(dispatch),
    setLocale: dispatchSetLocale(dispatch),
    setTheme: dispatchSetTheme(dispatch),
  };
};

export type MainCommandBarProps = {};

type CombinedProps = MainCommandBarProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class MainCommandBarC extends React.Component<MainCommandBarProps> {
  public componentDidMount() {
    if ((this.props as CombinedProps).userConsentProvided) {
      this.applyLocalStorage();
    }
  }

  public render() {
    const items: ICommandBarItemProps[] = [
      {
        className: commandBarItemStyle((this.props as CombinedProps).theme, true),
        data: commandIds.mainMenuFileNew,
        key: "userSettingsCommandBarFileMenuNew",
        name: (this.props as CombinedProps).strings.MenuFileNew,
        iconProps: { iconName: "FabricNewFolder" },
        onClick: () => invokeCommand(commandIds.mainMenuFileNew),
      },
      {
        className: commandBarItemStyle((this.props as CombinedProps).theme, true),
        data: commandIds.mainMenuFileOpen,
        key: "userSettingsCommandBarFileMenuOpen",
        name: (this.props as CombinedProps).strings.MenuFileOpen,
        iconProps: { iconName: "OpenFolderHorizontal" },
        onClick: () => invokeCommand(commandIds.mainMenuFileOpen),
      },
      {
        className: commandBarItemStyle((this.props as CombinedProps).theme),
        data: commandIds.mainMenuFileSave,
        key: "userSettingsCommandBarFileMenuSave",
        name: (this.props as CombinedProps).strings.MenuFileSave,
        iconProps: { iconName: "Save" },
        onClick: () => invokeCommand(commandIds.mainMenuFileSave),
      },
    ];

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

    const handleFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const chosenFiles = ev.target.files;

      if (chosenFiles) {
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          const strData = fileReader.result as string;
          alert("not implemented"); //TODO
        };

        fileReader.readAsText(chosenFiles[0]);
      }
    };

    return (
      <>
        <input
          className={mergeStyles(hiddenAndInaccessible)}
          onChange={handleFile}
          ref={hiddenInputRef}
          type="file"
        />
        <CommandBar
          ariaLabel={(this.props as CombinedProps).strings.TipNavigateCommandBar}
          items={items}
          farItems={farItems}
          styles={commandBarStyle((this.props as CombinedProps).theme)}
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

    Object.keys(localizedStrings).forEach((localeOption: string) => {
      options.push({
        data: localeOption,
        key: this.getLocaleDropdownOptionKey(localeOption),
        text: localizedStrings[localeOption as keyof typeof localizedStrings].LanguageCodeName,
      });
    });

    const updateChangedLocale = (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ) => {
      if (option !== undefined) {
        const localeId = option.data as keyof typeof localizedStrings;
        (this.props as CombinedProps).setLocale(localeId).then(() => {
          saveToLocalStorage((this.props as CombinedProps).reduxState);
        });
      }
    };

    const renderDropdownTitle = () => (
      <>
        <Icon iconName="LocaleLanguage" styles={iconSpaceBeforeTextStyle} />
        <span className={mergeStyles((this.props as CombinedProps).theme.fonts.large)}>
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

    Object.keys(themes).forEach((themeKey: string) => {
      const theme = themes[themeKey as keyof typeof themes];

      options.push({
        data: theme,
        key: this.getThemeDropdownOptionKey(theme.localizedName),
        text: theme.localizedName,
      });
    });

    const updateChangedTheme = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      if (option !== undefined) {
        const theme = option.data as ISupportedTheme;
        (this.props as CombinedProps).setTheme(theme).then(() => {
          saveToLocalStorage((this.props as CombinedProps).reduxState);
        });
      }
    };

    const renderDropdownTitle = () => (
      <span className={mergeStyles((this.props as CombinedProps).theme.fonts.large)}>
        {(this.props as CombinedProps).strings.ThemeDropdownText(
          (this.props as CombinedProps).themeName
        )}
      </span>
    );

    return (
      <CommandBarDropdown
        dropdown={{
          defaultSelectedKey: this.getThemeDropdownOptionKey(
            (this.props as CombinedProps).themeName
          ),
          onRenderTitle: renderDropdownTitle,
          options: options,
          onChange: updateChangedTheme,
          styles: commandBarDropdownSeparatorStyle((this.props as CombinedProps).theme),
        }}
      />
    );
  };
}

export const MainCommandBar = connect(mapStateToProps, mapDispatchToProps)(MainCommandBarC);
