const { log } = require("./logging");
let popperEnabled = false;

function setupPopper() {
  let { cy, options } = this;
  log("Seting up Popper", this);
  if (popperEnabled) { return; }
  

  popperEnabled = true;

  // example code for making your own handles -- customise events and presentation where fitting
  // var popper;
  var popperNode;
  var popper;
  var popperDiv;
  

  function setHandleOn(node) {
 
    if(node.classes().includes("eh-handle")){
      // Don't add edit box for cytoscape-edgehandles handles
      return;
    }
    removeHandle(); // rm old handle

    let icons = node.data('icons');
    if (!icons || icons.length == 0) {
      log("Node with no icons in data");
      return;
    }
    popperNode = node;

    popperDiv = document.createElement('div');
    popperDiv.classList.add('cy-nodeicons-popper-handle');

    icons.forEach(icon => {
      let iconDiv = document.createElement('div');
      iconDiv.classList.add('cy-nodeicons-popper-nodeicon');
      if (icon.style) {
        iconDiv.style = icon.style;
      }
      iconDiv.innerHTML = icon.innerHTML;
      if(icon.tooltip){
        iconDiv.title = icon.tooltip;
      }
      popperDiv.appendChild(iconDiv);
      iconDiv.addEventListener("click", () => {
        log("Clicked on: ", icon);
        if (icon.onclick) {
          icon.onclick();
        }
      });

    }); 

    document.body.appendChild(popperDiv);

    popper = node.popper({
      content: popperDiv,
      popper: {
        placement: options.iconsPlacement,
        interactive: true,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, options.verticalOffset],
            },
          },
        ],

      }
    });
  }

  function removeHandle() {
    if (popper) {
      popper.destroy();
      popper = null;
    }

    if (popperDiv) {
      document.body.removeChild(popperDiv);
      popperDiv = null;
    }

    popperNode = null;
  }

  cy.on('mouseover', 'node', function (e) {
    setHandleOn(e.target);
  });

  cy.on('grab', 'node', function () {
    removeHandle();
  });

  cy.on('tap', function (e) {
    console.log("cypopper - tap");
    if (e.target === cy) {
      removeHandle();
    }    
  });

  cy.on('zoom pan', function () {
    removeHandle();
  });
  cy.on('mouseout', 'node', function (e) {
    removeHandle();
  });

  cy.on('tap', 'node', function (e) {
    console.log("cypopper - tap", e);
    setHandleOn(e.target);
  });


  cy.on('tapend', 'node', function (e) {
    console.log("cypopper - tapend");
    removeHandle();
  });
  return this;
}

module.exports = { setupPopper };
