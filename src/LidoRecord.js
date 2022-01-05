const xmltools = require('./tools/xmltools.js')
const lidotools = require('./tools/lidotools.js')

export default class LidoRecord {

  constructor(node) {
    this.node = node
    this.select = lidotools.useNamespaces()
  }

  getRecordID() {
    return lidotools.getRecordID(this.node,this.select)
  }

  getLidoRecordID() {
    return lidotools.getLidoRecordID(this.node,this.select)
  }

  getLabel() {
    return lidotools.getLabel(this.node,this.select)
  }

}
