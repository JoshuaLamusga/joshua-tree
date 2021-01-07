import { invokeOpenCommand } from "../../gui/OpenFileHandler";
import { store } from "../../store";
import { newStory } from "../redux/viewedit.actions";
import { IShortcut } from "./shortcutManager";

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
  newProject = "newProject",
  openProjectOrGame = "openProjectOrGame",
  saveProject = "saveProject",
}

/**
 * Disabled in play mode. Prompts the author to save unsaved changes, then starts a new project. */
const actionNewProject: ICommandFunction = {
  function: () => {
    store.dispatch(newStory);
  },
};

/**
 * If in play mode, prompts the player to save unsaved progress, then opens a different game.
 * If in edit mode, prompts the author to save unsaved changes, then opens a different game.
 */
const actionOpenProjectOrGame: ICommandFunction = {
  function: (data?: { data?: { data: Function } }) => {
    invokeOpenCommand(data?.data?.data ?? undefined);
  },
};

/**
 * Disabled in play mode. Prompts the author for a save location if never saved, or online version is in use. */
const actionSaveProject: ICommandFunction = {
  function: () => {
    alert("Invoked file -> save."); //TODO
  },
};

export const commands: { [key in commandIds]: ICommand } = {
  newProject: {
    functionsToInvoke: [actionNewProject],
    guid: commandIds.newProject as commandIds,
    shortcuts: [
      {
        originalSequence: [{ key: "N", usesShift: true }],
      },
    ],
  },
  openProjectOrGame: {
    functionsToInvoke: [actionOpenProjectOrGame],
    guid: commandIds.openProjectOrGame as commandIds,
    shortcuts: [
      {
        originalSequence: [{ key: "O", usesShift: true }],
      },
    ],
  },
  saveProject: {
    functionsToInvoke: [actionSaveProject],
    guid: commandIds.saveProject as commandIds,
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

  if (!commands[Id].disabled) {
    commands[Id].functionsToInvoke.forEach((func: ICommandFunction) => {
      if (!func.disabled) {
        func.function(data);
      }
    });
  }
};
