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

  getCreationPlaceIDs() {
    return lidotools.getCreationPlaceIDs(this.node,this.select)
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

  getWorkType() {
    return lidotools.getWorkType(this.node,this.select)
  }

  getClassificationByType(type) {
    return lidotools.getClassificationByType(this.node,this.select,type)
  }

  getIdentificationByType(type) {
    return lidotools.getIdentificationByType(this.node,this.select,type)
  }

  getRecordInfoLink() {
    return lidotools.getRecordInfoLink(this.node,this.select)
  }

}

module.exports = LidoRecord
