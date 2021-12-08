import Dashboard from './dashboard';
import Server from './server';

console.log('app started');

// const sse = new EventSource('http://localhost:3333/sse');
const server = new Server();
const dash = new Dashboard(server);

dash.events();
