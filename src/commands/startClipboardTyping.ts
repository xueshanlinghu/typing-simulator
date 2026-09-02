import * as vscode from "vscode";
import Controller from "../Controller";
import { getActiveEditor } from "../utils/editor";

const startClipboardTyping = async () => {
  const editor = getActiveEditor();
  if (!editor) return;

  const controller = Controller.getInstance();
  const rawClipboardText = await vscode.env.clipboard.readText();
  if (!rawClipboardText.trim()) {
    vscode.window.showErrorMessage("Typing Simulator: I did not find any text in the clipboard.");
    return;
  }

  const targetEol =
    editor.document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";

  const clipboardText = rawClipboardText.replace(/\r\n|\r|\n/g, targetEol);

  controller.startTyping(clipboardText, editor.document, editor.selection.active);
};

export default startClipboardTyping;
