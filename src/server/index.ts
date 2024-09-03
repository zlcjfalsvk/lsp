import { TCPServer } from './TCPServer';

const bootstrap = async () => {
	const server = TCPServer.init({
		host: 'localhost',
		port: 3000,
	});

	server.addMethod('textDocument/definition');
};
void bootstrap();
