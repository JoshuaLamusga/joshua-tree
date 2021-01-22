import { ColorPicker, Dropdown, IColor, IDropdownOption, Label, SpinButton } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getStrings } from "../../common/localization/Localization";
import {
  dispatchSetPlayerStoryInputStyles,
  dispatchSetPlayerStoryOptionHighlightStyles,
  dispatchSetPlayerStoryOptionStyles,
  dispatchSetPlayerStoryOutputStyles,
  dispatchSetPlayerStoryRunnerOptions,
  IPlayerStorySettingsState,
} from "./playerStorySettings.reducers";
import { IRootState } from "../../store";
import { dispatchCloseColorPicker, dispatchOpenColorPicker } from "./runnerSettings.reducers";
import { ITextStyle } from "../../common/redux/typedefs";

const mapStateToProps = (state: IRootState) => {
  return {
    colorPickerOpenId: state.runnerSettings.colorPickerOpenId,
    playerStoryInputStyles: state.playerStorySettings.playerStoryInputStyles,
    playerStoryOptionStyles: state.playerStorySettings.playerStoryOptionStyles,
    playerStoryOptionHighlightStyles: state.playerStorySettings.playerStoryOptionHighlightStyles,
    playerStoryOutputStyles: state.playerStorySettings.playerStoryOutputStyles,
    playerStoryRunnerOptions: state.playerStorySettings.playerStoryRunnerOptions,
    strings: getStrings(state.settings.locale),
    theme: state.settings.theme,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchCloseColorPicker: dispatchCloseColorPicker(dispatch),
    dispatchInputStyles: dispatchSetPlayerStoryInputStyles(dispatch),
    dispatchOpenColorPicker: dispatchOpenColorPicker(dispatch),
    dispatchOptionHighlightStyles: dispatchSetPlayerStoryOptionHighlightStyles(dispatch),
    dispatchOptionStyles: dispatchSetPlayerStoryOptionStyles(dispatch),
    dispatchOutputStyles: dispatchSetPlayerStoryOutputStyles(dispatch),
    dispatchRunnerOptions: dispatchSetPlayerStoryRunnerOptions(dispatch),
  };
};

/** The allowed units a font size may be specified in. */
const fontSizeUnits = {
  px: "px",
  rem: "rem",
};

type RunnerSettingsOwnProps = {};
type CombinedProps = RunnerSettingsOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class RunnerSettingsC extends React.Component<RunnerSettingsOwnProps> {
  public componentWillUnmount() {
    (this.props as CombinedProps).dispatchCloseColorPicker();
  }

  public render() {
    const combinedProps = this.props as CombinedProps;

    return (
      <>
        {combinedProps.colorPickerOpenId &&
          this.renderColorPicker(
            combinedProps.colorPickerOpenId.color,
            combinedProps.colorPickerOpenId.forStyle as keyof typeof combinedProps
          )}
        <h4 style={{ color: combinedProps.theme.theme.semanticColors.bodyText }}>
          {combinedProps.strings.SettingsRunnerInputStyles}
        </h4>
        {this.renderColorPickerHexField(
          "playerStoryInputStyles",
          combinedProps.playerStoryInputStyles,
          combinedProps.dispatchInputStyles
        )}
        {this.renderFontSizeControls("playerStoryInputStyles")}
        <h4 style={{ color: combinedProps.theme.theme.semanticColors.bodyText }}>
          {combinedProps.strings.SettingsRunnerOptionStyles}
        </h4>
        {this.renderColorPickerHexField(
          "playerStoryOptionStyles",
          combinedProps.playerStoryOptionStyles,
          combinedProps.dispatchOptionStyles
        )}
        {this.renderFontSizeControls("playerStoryOptionStyles")}
        <h4 style={{ color: combinedProps.theme.theme.semanticColors.bodyText }}>
          {combinedProps.strings.SettingsRunnerOptionHighlightStyles}
        </h4>
        {this.renderColorPickerHexField(
          "playerStoryOptionHighlightStyles",
          combinedProps.playerStoryOptionHighlightStyles,
          combinedProps.dispatchOptionHighlightStyles
        )}
        {this.renderFontSizeControls("playerStoryOptionHighlightStyles")}
        <h4 style={{ color: combinedProps.theme.theme.semanticColors.bodyText }}>
          {combinedProps.strings.SettingsRunnerOutputStyles}
        </h4>
        {this.renderColorPickerHexField(
          "playerStoryOutputStyles",
          combinedProps.playerStoryOutputStyles,
          combinedProps.dispatchOutputStyles
        )}
        {this.renderFontSizeControls("playerStoryOutputStyles")}
      </>
    );
  }

  /** Renders a color picker to adjust the chosen color for a style override. */
  private renderColorPicker = (color: "colorDark" | "colorLight", forStyle: keyof CombinedProps) => {
    const combinedProps = this.props as CombinedProps;
    const style = combinedProps[forStyle] as ITextStyle;
    let chosenStyle: ITextStyle;
    let chosenDispatchCall: (style: ITextStyle) => void;

    switch (forStyle) {
      case "playerStoryInputStyles": {
        chosenDispatchCall = combinedProps.dispatchInputStyles;
        chosenStyle = combinedProps.playerStoryInputStyles;
        break;
      }
      case "playerStoryOptionStyles": {
        chosenDispatchCall = combinedProps.dispatchOptionStyles;
        chosenStyle = combinedProps.playerStoryOptionStyles;
        break;
      }
      case "playerStoryOptionHighlightStyles": {
        chosenDispatchCall = combinedProps.dispatchOptionHighlightStyles;
        chosenStyle = combinedProps.playerStoryOptionHighlightStyles;
        break;
      }
      case "playerStoryOutputStyles": {
        chosenDispatchCall = combinedProps.dispatchOutputStyles;
        chosenStyle = combinedProps.playerStoryOutputStyles;
        break;
      }
      default: {
        return;
      }
    }

    const updateColor = (_: React.SyntheticEvent<HTMLElement, Event>, cssColor: IColor) => {
      chosenDispatchCall({
        ...chosenStyle,
        [color]: cssColor.str,
      });
    };

    return (
      <ColorPicker
        alphaType="none"
        color={style[color] ?? ""}
        onChange={updateColor}
        strings={{
          // TODO: localize. Determine if label/descriptions and some unused labels are needed.
          blue: "blue",
          green: "green",
          hex: "hex",
          hueAriaLabel: "hue",
          red: "red",
          svAriaDescription: "saturation and value",
          svAriaLabel: "saturation and value",
        }}
        styles={{ table: { color: combinedProps.theme.theme.semanticColors.bodyText } }}
      />
    );
  };

  /** Renders color boxes to adjust the light/dark theme settings for one of the override styles. */
  private renderColorPickerHexField = (
    forStyle: keyof IPlayerStorySettingsState,
    textStyleObj: ITextStyle,
    update: (style: ITextStyle) => void
  ) => {
    const combinedProps = this.props as CombinedProps;

    const onSwatchClicked = (color: "colorDark" | "colorLight", forStyle: keyof IPlayerStorySettingsState) => () => {
      if (combinedProps.colorPickerOpenId?.forStyle === forStyle && combinedProps.colorPickerOpenId?.color === color) {
        combinedProps.dispatchCloseColorPicker();
      } else {
        combinedProps.dispatchOpenColorPicker(color, forStyle);
      }
    };

    const onChange = (updateKey: "colorDark" | "colorLight") => (ev: React.ChangeEvent<HTMLInputElement>) => {
      update({
        ...textStyleObj,
        [updateKey]: ev.target.value,
      });
    };

    return (
      <div style={{ display: "inline-flex", flexDirection: "row" }}>
        <div style={{ alignItems: "center", display: "flex", flexDirection: "row" }}>
          <button
            onClick={onSwatchClicked("colorDark", forStyle)}
            style={{
              backgroundColor: textStyleObj.colorDark,
              border: combinedProps.theme.theme.semanticColors.buttonBorder,
              height: "2rem",
              margin: combinedProps.theme.theme.spacing.s2,
              width: "2rem",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Label style={{ paddingTop: 0 }}>{combinedProps.strings.SettingsTextStyleDarkColor}</Label>
            <input
              onChange={onChange("colorDark")}
              placeholder={combinedProps.strings.SettingsTextStyleColorUnset}
              type="text"
              value={textStyleObj.colorDark}
            />
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", flexDirection: "row" }}>
          <button
            onClick={onSwatchClicked("colorLight", forStyle)}
            style={{
              backgroundColor: textStyleObj.colorLight,
              border: combinedProps.theme.theme.semanticColors.buttonBorder,
              height: "2rem",
              margin: combinedProps.theme.theme.spacing.s2,
              width: "2rem",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Label style={{ paddingTop: 0 }}>{combinedProps.strings.SettingsTextStyleLightColor}</Label>
            <input
              onChange={onChange("colorLight")}
              placeholder={combinedProps.strings.SettingsTextStyleColorUnset}
              type="text"
              value={textStyleObj.colorLight}
            />
          </div>
        </div>
      </div>
    );
  };

  /** Renders a spin button to change font size. */
  private renderFontSizeControls = (forStyle: keyof CombinedProps) => {
    const combinedProps = this.props as CombinedProps;
    const textStyle = combinedProps[forStyle] as ITextStyle;
    let chosenStyle: ITextStyle;
    let chosenDispatchCall: (style: ITextStyle) => void;

    switch (forStyle) {
      case "playerStoryInputStyles": {
        chosenDispatchCall = combinedProps.dispatchInputStyles;
        chosenStyle = combinedProps.playerStoryInputStyles;
        break;
      }
      case "playerStoryOptionStyles": {
        chosenDispatchCall = combinedProps.dispatchOptionStyles;
        chosenStyle = combinedProps.playerStoryOptionStyles;
        break;
      }
      case "playerStoryOptionHighlightStyles": {
        chosenDispatchCall = combinedProps.dispatchOptionHighlightStyles;
        chosenStyle = combinedProps.playerStoryOptionHighlightStyles;
        break;
      }
      case "playerStoryOutputStyles": {
        chosenDispatchCall = combinedProps.dispatchOutputStyles;
        chosenStyle = combinedProps.playerStoryOutputStyles;
        break;
      }
      default: {
        return;
      }
    }

    const fontSizeUnit = textStyle.fontSize?.endsWith(fontSizeUnits.px) ? fontSizeUnits.px : fontSizeUnits.rem;

    const fontSizeOrigValue = chosenStyle.fontSize
      ? fontSizeUnit === fontSizeUnits.px
        ? Number.parseInt(chosenStyle.fontSize.replaceAll(/px|rem/g, ""), 10)
        : Math.round(Number.parseFloat(chosenStyle.fontSize.replaceAll(/px|rem/g, "")) * 100) / 100
      : undefined;

    const fontSizeObjects = {
      [fontSizeUnits.px]: {
        default: 12,
        max: 96,
        min: 4,
        step: 1,
      },
      [fontSizeUnits.rem]: {
        default: 1.2,
        max: 6,
        min: 0.1,
        step: 0.1,
      },
    };

    const fontSizeObj = fontSizeObjects[fontSizeUnit];

    const fontSizeChanged = (action?: "+" | "-") => (fontSize: string) => {
      const fontSizeValue =
        fontSizeUnit === fontSizeUnits.px
          ? Number.parseInt(fontSize, 10)
          : Math.round(Number.parseFloat(fontSize) * 100) / 100;

      // Resets invalid values to be valid
      if (isNaN(fontSizeValue) || !isFinite(fontSizeValue)) {
        if (fontSize !== "" || action !== undefined) {
          chosenDispatchCall({
            ...chosenStyle,
            fontSize: `${fontSizeObj.default}${fontSizeUnit}`,
          });
        }
      }

      // Clears the set value for empty strings
      if (fontSize === "") {
        chosenDispatchCall({
          ...chosenStyle,
          fontSize: undefined,
        });
      }

      // Handles increment and decrement
      else if (action !== undefined) {
        if (action === "+" && fontSizeValue < fontSizeObj.max) {
          chosenDispatchCall({
            ...chosenStyle,
            fontSize: `${Math.min(fontSizeValue + fontSizeObj.step, fontSizeObj.max)}${fontSizeUnit}`,
          });
        } else if (action === "-" && fontSizeValue > fontSizeObj.min) {
          chosenDispatchCall({
            ...chosenStyle,
            fontSize: `${Math.max(fontSizeValue - fontSizeObj.step, fontSizeObj.min)}${fontSizeUnit}`,
          });
        }
      }

      // Handles written-in values
      else if (fontSize === fontSizeValue.toString()) {
        if (fontSizeValue >= fontSizeObj.min && fontSizeValue <= fontSizeObj.max) {
          chosenDispatchCall({
            ...chosenStyle,
            fontSize: `${fontSizeValue}${fontSizeUnit}`,
          });
        } else if (fontSizeValue < fontSizeObj.min) {
          chosenDispatchCall({
            ...chosenStyle,
            fontSize: `${fontSizeObj.min}${fontSizeUnit}`,
          });
        } else if (fontSizeValue > fontSizeObj.max) {
          chosenDispatchCall({
            ...chosenStyle,
            fontSize: `${fontSizeObj.max}${fontSizeUnit}`,
          });
        }
      }
    };

    const fontUnitChanged = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      if (option) {
        let value = fontSizeOrigValue ?? fontSizeObjects[option.data].default;
        value = Math.min(Math.max(value, fontSizeObjects[option.data].min), fontSizeObjects[option.data].max);

        chosenDispatchCall({
          ...chosenStyle,
          fontSize: `${value}${option.data}`,
        });
      }
    };

    return (
      // TODO: localize
      <span style={{ display: "inline-flex" }}>
        <SpinButton
          ariaLabel={"Adjust font size"}
          decrementButtonAriaLabel={"decrease font size by 1"}
          incrementButtonAriaLabel={"increase font size by 1"}
          label={"Font size"}
          min={fontSizeObj.min}
          max={fontSizeObj.max}
          step={fontSizeObj.step}
          onDecrement={fontSizeChanged("-")}
          onIncrement={fontSizeChanged("+")}
          onValidate={fontSizeChanged()}
          value={fontSizeOrigValue?.toString() ?? "unset"}
          styles={{
            spinButtonWrapper: { width: "1px" }, // shrinks to min width
          }}
        />
        <Dropdown
          aria-label="font size unit"
          onChange={fontUnitChanged}
          options={[
            {
              data: fontSizeUnits.rem,
              key: `settingsFontSizeRem-${forStyle}`,
              selected: fontSizeUnit === fontSizeUnits.rem,
              text: "rems",
              title: "rems are a 'relative' measurement that takes screen density into account. Use this one normally.",
            },
            {
              data: fontSizeUnits.px,
              key: `settingsFontSizePx-${forStyle}`,
              selected: fontSizeUnit === fontSizeUnits.px,
              text: "pixels",
              title:
                "Pixels (px) is an 'absolute' measurement that doesn't take screen density into account, so a font may display at different sizes on different devices.",
            },
          ]}
        />
      </span>
    );
  };
}

export const RunnerSettings = connect(mapStateToProps, mapDispatchToProps)(RunnerSettingsC);
