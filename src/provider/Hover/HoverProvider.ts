/* eslint-disable max-statements */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { hoverAVar } from '../../tools/Built-in/A_Variables';
import { hoverBiVar } from '../../tools/Built-in/BiVariables';
import { getHoverCommand2 } from '../../tools/Built-in/Command_tools';
import { BuiltInFuncMDMap } from '../../tools/Built-in/func_tools';
import { getHoverOtherKeyWord } from '../../tools/Built-in/otherKeyWord';
import { getHoverStatement } from '../../tools/Built-in/statement_vsc';
import { hover2winMsgMd } from '../../tools/Built-in/Windows_Messages_Tools';
import { numberFindWinMsg } from '../../tools/Built-in/Windows_MessagesRe_Tools';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { isPosAtStrNext } from '../../tools/isPosAtStr';
import { DeepAnalysisHover } from './tools/DeepAnalysisHover';
import { hoverMultiLine } from './tools/hover-multi-line';
import { hoverClassName } from './tools/hoverClassName';
import { HoverDirectives } from './tools/HoverDirectives';
import { hoverGlobalVar } from './tools/hoverGlobalVar';

function HoverOfFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`#%])\b\w+\b(?=\()/u);
    if (range === undefined) return null;

    const wordUp: string = document.getText(range).toUpperCase();
    const DA: CAhkFunc | null = getFuncWithName(wordUp);
    if (DA !== null) return DA.md;

    const BuiltInFuncMD: vscode.MarkdownString | undefined = BuiltInFuncMDMap.get(wordUp)?.md;
    if (BuiltInFuncMD !== undefined) return BuiltInFuncMD;

    return null; // not userDefFunc of BiFunc
}

function HoverProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Hover | null {
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    const { AST, DocStrMap } = AhkFileData;

    // ^\s*\( Trim
    const mdOfMultiLine: vscode.MarkdownString | null = hoverMultiLine(DocStrMap, position);
    if (mdOfMultiLine !== null) return new vscode.Hover(mdOfMultiLine);

    // pos at Comment range...
    const { lStr, textRaw } = DocStrMap[position.line];
    if (position.character > lStr.length) return null;

    // ex: #Warn
    const DirectivesMd: vscode.MarkdownString | undefined = HoverDirectives(position, AST);
    if (DirectivesMd !== undefined) return new vscode.Hover(DirectivesMd);

    const AhkFunc: CAhkFunc | null = getDAWithPos(AST, position);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (AhkFunc !== null && AhkFunc.nameRange.contains(position)) {
        return new vscode.Hover(AhkFunc.md);
    }

    const haveFunc: vscode.MarkdownString | null = HoverOfFunc(document, position);
    if (haveFunc !== null) return new vscode.Hover(haveFunc);

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b(?!\()/u);
    if (range === undefined) return null;

    if (isPosAtStrNext(textRaw, lStr, position)) return null;

    const wordUp: string = document.getText(range).toUpperCase();

    const ahkClassMd: vscode.MarkdownString | null = hoverClassName(AhkFileData, position, wordUp);
    if (ahkClassMd !== null) return new vscode.Hover(ahkClassMd);

    if (AhkFunc !== null) {
        const DAmd: vscode.MarkdownString | null = DeepAnalysisHover(AhkFunc, wordUp, position);
        if (DAmd !== null) return new vscode.Hover(DAmd);
    }

    type TFn = (wordUp: string) => vscode.MarkdownString | null | undefined;
    const fnList: TFn[] = [
        getHoverCommand2,
        getHoverOtherKeyWord,
        getHoverStatement,
        hoverAVar,
        hoverBiVar,
        hoverGlobalVar,
        hover2winMsgMd,
        numberFindWinMsg,
    ];

    for (const fn of fnList) {
        const md: vscode.MarkdownString | null | undefined = fn(wordUp);
        if (md !== undefined && md !== null) return new vscode.Hover(md);
    }

    return null;
}

export const HoverProvider: vscode.HoverProvider = {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Hover> {
        return HoverProviderCore(document, position);
    },
};
