export default class Dashboard {
  constructor(server) {
    this.server = server;
    this.instances = document.querySelector('.instances');
    this.instHere = document.querySelector('.inst-here');
    this.newInst = document.querySelector('.new-inst');
    this.worklog = document.querySelector('.worklog-logging');
    this.currentInst = null;
    // Server is being created...
  }

  events() {
    this.renderInstances();
    this.clickOnCreate();
    // this.server.commandForInst('start');
  }

  async renderInstances() {
    this.currentInst = await this.server.loadInst();
    for (const inst of this.currentInst) {
      const div = this.instHere.cloneNode(true);
      div.dataset.id = inst.id;
      div.classList.remove('none');
      div.children[0].textContent = inst.id;
      this.instances.insertBefore(div, this.newInst);
      const divLog = document.createElement('div');
      const spanDate = document.createElement('span');
      const spanServer = document.createElement('span');
      const spanInfo = document.createElement('span');
      spanDate.textContent = Dashboard.date();
      spanServer.textContent = `Server: ${inst.id}`;
      spanInfo.textContent = 'INFO: Recieved: "Load instance"';
      divLog.appendChild(spanDate);
      divLog.appendChild(spanServer);
      divLog.appendChild(spanInfo);
      divLog.classList.add('log');
      this.worklog.appendChild(divLog);
    }
  }

  async createInst() {
    const resp = await this.server.commandForInst('create');
    console.log(resp);
  }

  clickOnCreate() {
    this.newInst.addEventListener('click', () => {
      this.createInst();
    });
  }

  static date() {
    const year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let hours = new Date().getHours();
    let minute = new Date().getMinutes();
    let seconds = new Date().getSeconds();

    if (String(month).length === 1) {
      month = `0${month}`;
    }
    if (String(day).length === 1) {
      day = `0${day}`;
    }
    if (String(minute).length === 1) {
      minute = `0${minute}`;
    }
    if (String(seconds).length === 1) {
      seconds = `0${seconds}`;
    }
    if (String(hours).length === 1) {
      hours = `0${hours}`;
    }
    return `${hours}:${minute}:${seconds} ${day}.${month}.${String(year).slice(2)}`;
  }
}
