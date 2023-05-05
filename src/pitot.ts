// npx ts-node ./ast/ast.ts ../nest-project/src/main.ts
import { readFileSync, existsSync } from 'fs';
import * as ts from 'typescript';
import * as path from 'path';
import { Tree } from './tree';
let tree: any = null;

export function delint(sourceFile: ts.SourceFile) {
  let srcs: any = [];

  const dirname = path.dirname(sourceFile.fileName);

  console.log('=======================================');
  console.log('|--> fileName: ' + sourceFile.fileName);
  console.log('=======================================');
  delintNode(sourceFile);

  function delintNode(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
        console.log('delintNode: ' + node.kind);
        if ((node as ts.IterationStatement).statement.kind !== ts.SyntaxKind.Block) {
          report(node, "A looping statement's contents should be wrapped in a block body.");
        }
        break;

      case ts.SyntaxKind.IfStatement:
        console.log('delintNode: IfStatement');
        const ifStatement = node as ts.IfStatement;
        if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
          report(ifStatement.thenStatement, "An if statement's contents should be wrapped in a block body.");
        }
        if (
          ifStatement.elseStatement &&
          ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
          ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement
        ) {
          report(ifStatement.elseStatement, "An else statement's contents should be wrapped in a block body.");
        }
        break;

      case ts.SyntaxKind.BinaryExpression:
        // console.log('delintNode: BinaryExpression');
        const op = (node as ts.BinaryExpression).operatorToken.kind;
        if (sourceFile.fileName.includes('rewards.service')) {
          console.log({ op });
        }
        if (op === ts.SyntaxKind.EqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsToken) {
          report(node, "Use '===' and '!=='.");
        }
        break;

      case ts.SyntaxKind.ClassDeclaration:
        console.log('delintNode: ClassDeclaration');
        if (sourceFile.fileName.includes('rewards.service')) {
          const cl = node as ts.ClassDeclaration;

          const currentNode = tree.find(path.resolve(sourceFile.fileName));

          if (currentNode && cl.name?.getText()) {
            if (currentNode && !currentNode?.value?.functions) {
              currentNode.value.funcs = new Map();
            }

            currentNode.value.className = cl.name?.getText();
            tree.insert(
              path.resolve(sourceFile.fileName),
              path.resolve(sourceFile.fileName),
              currentNode?.value ?? {},
              false,
            );
          }

          console.log('>>> ' + cl.members.length);
          cl.members.forEach((memb) => {
            // console.log(memb); // parameters, body
            console.log('= = = = = = = = >  >  > ' + memb.name?.getText());
            if (memb.name?.getText()) {
              currentNode.value.funcs.set(memb.name?.getText(), {});
              tree.insert(
                path.resolve(sourceFile.fileName),
                path.resolve(sourceFile.fileName),
                currentNode?.value ?? {},
                false,
              );
              delintNode(memb);
            }
          });
        }
        break;

      case ts.SyntaxKind.ClassExpression:
        // console.log('delintNode: ClassExpression');
        break;

      case ts.SyntaxKind.ClassKeyword:
        // console.log('delintNode: ClassKeyword');
        break;

      case ts.SyntaxKind.ClassStaticBlockDeclaration:
        // console.log('delintNode: ClassStaticBlockDeclaration');
        break;

      case ts.SyntaxKind.FunctionType ||
        ts.SyntaxKind.ArrowFunction ||
        ts.SyntaxKind.FunctionDeclaration ||
        ts.SyntaxKind.FunctionKeyword:
        // console.log('delintNode: FunctionType');
        console.log(node);
        break;
      case ts.SyntaxKind.ImportDeclaration:
        console.log('ImportDeclaration');
        const something = node as ts.ImportDeclaration;
        const text = something.moduleSpecifier.getText().replace(/[']/g, '');
        const file = text + '.ts';
        const src = path.resolve(path.join(dirname, file));

        if (text.includes('module') || text.includes('controller') || text.includes('service')) {
          console.log('src: ' + src);
          console.log('text: ' + text);

          const currentNode = tree.find(path.resolve(sourceFile.fileName));

          if (currentNode) {
            if (currentNode && !currentNode?.value?.imports) {
              currentNode.value.imports = [];
            }

            currentNode.value.imports.push(src);
          }
          console.log('____________________________________');
          console.log('++ insert ' + path.resolve(sourceFile.fileName) + ' ' + src);
          tree.insert(path.resolve(sourceFile.fileName), src, currentNode?.value ?? {});
          console.log('____________________________________');

          if (existsSync(src)) {
            srcs.push({ src });
          }
        }

        break;
    }
    ts.forEachChild(node, delintNode);
  }

  function report(node: ts.Node, message: string) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
  }

  // read all existing files in the project
  srcs.forEach(({ src }: any) => {
    readFile(src);
  });
}

function readFile(fileName: string) {
  console.log('reading file... ' + fileName);
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true,
  );

  // delint it

  delint(sourceFile);
}

export function main(fileNames: string[]) {
  fileNames.forEach((file) => {
    tree = new Tree(path.resolve(file), { imports: [] });
    readFile(file);
  });

  console.log(tree);
  console.log(tree.root.value.imports);
  tree.root.children.forEach((child: any) => {
    console.log(child);
  });

  const test = tree.find('/Users/suba/Documents/Dev/standup_test/apps/api/src/app/rewards/rewards.service.ts');
  console.log(test?.value);
}

/*
{
  '0': 'FirstToken',
  '1': 'EndOfFileToken',
  '2': 'FirstTriviaToken',
  '3': 'MultiLineCommentTrivia',
  '4': 'NewLineTrivia',
  '5': 'WhitespaceTrivia',
  '6': 'ShebangTrivia',
  '7': 'LastTriviaToken',
  '8': 'FirstLiteralToken',
  '9': 'BigIntLiteral',
  '10': 'StringLiteral',
  '11': 'JsxText',
  '12': 'JsxTextAllWhiteSpaces',
  '13': 'RegularExpressionLiteral',
  '14': 'FirstTemplateToken',
  '15': 'TemplateHead',
  '16': 'TemplateMiddle',
  '17': 'LastTemplateToken',
  '18': 'FirstPunctuation',
  '19': 'CloseBraceToken',
  '20': 'OpenParenToken',
  '21': 'CloseParenToken',
  '22': 'OpenBracketToken',
  '23': 'CloseBracketToken',
  '24': 'DotToken',
  '25': 'DotDotDotToken',
  '26': 'SemicolonToken',
  '27': 'CommaToken',
  '28': 'QuestionDotToken',
  '29': 'FirstBinaryOperator',
  '30': 'LessThanSlashToken',
  '31': 'GreaterThanToken',
  '32': 'LessThanEqualsToken',
  '33': 'GreaterThanEqualsToken',
  '34': 'EqualsEqualsToken',
  '35': 'ExclamationEqualsToken',
  '36': 'EqualsEqualsEqualsToken',
  '37': 'ExclamationEqualsEqualsToken',
  '38': 'EqualsGreaterThanToken',
  '39': 'PlusToken',
  '40': 'MinusToken',
  '41': 'AsteriskToken',
  '42': 'AsteriskAsteriskToken',
  '43': 'SlashToken',
  '44': 'PercentToken',
  '45': 'PlusPlusToken',
  '46': 'MinusMinusToken',
  '47': 'LessThanLessThanToken',
  '48': 'GreaterThanGreaterThanToken',
  '49': 'GreaterThanGreaterThanGreaterThanToken',
  '50': 'AmpersandToken',
  '51': 'BarToken',
  '52': 'CaretToken',
  '53': 'ExclamationToken',
  '54': 'TildeToken',
  '55': 'AmpersandAmpersandToken',
  '56': 'BarBarToken',
  '57': 'QuestionToken',
  '58': 'ColonToken',
  '59': 'AtToken',
  '60': 'QuestionQuestionToken',
  '61': 'BacktickToken',
  '62': 'HashToken',
  '63': 'FirstAssignment',
  '64': 'FirstCompoundAssignment',
  '65': 'MinusEqualsToken',
  '66': 'AsteriskEqualsToken',
  '67': 'AsteriskAsteriskEqualsToken',
  '68': 'SlashEqualsToken',
  '69': 'PercentEqualsToken',
  '70': 'LessThanLessThanEqualsToken',
  '71': 'GreaterThanGreaterThanEqualsToken',
  '72': 'GreaterThanGreaterThanGreaterThanEqualsToken',
  '73': 'AmpersandEqualsToken',
  '74': 'BarEqualsToken',
  '75': 'BarBarEqualsToken',
  '76': 'AmpersandAmpersandEqualsToken',
  '77': 'QuestionQuestionEqualsToken',
  '78': 'LastBinaryOperator',
  '79': 'Identifier',
  '80': 'PrivateIdentifier',
  '81': 'FirstKeyword',
  '82': 'CaseKeyword',
  '83': 'CatchKeyword',
  '84': 'ClassKeyword',
  '85': 'ConstKeyword',
  '86': 'ContinueKeyword',
  '87': 'DebuggerKeyword',
  '88': 'DefaultKeyword',
  '89': 'DeleteKeyword',
  '90': 'DoKeyword',
  '91': 'ElseKeyword',
  '92': 'EnumKeyword',
  '93': 'ExportKeyword',
  '94': 'ExtendsKeyword',
  '95': 'FalseKeyword',
  '96': 'FinallyKeyword',
  '97': 'ForKeyword',
  '98': 'FunctionKeyword',
  '99': 'IfKeyword',
  '100': 'ImportKeyword',
  '101': 'InKeyword',
  '102': 'InstanceOfKeyword',
  '103': 'NewKeyword',
  '104': 'NullKeyword',
  '105': 'ReturnKeyword',
  '106': 'SuperKeyword',
  '107': 'SwitchKeyword',
  '108': 'ThisKeyword',
  '109': 'ThrowKeyword',
  '110': 'TrueKeyword',
  '111': 'TryKeyword',
  '112': 'TypeOfKeyword',
  '113': 'VarKeyword',
  '114': 'VoidKeyword',
  '115': 'WhileKeyword',
  '116': 'LastReservedWord',
  '117': 'FirstFutureReservedWord',
  '118': 'InterfaceKeyword',
  '119': 'LetKeyword',
  '120': 'PackageKeyword',
  '121': 'PrivateKeyword',
  '122': 'ProtectedKeyword',
  '123': 'PublicKeyword',
  '124': 'StaticKeyword',
  '125': 'LastFutureReservedWord',
  '126': 'FirstContextualKeyword',
  '127': 'AccessorKeyword',
  '128': 'AsKeyword',
  '129': 'AssertsKeyword',
  '130': 'AssertKeyword',
  '131': 'AnyKeyword',
  '132': 'AsyncKeyword',
  '133': 'AwaitKeyword',
  '134': 'BooleanKeyword',
  '135': 'ConstructorKeyword',
  '136': 'DeclareKeyword',
  '137': 'GetKeyword',
  '138': 'InferKeyword',
  '139': 'IntrinsicKeyword',
  '140': 'IsKeyword',
  '141': 'KeyOfKeyword',
  '142': 'ModuleKeyword',
  '143': 'NamespaceKeyword',
  '144': 'NeverKeyword',
  '145': 'OutKeyword',
  '146': 'ReadonlyKeyword',
  '147': 'RequireKeyword',
  '148': 'NumberKeyword',
  '149': 'ObjectKeyword',
  '150': 'SatisfiesKeyword',
  '151': 'SetKeyword',
  '152': 'StringKeyword',
  '153': 'SymbolKeyword',
  '154': 'TypeKeyword',
  '155': 'UndefinedKeyword',
  '156': 'UniqueKeyword',
  '157': 'UnknownKeyword',
  '158': 'FromKeyword',
  '159': 'GlobalKeyword',
  '160': 'BigIntKeyword',
  '161': 'OverrideKeyword',
  '162': 'LastContextualKeyword',
  '163': 'FirstNode',
  '164': 'ComputedPropertyName',
  '165': 'TypeParameter',
  '166': 'Parameter',
  '167': 'Decorator',
  '168': 'PropertySignature',
  '169': 'PropertyDeclaration',
  '170': 'MethodSignature',
  '171': 'MethodDeclaration',
  '172': 'ClassStaticBlockDeclaration',
  '173': 'Constructor',
  '174': 'GetAccessor',
  '175': 'SetAccessor',
  '176': 'CallSignature',
  '177': 'ConstructSignature',
  '178': 'IndexSignature',
  '179': 'FirstTypeNode',
  '180': 'TypeReference',
  '181': 'FunctionType',
  '182': 'ConstructorType',
  '183': 'TypeQuery',
  '184': 'TypeLiteral',
  '185': 'ArrayType',
  '186': 'TupleType',
  '187': 'OptionalType',
  '188': 'RestType',
  '189': 'UnionType',
  '190': 'IntersectionType',
  '191': 'ConditionalType',
  '192': 'InferType',
  '193': 'ParenthesizedType',
  '194': 'ThisType',
  '195': 'TypeOperator',
  '196': 'IndexedAccessType',
  '197': 'MappedType',
  '198': 'LiteralType',
  '199': 'NamedTupleMember',
  '200': 'TemplateLiteralType',
  '201': 'TemplateLiteralTypeSpan',
  '202': 'LastTypeNode',
  '203': 'ObjectBindingPattern',
  '204': 'ArrayBindingPattern',
  '205': 'BindingElement',
  '206': 'ArrayLiteralExpression',
  '207': 'ObjectLiteralExpression',
  '208': 'PropertyAccessExpression',
  '209': 'ElementAccessExpression',
  '210': 'CallExpression',
  '211': 'NewExpression',
  '212': 'TaggedTemplateExpression',
  '213': 'TypeAssertionExpression',
  '214': 'ParenthesizedExpression',
  '215': 'FunctionExpression',
  '216': 'ArrowFunction',
  '217': 'DeleteExpression',
  '218': 'TypeOfExpression',
  '219': 'VoidExpression',
  '220': 'AwaitExpression',
  '221': 'PrefixUnaryExpression',
  '222': 'PostfixUnaryExpression',
  '223': 'BinaryExpression',
  '224': 'ConditionalExpression',
  '225': 'TemplateExpression',
  '226': 'YieldExpression',
  '227': 'SpreadElement',
  '228': 'ClassExpression',
  '229': 'OmittedExpression',
  '230': 'ExpressionWithTypeArguments',
  '231': 'AsExpression',
  '232': 'NonNullExpression',
  '233': 'MetaProperty',
  '234': 'SyntheticExpression',
  '235': 'SatisfiesExpression',
  '236': 'TemplateSpan',
  '237': 'SemicolonClassElement',
  '238': 'Block',
  '239': 'EmptyStatement',
  '240': 'FirstStatement',
  '241': 'ExpressionStatement',
  '242': 'IfStatement',
  '243': 'DoStatement',
  '244': 'WhileStatement',
  '245': 'ForStatement',
  '246': 'ForInStatement',
  '247': 'ForOfStatement',
  '248': 'ContinueStatement',
  '249': 'BreakStatement',
  '250': 'ReturnStatement',
  '251': 'WithStatement',
  '252': 'SwitchStatement',
  '253': 'LabeledStatement',
  '254': 'ThrowStatement',
  '255': 'TryStatement',
  '256': 'LastStatement',
  '257': 'VariableDeclaration',
  '258': 'VariableDeclarationList',
  '259': 'FunctionDeclaration',
  '260': 'ClassDeclaration',
  '261': 'InterfaceDeclaration',
  '262': 'TypeAliasDeclaration',
  '263': 'EnumDeclaration',
  '264': 'ModuleDeclaration',
  '265': 'ModuleBlock',
  '266': 'CaseBlock',
  '267': 'NamespaceExportDeclaration',
  '268': 'ImportEqualsDeclaration',
  '269': 'ImportDeclaration',
  '270': 'ImportClause',
  '271': 'NamespaceImport',
  '272': 'NamedImports',
  '273': 'ImportSpecifier',
  '274': 'ExportAssignment',
  '275': 'ExportDeclaration',
  '276': 'NamedExports',
  '277': 'NamespaceExport',
  '278': 'ExportSpecifier',
  '279': 'MissingDeclaration',
  '280': 'ExternalModuleReference',
  '281': 'JsxElement',
  '282': 'JsxSelfClosingElement',
  '283': 'JsxOpeningElement',
  '284': 'JsxClosingElement',
  '285': 'JsxFragment',
  '286': 'JsxOpeningFragment',
  '287': 'JsxClosingFragment',
  '288': 'JsxAttribute',
  '289': 'JsxAttributes',
  '290': 'JsxSpreadAttribute',
  '291': 'JsxExpression',
  '292': 'CaseClause',
  '293': 'DefaultClause',
  '294': 'HeritageClause',
  '295': 'CatchClause',
  '296': 'AssertClause',
  '297': 'AssertEntry',
  '298': 'ImportTypeAssertionContainer',
  '299': 'PropertyAssignment',
  '300': 'ShorthandPropertyAssignment',
  '301': 'SpreadAssignment',
  '302': 'EnumMember',
  '303': 'UnparsedPrologue',
  '304': 'UnparsedPrepend',
  '305': 'UnparsedText',
  '306': 'UnparsedInternalText',
  '307': 'UnparsedSyntheticReference',
  '308': 'SourceFile',
  '309': 'Bundle',
  '310': 'UnparsedSource',
  '311': 'InputFiles',
  '312': 'FirstJSDocNode',
  '313': 'JSDocNameReference',
  '314': 'JSDocMemberName',
  '315': 'JSDocAllType',
  '316': 'JSDocUnknownType',
  '317': 'JSDocNullableType',
  '318': 'JSDocNonNullableType',
  '319': 'JSDocOptionalType',
  '320': 'JSDocFunctionType',
  '321': 'JSDocVariadicType',
  '322': 'JSDocNamepathType',
  '323': 'JSDocComment',
  '324': 'JSDocText',
  '325': 'JSDocTypeLiteral',
  '326': 'JSDocSignature',
  '327': 'JSDocLink',
  '328': 'JSDocLinkCode',
  '329': 'JSDocLinkPlain',
  '330': 'FirstJSDocTagNode',
  '331': 'JSDocAugmentsTag',
  '332': 'JSDocImplementsTag',
  '333': 'JSDocAuthorTag',
  '334': 'JSDocDeprecatedTag',
  '335': 'JSDocClassTag',
  '336': 'JSDocPublicTag',
  '337': 'JSDocPrivateTag',
  '338': 'JSDocProtectedTag',
  '339': 'JSDocReadonlyTag',
  '340': 'JSDocOverrideTag',
  '341': 'JSDocCallbackTag',
  '342': 'JSDocEnumTag',
  '343': 'JSDocParameterTag',
  '344': 'JSDocReturnTag',
  '345': 'JSDocThisTag',
  '346': 'JSDocTypeTag',
  '347': 'JSDocTemplateTag',
  '348': 'JSDocTypedefTag',
  '349': 'JSDocSeeTag',
  '350': 'LastJSDocTagNode',
  '351': 'SyntaxList',
  '352': 'NotEmittedStatement',
  '353': 'PartiallyEmittedExpression',
  '354': 'CommaListExpression',
  '355': 'MergeDeclarationMarker',
  '356': 'EndOfDeclarationMarker',
  '357': 'SyntheticReferenceExpression',
  '358': 'Count',
*/
