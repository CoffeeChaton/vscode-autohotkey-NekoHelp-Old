import * as vscode from 'vscode';
import { TValMapIn, TValMetaIn } from '../../../../globalEnum';
import { wrapFnValDef } from './wrapFnValDef';

export function getValMeta(line: number, character: number, RawName: string, valMap: TValMapIn): TValMetaIn {
    const defRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + RawName.length),
    );

    const value: TValMetaIn = wrapFnValDef({
        RawNameNew: RawName,
        valMap,
        defRange,
    });
    return value;
}
