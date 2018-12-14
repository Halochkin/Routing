let slider = document.querySelector("svg-slider");
let start = true;
let loop = false;

class Slider extends HTMLElement {

  static get observedAttributes() {
    return ["current", "src", "frames", "duration", "width", "height", "description"];
  }

  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `
<style>
    #frame{
    /*animation: blink 3.5s ease-in-out infinite alternate;  */
    background-size: cover;
    }
    @keyframes blink{
         0%{
         opacity: 0;
         }
    }

</style>
    <div id="frame"></div>`;
    Promise.resolve().then(function () {
      slider.setAttribute("current", 0);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    let frame = this.shadowRoot.querySelector("div");
    switch (name) {
      case "src":
        frame.style.backgroundImage = "url(" + newValue + ")";
        frame.style.display = "block";
        break;
      case "duration":
        frame.style.transitionDuration = newValue + "ms";
        // frame.style.animation = "blink" + parseInt(newValue) / 2 + "s ease-in-out infinite alternate;"
        this.duration = parseInt(newValue);
        break;
      case "height":
        frame.style.height = newValue + "px";
        break;
      case "width":
        frame.style.width = newValue + "px";
        break;
      case "description":
        frame.innerText = newValue;
        break;
      case  "current":

        let currentValue = parseInt(newValue);

        if (currentValue >= slider.getAttribute("frames") - 1) {
          loop = true;
          start = false;
        }
        if (currentValue === 0) {
          start = true;
          loop = false;
        }
        if (loop) {
          currentValue += -1;
        }
        if (start && oldValue !== null) {
          currentValue += 1;
        }
        frame.style.backgroundPositionX = -currentValue * parseInt(frame.style.width) + "px";

        setTimeout(function () {
          slider.setAttribute("current", currentValue);
        }, slider.duration);
    }
  }
}


customElements.define("svg-slider", Slider);