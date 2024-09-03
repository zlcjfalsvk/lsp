import * as net from 'node:net';
import { ListenOptions } from 'net';

import { JsonRpc } from './json-rpc';

export class TCPServer {
	#server: net.Server;

	static init(jsonRpc: JsonRpc, options?: Partial<ListenOptions>): TCPServer {
		return new TCPServer(jsonRpc, options);
	}

	private constructor(jsonRpc: JsonRpc, options?: Partial<ListenOptions>) {
		this.#server = net.createServer((socket) => {
			socket.on('data', async (data: Buffer) => {
				try {
					const str = data.toString();
					await jsonRpc.receive(str);
				} catch (e) {
					socket.write(`${e}\r\n`);
				}
			});
			socket.on('close', () => {
				console.log(`Server Closed`);
			});
		});

		this.#server.listen(options, () => {
			console.log(`Start ${options?.host}:${options?.port} Start...`);
		});
	}
}
