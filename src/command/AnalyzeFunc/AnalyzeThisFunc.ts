import * as vscode from 'vscode';
import type {
    CAhkFunc,
    TParamMapOut,
    TTextMapOut,
    TValMapOut,
} from '../../AhkSymbol/CAhkFunc';
import type { TTokenStream } from '../../globalEnum';
import { EFormatChannel } from '../../globalEnum';
import { FormatCore } from '../../provider/Format/FormatProvider';
import type { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { getAllFunc } from '../../tools/Func/getAllFunc';
import { AnalyzeCommand } from './AnalyzeCommand';
import { AnalyzeGlobalVal } from './AnalyzeGlobalVal';
import { AnalyzeRefFunc } from './AnalyzeRefFunc';

function showElement(map: TParamMapOut | TTextMapOut | TValMapOut): string {
    if (map.size === 0) return '';

    const arr: string[] = [];
    for (const { keyRawName } of map.values()) {
        arr.push(keyRawName);
    }
    return arr.join(', ');
}
// --------

async function fmtAnalyze(document: vscode.TextDocument): Promise<void> {
    const TextEdit: vscode.TextEdit[] = FormatCore({
        document,
        options: {
            tabSize: 4,
            insertSpaces: true,
        },
        fmtStart: 0,
        fmtEnd: document.lineCount - 1,
        from: EFormatChannel.byFormatAllFile,
        needDiff: true,
    });

    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.set(document.uri, TextEdit);
    await vscode.workspace.applyEdit(edit);
}

function baseDataAnalyze(DA: CAhkFunc): string[] {
    return [
        `${DA.name}() ;`,
        '/**',
        `* @Analyze ${DA.name}`,
        '* ',
        '* @Base Data',
        '* ',
        `* @param : ${DA.paramMap.size} of [${showElement(DA.paramMap)}]`,
        `* @value : ${DA.valMap.size} of [${showElement(DA.valMap)}]`,
        `* @unknownText : ${DA.textMap.size} of [${showElement(DA.textMap)}]`,
        '*/',
    ];
}

export type TShowAnalyze = [CAhkFunc, TTokenStream];

export async function AnalyzeFuncMain(DA: CAhkFunc, AhkTokenList: TTokenStream): Promise<void> {
    const fullFuncMap: TFullFuncMap = getAllFunc();

    const t1 = Date.now();
    const ed: string[] = [
        `Analyze_Results_of_${DA.name}() {`,
        'throw, "this is Analyze Results, not .ahk"',
        ...baseDataAnalyze(DA),
        '',
        ...AnalyzeCommand(AhkTokenList, fullFuncMap),
        ...AnalyzeRefFunc(AhkTokenList, fullFuncMap),
        ...AnalyzeGlobalVal(AhkTokenList),
        '}',
        '; Analyze End',
        `; use ${Date.now() - t1} ms`,
    ];

    const document: vscode.TextDocument = await vscode.workspace.openTextDocument({
        language: 'ahk',
        content: ed.join('\n'),
    });

    await fmtAnalyze(document);

    await vscode.window.showTextDocument(document);
}
