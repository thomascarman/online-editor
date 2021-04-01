(function () {
  let html = <HTMLTextAreaElement>document.getElementById("html");
  let css = <HTMLTextAreaElement>document.getElementById("css");
  let js = <HTMLTextAreaElement>document.getElementById("js");
  let code: any = <HTMLIFrameElement>document.getElementById("code");

  html.value = `<h1 id="header"></h1>`;
  css.value = `@keyframes colorShift {
  from {
    color: blue;
  }
  to {
    color: red;
  }
}

#header {
  text-align: center;
  color: blue;
  animation: colorShift 1s infinite ease-in-out alternate;
}`;
  js.value = `let a = 'Welcome To the Editor';
let b = document.getElementById('header');
b.innerHTML = a;
console.log('console test', 'line2' , {
  nested: {
    list: [1, 2, 3],
    fun: function () { return 'fun'; }
  }
})
console.log('line3');`;

  // @ts-ignore
  code = code.contentWindow.document;

  let cLog = function (target: HTMLElement, ...args: any[]) {
    let createObjElem = function (obj: any, tab = 1) {
      let element = document.createElement("span");
      element.innerHTML = Array.isArray(obj) ? "[" : "{";

      for (let key in obj) {
        let keyEl = document.createElement("div");
        keyEl.classList.add("console__line", "console__line--tab1");

        if (typeof obj[key] === "string" || typeof obj[key] === "number")
          keyEl.innerHTML = key + ": " + obj[key];
        else if (typeof obj[key] === "function")
          keyEl.innerHTML = key + ": " + obj[key].toString();
        else {
          keyEl.innerHTML = key + ": ";
          keyEl.appendChild(createObjElem(obj[key], tab + 1));
        }
        element.appendChild(keyEl);
      }

      let endEl = document.createElement("div");
      endEl.classList.add("console__line");
      endEl.innerHTML = "}";
      element.appendChild(endEl);

      return element;
    };

    let container = document.createElement("div");
    container.classList.add("console");

    for (let i = 0; i < args.length; i++) {
      if (
        typeof args[i] === "string" ||
        typeof args[i] === "number" ||
        typeof args[i] === "function"
      ) {
        let element = document.createElement("div");
        element.classList.add("console__line", "console__line--start");
        element.innerHTML = args[i].toString();
        container.appendChild(element);
      } else {
        let element = document.createElement("div");
        element.classList.add("console__line", "console__line--start");
        element.appendChild(createObjElem(args[i]));
        container.appendChild(element);
      }
    }

    // return container.outerHTML;
    target.appendChild(container);
  };

  let keymap: any[] = [];
  let keyCode = function (event: any, callback: any) {
    let code: number;

    if (event.keyCode !== undefined) {
      code = event.keyCode;
    } else if (event.keyIdentifier !== undefined) {
      code = event.keyIdentifier;
    } else if (event.key !== undefined) {
      code = event.key;
    }

    if (callback && typeof callback === "function") callback(code);
  };

  document.body.onkeydown = function (evt) {
    keyCode(evt, function (code: number) {
      keymap[code] = true;
    });

    // ctrl + shift + F "Format"
    if (keymap[17] && keymap[16] && keymap[70]) {
      console.log("format");
    }
  };

  document.body.onkeyup = function (evt) {
    keyCode(evt, function (code: number) {
      keymap[code] = false;
    });

    let clogStr = js.value.replace(/console\.log\(/gim, "cLog(cons, ");
    code.open();
    code.write(`
      <link rel="stylesheet" href="/styles/main.css" />
      <div class="outputDisplay">
        <div id="outputContent" class="outputDisplay__content">${
          html.value
        }</div>

        <div id="outputConsole" class="outputDisplay__console"></div>
      </div>
      <style>
        body {
          margin: 0;
          padding: 0;
        }
        ${css.value}
      </style>
      <script>
      let cons = document.getElementById("outputConsole");
        try {
          let cLog = ${cLog.toString()}
          ${clogStr}
        } catch (error) {
          cons.innerHTML = error
        }
      </script>
    `);
    code.close();
  };
})();
