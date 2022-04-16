import * as path from 'path';
import * as vscode from 'vscode';
import { TGValMap } from '../../core/ParserTools/ahkGlobalDef';
import {
    EMode,
    TAhkSymbol,
    TAhkSymbolList,
    TTokenStream,
} from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { getDocStrMapMask } from '../getDocStrMapMask';
import { getFuncDocCore } from '../MD/getFuncDocMD';
import { getFnVarDef } from './FnVar/getFnVarDef';
import { getUnknownTextMap } from './getUnknownTextMap';
import { getParamDef } from './Param/getParamDef';
import {
    TDAMeta,
    TParamMap,
    TTextMap,
    TValMap,
} from './TypeFnMeta';

function getDACore(
    document: vscode.TextDocument,
    AhkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    GValMap: TGValMap, // eval!!
    defStack: string[],
): null | TDAMeta {
    const kind: vscode.SymbolKind.Method | vscode.SymbolKind.Function | null = kindPick(AhkSymbol.kind);
    if (kind === null) return null;

    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkSymbol.range, DocStrMap);

    const paramMap: TParamMap = getParamDef(AhkSymbol, AhkTokenList);
    const valMap: TValMap = getFnVarDef(AhkSymbol, AhkTokenList, paramMap, GValMap);
    const textMap: TTextMap = getUnknownTextMap(AhkSymbol, AhkTokenList, paramMap, valMap, GValMap); // eval!!
    const funcRawName: string = AhkSymbol.name;

    const selectionRangeText: string = document.getText(AhkSymbol.selectionRange);
    const fileName: string = path.basename(document.uri.fsPath);
    const kindStr: string = kind === vscode.SymbolKind.Function
        ? EMode.ahkFunc
        : EMode.ahkMethod;
    const md: vscode.MarkdownString = getFuncDocCore(kindStr, fileName, AhkTokenList, selectionRangeText); // TODO emmt

    const v: TDAMeta = {
        defStack,
        kind,
        paramMap,
        valMap,
        textMap,
        funcRawName,
        upName: funcRawName.toUpperCase(),
        selectionRangeText,
        selectionRange: AhkSymbol.selectionRange,
        range: AhkSymbol.range,
        uri: document.uri,
        md,
    };

    return v;
}

export function DeepAnalysis(
    document: vscode.TextDocument, // TODO remove this...
    AhkSymbolList: TAhkSymbolList,
    DocStrMap: TTokenStream,
    GValMap: TGValMap,
    defStack: string[], // := []
): TDAMeta[] {
    const funcMetaList: TDAMeta[] = [];
    for (const AhkSymbol of AhkSymbolList) {
        if (AhkSymbol.kind === vscode.SymbolKind.Class) {
            funcMetaList.push(
                ...DeepAnalysis(document, AhkSymbol.children, DocStrMap, GValMap, [...defStack, AhkSymbol.name]),
            );
            continue;
        }
        const DA: TDAMeta | null = getDACore(document, AhkSymbol, DocStrMap, GValMap, defStack);
        if (DA !== null) funcMetaList.push(DA);
    }

    return funcMetaList;
}
