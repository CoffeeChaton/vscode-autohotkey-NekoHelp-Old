// [c](file:\\c:\DEV\dev_main_P7\Lib\Gdip_All_2020.ahk#330,1)

/**
 * @returns ```file:\\c:\DEV\dev_main_P7\Lib\Gdip_All_2020.ahk#330,1`
 */
export function FsLink(fsPath: string, line: number): string {
    return `file:\\\\${fsPath}#${line + 1}`;
}

/**
 * @returns ```[msg](file:\\c:\DEV\dev_main_P7\Lib\Gdip_All_2020.ahk#330,1)```
 */
export function MDMsgLink(msg: string, fsPath: string, line: number): string {
    return `[${msg}](${FsLink(fsPath, line)})`;
}
