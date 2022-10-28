/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
import type { DeepReadonly } from './globalEnum';

// TODO Literal commas and percent signs must be escaped (e.g. `%)"
// ScriptError(_T("Global variables must not be declared in this function."), aLineText);
// ScriptError(_T("Local variables must not be declared in this function."), aLineText);
// "Too many params, param_start > 10
// Duplicate parameter.
export const enum EDiagCodeDA {
    // 501~599 Analysis Func or Method
    code500 = 500, // var is assigned but never used.
    code501 = 501, // param is assigned but never used.
    code502 = 502, // var case sensitivity
    // code503 = 503, param case sensitivity
    code504 = 504, // Variadic param * >1
    code505 = 505, // param parsed Error -> unknown style
    code506 = 506, // base8 base2 diag of not support number formats
    // code511 = 511, //  paramMapSize > 10
}

export type TDiagsDA = {
    [k in EDiagCodeDA]: {
        msg: string;
        path: `https://www.autohotkey.com/docs/${string}`;
    };
};

export const DiagsDA: DeepReadonly<TDiagsDA> = {
    500: {
        msg: 'var is assigned but never used.',
        path: 'https://www.autohotkey.com/docs/Variables.htm',
    },
    501: {
        msg: 'param is assigned but never used.',
        path: 'https://www.autohotkey.com/docs/Functions.htm#optional',
    },
    502: {
        msg: 'case sensitivity',
        path: 'https://www.autohotkey.com/docs/Concepts.htm#names',
    },
    504: {
        msg: 'Note: The "variadic" parameter can only appear at the end of the formal parameter list.',
        path: 'https://www.autohotkey.com/docs/Functions.htm#Variadic',
    },
    505: {
        msg: 'param parsed Error -> unknown style',
        path: 'https://www.autohotkey.com/docs/Functions.htm#param',
    },
    506: {
        msg: 'not support of this number formats',
        path: 'https://www.autohotkey.com/docs/Concepts.htm#numbers',
    },
};

export const enum EDiagCode {
    code107 = 107,
    code110 = 110, // 100~110 is switch err
    code111 = 111,
    code112 = 112,
    code113 = 113,
    code114 = 114,
    // 120~130 is Multiline-Diag
    code120 = 120, // unknown-flag
    code121 = 121, // join > 15
    code122 = 122, // % , ` 3-flag is not support now
    code124 = 124, // `"` is not closed
    code125 = 125, // `%` miss to closed
    code126 = 126, // `%` variable name contains an illegal character
    code127 = 127, // 'Multiline just allow like `" VarName "` style, `"` need Need whitespace inside.',

    code201 = 201, // 200~299 is not expression // need use %
    code301 = 301, // 300~399 is func err
    code302 = 302,
    // code600~699 warn user
    /**
     * `.base`  Prototype pollution!
     */
    code600 = 600,

    /**
     * label like `DEFAULT:`
     */
    code601 = 601, // DEFAULT:

    /**
     * Label name of `On:` , `Off:`
     *
     * On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.
     */
    code602 = 602,

    /**
     * Unknown #Directives
     */
    code603 = 603,

    code700 = 700, // 700 is Command -> func
    // code701 = 701, // 701~799 is Command error
    // 800~899 is Deprecated / Old Syntax
    code801 = 801,
    code802 = 802,
    code803 = 803,
    code804 = 804,
    code806 = 806,
    code811 = 811,
    code812 = 812,
    code813 = 813,
    code814 = 814,
    code815 = 815,
    code816 = 816,
    code824 = 824,
    code825 = 825,
    // 901~999 is not recommended
    code901 = 901,
    code902 = 902,
    code903 = 903,
    code904 = 904,

    // of EDiagDeep
    code908 = 908, // {{{ of one Line
    code909 = 909, // }}} of one Line
}

type TLink =
    | `https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#${string}`
    | `https://www.autohotkey.com/docs/${string}`;
export type TDiags = {
    [k in EDiagCode]: {
        msg: string;
        path: TLink;
    };
};

export const Diags: DeepReadonly<TDiags> = {
    107: {
        msg: 'assign warning',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag107',
    },
    110: {
        msg: 'Default : not find ',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    111: {
        msg: 'Default : not find ',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    112: {
        msg: 'Case : > 20',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    113: {
        msg: 'Case : not find ',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    114: {
        msg: 'Switch name not find',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    120: {
        msg: 'unknown options of Multiline',
        path: 'https://www.autohotkey.com/docs/Scripts.htm#Join',
    },
    121: {
        msg: 'Multiline:join > 15 characters',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag121',
    },
    122: {
        msg: 'ahk-neko-help not supported ( % , `) flag now.',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag122',
    },
    124: {
        msg: '`"` is not closed',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag124',
    },
    125: {
        msg: '`%` is miss to closed',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag125',
    },
    126: {
        msg: 'Multiline just allow like `%VarName%` of style1.',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag126',
    },
    127: {
        msg: 'Multiline just allow like `" VarName "` of style2, `"` need to use whitespace pack varName.',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag127',
    },
    201: {
        msg: 'Count cannot be an expression, use %',
        path: 'https://www.autohotkey.com/docs/commands/Loop.htm',
    },
    301: {
        msg: 'function or Method is so big',
        path: 'https://www.autohotkey.com/docs/Functions.htm',
    },
    302: {
        msg: 'Function name too long, name len > (255 -2) characters.',
        path: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/tree/master/note#diag302',
    },
    600: {
        msg: 'Alert Prototype Pollution!! Suggest to use class replace',
        path: 'https://www.autohotkey.com/docs/Objects.htm#Custom_Classes',
    },
    601: {
        msg: 'did you mean switch case `default :` ? this way look like a `label:`.',
        path: 'https://www.autohotkey.com/docs/misc/Labels.htm#syntax-and-usage=',
    },
    602: {
        msg: 'recommended that the following names not be used: On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.',
        path: 'https://www.autohotkey.com/docs/misc/Labels.htm#syntax-and-usage=',
    },
    603: {
        msg: 'Unknown #Directives',
        path: 'https://www.autohotkey.com/docs/commands/_AllowSameLineComments.htm',
    },
    700: {
        msg: 'try to use function replace Command(obsolete code)',
        path: 'https://www.autohotkey.com/docs/Language.htm#commands-vs-functions',
    },
    801: {
        msg: 'Old Syntax(obsolete code)',
        path: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#old',
    },
    802: {
        msg: 'Old Syntax(obsolete code)',
        path: 'https://www.autohotkey.com/docs/commands/LoopFile.htm#old',
    },
    803: {
        msg: 'Use `Var := Var / Value` or `Var /= Value` instead.',
        path: 'https://www.autohotkey.com/docs/commands/EnvDiv.htm',
    },
    804: {
        msg: 'Use `Var := Var * Value` or `Var *= Value` instead.',
        path: 'https://www.autohotkey.com/docs/commands/EnvMult.htm',
    },
    806: {
        msg: 'Use `If (expression)` instead.',
        path: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
    },
    811: {
        msg: 'Use the `OnClipboardChange()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/OnClipboardChange.htm#label',
    },
    812: {
        msg: 'Use the `OnExit()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/OnExit.htm#command',
    },
    813: {
        msg: 'Use the `Gui,` command instead.',
        path: 'https://www.autohotkey.com/docs/commands/Progress.htm',
    },
    814: {
        msg: 'Use expression assignments like `Var := Value` instead.',
        path: 'https://www.autohotkey.com/docs/commands/SetEnv.htm',
    },
    815: {
        msg: 'Use the `Format()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/SetFormat.htm',
    },
    816: {
        msg: 'Use the `Gui` command instead.',
        path: 'https://www.autohotkey.com/docs/commands/SplashTextOn.htm',
    },
    824: {
        msg: 'Deprecated: This command is not recommended for use in new scripts.',
        path: 'https://www.autohotkey.com/docs/commands/Transform.htm',
    },
    825: {
        msg: 'Deprecated: #AllowSameLineComments was removed.',
        path: 'https://www.autohotkey.com/docs/commands/_AllowSameLineComments.htm',
    },
    901: {
        msg: 'ahk-doc not recommended and ahk-neko-help is not work of this Directives.',
        path: 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm',
    },
    902: {
        msg: 'ahk-doc not recommended and ahk-neko-help is not work of this Directives.',
        path: 'https://www.autohotkey.com/docs/commands/_CommentFlag.htm',
    },
    903: {
        msg: 'ahk-doc not recommended and ahk-neko-help is not work of this Directives.',
        path: 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related',
    },
    904: {
        msg: 'ahk-neko-help is not work of this Directives',
        path: 'https://www.autohotkey.com/docs/commands/_Hotstring.htm',
    },
    // of EDiagDeep
    908: { // {{{ of one Line
        msg: 'Indentation suggestions : split to new line',
        path: 'https://www.autohotkey.com/docs/Tutorial.htm#s84',
    },
    909: { // }}} of one Line
        msg: 'Indentation suggestions : split to new line',
        path: 'https://www.autohotkey.com/docs/Tutorial.htm#s84',
    },
};
