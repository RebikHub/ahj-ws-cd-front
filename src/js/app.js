import Dashboard from './dashboard';
import Server from './server';

console.log('app started');

const server = new Server();
const dash = new Dashboard(server);

dash.events();
