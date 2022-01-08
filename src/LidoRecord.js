const xmltools = require('./tools/xmltools.js')
const lidotools = require('./tools/lidotools.js')

class LidoRecord {

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

  getKenomImages() {
    return lidotools.getKenomImages(this.node,this.select)
  }

  getCreationYear() {
    return lidotools.getCreationYear(this.node,this.select)
  }

  getCreationPlace() {
    return lidotools.getCreationPlace(this.node,this.select)
  }

  getEventActorRoles() {
    return lidotools.getEventActorRoles(this.node,this.select)
  }

  getLicenseUri() {
    return lidotools.getLicenseUri(this.node,this.select)
  }

  getReqStatement() {
    return lidotools.getReqStatement(this.node,this.select)
  }

  getRelatedLinks() {
    return lidotools.getRelatedLinks(this.node,this.select)
  }

}

module.exports = LidoRecord
