import * as vscode from 'vscode';
import { getCode502Default } from '../../../configUI';
import {
    TAhkSymbol,
    TArgMap,
    TTokenStream,
    TValMap,
} from '../../../globalEnum';
import { getFnVarDef } from './getFnVarDef';
import { getFnVarRef } from './getFnVarRef';

type TSetValMap = {
    valMap: TValMap;
    diagFnVar: vscode.Diagnostic[];
};

export function getFnVarMain(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    argMap: TArgMap,
): TSetValMap {
    const warnNumber: [number] = [getCode502Default()];
    const diagFnVar: vscode.Diagnostic[] = []; // TODO NeverUsed or Inconsistent capitalization
    const valMap: TValMap = getFnVarDef({
        uri,
        ahkSymbol,
        DocStrMap,
        argMap,
        diagFnVar,
        warnNumber,
    });

    getFnVarRef(uri, ahkSymbol, DocStrMap, valMap, diagFnVar);

    return {
        valMap,
        diagFnVar,
    };
}
