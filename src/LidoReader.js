const { DOMParser } = require('xmldom')
const xmltools = require('./tools/xmltools.js')
const lidotools = require('./tools/lidotools.js')
const LidoRecord = require('./LidoRecord.js').default

class LidoReader {

  constructor(data) {
    this.doc = new DOMParser().parseFromString(data)
    this.select = lidotools.useNamespaces()
  }

  getAllRecords() {
    let records = xmltools.getNodes('//record',this.doc,this.select)
    if(Object.keys(records).length === 0) {
      records = xmltools.getNodes('//oai:record',this.doc,this.select)
    }
    this.records = []
    for(let key in records) {
      this.records.push(new LidoRecord(records[key]))
    }
    return this.records
  }

}

module.exports = LidoReader
