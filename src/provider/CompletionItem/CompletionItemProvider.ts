/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-await-in-loop */
import * as vscode from 'vscode';
import { getSnippetBlockFilesList } from '../../configUI';
import { ahkSend } from './ahkSend';
import { wrapClass } from './classThis/wrapClass';
import { DeepAnalysisToCompletionItem } from './DA/DeepAnalysisToCompletionItem';
import { globalValCompletion } from './global/globalValCompletion';
import { isNormalPos } from './isNormalPos';
import { snippetStartWihA } from './json/SnippetStartWihA';
import { listAllFuncClass } from './listAllFuncClass/listAllFuncClass';
import { getStartWithStr } from './util';

// icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export class CompletionItemProvider implements vscode.CompletionItemProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        _context: vscode.CompletionContext,
    ): Promise<null | vscode.CompletionItem[]> {
        // TODO wrap vscode.CompletionItem
        const filesBlockList: readonly string[] = getSnippetBlockFilesList();

        const inputStr = getStartWithStr(document, position);
        const completions: vscode.CompletionItem[] = [
            ...await wrapClass(document, position), // '.'
            ...ahkSend(document, position), // '{'
        ];

        if (isNormalPos(document, position)) {
            completions.push(
                ...await listAllFuncClass(inputStr, filesBlockList),
                ...DeepAnalysisToCompletionItem(document, position, inputStr),
                ...snippetStartWihA(),
                ...globalValCompletion(document, position, inputStr),
            );
        }
        // TODO #Include list fsPath List && suggest never #include
        return completions;
    }
}

/*
Functions are assume-local by default. Variables accessed or created inside an assume-local function are local by default,
with the following exceptions:

Super-global variables, including classes.
A dynamic variable reference may resolve to an existing global variable if no local variable exists by that name.
Commands that create pseudo-arrays may create all elements as global even if only the first element is declared.
*/
// TODO https://www.autohotkey.com/docs/KeyList.htm
