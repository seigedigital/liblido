const { DOMParser } = require('xmldom')
const xmltools = require('./tools/xmltools.js')
const lidotools = require('./tools/lidotools.js')
const LidoRecord = require('./LidoRecord.js')

class LidoReader {

  constructor(data) {
    console.log("LR1")
    this.doc = new DOMParser().parseFromString(data)
    console.log({doc:this.doc})
    console.log("LR2")
    this.select = lidotools.useNamespaces()
    console.log("LR3")
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
