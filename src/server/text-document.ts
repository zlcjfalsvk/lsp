type MethodNames<T> = {
	[K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];
export type TextDocumentMethods = MethodNames<TextDocument>;

export class TextDocument {
	definition(params: any) {
		console.log(
			`Called textDocument/definition, param: ${JSON.stringify(params)}`,
		);
	}
}
