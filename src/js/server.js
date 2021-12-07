export default class Server {
  constructor() {
    this.url = 'http://localhost:3333/instances';
  }

  async commandForInst(command) {
    const response = await fetch(this.url, {
      body: command,
      method: 'POST',
    });
    const result = await response.text();
    return result;
  }

  async loadInst() {
    const response = await fetch(this.url);
    const result = await response.json();
    return result;
  }

  async removeInst(id) {
    const response = await fetch(`${this.url}/${id}`, {
      method: 'DELETE',
    });
    const result = await response.text();
    return result;
  }
}
