var LOG_OPTIONS = {
    enabled: true
}

function log(msg, ...parameters) {   
    if (LOG_OPTIONS.enabled) {
      console.log(`[cytoscape-nodeicons] ${msg}`, parameters);
    }
}
  
module.exports = { log, LOG_OPTIONS };