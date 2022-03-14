const { log } = require("./logging");

function setupPopper() {
  let { cy, options } = this;
  log("Seting up Popper", this);
 
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
      else{
        log("Node render size:",node.renderedBoundingBox());
      //  iconDiv.style = `font-size:${}px`;
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
    log("cypopper - creating popper with options: ", options);
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
    log("cypopper - removeHandle", popper);
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
    log("cypopper - mouseout");
    removeHandle();
  });
  cy.on('destroy', function (e) {
    log("cypopper - destroy");
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
