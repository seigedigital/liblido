import { DOMParser } from 'xmldom'
import LidoRecord  from './LidoRecord.js'
import * as xmltools from './tools/xmltools.js'
import * as lidotools from './tools/lidotools.js'

export default class LidoReader {

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
