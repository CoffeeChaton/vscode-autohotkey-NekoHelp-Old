import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { globalVal2Msg, TGlobalVal } from '../../core/ParserTools/ahkGlobalDef';

export function getGlobalMarkdown(wordUp: string): vscode.MarkdownString | null {
    const msgList: string[] = [];
    const fsPathList: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPathList) {
        const GlobalVal: TGlobalVal | undefined = Detecter
            .getDocMap(fsPath)
            ?.GValMap
            ?.get(wordUp);
        if (GlobalVal === undefined) continue;
        msgList.push(globalVal2Msg(fsPath, GlobalVal));
    }
    return new vscode.MarkdownString(msgList.join('\n\n'), true);
}
