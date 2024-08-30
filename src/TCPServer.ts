import { isJSONRPCRequest, JSONRPCServer } from 'json-rpc-2.0';
import * as net from 'node:net';
import { ListenOptions } from 'net';
import { JSONRPCRequest } from 'json-rpc-2.0/dist/models';

export class TCPServer {
	#server: net.Server;
	#jsonRpc: JSONRPCServer;

	static init(options?: Partial<ListenOptions>): TCPServer {
		return new TCPServer(options);
	}

	addMethod(name: string) {
		this.#jsonRpc.addMethod(name, (params) => {
			console.log(`Call Method ${name}, params: ${params}`);
		});
	}

	private constructor(options?: Partial<ListenOptions>) {
		this.#server = net.createServer((socket) => {
			socket.on('data', async (data: Buffer) => {
				try {
					await this.receiveData(this.tryConvertData(data.toString())).then(
						() => {},
					);
				} catch (e) {
					socket.write(`${e}\r\n`);
				}
			});

			socket.on('close', () => {
				console.log(`Server Closed`);
			});
		});

		this.#jsonRpc = new JSONRPCServer();
		this.#server.listen(options, () => {
			console.log(`Start ${options?.host}:${options?.port} Start...`);
		});
	}

	private async receiveData(data: unknown | JSONRPCRequest): Promise<void> {
		if (!isJSONRPCRequest(data)) {
			throw new Error(`Only Can receive JSON String`);
		}

		await this.#jsonRpc.receive(<JSONRPCRequest>data);
	}

	private tryConvertData(data: string): JSONRPCRequest | string {
		try {
			return JSON.parse(data);
		} catch (_) {
			return data;
		}
	}
}
