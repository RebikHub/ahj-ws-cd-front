export default class Dashboard {
  constructor(server) {
    this.server = server;
    this.instances = document.querySelector('.instances');
    this.instHere = document.querySelector('.inst-here');
    this.newInst = document.querySelector('.new-inst');
    this.worklog = document.querySelector('.worklog-logging');
    this.startStop = document.querySelectorAll('.action-play-stop');
    this.currentInst = null;
  }

  events() {
    this.getServersRenderDashboard();
    this.clickOnCreate();
    this.clickOnStart();
    this.clickOnStop();
    this.clickOnDelete();
  }

  eventSource(command) {
    const sse = new EventSource(`https://ahj-ws-dashboard.herokuapp.com/${command}`);
    sse.addEventListener('comment', (ev) => {
      const data = JSON.parse(ev.data);
      if (data.status === 'ok') {
        this.addLog(data.id, data.info);
      }

      if (data.INFO === 'Server create') {
        this.addLog(data.id, data.INFO);
        this.addInstance(data);
      } else if (data.INFO === 'Server delete') {
        const servers = document.querySelectorAll('.inst-here');
        for (const iter of servers) {
          if (iter.dataset.id === data.id) {
            iter.remove();
          }
        }
        this.addLog(data.id, data.INFO);
      } else if (data.INFO === 'Server stop') {
        const servers = document.querySelectorAll('.inst-here');
        for (const iter of servers) {
          if (iter.dataset.id === data.id) {
            iter.querySelector('.status-ind').classList.remove('run');
            iter.querySelector('.status-ind').classList.add('stop');
            iter.querySelector('.action-play-stop').classList.remove('stopped');
            iter.querySelector('.action-play-stop').classList.add('play');
            iter.querySelector('.status-description').textContent = 'Stopped';
          }
        }
        this.addLog(data.id, data.INFO);
      } else if (data.INFO === 'Server start') {
        const servers = document.querySelectorAll('.inst-here');
        for (const iter of servers) {
          if (iter.dataset.id === data.id) {
            iter.querySelector('.status-ind').classList.remove('stop');
            iter.querySelector('.status-ind').classList.add('run');
            iter.querySelector('.action-play-stop').classList.remove('play');
            iter.querySelector('.action-play-stop').classList.add('stopped');
            iter.querySelector('.status-description').textContent = 'Running';
          }
        }
        this.addLog(data.id, data.INFO);
      }
    });

    sse.addEventListener('open', () => {
      console.log('connected');
    });

    sse.addEventListener('error', () => {
      console.log('error');
    });
  }

  async getServersRenderDashboard() {
    this.currentInst = await this.server.loadInst();
    for (const inst of this.currentInst) {
      this.addInstance(inst);
      this.addLog(inst.id);
    }
  }

  addInstance(data) {
    const div = this.instHere.cloneNode(true);
    div.dataset.id = data.id;
    div.classList.remove('none');
    div.children[0].textContent = data.id;
    if (data.state === 'stopped') {
      div.querySelector('.status-ind').classList.add('stop');
      div.querySelector('.action-play-stop').classList.add('play');
      div.querySelector('.status-description').textContent = 'Stopped';
    } else {
      div.querySelector('.status-ind').classList.add('run');
      div.querySelector('.action-play-stop').classList.add('stopped');
      div.querySelector('.status-description').textContent = 'Running';
    }
    this.instances.insertBefore(div, this.newInst);
  }

  addLog(id, info = 'Recieved: "Load instance"') {
    const divLog = document.createElement('div');
    const spanDate = document.createElement('span');
    const spanServer = document.createElement('span');
    const spanInfo = document.createElement('span');
    spanDate.textContent = Dashboard.date();
    spanServer.textContent = `Server: ${id}`;
    spanInfo.textContent = `INFO: ${info}`;
    divLog.appendChild(spanDate);
    divLog.appendChild(spanServer);
    divLog.appendChild(spanInfo);
    divLog.classList.add('log');
    this.worklog.appendChild(divLog);
  }

  clickOnCreate() {
    this.newInst.addEventListener('click', () => {
      this.eventSource('create');
    });
  }

  clickOnStart() {
    this.instances.addEventListener('click', (ev) => {
      const div = ev.target;
      if (div.classList.contains('play')) {
        const { id } = div.closest('.inst-here').dataset;
        this.eventSource(`start/?id=${id}`);
      }
    });
  }

  clickOnStop() {
    this.instances.addEventListener('click', (ev) => {
      const div = ev.target;
      if (div.classList.contains('stopped')) {
        const { id } = div.closest('.inst-here').dataset;
        this.eventSource(`stop/?id=${id}`);
      }
    });
  }

  clickOnDelete() {
    this.instances.addEventListener('click', (ev) => {
      const div = ev.target;
      if (div.classList.contains('action-cancel')) {
        const { id } = div.closest('.inst-here').dataset;
        this.eventSource(`delete/?id=${id}`);
      }
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
