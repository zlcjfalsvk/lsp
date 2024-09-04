import { isJSONRPCRequest, JSONRPCServer } from 'json-rpc-2.0';
import { JSONRPCRequest } from 'json-rpc-2.0/dist/models';

import { TextDocument, TextDocumentMethods } from './text-document';

export type Message = JSONRPCRequest;
export class JsonRpc {
	#jsonRpc: JSONRPCServer;
	#textDocument: TextDocument;

	constructor(textDocument: TextDocument) {
		this.#jsonRpc = new JSONRPCServer();
		this.#textDocument = textDocument;

		this.register();
	}

	register() {
		const methodList = ['textDocument/helloWorld'];

		methodList.forEach((method) => {
			const m = method.split('/')[1];

			this.#jsonRpc.addMethod(method, (params) => {
				try {
					// TODO guard
					this.#textDocument[m as TextDocumentMethods](params);
				} catch (e) {
					console.error(e);
				}
			});
		});
	}

	async receive(data: string): Promise<void> {
		const msg = this.tryConvertData(data);

		console.log(`msg: ${data}`);

		if (!isJSONRPCRequest(msg)) {
			throw new Error(`Only Can receive JSON String`);
		}

		await this.#jsonRpc.receive(<Message>msg);
	}

	private tryConvertData(data: string): Message | string {
		try {
			return JSON.parse(data);
		} catch (_) {
			return data;
		}
	}
}
