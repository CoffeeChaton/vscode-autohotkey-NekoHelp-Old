import * as vscode from 'vscode';
import type { EDiagCode } from '../../diag';
import { Diags } from '../../diag';
import type { TCommandElement } from './Command';
import { LineCommand } from './Command';
import { CSnippetCommand } from './CSnippetCommand';

type TCommandMDMap = ReadonlyMap<string, vscode.MarkdownString>;
export type TSnippetCommand = readonly CSnippetCommand[];
type TCommandErrMap = ReadonlyMap<string, EDiagCode>;

export const [snippetCommand, CommandMDMap, CommandErrMap] = ((): [TSnippetCommand, TCommandMDMap, TCommandErrMap] => {
    const commandElement2Md = (Element: TCommandElement): vscode.MarkdownString => {
        const {
            body,
            doc,
            link, // string | undefined
            exp, // string[] | undefined
            diag,
        } = Element;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown('Command')
            .appendCodeblock(body, 'ahk')
            .appendMarkdown(`[(Read Doc)](${link ?? 'https://www.autohotkey.com/docs/commands/index.htm'})\n\n`) // TODO
            .appendMarkdown(doc);

        // .appendCodeblock(exp.join('\n'));
        if (exp !== undefined && exp.length > 0) {
            md
                .appendMarkdown('\n\n***')
                .appendMarkdown('\n\n*exp:*')
                .appendCodeblock(exp.join('\n'), 'ahk');
        }
        if (diag !== undefined) {
            const { msg, path } = Diags[diag];
            md
                .appendMarkdown(`\n\n***\n\n**warn:** ${msg}`)
                .appendMarkdown(`[(Read Warn ${diag})](${path})`);
        }
        md.supportHtml = true;
        return md;
    };

    const map1 = new Map<string, vscode.MarkdownString>();
    const tempList: CSnippetCommand[] = [];
    const tempSet = new Map<string, EDiagCode>();

    for (const [k, v] of Object.entries(LineCommand)) {
        const md: vscode.MarkdownString = commandElement2Md(v);
        map1.set(k, md);

        tempList.push(new CSnippetCommand(k, v, md));
        const { diag } = v;
        if (diag !== undefined) {
            tempSet.set(k, diag);
        }
    }
    return [tempList, map1, tempSet];
})();

export function getHoverCommand2(wordUp: string): vscode.MarkdownString | undefined {
    return CommandMDMap.get(wordUp);
}
