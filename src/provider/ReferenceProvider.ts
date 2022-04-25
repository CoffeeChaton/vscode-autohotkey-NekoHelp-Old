import * as vscode from 'vscode';
import { isPosAtStr } from '../tools/isPosAtStr';
import { userDefFunc } from './Def/DefProvider';
import { getValWithDA } from './Def/getValDefInFunc';

function ReferenceProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | null {
    if (isPosAtStr(document, position)) return null;

    // eslint-disable-next-line security/detect-unsafe-regex
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/ui);
    if (!range) return null;
    const wordUp: string = document.getText(range).toUpperCase();
    // TODO class.Method, this.classVar,GoSub, GoTo, ahk Built-in func

    const listAllUsing = true;
    const userDefLink: vscode.Location[] | null = userDefFunc(document, position, wordUp, listAllUsing);
    if (userDefLink !== null) return userDefLink;

    const valInFunc: vscode.Location[] | null = getValWithDA(document, position, wordUp, listAllUsing);
    if (valInFunc !== null) return valInFunc;
    return null;
}

//  Go to References search (via Shift+F12),
export const ReferenceProvider: vscode.ReferenceProvider = {
    provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        _context: vscode.ReferenceContext,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Location[]> {
        return ReferenceProviderCore(document, position);
    },
};
