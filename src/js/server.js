export default class Server {
  constructor() {
    this.url = 'http://localhost:3333/instances';
  }

  async loadInst() {
    const response = await fetch(this.url);
    const result = await response.json();
    return result;
  }
}
