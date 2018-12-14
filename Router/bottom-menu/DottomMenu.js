import {SlotchangeMixin} from "https://unpkg.com/joicomponents@1.2.4/img/slot/SlotchangeMixin.js";

import {SlashDotsRouter} from "../src/HashDotRouter.js";


const router = new SlashDotsRouter([
  "/chapter1 <=> /Antipatterns_this_innerHTML_style.md/HowTo_CreateElement.md/HowTo_MutationObserver.md/Pattern1_shadowDomStrategies.md"
]);

window.addEventListener("routechange", e => {
  let box = document.querySelector("view-element");
  // box.innerHTML += "fdfff";

});


const tabsTemplate = document.createElement("template");
tabsTemplate.innerHTML = `
<slot></slot>`;

class ViewElement extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<chapters-list> First chapter</chapters-list>
    <div id="place"></div>
`;

  }
}


class ChaptersList extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<a href="chapter1">Chapter1</a>
 <ul>
   <li><a href="Antipatterns_this_innerHTML_style.md">Antipatterns_this_innerHTML_style</a></li>
   <li><a href="HowTo_CreateElement.md">HowTo_CreateElement</a></li>
   <li><a href="HowTo_MutationObserver.md">HowTo_MutationObserver</a></li>
   <li><a href="Pattern1_shadowDomStrategies.md">Pattern1_shadowDomStrategies</a></li>
  </ul>`;
    this.loadCont = e => this.loadContent(e);
    this.addEventListener("click", this.loadCont);
    this.rules = new SlashDotsRouter([
      "/chapter1 <=> /Antipatterns_this_innerHTML_style.md/HowTo_CreateElement.md/HowTo_MutationObserver.md/Pattern1_shadowDomStrategies.md"
    ]);
  }


  loadContent(e) {
    // let subchapterslink = this.link[num - 1];
    // for (let b = 0; b < subchapterslink.length; b++) {
    let a = document.querySelector("#place");

    a.innerHTML = `<mark-down src="https://unpkg.com/joicomponents@1.2.4/book${this.rules.rules.rules[0].left[0].tagName}/${e.target.innerHTML}.md" ></mark-down>`;



    // this.children[].children[b].innerHTML = `<mark-down img="https://unpkg.com/joicomponents@1.2.4/book/chapter1 ${this.children[num - 1].id}/${subchapterslink[b]}.md" ></mark-down>`
    // }
  }

  async parseText(url){

  }


//delete previous chapter from viewport
  clearPrevious(prev) {
    for (let a of this.children[prev].children) {
      a.innerHTML = "";
    }
  }
}

class BottomMenu extends SlotchangeMixin(HTMLElement) {
  constructor() {
    super();
    this.tabs = undefined;
    this.attachShadow({mode: "open"});
    this.innerHTML = `
    <bottom-btn id="icon1" name="one"><img src="img/button1.svg"><a>HOME</a></bottom-btn>    
    <bottom-btn id="icon2" name="two"><img src="img/button2.svg"><a>CHAPTERS</a></bottom-btn>
    <bottom-btn id="icon3" name="three"><img src="img/button3.svg"><a>SUBCHAPTERS</a></bottom-btn>
    <bottom-btn id="icon4" name="four"><img src="img/button4.svg"><a>TITLES</a></bottom-btn>
    <a id="title">THE NETIVE WEB COMPONENTS COOKBOOK </a>`;
    this.shadowRoot.appendChild(tabsTemplate.content.cloneNode(true));
    this.active = undefined;
    this.$top = this.shadowRoot.children[1];
    this.addEventListener("click", (e) => this.onClick(e));
  }

  childActivated(child, toActive) {
    if (toActive === (this.active === child)) //no change, the child either was inactive + becoming inactive
      return; //or was active + becoming active
    this.updateActive(toActive ? child : undefined);
  }

  onClick(e) {
    if (!e.path[0].tagName === "BOTTOM-BTN")
      return;
    e.stopPropagation();
    e.preventDefault();
    let activeNr = Array.from(this.children).findIndex(btn => e.path[3] === btn);
    this.updateActive(this.tabs[activeNr]);
  }

  slotchangeCallback(slot) {
    this.tabs = slot.assignedNodes().filter(n => n instanceof HTMLElement && n.constructor.name === "Buttons");
    this.active = undefined;
    // this.updateActive();
  }


  updateActive(newActive) {
    if (!this.tabs)
      return;
    this.active = newActive ?
      newActive :
      this.tabs.find(n => n.hasAttribute("active")) || this.tabs[0];
    for (let tab of this.tabs) {
      tab.toggleActive(tab === this.active);
    }
  }
}

const tabTemplate = document.createElement("template");
tabTemplate.innerHTML = `<slot></slot>`;

class Buttons extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(tabTemplate.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["name", "active"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active")
      this.parentNode.childActivated && this.parentNode.childActivated(this, newValue !== null);
    if (name === "name")
      this.parentNode.updateLabels && this.parentNode.updateLabels();
  }

  toggleActive(bool) {
    if (this.hasAttribute("active") !== bool) {
      bool ? this.setAttribute("active", "") : this.removeAttribute("active");
    }
  }
}

class MarkDown extends HTMLElement {

  constructor() {
    super();
    // this.attachShadow({mode: "open"});
  }

  async connectedCallback() {
    let src = this.getAttribute("src");
    if (!src)
      this.innerHTML = "no link in mark-down element";
    const conn = await fetch(src);
    const md = await conn.text();
    // const html = await marked(md);
    this.innerText = md;
  }
}

customElements.define("mark-down", MarkDown);

customElements.define("bottom-menu", BottomMenu);
customElements.define("chapters-list", ChaptersList);
customElements.define("bottom-btn", Buttons);
customElements.define("view-element", ViewElement);
