import * as vscode from 'vscode';
import type { AnalyzeFuncMain } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import type { CmdFindFuncRef } from '../../command/CmdFindFuncRef';
import { ECommand } from '../../command/ECommand';
import { getCodeLenConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import { getFuncRef } from '../Def/getFnRef';
import type { showUnknownAnalyze } from './showUnknownAnalyze';

function CodeLensCore(fsPath: string): vscode.CodeLens[] {
    const AhkFileData: TAhkFileData | undefined = pm.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];

    const { AST, DocStrMap, uri } = AhkFileData;

    const need: vscode.CodeLens[] = [];
    for (const fnSymbol of getDAListTop(AST)) {
        const cmd0: vscode.Command = {
            title: 'Analyze',
            command: ECommand.showFuncAnalyze,
            tooltip: 'by neko-help dev tools',
            arguments: [
                fnSymbol,
                DocStrMap.slice(fnSymbol.selectionRange.start.line + 1, fnSymbol.range.end.line + 1),
            ] satisfies Parameters<typeof AnalyzeFuncMain>,
        };
        need.push(new vscode.CodeLens(fnSymbol.range, cmd0));

        if (fnSymbol.textMap.size > 0) {
            const cmd1: vscode.Command = {
                title: 'unknownText',
                command: ECommand.showUnknownAnalyze,
                tooltip: 'by neko-help dev tools',
                arguments: [fnSymbol] satisfies Parameters<typeof showUnknownAnalyze>,
            };
            need.push(new vscode.CodeLens(fnSymbol.range, cmd1));
        }

        if (fnSymbol.kind === vscode.SymbolKind.Function) {
            const len: number = getFuncRef(fnSymbol).length;
            const lenFix: number = len <= 2
                ? len - 1
                : len;
            const cmd2: vscode.Command = {
                title: `Reference ${lenFix}`,
                command: ECommand.CmdFindFuncRef,
                tooltip: 'by neko-help dev tools',
                arguments: [
                    uri,
                    fnSymbol.range.start,
                    fnSymbol,
                ] satisfies Parameters<typeof CmdFindFuncRef>,
            };
            need.push(new vscode.CodeLens(fnSymbol.range, cmd2));
        }
    }

    return need;
}

export const CodeLensProvider: vscode.CodeLensProvider = {
    // onDidChangeCodeLenses?: Event<void> | undefined;
    provideCodeLenses(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.CodeLens[]> {
        return getCodeLenConfig()
            ? CodeLensCore(document.uri.fsPath)
            : null;
    },
};
