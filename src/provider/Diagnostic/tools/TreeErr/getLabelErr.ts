/* cSpell:disable */
import * as vscode from 'vscode';
import { CAhkLabel } from '../../../../AhkSymbol/CAhkLine';
import type { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import { CDiagBase } from '../CDiagBase';

type TDiagMsg = {
    code: EDiagCode;
    // severity: vscode.DiagnosticSeverity.Warning,
    tags: vscode.DiagnosticTag[];
};

const DiagLabelErrMap: ReadonlyMap<string, TDiagMsg> = new Map([
    ['ONCLIPBOARDCHANGE:', {
        code: EDiagCode.code811,
        tags: [vscode.DiagnosticTag.Deprecated],
    }],
    ['DEFAULT:', {
        code: EDiagCode.code501,
        tags: [],
    }],
    ['ON:', {
        code: EDiagCode.code502,
        tags: [],
    }],
    ['OFF:', {
        code: EDiagCode.code502,
        tags: [],
    }],
    ['TOGGLE:', {
        code: EDiagCode.code502,
        tags: [],
    }],
    ['SHIFTALTTAB:', {
        code: EDiagCode.code502,
        tags: [],
    }],
    ['ALTTAB:', {
        code: EDiagCode.code502,
        tags: [],
    }],
    ['ALTTABANDMENU:', {
        code: EDiagCode.code502,
        tags: [],
    }],
    ['ALTTABMENUDISMISS:', {
        code: EDiagCode.code502,
        tags: [],
    }],
]);

export function getLabelErr(ch: TAhkSymbol): CDiagBase[] {
    if (!(ch instanceof CAhkLabel)) return [];

    /**
     * exp : `LABEL:` or `THIS_IS_A_LABEL:`
     */
    const labUpName: string = ch.name.toUpperCase();

    const v2: TDiagMsg | undefined = DiagLabelErrMap.get(labUpName);
    if (v2 === undefined) return [];
    return [
        new CDiagBase({
            value: v2.code,
            range: ch.selectionRange,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: v2.tags,
        }),
    ];
}
