function click(a) {
  const event = new CustomEvent("keypress", Object.assign({}, {
    key: 'a',
    bubbles: true,
    cancelable: true,
    altKey: true,
  }));
  a.dispatchEvent(event);
}

function createA(element, attributes) {
  const a = document.createElement(element);
  for (let key of Object.keys(attributes))
    a.setAttribute(key, attributes[key]);
  return a;
}

describe("accessKey tests",
  it("attribute test", (done) => {

      const listener = e => {
        expect(e.detail.accesskey).to.be.equal("a");
        done();
      };
      window.addEventListener("beforeNavigate", listener);
      const element = createA("area", {accesskey: "a"});
      document.body.appendChild(element);
      click(element);
      window.removeEventListener("beforeNavigate", listener);

    }
  )
);