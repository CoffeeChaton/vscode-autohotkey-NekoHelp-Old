/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable max-lines */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,20] }] */
import * as vscode from 'vscode';
import { FuncInputType } from '../../core/getChildren';
import { MyDocSymbol } from '../../globalEnum';
import { removeParentheses } from '../removeParentheses';

export function getClassInstanceVar(FuncInput: FuncInputType): false | MyDocSymbol {
    const { line, lStr } = FuncInput;

    if (lStr.indexOf(':=') === -1) return false;
    if ((/^\s*\bstatic\b/i).test(lStr) || (/^\s*\bglobal\b/i).test(lStr)) return false;

    const name = removeParentheses(lStr)
        .split(',')
        .map((str) => str.replace(/:=.*/, '').trim())
        .join(', ');

    const detail = 'Instance Var';
    const kind = vscode.SymbolKind.Variable;
    const rangeRaw = new vscode.Range(line, 0, line + 1, 0);

    return new vscode.DocumentSymbol(name,
        detail, kind, rangeRaw, rangeRaw);
}
