/* eslint-disable security/detect-non-literal-regexp */

import * as vscode from 'vscode';
import { tryGetSymbol } from './Def/DefProvider';
import { EMode, MyDocSymbol } from '../globalEnum';
import { setFuncHoverMD } from '../tools/setHoverMD';

const wm: WeakMap<MyDocSymbol, vscode.Hover> = new WeakMap();

async function HoverFunc(wordLower: string, textRaw: string): Promise<false | vscode.Hover> {
    const isFunc = new RegExp(`(?<!\\.)(${wordLower})\\(`, 'i'); // not search class.Method()
    if (isFunc.test(textRaw) === false) return false;

    const hasSymbol = tryGetSymbol(wordLower, EMode.ahkFunc);
    if (hasSymbol === false) return false;
    const cache = wm.get(hasSymbol.AhkSymbol);
    if (cache !== undefined) {
        //  console.log('WeakMap -> wordLower :', wordLower);
        //  console.log('WeakMap -> AhkSymbol -> range :', hasSymbol.AhkSymbol.range);
        //  console.log('WeakMap -> fsPath :', hasSymbol.fsPath);
        return cache;
    }

    const Hover = await setFuncHoverMD(hasSymbol);
    wm.set(hasSymbol.AhkSymbol, Hover);
    return Hover;
}

export class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideHover(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Hover | undefined> {
        const Range = document.getWordRangeAtPosition(position);
        if (Range === undefined) return undefined;
        const wordLower = document.getText(Range).toLowerCase();
        const textRaw = document.lineAt(position).text;
        const isFunc = await HoverFunc(wordLower, textRaw);
        if (isFunc !== false) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = this.getCommandsHover(document, position);
        // if (commands) return commands;

        return undefined;
    }
}
