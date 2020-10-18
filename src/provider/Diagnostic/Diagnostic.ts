/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import { getSkipSign2 } from '../../tools/removeSpecialChar';
import { TDocArr, EDiagnostic } from '../../globalEnum';

function getIgnore(DocStrMap: TDocArr, line: number, IgnoreLine: number): number {
    // ;@ahk-ignore 30 line.
    // textRaw
    if (DocStrMap[line].textRaw.indexOf(EDiagnostic.ParserIgnore) === -1) return IgnoreLine;
    const ignoreExec = (/^\s*;@ahk-ignore\s\s*(\d\d*)\s/i).exec(DocStrMap[line].textRaw);
    if (ignoreExec === null) {
        console.log('function getIgnore -> ignoreExec', ignoreExec);
        console.log(line, ' line');
        return IgnoreLine;
    }
    const numberOfIgnore = Number(ignoreExec[1]);
    if (Number.isNaN(numberOfIgnore)) {
        vscode.window.showInformationMessage(`Parsing error of ${line} line about ;@ahk-ignore (number) line.`);
        return -1;
    }
    return numberOfIgnore + line;
}

function assign(DocStrMap: TDocArr, line: number, uri: vscode.Uri): null | vscode.Diagnostic {
    // https://www.autohotkey.com/docs/commands/SetEnv.htm
    if (!getSkipSign2(DocStrMap[line].lStr)) return null;

    let col = DocStrMap[line].lStr.indexOf('=');
    if (col === -1) col = 0;
    const Range = new vscode.Range(line, col, line, DocStrMap[line].lStr.length);

    const diag1 = new vscode.Diagnostic(Range, EDiagnostic.code107assignWarning, vscode.DiagnosticSeverity.Information);
    diag1.source = EDiagnostic.Source;
    diag1.code = EDiagnostic.code107;
    //   diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(uri, pos), 'suggest to use := not =')];
    return diag1;
}
export function Diagnostic(DocStrMap: TDocArr, uri: vscode.Uri, collection: vscode.DiagnosticCollection): void {
    const iMax = DocStrMap.length;
    let IgnoreLine = -1;
    const diagList: vscode.Diagnostic[] = [];
    for (let line = 0; line < iMax; line++) {
        IgnoreLine = getIgnore(DocStrMap, line, IgnoreLine);
        if (line > IgnoreLine) {
            const assignEnd = assign(DocStrMap, line, uri);
            if (assignEnd) diagList.push(assignEnd);
        }
    }

    collection.set(uri, diagList);
}
