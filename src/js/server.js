export default class Server {
  constructor() {
    this.url = 'http://localhost:3333/instances';
  }

  async create(command) {
    const response = await fetch(this.url, {
      method: 'POST',
      body: command,
    });
    const result = await response.text();
    console.log(result);
    return result;
  }

  async loadInst() {
    const response = await fetch(this.url);
    const result = await response.json();
    return result;
  }

  async commandInst(command, id) {
    const response = await fetch(`${this.url}/${id}`, {
      method: 'POST',
      body: command,
    });
    const result = await response.text();
    return result;
  }
}
