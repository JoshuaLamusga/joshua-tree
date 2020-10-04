import { IShortcut } from "./shortcutManager";
import { invokeOpenCommand } from "../../shell/gui/MenuBar";

/** A command is a set of functions executed when the command is invoked by identity. */
export interface ICommand {
  enableWhileTyping?: boolean;
  disabled?: boolean;
  functionsToInvoke: ICommandFunction[];
  guid: commandIds;
  shortcuts: IShortcut[];
}

/** Contains the event object and/or arbitrary data passed to the called command. */
export interface ICommandFunctionData {
  event?: React.SyntheticEvent;
  data?: any;
}

/** A function that can be executed by a command. */
export interface ICommandFunction {
  disabled?: boolean;
  function: (data?: ICommandFunctionData) => void;
}

/**
 * Commands can be invoked by ID or keyboard shortcuts. Users can define shortcuts, making it
 * valuable to define frequent or important user actions as commands.
 */
export enum commandIds {
  mainMenuFileNew = "mainMenuFileNew",
  mainMenuFileOpen = "mainMenuFileOpen",
  mainMenuFileSave = "mainMenuFileSave",
}

/** Prompts the user to save first, then starts a new project. */
const actionMainMenuFileNew: ICommandFunction = {
  function: () => {
    alert("Invoked file -> new."); //TODO
  },
};

/** Prompts the user to save first, then opens the given file. */
const actionMainMenuFileOpen: ICommandFunction = {
  function: () => {
    invokeOpenCommand();
  },
};

/** Saves all changes. Prompts for a save location if never before saved. */
const actionMainMenuFileSave: ICommandFunction = {
  function: () => {
    alert("Invoked file -> save."); //TODO
  },
};

export const commands: { [key in commandIds]: ICommand } = {
  mainMenuFileNew: {
    functionsToInvoke: [actionMainMenuFileNew],
    guid: commandIds.mainMenuFileNew as commandIds,
    shortcuts: [
      {
        originalSequence: [{ key: "N", usesShift: true }],
      },
    ],
  },
  mainMenuFileOpen: {
    functionsToInvoke: [actionMainMenuFileOpen],
    guid: commandIds.mainMenuFileOpen as commandIds,
    shortcuts: [
      {
        originalSequence: [{ key: "O", usesShift: true }],
      },
    ],
  },
  mainMenuFileSave: {
    functionsToInvoke: [actionMainMenuFileSave],
    guid: commandIds.mainMenuFileSave as commandIds,
    shortcuts: [
      {
        originalSequence: [{ key: "S", usesShift: true }],
      },
    ],
  },
};

/** Invokes the command with the given ID. */
export const invokeCommand = (Id: commandIds, data?: ICommandFunctionData) => {
  // Silently consume command invocations that aren't enabled while typing. They still consume keypresses.
  if (
    commands[Id].enableWhileTyping !== true &&
    (document.activeElement?.nodeName.toLowerCase() === "textarea" ||
      (document.activeElement?.nodeName.toLowerCase() === "input" &&
        document.activeElement.getAttribute("type") === "text"))
  ) {
    return;
  }

  if (commands[Id].disabled !== true) {
    commands[Id].functionsToInvoke.forEach((func: ICommandFunction) => {
      if (func.disabled !== true) {
        func.function(data);
      }
    });
  }
};
