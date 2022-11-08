/* cSpell:disable */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */

const z9 = {
    CLASS: {
        keyRawName: 'Class',
        body: 'Class',
        doc: 'At its root, a "class" is a set or category of things having some property or attribute in common. Since a [base](https://www.autohotkey.com/docs/Objects.htm#Custom_Objects) or [prototype](https://www.autohotkey.com/docs/Objects.htm#Custom_Prototypes) object defines properties and behaviour for set of objects, it can also be called a _class_ object. For convenience, base objects can be defined using the "class" keyword as shown below:',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Objects.htm#Custom_Classes',
        exp: [
            'class ClassName extends BaseClassName',
            '{',
            '    InstanceVar := Expression',
            '    static ClassVar := Expression',
            '',
            '    class NestedClass',
            '    {',
            '        ...',
            '    }',
            '',
            '    Method()',
            '    {',
            '        ...',
            '    }',
            '',
            '    Property[]  ; Brackets are optional',
            '    {',
            '        get {',
            '            return ...',
            '        }',
            '        set {',
            '            return ... := value',
            '        }',
            '    }',
            '}',
        ],
    },
    STATIC: {
        keyRawName: 'Static',
        body: 'Static LoggedLines := 0',
        doc: 'Static variables are always implicitly local, but differ from locals because their values are remembered between calls.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Functions.htm#static',
        exp: [
            'LogToFile(TextToLog)',
            '{',
            '    Static LoggedLines := 0',
            '    LoggedLines += 1  ; Maintain a tally locally (its value is remembered between calls).',
            '    global LogFileName',
            '    FileAppend, %LoggedLines%: %TextToLog%`n, %LogFileName%',
            '}',
        ],
    },
    GLOBAL: {
        keyRawName: 'global',
        body: 'global',
        doc: 'To refer to an existing global variable inside a function (or create a new one), declare the variable as global prior to using it.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Functions.htm#Global',
        exp: [
            'global LogFileName  ; This global variable was previously given a value somewhere outside this function.',
        ],
    },
    LOCAL: {
        keyRawName: 'Local',
        body: 'local, ${1:VariableName}',
        doc: 'Local variables are specific to a single function and are visible only inside that function. Consequently, a local variable may have the same name as a global variable and both will have separate contents. Separate functions may also safely use the same variable names.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Functions.htm#Local',
        exp: [
            'local a',
            'Local b := 0',
        ],
    },
};
