import { TCPServer } from './TCPServer';
import { JsonRpc } from './json-rpc';

const bootstrap = async () => {
	TCPServer.init(new JsonRpc(), {
		host: 'localhost',
		port: 3000,
	});
};
void bootstrap();
