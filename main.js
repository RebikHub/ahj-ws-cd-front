(()=>{"use strict";class t{constructor(t){this.server=t,this.instances=document.querySelector(".instances"),this.instHere=document.querySelector(".inst-here"),this.newInst=document.querySelector(".new-inst"),this.worklog=document.querySelector(".worklog-logging"),this.startStop=document.querySelectorAll(".action-play-stop"),this.currentInst=null}events(){this.getServersRenderDashboard(),this.clickOnCreate(),this.clickOnStart(),this.clickOnStop(),this.clickOnDelete()}eventSource(t){const e=new EventSource(`https://ahj-ws-dashboard.herokuapp.com/${t}`);e.addEventListener("comment",(t=>{const e=JSON.parse(t.data);if("ok"===e.status&&this.addLog(e.id,e.info),"Server create"===e.INFO)this.addLog(e.id,e.INFO),this.addInstance(e);else if("Server delete"===e.INFO){const t=document.querySelectorAll(".inst-here");for(const s of t)s.dataset.id===e.id&&s.remove();this.addLog(e.id,e.INFO)}else if("Server stop"===e.INFO){const t=document.querySelectorAll(".inst-here");for(const s of t)s.dataset.id===e.id&&(s.querySelector(".status-ind").classList.remove("run"),s.querySelector(".status-ind").classList.add("stop"),s.querySelector(".action-play-stop").classList.remove("stopped"),s.querySelector(".action-play-stop").classList.add("play"),s.querySelector(".status-description").textContent="Stopped");this.addLog(e.id,e.INFO)}else if("Server start"===e.INFO){const t=document.querySelectorAll(".inst-here");for(const s of t)s.dataset.id===e.id&&(s.querySelector(".status-ind").classList.remove("stop"),s.querySelector(".status-ind").classList.add("run"),s.querySelector(".action-play-stop").classList.remove("play"),s.querySelector(".action-play-stop").classList.add("stopped"),s.querySelector(".status-description").textContent="Running");this.addLog(e.id,e.INFO)}})),e.addEventListener("open",(()=>{console.log("connected")})),e.addEventListener("error",(()=>{console.log("error")}))}async getServersRenderDashboard(){this.currentInst=await this.server.loadInst();for(const t of this.currentInst)this.addInstance(t),this.addLog(t.id)}addInstance(t){const e=this.instHere.cloneNode(!0);e.dataset.id=t.id,e.classList.remove("none"),e.children[0].textContent=t.id,"stopped"===t.state?(e.querySelector(".status-ind").classList.add("stop"),e.querySelector(".action-play-stop").classList.add("play"),e.querySelector(".status-description").textContent="Stopped"):(e.querySelector(".status-ind").classList.add("run"),e.querySelector(".action-play-stop").classList.add("stopped"),e.querySelector(".status-description").textContent="Running"),this.instances.insertBefore(e,this.newInst)}addLog(e,s='Recieved: "Load instance"'){const n=document.createElement("div"),o=document.createElement("span"),i=document.createElement("span"),r=document.createElement("span");o.textContent=t.date(),i.textContent=`Server: ${e}`,r.textContent=`INFO: ${s}`,n.appendChild(o),n.appendChild(i),n.appendChild(r),n.classList.add("log"),this.worklog.appendChild(n)}clickOnCreate(){this.newInst.addEventListener("click",(()=>{this.eventSource("create")}))}clickOnStart(){this.instances.addEventListener("click",(t=>{const e=t.target;if(e.classList.contains("play")){const{id:t}=e.closest(".inst-here").dataset;this.eventSource(`start/?id=${t}`)}}))}clickOnStop(){this.instances.addEventListener("click",(t=>{const e=t.target;if(e.classList.contains("stopped")){const{id:t}=e.closest(".inst-here").dataset;this.eventSource(`stop/?id=${t}`)}}))}clickOnDelete(){this.instances.addEventListener("click",(t=>{const e=t.target;if(e.classList.contains("action-cancel")){const{id:t}=e.closest(".inst-here").dataset;this.eventSource(`delete/?id=${t}`)}}))}static date(){const t=(new Date).getFullYear();let e=(new Date).getMonth()+1,s=(new Date).getDate(),n=(new Date).getHours(),o=(new Date).getMinutes(),i=(new Date).getSeconds();return 1===String(e).length&&(e=`0${e}`),1===String(s).length&&(s=`0${s}`),1===String(o).length&&(o=`0${o}`),1===String(i).length&&(i=`0${i}`),1===String(n).length&&(n=`0${n}`),`${n}:${o}:${i} ${s}.${e}.${String(t).slice(2)}`}}console.log("app started");const e=new class{constructor(){this.url="https://ahj-ws-dashboard.herokuapp.com/instances"}async loadInst(){const t=await fetch(this.url);return await t.json()}};new t(e).events()})();