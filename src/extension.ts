import { ExtensionContext, window, commands, Range, Selection, TextEditorCursorStyle } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {	

	let jumpCommand = commands.registerCommand('jump-cursors-too.jumpCursorsToo', async () => {
		const editor = window.activeTextEditor;
		if(editor){

			let input = window.showInputBox({
				placeHolder: 'Character to jump cursors too',
				validateInput: text => {
					if(text && text.length > 0){
						return null;
					}
					return 'Must take value';
				},
			});

			const document = editor.document;
			const lastLineNumber = document.lineCount - 1;
			const lastLine = document.lineAt(lastLineNumber);
			const endOfFilePosition = lastLine.range.end;
			const wholeText = editor.document.getText();
			//Get selection before the position is removed because of the input
			const selections = editor.selections;

			let character = await input;
			if(character){
				let newSelections: Selection[] = [];
				let lastSelection = new Selection(0,0,0,0);
				for (const selection of selections) {
					//Get text after selection
					const textAfterSelection = editor.document.getText(new Range(selection.active, endOfFilePosition)).toLowerCase();
					const charIndexAfterSelection = textAfterSelection.indexOf(character);

					//Get the position in the document
					const lengthDifference = wholeText.length - textAfterSelection.length;
					const charIndex = charIndexAfterSelection + lengthDifference;
					let charPostition = document.positionAt(charIndex);

					//If the
					if (!charPostition.isBefore(selection.anchor)) {
						charPostition = document.positionAt(charIndex + character.length);
					}
					//create selection
					let newSelection = new Selection(charPostition, charPostition);

					// newSelection = new Selection(selection.anchor, charPostition);
					// if (selection.active.isEqual(selection.anchor)) {
					// 	//if nothing is selected, don't highlight anything.
					// }
					
					//if this is not a repeat selection add selection
					if (!newSelection.isEqual(lastSelection)) {
						newSelections.push(newSelection);
						lastSelection = newSelection;
					}
				}
				//update selections
				editor.selections = newSelections;
			}
			window.showInformationMessage('');
		}
	});

	context.subscriptions.push(jumpCommand);
}

export function deactivate() {}
