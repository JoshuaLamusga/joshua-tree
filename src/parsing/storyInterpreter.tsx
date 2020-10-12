import { getTheme, mergeStyles, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
import { StoryParseNode } from "./storyParseNode";
import { Random } from "../common/random";
import { IPageDictionary } from "./storyParser";
import {
  idRunnerContent,
  idRunnerInputfield,
  idRunnerLog,
  idRunnerOptions,
  idRunnerOptionRestart,
  idRunnerWrapper,
} from "../common/identifiers";
import { ActionButton } from "office-ui-fabric-react";
import { numberRegex } from "./expression/utils";
import { Parser } from "./expression/Parser";
import { TokenId } from "./expression/TokenId";
import { TokenFunc } from "./expression/TokenFunc";
import { TokenBool } from "./expression/TokenBool";
import { IRootState } from "../store";
import { connect } from "react-redux";
import { TokenNum } from "./expression/TokenNum";
import { dispatchRerenderStory } from "../common/redux/viewedit.reducers";
import { Dispatch } from "redux";

// TODO: localize strings in this file.

let uniqueKeyCounter = Number.MIN_SAFE_INTEGER;
const fallbackFontStack = "Calibri; Times New Roman; Courier New; sans-serif";

const whitespaceRegex = /\s+/gm;
const colorRegex = /^[0-9|a-f]+$/g;
const singleDigitRegex = /[0-9]/g;
const escapeBraceRegex = /\\at|\\lb|\\rb|\\n|\\s/g;
const escapeNoBraceRegex = /\\at|\\n|\\s/g;

/** An expression parser used by the interpreter to resolve expressions for variable assignments. */
const exprParser = new Parser();

/** The interface for the variable dictionary. */
interface IVariables {
  [key: string]: number | boolean | string;
}

interface IInterpreterCustomization {
  discreteInlineLinks: boolean;
  preserveOldOutput: boolean;
  random: Random;
  restartOptionDisabled: boolean;
  restartOptionText: string;
  showErrors: boolean;
  styleInput: { [key: string]: string | number };
  styleOptions: { [key: string]: string | number };
  styleOptionsHighlight: { [key: string]: string | number };
  styleOutput: { [key: string]: string | number };
  styleRunner: Partial<CSSStyleDeclaration>;
}

const defaultCustomization: IInterpreterCustomization = {
  discreteInlineLinks: false,
  preserveOldOutput: true,
  random: new Random(null),
  restartOptionDisabled: false,
  restartOptionText: "restart",
  showErrors: true,

  styleInput: {
    color: "#ff0000",
    fontFamily: fallbackFontStack,
    fontSize: "16px",
    fontWeight: "400",
  },

  styleOptions: {
    color: "#0000ff",
    fontFamily: fallbackFontStack,
    fontSize: "16px",
    fontWeight: "400",
  },

  styleOptionsHighlight: {
    color: "#0000ff",
  },

  styleOutput: {
    color: "#000000",
    fontFamily: fallbackFontStack,
    fontSize: "16px",
    fontWeight: "400",
  },

  styleRunner: {
    backgroundColor: "#ffffff",
  },
};

const mapStateToProps = (state: IRootState) => {
  return {
    renderTrigger: state.viewEdit.storyRerenderToken, // This is here to re-render. Don't remove.
    wholeTheme: getTheme(),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchRerenderStory: dispatchRerenderStory(dispatch),
  };
};

type StoryInterpreterOwnProps = {
  showErrors?: boolean;
  random?: Random;
};

type StoryInterpreterProps = StoryInterpreterOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class StoryInterpreterC extends React.Component<StoryInterpreterOwnProps> {
  /** Tracks actions so they can be removed when navigating other forks/files. */
  private actions: ((text: string) => void)[] = [];

  /** The content of the current page. */
  private content: JSX.Element[] = [];

  /** Stores all tree entries. */
  private entries: IPageDictionary = {};

  /** An optional error message that displays in a top banner when non-empty. */
  private errorMessage = "";

  /** Stores the current page by name. */
  private fork = "";

  /** Keeps a list of all previous content, if not disabled. */
  private log: JSX.Element[] = [];

  /** Hyperlink options to the next page. */
  private options: JSX.Element[] = [];

  /** Used to stop evaluation of the current fork entirely. */
  private stopEvaluation = false;

  /** Whether to display a textbox or not. It's displayed automatically when the user can enter text. */
  private textboxHidden = true;

  /** Tracked so they can be stopped when navigating other forks/files. */
  private timers: NodeJS.Timeout[] = [];

  /** Defines a place for generated variables to be stored and accessed. */
  private variables: IVariables = {};

  /** Stores a copy of all variables as they were just before visiting a new page. This is used when saving. */
  private variablesPrev: IVariables = {};

  /**
   * The current options and styles associated with the engine. Exposed to read and change styles.
   * Note that changes will not trigger a re-render.
   */
  public customization: IInterpreterCustomization = {} as IInterpreterCustomization;

  /** The restart link for when a page is empty or the link is forcibly shown. */
  private getRestartLink = () =>
    this.addOption(this.customization.restartOptionText, this.restartGame, idRunnerOptionRestart);

  constructor(props: StoryInterpreterProps) {
    super(props);

    this.refreshInterpreter();

    if (this.props.showErrors) {
      this.customization.showErrors = this.props.showErrors;
    }

    if (this.props.random) {
      this.customization.random = this.props.random;
    }
  }

  /** Escapes the given text for all supported escape sequences. */
  private escapeText(text: string, matchBraces: boolean) {
    if (matchBraces) {
      return text.replace(escapeBraceRegex, (str: string) => {
        switch (str) {
          case "\\at":
            return "@";
          case "\\n":
            return "\n";
          case "\\s":
            return "\\";
          case "\\lb":
            return "{";
          case "\\rb":
            return "}";
        }

        return str;
      });
    }

    return text.replace(escapeNoBraceRegex, (str: string) => {
      switch (str) {
        case "\\at":
          return "@";
        case "\\n":
          return "\n";
        case "\\s":
          return "\\";
      }

      return str;
    });
  }

  /** Handles submission of text in the textbox. */
  private onTextboxKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.charCode === 13) {
      this.actions.forEach((action) => {
        action(ev.currentTarget.value);
      });

      ev.currentTarget.value = "";
    }
  };

  /**
   * Crawls the given node structure in a depth-first search. If text is provided, it's used
   * solely to evaluate 'if text is' and 'if text has' syntax. Otherwise, those nodes are set to be
   * parsed the next time input is submitted through the textbox.
   */
  private preorderProcess(node: StoryParseNode, textboxText: string) {
    // If the node's conditions are met, processes it and children.
    if (this.processIf(node, textboxText)) {
      this.processText(node);

      for (let i = 0; i < node.children.length; i++) {
        if (this.stopEvaluation) {
          return;
        }

        this.preorderProcess(node.children[i], textboxText);
      }
    }
  }

  /**
   * Interprets the contents of a node is its condition is met. If text is provided, it's used
   * solely to evaluate 'if text is' and 'if text has' syntax. Otherwise, those nodes are set to be
   * parsed the next time input is submitted through the textbox.
   */
  private processIf(node: StoryParseNode, textboxText: string): boolean {
    // If there are no conditions, consider it met.
    if (node.condition.trim() === "") {
      return true;
    }

    // Gets the condition without the word 'if'.
    const condition = node.condition.substring(2).trim();
    const words = condition.split(" ");

    // There should be at least one word after 'if'.
    if (words.length === 0) {
      this.setErrorMessage("The line if '" + condition + "' is incorrectly formatted.");
      return false; // Skips ifs with invalid syntax.
    }

    //#region Timers. Syntax: if timer is num
    if (words.length > 1 && words[0] === "timer" && words[1] === "is") {
      if (words.length < 2) {
        this.setErrorMessage("The timer must be set with a time specified in seconds.");
        return false;
      }

      // The third word must be a number.
      if (!numberRegex.test(words[2])) {
        this.setErrorMessage(
          "Interpreter: In line '" + condition + "', the third word must be numeric."
        );
        return false;
      }

      const number = parseFloat(words[2]);

      if (isNaN(number) || !isFinite(number)) {
        this.setErrorMessage(
          "Interpreter: In line '" + condition + "', the time must be numeric and not too large."
        );
        return false;
      }

      // The number must be positive.
      if (number <= 0) {
        this.setErrorMessage(
          "Interpreter: In line '" + condition + "', the time must be positive and non-zero."
        );
        return false;
      }

      // Creates a timer to delay the evaluation of everything in the current if-statement.
      const ref = global.setTimeout(() => {
        this.processText(node);

        for (let i = 0; i < node.children.length; i++) {
          this.preorderProcess(node.children[i], textboxText);
        }
      }, number * 1000);

      this.timers.push(ref);

      return false; // Delays execution of child nodes.
    }
    //#endregion

    //#region Textbox. Syntax: if text (!)is/has/pick query
    // Handles syntax: if text is query, if text has query, if text !is query, if text !has query, if text pick query
    else if (
      words.length > 1 &&
      words[0] === "text" &&
      (words[1] === "is" ||
        words[1] === "!is" ||
        words[1] === "has" ||
        words[1] === "!has" ||
        words[1] === "pick")
    ) {
      // Automatically shows the textbox.
      this.textboxHidden = false;

      let query = ""; // Contains all additional words.

      // Concatenates all words after the command syntax.
      for (let i = 2; i < words.length; i++) {
        query += words[i] + " ";
      }

      query = this.escapeText(query.toLowerCase().trim(), true);

      if (query === "") {
        this.setErrorMessage(
          "Interpreter: In the line 'if " +
            condition +
            "', at least one word to look for must be specified after 'pick'."
        );
      }

      // The generated option adds to the submission event based on whether it's checking if the
      // textbox input is/has the query.
      if (words[1] === "pick") {
        // Splits the query on commas if checking for containing.
        const queryWords = query.split(",");

        // Escapes commas as \c
        for (let i = 0; i < queryWords.length; i++) {
          queryWords[i] = queryWords[i].replace("\\c", ",").trim();
        }

        if (textboxText === "") {
          this.actions.push((text: string) => {
            text = text.toLowerCase().trim();
            let containsWord = false;

            // Ensures the text contains at least one word.
            for (let i = 0; i < queryWords.length; i++) {
              const matchWordRegex = new RegExp("\\b" + queryWords[i] + "\\b");
              if (matchWordRegex.test(text)) {
                containsWord = true;
              }
            }

            if (!containsWord) {
              return;
            }

            // If still executing, conditions are met.
            if (this.customization.preserveOldOutput) {
              this.content.push(this.addInput(text));
            }

            this.processText(node);

            for (let i = 0; i < node.children.length; i++) {
              this.preorderProcess(node.children[i], text);
            }

            this.refreshInterpreterGui();
          });
        } else {
          textboxText = textboxText.toLowerCase().trim();
          let containsWord = false;

          // Ensures the text contains at least one word.
          for (let i = 0; i < queryWords.length; i++) {
            const matchWordRegex = new RegExp("\\b" + queryWords[i] + "\\b");

            if (matchWordRegex.test(textboxText)) {
              containsWord = true;
            }
          }

          if (!containsWord) {
            return false;
          }

          // If still executing, conditions are met.
          this.processText(node);

          for (let i = 0; i < node.children.length; i++) {
            this.preorderProcess(node.children[i], textboxText);
          }
        }
      } else if (words[1].endsWith("is")) {
        if (textboxText === "") {
          this.actions.push((text: string) => {
            text = text.toLowerCase().trim();

            if ((words[1] === "is" && text === query) || (words[1] === "!is" && text !== query)) {
              if (this.customization.preserveOldOutput) {
                this.content.push(this.addInput(text));
              }

              this.processText(node);

              for (let i = 0; i < node.children.length; i++) {
                this.preorderProcess(node.children[i], text);
              }
            }

            this.refreshInterpreterGui();
          });
        } else {
          if (
            (words[1] === "is" && textboxText === query) ||
            (words[1] === "!is" && textboxText !== query)
          ) {
            this.processText(node);

            for (let i = 0; i < node.children.length; i++) {
              this.preorderProcess(node.children[i], textboxText);
            }
          }
        }
      } else if (words[1].endsWith("has")) {
        // Splits the query on commas if checking for containing.
        const queryWords = query.split(",");

        // Escapes commas as \c.
        for (let i = 0; i < queryWords.length; i++) {
          queryWords[i] = queryWords[i].replace("\\c", ",").trim();
        }

        if (textboxText === "") {
          this.actions.push((text: string) => {
            text = text.toLowerCase().trim();

            // Ensures the text contains each word.
            for (let i = 0; i < queryWords.length; i++) {
              const matchWordRegex = new RegExp("\\b" + queryWords[i] + "\\b");
              const matches = matchWordRegex.test(text);

              if ((words[1] === "has" && !matches) || (words[1] === "!has" && matches)) {
                return;
              }
            }

            // If still executing, conditions are met.
            if (this.customization.preserveOldOutput) {
              this.content.push(this.addInput(text));
            }

            this.processText(node);

            for (let i = 0; i < node.children.length; i++) {
              this.preorderProcess(node.children[i], text);
            }

            this.refreshInterpreterGui();
          });
        } else {
          // Ensures the text contains each word.
          for (let i = 0; i < queryWords.length; i++) {
            const matchWordRegex = new RegExp("\\b" + queryWords[i] + "\\b");
            const matches = matchWordRegex.test(textboxText);

            if ((words[1] === "has" && !matches) || (words[1] === "!has" && matches)) {
              return false;
            }
          }

          // If still executing, conditions are met.
          this.processText(node);

          for (let i = 0; i < node.children.length; i++) {
            this.preorderProcess(node.children[i], textboxText);
          }
        }
      }

      return false; // Execution of child nodes is conditional.
    }
    //#endregion

    //#region Truth tests. Syntax: if expr; expr must be true or false.
    else {
      // Unregisters previously-set variables and confirms options.
      exprParser.optIncludeUnknowns = true;
      exprParser.resetTokens();

      const variablesKeys = Object.keys(this.variables);

      // Supports syntax: if visited, if !visited
      const varValue = this.variables["visited" + this.fork] as number;
      exprParser.addIdentifier(new TokenId("visited", varValue));

      // Registers all valid variables with the math parser.
      for (let i = 0; i < variablesKeys.length; i++) {
        const varName = variablesKeys[i];
        const varVal = this.variables[variablesKeys[i]];

        exprParser.addIdentifier(new TokenId(varName, varVal));
      }

      // Registers a function to check if a variable exists.
      exprParser.addFunction(
        new TokenFunc("exists", 1, (tokens) => {
          if (tokens[0] instanceof TokenBool) {
            return tokens[0];
          }

          return new TokenBool(!(tokens[0] instanceof TokenId));
        })
      );

      let result = "";
      let resultVal = null;

      // Attempts to compute the expression.
      try {
        result = exprParser.eval(words.join(" "));
      } catch (e) {
        if (e instanceof Error) {
          this.setErrorMessage(e.message);
        } else {
          this.setErrorMessage(e);
        }

        return false;
      }

      // Parses the computed result as a bool.
      if (result === "true" || result === "false") {
        return result === "true";
      } else {
        this.setErrorMessage(
          "Interpreter: In the line 'if " +
            words.join(" ") +
            "', the expression must be boolean (true or false), but was " +
            resultVal +
            " instead."
        );

        return false;
      }
    }
  }

  /** Interprets the node text to display output and evaluate commands. */
  private processText(node: StoryParseNode) {
    let textLeft = node.text;

    // Processes all text until none is left.
    while (textLeft.length > 0) {
      // Gets the current line and its words.
      let endOfLine = textLeft.indexOf("\n");
      let line: string;

      if (endOfLine >= 0) {
        line = textLeft.substring(0, endOfLine);
      } else {
        line = textLeft;
      }

      let words = line.split(" ");

      //#region Handles empty lines if they appear.
      // Removes excess lines.
      if (line.trim() === "") {
        // Deletes pointless whitespace.
        textLeft = textLeft.substring(endOfLine + 1);
      }
      //#endregion

      //#region Parse in-line options. Syntax: output@@forkname.
      else if (line.includes("@@")) {
        let forkName = line
          .substring(line.indexOf("@") + 2)
          .replace(whitespaceRegex, "")
          .toLowerCase();

        let displayName = this.escapeText(line.substring(0, line.indexOf("@")).trim(), false);

        // Handles having no hyperlink or display name.
        if (forkName === "") {
          this.setErrorMessage(
            "Interpreter: there was no fork name given to option '" + displayName + "'."
          );
        } else if (displayName.trim() === "") {
          this.setErrorMessage(
            "Interpreter: the option linking to '" +
              forkName +
              "' has no displayable text specified."
          );
        } else if (this.entries[forkName] === undefined) {
          this.setErrorMessage(
            "Interpreter: the fork in the option '" +
              displayName +
              "@" +
              forkName +
              "' doesn't exist."
          );
        } else {
          this.options.push(this.addOption(displayName, forkName));
        }

        // Deletes the line just processed.
        textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
      }
      //#endregion

      //#region Parse options. Syntax: output@forkname.
      else if (line.includes("@")) {
        // Gets the fork name. Case and space insensitive.
        const indexOfAt = line.indexOf("@");
        const forkName = line
          .substring(indexOfAt + 1)
          .replace(whitespaceRegex, "")
          .toLowerCase();
        const displayName = this.escapeText(line.substring(0, indexOfAt).trim(), false);

        // Handles having no hyperlink or display name.
        if (forkName === "") {
          this.setErrorMessage(
            "Interpreter: there was no fork name given to option '" + displayName + "'."
          );
        } else if (displayName.trim() === "") {
          this.setErrorMessage(
            "Interpreter: the option linking to '" +
              forkName +
              "' has no displayable text specified."
          );
        } else {
          this.options.push(this.addOption(displayName, forkName));
        }

        // Deletes the line just processed.
        textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
      }
      //#endregion

      //#region Print text. Syntax: {output text}.
      // Parses output text and escape characters.
      else if (line.includes("{")) {
        let lbPos = textLeft.indexOf("{");
        let rbPos = textLeft.indexOf("}");
        let output = textLeft.substring(lbPos, rbPos + 1);

        if (rbPos < lbPos) {
          this.setErrorMessage(
            "Interpreter: In the line '" + line + "', right braces should follow left braces. "
          );

          // Skips the unprocessable line.
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);

          continue;
        }

        const fontStyle = this.customization.styleOutput.fontStyle;
        const fontWeight = this.customization.styleOutput.fontWeight;

        if (output.includes("***}")) {
          this.customization.styleOutput.fontStyle = "italic";
          this.customization.styleOutput.fontWeight = "600";
        } else if (output.includes("**}")) {
          this.customization.styleOutput.fontWeight = "600";
        } else if (output.includes("*}")) {
          this.customization.styleOutput.fontStyle = "italic";
        }

        // create output
        output = this.escapeText(
          output
            .replace("{", "")
            .replace("***}", "")
            .replace("**}", "")
            .replace("*}", "")
            .replace("}", ""),
          true
        );

        // Generates the text
        this.content.push(this.addOutput(output));

        this.customization.styleOutput.fontStyle = fontStyle;
        this.customization.styleOutput.fontWeight = fontWeight;

        // Removes the processed text.
        textLeft = textLeft.substring(0, lbPos) + textLeft.substring(rbPos + 1, textLeft.length);
      }
      //#endregion

      //#region Set variables.
      else if (textLeft.startsWith("set")) {
        // Unregisters previously-set variables.
        exprParser.optIncludeUnknowns = false;
        exprParser.resetTokens();

        // Registers all valid variables with the math parser.
        const variablesKeys = Object.keys(this.variables);
        for (let i = 0; i < variablesKeys.length; i++) {
          const varName = variablesKeys[i];
          const varVal = this.variables[variablesKeys[i]];

          if (typeof varVal === "number") {
            exprParser.addIdentifier(new TokenId(varName, varVal));
          } else if (typeof varVal === "boolean") {
            exprParser.addIdentifier(new TokenId(varName, varVal));
          }
        }

        // Registers a function to set a random number.
        exprParser.addFunction(
          new TokenFunc("random", 1, (tokens) => {
            if (tokens[0] instanceof TokenNum) {
              const n0 = tokens[0] as TokenNum;

              return new TokenNum(this.customization.random.nextNumber() * n0.value + 1);
            }

            return null;
          })
        );

        // Gets the index to separate left and right-hand sides.
        let exprTwoSidedIndex = words.indexOf("=");

        // Handles expressions with both LHS and RHS.
        if (exprTwoSidedIndex !== -1) {
          let lhs = words.slice(1, exprTwoSidedIndex);
          let rhs = words.slice(exprTwoSidedIndex + 1);
          let result = "";
          let resultVal = null;

          // If the left-hand side is a single word.
          if (lhs.length === 1) {
            // Attempts to compute the RHS expression.
            try {
              result = exprParser.eval(rhs.join(" "));
            } catch (e) {
              if (e instanceof Error) {
                this.setErrorMessage("Interpreter: In the line '" + line + "', " + e.message);
              } else {
                this.setErrorMessage("Interpreter: In the line '" + line + ", " + e);
              }
            }

            // Parses the computed result as a bool.
            if (result === "true" || result === "false") {
              resultVal = result === "true";
            }

            // Parses the computed result as a number.
            else {
              if (numberRegex.test(result)) {
                resultVal = parseFloat(result);
              } else {
                this.setErrorMessage(
                  "Interpreter: In the line '" +
                    line +
                    "', the expression " +
                    rhs.join(" ") +
                    " should be a number, but " +
                    result +
                    " was computed instead."
                );
              }
            }

            // Sets or adds the new value as appropriate.
            if (variablesKeys.includes(lhs[0])) {
              this.variables[lhs[0]] = resultVal as number | boolean;
            } else {
              if (
                singleDigitRegex.test(lhs[0][0]) ||
                exprParser.getTokens().some((o) => o.strForm === lhs[0])
              ) {
                this.setErrorMessage(
                  "Interpreter: In the line '" +
                    line +
                    "', the variable '" +
                    lhs[0] +
                    "' is a name used for math or is a number."
                );
              } else {
                this.variables[lhs[0]] = resultVal as number | boolean;
              }
            }
          } else {
            this.setErrorMessage(
              "Interpreter: In the line '" +
                line +
                ", the phrase " +
                lhs.join(" ") +
                " must be a variable name without spaces."
            );
          }
        }

        // Handles shorthand expressions with only the LHS.
        else {
          let lhs = words.slice(1);
          let result = "";
          let resultVal = null;

          if (lhs.length > 0) {
            // Syntax: set name, set !name
            if (lhs.length === 1) {
              // Sets false boolean values.
              if (lhs[0].startsWith("!")) {
                let lhsBool = lhs[0].substring(1);

                if (variablesKeys.includes(lhsBool)) {
                  this.variables[lhsBool] = false;
                } else if (
                  (lhs.length > 0 && singleDigitRegex.test(lhs[0][0])) ||
                  exprParser.getTokens().some((tok) => tok.strForm === lhsBool)
                ) {
                  this.setErrorMessage(
                    "Interpreter: In the line '" +
                      line +
                      "', the variable '" +
                      lhsBool +
                      "' is a number or is used for math."
                  );
                } else {
                  this.variables[lhsBool] = false;
                }
              }

              // Sets true boolean values.
              else {
                if (variablesKeys.includes(lhs[0])) {
                  this.variables[lhs[0]] = true;
                } else if (
                  (lhs.length > 0 && singleDigitRegex.test(lhs[0][0])) ||
                  exprParser.getTokens().some((tok) => tok.strForm === lhs[0])
                ) {
                  this.setErrorMessage(
                    "Interpreter: In the line '" +
                      line +
                      "', the variable '" +
                      lhs[0] +
                      "' is a number or is used for math."
                  );
                } else {
                  this.variables[lhs[0]] = true;
                }
              }
            }

            // Syntax: set EXPR, where EXPR is a math expression and not equation.
            // This is computed as set name = EXPR.
            else if (variablesKeys.includes(lhs[0])) {
              // Attempts to compute the LHS expression.
              try {
                result = exprParser.eval(lhs.join(" "));
              } catch (e) {
                if (e instanceof Error) {
                  this.setErrorMessage("Interpreter: In the line '" + line + "', " + e.message);
                } else {
                  this.setErrorMessage("Interpreter: In the line '" + line + "', " + e);
                }
              }

              // Parses the computed result as a bool.
              if (result === "true" || result === "false") {
                resultVal = result === "true";
              }

              // Parses the computed result as a number.
              else {
                if (numberRegex.test(result)) {
                  resultVal = parseFloat(result);
                } else {
                  this.setErrorMessage(
                    "Interpreter: In the line '" +
                      line +
                      "', the expression " +
                      lhs.join(" ") +
                      " should be a number, but " +
                      result +
                      " was computed instead."
                  );
                }
              }

              this.variables[lhs[0]] = resultVal as number | boolean;
            } else {
              this.setErrorMessage(
                "Interpreter: In the line '" +
                  line +
                  "', the variable " +
                  lhs[0] +
                  " doesn't exist yet."
              );
            }
          } else {
            this.setErrorMessage(
              "Interpreter: In the line '" +
                line +
                "', you need to provide a variable name to set, using syntax like set a, set !a, or a mathematical expression."
            );
          }
        }

        // Deletes the line just processed.
        if (endOfLine >= 0) {
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
        } else {
          textLeft = "";
        }
      }
      //#endregion

      //#region Print variables. Syntax: get name.
      // Syntax: get name.
      else if (textLeft.startsWith("get")) {
        if (words.length === 2) {
          if (this.variables[words[1]] !== undefined) {
            this.content.push(this.addOutput(this.variables[words[1]].toString()));
          } else {
            this.setErrorMessage(
              "Interpreter: In the line '" + line + "', variable " + words[1] + " does not exist."
            );
          }
        } else {
          this.setErrorMessage(
            "Interpreter: In the line '" + line + "', only one word can follow 'get'."
          );
        }

        // Deletes the line just processed.
        if (endOfLine >= 0) {
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
        } else {
          textLeft = "";
        }
      }
      //#endregion

      //#region Immediately jumps to another forks. Syntax: goto forkname.
      // Handles syntax: goto forkname.
      else if (textLeft.startsWith("goto")) {
        let forkName = line.substring(4).replace(whitespaceRegex, "").toLowerCase();

        if (this.entries[forkName] !== undefined) {
          // Ensures this page is considered visited, then executes the page being jumped to. When
          // execution flow returns, this exits out of everything.
          this.visitFork();
          this.setFork(forkName);
          this.stopEvaluation = true;
          return;
        } else {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              textLeft +
              "', cannot navigate to fork '" +
              forkName +
              "' because it does not exist."
          );
        }

        // Deletes the line just processed.
        if (endOfLine >= 0) {
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
        } else {
          textLeft = "";
        }
      }
      //#endregion

      //#region Set text color. Syntax: color ffffff, color fff.
      // Handles syntax: color ffffff (and other hex codes).
      else if (textLeft.startsWith("color")) {
        let color = line.substring(5).trim().toLowerCase();
        if (!colorRegex.test(color)) {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              line +
              "', color must be given in hex format. It can only include numbers 1-9 and upper or lowercase a-f."
          );
        } else if (color.length !== 6 && color.length !== 3) {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              line +
              "', color must be given in hex format using 3 or 6 digits. For example, f00 or 8800f0."
          );
        } else if (color.length === 3) {
          this.customization.styleOutput.color = color.substring(0, 3);
        }

        // Deletes the line just processed.
        if (endOfLine >= 0) {
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
        } else {
          textLeft = "";
        }
      }
      //#endregion

      // Anything left is an error.
      else {
        this.setErrorMessage(
          "Interpreter: In the line '" +
            line +
            "', unexpected symbols encountered. Ensure all output text is wrapped in single braces and there are no extra braces inside."
        );

        // Skips the unprocessable line.
        textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
      }
    }
  }

  /** Initializes or resets the interpreter states. */
  private refreshInterpreter() {
    this.actions = [];
    this.content = [];
    this.customization = {
      discreteInlineLinks: defaultCustomization.discreteInlineLinks,
      preserveOldOutput: defaultCustomization.preserveOldOutput,
      random: defaultCustomization.random,
      showErrors: defaultCustomization.showErrors,
      styleOptions: { ...defaultCustomization.styleOptions },
      styleOptionsHighlight: { ...defaultCustomization.styleOptionsHighlight },
      restartOptionDisabled: defaultCustomization.restartOptionDisabled,
      restartOptionText: defaultCustomization.restartOptionText,
      styleInput: { ...defaultCustomization.styleInput },
      styleOutput: { ...defaultCustomization.styleOutput },
      styleRunner: { ...defaultCustomization.styleRunner },
    };
    this.errorMessage = "";
    this.fork = "";
    this.log = [];
    this.options = [];
    this.timers = [];
    this.variables = {};
    this.variablesPrev = {};
  }

  /** Called when a restart link is pressed or restart is invoked. */
  private restartGame = () => {
    this.refreshInterpreter();

    const entriesKeys = Object.keys(this.entries);
    this.setFork(entriesKeys[0]);
  };

  /** Empties the log or updates it, depending on interpreter options. */
  private updateLog() {
    if (!this.customization.preserveOldOutput) {
      this.log = [];
    } else {
      this.log.push(...this.content);
    }
  }

  /**
   * Called when a fork is finished executing or is stopped so another fork can run, in which this
   * should execute immediately.
   */
  private visitFork() {
    // Automatically sets variables to indicate pages were visited.
    if (this.variables["visited" + this.fork] === undefined) {
      this.variables["visited" + this.fork] = true;
    }
  }

  /**
   * Creates and returns a hyperlink styled as an option. For forkNameOrAction, if a string is
   * provided, it indicates the fork to go to. Passing a function can execute custom code instead.
   */
  public addOption(text: string, forkNameOrAction: string | (() => void), key?: string) {
    const linkAction =
      typeof forkNameOrAction === "function"
        ? forkNameOrAction
        : () => {
            if (this.customization.preserveOldOutput) {
              this.content.push(this.addInput(text));
            }

            this.setFork(forkNameOrAction);
          };

    return (
      <ActionButton
        key={key ? key : `runner-option-${uniqueKeyCounter++}`}
        onClick={linkAction}
        styles={{
          root: { ...this.customization.styleOptions, display: "block", height: "32px" },
          rootFocused: { ...this.customization.styleOptionsHighlight },
          rootHovered: { ...this.customization.styleOptionsHighlight },
        }}
        text={text}
      />
    );
  }

  /** Creates and returns a text element styled to represent the player's input. */
  public addInput(text: string) {
    return (
      <p
        key={`runner-input-${uniqueKeyCounter++}`}
        className={mergeStyles(this.customization.styleInput)}
      >
        {text}
      </p>
    );
  }

  /** Creates and returns a text element styled as output text. */
  public addOutput(text: string) {
    return (
      <p
        key={`runner-output-${uniqueKeyCounter++}`}
        className={mergeStyles(this.customization.styleOutput)}
      >
        {text}
      </p>
    );
  }

  /** Loads the current progress from local storage if possible. */
  public loadFile() {
    // TODO: implement.
  }

  /** Loads an entry and pushes changes to the page, catching and displaying errors on the screen. */
  public loadFork() {
    this.updateLog();
    this.content = [];
    this.options = [];
    this.textboxHidden = true;

    // Clears all timers.
    this.timers.forEach((ref: NodeJS.Timeout) => {
      clearTimeout(ref);
    });

    this.timers = [];
    this.actions = [];

    // Sets up variables.
    let tree: StoryParseNode | undefined;

    // Gets the nodes to process, if possible.
    tree = this.entries[this.fork];
    if (tree === undefined) {
      this.setErrorMessage("Interpreter: fork '" + this.fork + "' not found.");
      return;
    }

    // Records the previous state of all variables.
    this.variablesPrev = {};
    const variablesKeys = Object.keys(this.variables);

    for (let i = 0; i < variablesKeys.length; i++) {
      this.variablesPrev[variablesKeys[i]] = this.variables[variablesKeys[i]];
    }

    // Evaluates every node.
    this.preorderProcess(tree, "");

    // Exits if fork execution stops.
    if (this.stopEvaluation) {
      return;
    }

    // Ensures the fork is considered visited.
    this.visitFork();
    this.refreshInterpreterGui();
  }

  /** Parses a special set of options at the top of the file. */
  public processHeaderOptions(text: string) {
    // Clears all old preferences.
    this.refreshInterpreter();

    let lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      // Gets the line and words on that line.
      let line = lines[i];
      let words = line.split(" ");

      // Gets all text after the option has been named.
      let input = "";

      for (let j = 1; j < words.length; j++) {
        input += words[j] + " ";
      }

      input = input.trim();

      if (line.startsWith("link-style-text")) {
        this.customization.discreteInlineLinks = true;
      } else if (line.startsWith("option-default-text")) {
        this.customization.restartOptionText = input;
      } else if (line.startsWith("option-default-disable")) {
        this.customization.restartOptionDisabled = true;
      } else if (
        line.startsWith("option-color") ||
        line.startsWith("option-hover-color") ||
        line.startsWith("background-color")
      ) {
        // Stores the color to be created.
        let color = "";
        if (!colorRegex.test(input)) {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              line +
              "', color must be given in hex format. It can only include numbers 1-9 and upper or lowercase a-f."
          );
        } else if (input.length !== 6 && input.length !== 3) {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              line +
              "', color must be given in hex format using 3 or 6 digits. For example, f00 or 8800f0."
          );
        } else if (input.length === 3 || input.length === 6) {
          color = input.substring(0, input.length);
        }

        if (line.startsWith("option-color")) {
          this.customization.styleOptions.color = color;
        } else if (line.startsWith("option-hover-color")) {
          this.customization.styleOptionsHighlight.color = color;
        } else if (line.startsWith("background-color")) {
          this.customization.styleRunner.backgroundColor = color;
        }
      } else if (line.startsWith("output-font-size") || line.startsWith("option-font-size")) {
        if (!numberRegex.test(input)) {
          this.setErrorMessage(
            "Interpreter: In line '" + line + "', a number must be specified after the option."
          );
          continue;
        }

        let number = parseFloat(input);

        if (number <= 0) {
          this.setErrorMessage(
            "Interpreter: In line '" + line + "', numbers must be greater than zero."
          );
          continue;
        }

        if (line.startsWith("output-font-size")) {
          this.customization.styleOutput.fontSize = number;
        } else if (line.startsWith("option-font-size")) {
          this.customization.styleOutput.fontSize = number;
        }
      } else if (line.startsWith("option-font")) {
        this.customization.styleOptions.fontFamily = input + "; " + fallbackFontStack;
      } else if (line.startsWith("output-font")) {
        this.customization.styleOutput.fontFamily = input + "; " + fallbackFontStack;
      }
    }
  }

  /** Sets or clears an error message. */
  public setErrorMessage(error: string | undefined) {
    debugger;
    this.errorMessage = error ?? "";
    this.refreshInterpreterGui();
  }

  /** Re-renders the interpreter and applies the chosen background color. */
  public refreshInterpreterGui() {
    const runner = document.getElementById(idRunnerWrapper);

    if (runner && this.customization.styleRunner.backgroundColor) {
      runner.style["backgroundColor"] = this.customization.styleRunner.backgroundColor;
    }

    (this.props as StoryInterpreterProps).dispatchRerenderStory();
  }

  /** Renders output. Conditionally renders logs, error message, and textbox. */
  public render(): React.ReactNode {
    const restartOption =
      this.options.length === 0 && !this.customization.restartOptionDisabled
        ? this.getRestartLink()
        : undefined;

    const allOutput = [
      <div key={idRunnerLog} id={idRunnerLog}>
        {...this.log}
      </div>,
      <div key={idRunnerContent} id={idRunnerContent}>
        {...this.content}
      </div>,
      <div key={idRunnerOptions} id={idRunnerOptions}>
        {...this.options}
        {restartOption}
      </div>,
    ];

    const errorMessage =
      this.customization.showErrors && this.errorMessage !== "" ? (
        <MessageBar messageBarType={MessageBarType.error}>{this.errorMessage}</MessageBar>
      ) : undefined;

    const textbox = !this.textboxHidden ? (
      <input
        name="textfield" // Required for browsers to not autocomplete with prior entries.
        autoComplete="nah" // Required for browsers to not autocomplete with address.
        key={idRunnerInputfield}
        id={idRunnerInputfield}
        onKeyPress={this.onTextboxKeyPress}
        style={{
          alignSelf: "stretch",
          flexShrink: 1,
          fontSize: "16px",
          height: "32px",
        }}
        type="text"
      />
    ) : undefined;

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "90vh" }}>
        <div style={{ flexGrow: 1, margin: "4px" }}>{...allOutput}</div>
        {errorMessage}
        {textbox}
      </div>
    );
  }

  /** Saves the current progress to local storage if possible. */
  public saveFile() {
    // TODO: implement.
  }

  /** For internal use. Sets the entries usually given by the parser. */
  public setEntries(entries: IPageDictionary) {
    this.entries = entries;
  }

  /** For internal use. Sets the entries usually given by the parser. If forkToLoad is an empty string, loads the first fork. */
  public setEntriesWithFork(entries: IPageDictionary, forkToLoad: string) {
    this.content = [];
    this.log = [];
    this.options = [];
    this.entries = entries;
    this.errorMessage = "";

    const entriesKeys = Object.keys(this.entries);

    if (entriesKeys.length === 0) {
      this.setErrorMessage(
        "Interpreter: cannot play story. It contains no forks. Use @ at the beginning of a line to denote an fork."
      );
    } else {
      if (forkToLoad !== "" && entriesKeys.includes(forkToLoad)) {
        this.setFork(forkToLoad);
      } else {
        this.setFork(entriesKeys[0]);
      }
    }
  }

  /** For internal use. Sets the fork usually given by parsed entries. */
  public setFork(forkName: string) {
    this.fork = forkName;
    this.stopEvaluation = false;

    this.loadFork();
  }
}

export const StoryInterpreter = connect(mapStateToProps, mapDispatchToProps, undefined, {
  forwardRef: true,
})(StoryInterpreterC);
