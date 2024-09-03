import { isJSONRPCRequest, JSONRPCServer } from 'json-rpc-2.0';
import { JSONRPCRequest } from 'json-rpc-2.0/dist/models';

export type Message = JSONRPCRequest;

export class JsonRpc {
	#jsonRpc: JSONRPCServer;

	constructor() {
		this.#jsonRpc = new JSONRPCServer();
	}

	addMethod(name: string) {
		this.#jsonRpc.addMethod(name, (params) => {
			console.log(`Call Method ${name}, params: ${params}`);
		});
	}

	async receive(data: string): Promise<void> {
		const msg = this.tryConvertData(data);

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
