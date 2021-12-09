export default class Server {
  constructor() {
    this.url = 'https://ahj-ws-dashboard.herokuapp.com/instances';
  }

  async loadInst() {
    const response = await fetch(this.url);
    const result = await response.json();
    return result;
  }
}
