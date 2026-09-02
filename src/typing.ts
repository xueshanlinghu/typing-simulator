import * as vscode from "vscode";
import { EOL, State } from "./State";

interface TypingProps {
  text: string;
  state: State;
  pos?: vscode.Position;
}

async function typing(props: TypingProps): Promise<void> {
  if (!props.text || props.state.status != "typing") return;

  let text = props.text;
  let pos = props.pos ?? new vscode.Position(0, 0);
  const eol = props.state.eol;

  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.uri != props.state.currentDocument) {
    props.state.setStatus("stoped");
    return;
  }

  const textAction = applyActions(text, pos, props.state);
  if (!textAction) return;
  text = textAction;

  let charLength = 1;
  let newPos: vscode.Position;

  if (text.startsWith("\r\n")) {
    await writeText(eol === "crlf" ? "\r\n" : "\n", pos);
    charLength = 2;
    newPos = new vscode.Position(pos.line + 1, 0);
  } else if (text.startsWith("\n")) {
    await writeText("\n", pos);
    newPos = new vscode.Position(pos.line + 1, 0);
  } else {
    await writeText(text.substring(0, 1), pos);
    newPos = new vscode.Position(pos.line, pos.character + 1);
  }

  const nextText = text.substring(charLength);
  props.state.setTypingText(nextText);
  props.state.setPosition(newPos);
  vscode.window.activeTextEditor!.selection = new vscode.Selection(newPos, newPos);
  nextBuffer(nextText, newPos, props.state);
}

async function writeText(text: string, pos: vscode.Position) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  await editor.edit((editBuilder) => editBuilder.insert(pos, text));
}

function delayTyping(text: string, pos: vscode.Position, state: State) {
  const speed = state.speed == "slow" ? 200 : state.speed == "medium" ? 100 : 50;
  setTimeout(() => typing({ text, pos, state }), speed * Math.random());
}

function nextBuffer(text: string, pos: vscode.Position, state: State) {
  if (state.status == "typing" && state.mode == "auto") {
    delayTyping(text, pos, state);
  }
}

function applyActions(text: string, pos: vscode.Position, state: State): string | null {
  const eolChar = state.eol == "lf" ? "\n" : "\r\n";
  const currentLine = text.split(eolChar)[0];
  const endOfLinePos = text.indexOf(eolChar);

  if (currentLine.trim().match(/(\/\/|#)\[ignore\]/)) {
    const next = text.substring(currentLine.length + eolChar.length);
    nextBuffer(next, new vscode.Position(pos.line, 0), state);
    return null;
  }

  if (currentLine.trim().match(/(\/\/|#)\[quick\]/)) {
    writeText(currentLine.replace(/(\/\/|#)\[quick\]/, ""), new vscode.Position(pos.line, 0));
    nextBuffer(text.substring(endOfLinePos), new vscode.Position(pos.line + 1, 0), state);
    return null;
  }

  if (currentLine.trim().match(/^(\/\/|#)\[pause\]/)) {
    state.setStatus("paused");
    state.setTypingText(text.substring(endOfLinePos));
    return null;
  }

  return text;
}

export { typing, applyActions, delayTyping };
