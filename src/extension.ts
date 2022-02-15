import * as vscode from 'vscode';
import { statusBarClick } from './command/Command';
import { UpdateCache } from './command/UpdateCache';
// import { CompletionComma } from './provider/CompletionItemProvider';
import { configChangEvent } from './configUI';
import { Detecter } from './core/Detecter';
import { CodeActionProvider } from './provider/CodeActionProvider/CodeActionProvider';
import { CompletionItemProvider } from './provider/CompletionItem/CompletionItemProvider';
import { NekoDebugMain } from './provider/debugger/NekoDebugMain';
import { DefProvider } from './provider/Def/DefProvider';
import { FormatProvider } from './provider/Format/FormatProvider';
import { RangeFormatProvider } from './provider/FormatRange/RangeFormatProvider';
import { OnTypeFormattingEditProvider } from './provider/FormattingEditOnType/OnTypeFormattingEditProvider';
import { HoverProvider } from './provider/HoverProvider';
import { ReferenceProvider } from './provider/ReferenceProvider';
import { RenameProvider } from './provider/Rename/RenameProvider';
import { SymBolProvider } from './provider/SymbolProvider';

export function activate(context: vscode.ExtensionContext): void {
    const language: vscode.DocumentSelector = { language: 'ahk' };
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(language, new HoverProvider()),
        vscode.languages.registerCompletionItemProvider(language, new CompletionItemProvider(), '', '.', '{'),
        vscode.languages.registerDefinitionProvider(language, new DefProvider()),
        vscode.languages.registerReferenceProvider(language, new ReferenceProvider()),
        vscode.languages.registerDocumentSymbolProvider(language, new SymBolProvider()),
        vscode.languages.registerDocumentFormattingEditProvider(language, new FormatProvider()),
        vscode.languages.registerDocumentRangeFormattingEditProvider(language, new RangeFormatProvider()),
        vscode.languages.registerOnTypeFormattingEditProvider(language, new OnTypeFormattingEditProvider(), '\n'),
        vscode.languages.registerRenameProvider(language, new RenameProvider()),
        // vscode.languages.registerSignatureHelpProvider(language, new SignatureHelpProvider(), '(', ')', ','),
        vscode.languages.registerCodeActionsProvider(language, new CodeActionProvider()),
        vscode.workspace.onDidChangeConfiguration((): void => configChangEvent()),
        vscode.workspace.onDidDeleteFiles((e): void => Detecter.delMap(e)),
        vscode.workspace.onDidCreateFiles((e): void => Detecter.createMap(e)),
        vscode.workspace.onDidRenameFiles((e): void => Detecter.renameFileName(e)),
        // vscode.workspace.onDidChangeTextDocument((e) => d(e)),
        vscode.commands.registerCommand('ahk.bar.click', (): void => {
            statusBarClick();
        }),
        vscode.debug.registerDebugAdapterDescriptorFactory('ahk', new NekoDebugMain()),
    );
    UpdateCache();
}

export function deactive(): void {
    Detecter.DocMap.clear();
    Detecter.diagColl.clear();
}

/*
https://github.com/think2011/vscode-i18n-core/blob/10abc4b356cfb34f64d17a7dbdb73e58f6bd6274/editor/Annotation.ts

const range: vscode.Range = new vscode.Range(
    document.positionAt(index),
    document.positionAt(index + matchKey.length + 1)
)

const decoration = {
    range,
    renderOptions: {
        after: {
            color: 'rgba(150, 150, 150, 0.7)',
            contentText: mainText ? `${mainText}` : '',
            fontWeight: 'normal',
            fontStyle: 'normal'
        }
    }
}
vscode.Progress
// createTextEditorDecorationType
QuickInput
*/
