import * as fs from 'fs';
import * as vscode from 'vscode';
import {
    EStr,
    TFsPath,
} from '../globalEnum';
import { renameFileNameFunc } from '../provider/event/renameFileNameFunc';
import { BaseScanMemo, getBaseData, TMemo } from './BaseScanMemo/memo';

export type TAhkFileData = Omit<TMemo, 'hash'>;

export const diagColl: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('ahk-neko-help');

export const Detecter = {
    // key : vscode.Uri.fsPath,
    DocMap: new Map<TFsPath, TAhkFileData>(),

    getDocMapFile(): string[] {
        const need: string[] = [];
        const keyList: string[] = [...Detecter.DocMap.keys()];
        for (const fsPath of keyList) {
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            if (fs.existsSync(fsPath)) {
                need.push(fsPath);
            } else {
                Detecter.DocMap.delete(fsPath);
            }
        }
        return need;
    },

    getDocMap(fsPath: string): undefined | TAhkFileData {
        return Detecter.DocMap.get(fsPath);
    },

    delMap(e: vscode.FileDeleteEvent): void {
        for (const uri of e.files) {
            delOldCache(uri);
        }
    },

    createMap(e: vscode.FileCreateEvent): void {
        for (const uri of e.files) {
            if (uri.fsPath.endsWith('.ahk')) {
                void vscode.workspace
                    .openTextDocument(uri)
                    .then((doc: vscode.TextDocument): TAhkFileData => Detecter.updateDocDef(doc));
            }
        }
    },

    async renameFileName(e: vscode.FileRenameEvent): Promise<void> {
        for (const { oldUri, newUri } of e.files) {
            if (oldUri.fsPath.endsWith('.ahk')) {
                delOldCache(oldUri);
                if (newUri.fsPath.endsWith('.ahk')) {
                    // eslint-disable-next-line no-await-in-loop
                    await vscode.workspace
                        .openTextDocument(newUri)
                        .then((doc: vscode.TextDocument): TAhkFileData => Detecter.updateDocDef(doc));
                    // eslint-disable-next-line no-await-in-loop
                    await renameFileNameFunc(oldUri, newUri);
                } // else EXP : let a.ahk -> a.ahk0 or a.0ahk
            }
        }
    },

    updateDocDef(document: vscode.TextDocument): TAhkFileData {
        const UpDateDocDefReturn: TAhkFileData = getBaseData(document);

        const { uri } = document;
        const { fsPath } = document.uri;
        if (fsPath.endsWith('.ahk') && fsPath.indexOf(EStr.diff_name_prefix) === -1) {
            Detecter.DocMap.set(fsPath, UpDateDocDefReturn);
            diagColl.set(uri, [...UpDateDocDefReturn.baseDiag]);
        }

        return UpDateDocDefReturn;
    },
};

export function delOldCache(uri: vscode.Uri): void {
    const { fsPath } = uri;
    Detecter.DocMap.delete(fsPath);
    BaseScanMemo.memo.delete(fsPath);
    diagColl.delete(uri);
}
