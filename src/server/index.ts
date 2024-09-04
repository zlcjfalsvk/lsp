import { Tcp } from './tcp';
import { JsonRpc } from './json-rpc';
import { TextDocument } from './text-document';

const bootstrap = async () => {
	const jsonRpc = new JsonRpc(new TextDocument());

	Tcp.init(jsonRpc, {
		host: 'localhost',
		port: 3000,
	});
};

void bootstrap();
