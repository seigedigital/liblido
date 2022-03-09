const LidoReader = require('./index.js')
const fs = require('fs');

describe('Part 1', () => {
  let records = []
  let records2 = []
  let records3 = []
  let recn = 0
  let lid = ''
  let rid = ''
  let rid2 = ''
  let label = ''
  let images = []
  let images2 = []
  let md={}
  let md2={}
  let md3={}
  let links = []
  let links2 = []
  let links3 = []

  const data = fs.readFileSync('./testdata/lido1.xml').toString()
  const data2 = fs.readFileSync('./testdata/lido2.xml').toString()
  const data3 = fs.readFileSync('./testdata/lido3.xml').toString()
  let myreader = new LidoReader(data)
  let myreader2 = new LidoReader(data2)
  let myreader3 = new LidoReader(data3)
  records = myreader.getAllRecords()
  records2 = myreader2.getAllRecords()
  records3 = myreader3.getAllRecords()
  lid = records[0].getLidoRecordID()
  rid = records[0].getRecordID()
  rid2 = records2[0].getRecordID()
  label = records[0].getLabel()
  images = records[1].getKenomImages()
  images2 = records2[1].getKenomImages()
  md.year = records[0].getCreationYear()
  md2.year = records2[0].getCreationYear()
  md2.label = records2[0].getLabel()
  md.license = records[0].getLicenseUri()
  md.stmt = records[0].getReqStatement()
  md.place = records[1].getCreationPlace()
  md.placeIDs = records[0].getCreationPlaceIDs()
  md2.placeIDs = records2[0].getCreationPlaceIDs()
  md.person = records[0].getEventActorRoles()
  md.wtype = records[0].getWorkType()
  md2.wtype = records2[0].getWorkType()
  md2.sachgruppe = records2[0].getClassificationByType('Sachgruppe')
  md2.sammlung = records2[0].getClassificationByType('Sammlung')
  md2.inventarnummer = records2[0].getIdentificationByType('Inventarnummer')
  md2.permalink = records2[0].getRecordInfoLink()
  links = records[0].getRelatedLinks()
  links2 = records2[0].getRelatedLinks()
  md3.inventarnummer1 = records3[5].getIdentificationByType('Inventarnummer')
  md3.year = records3[5].getCreationYear()
  md3.inventarnummer2 = records3[5].getIdentificationByType('Inventarnummer')

  beforeEach(() => {
    // nothing
  })

  it('Test parsed OAI-PMH file.', () => {
    expect(typeof records).toBe('object')
    expect(records.length).toBe(20)
    expect(records2.length).toBe(10)
  })

  it('Test primary record data.', () => {
    expect(lid).toBe('record_DE-15_kenom_161017')
    expect(rid).toBe('161017')
    expect(rid2).toBe('mkg-e00139657')
    expect(label).toBe('Münze, 1 Crown, 1847')
  })

  it('Test images.', () => {
    expect(images.length).toBe(2)
    expect(images[0].url).toBe('https://www.kenom.de/iiif/image/record_DE-15_kenom_161081/record_DE-15_kenom_161081_vs.jpg/full/full/0/default.jpg')
    expect(images[1].width).toBe('2924')
    expect(images[1].perspective).toBe('back')
    expect(images2.length).toBe(1)
    expect(images2[0].url).toBe('http://resources.digicult-museen.net/dam/provided_image/m58c213370d075')
    expect(images2[0].width).toBe(null)
    expect(images2[0].perspective).toBe(null)
  })

  it('Test metadata.', () => {
    expect(md.year).toBe('1847')
    expect(md2.year).toBe('1900')
    expect(md2.label).toBe('Nikolaifleet')
    expect(md.license).toBe('https://creativecommons.org/publicdomain/zero/1.0/deed.de')
    expect(md.place).toBe('London')
    expect(md2.placeIDs.toString()).toBe([
      'http://digicult.vocnet.org/ort/6.67',
      'http://d-nb.info/gnd/4023118-5',
      'http://vocab.getty.edu/page/tgn/7005289',
      '02000000',
      'http://sws.geonames.org/2911298/'
    ].toString())
    expect(md.placeIDs.toString()).toBe(['http://d-nb.info/gnd/7844609-0'].toString())
    expect(md.person).toBe('Viktoria <Großbritannien, Königin> (Münzherr)')
    expect(md.stmt).toBe('Universitätsbibliothek Leipzig, kein Copyright / Public domain (CC0 1.0)')
    expect(md.wtype).toBe('Münze')
    expect(md2.wtype).toBe('Fotografie')
  })

  it('Test metadata.', () => {
    expect(links[0]).toBe('http://www.kenom.de/id/record_DE-15_kenom_161017')
    expect(links[1]).toBe('http://hdl.handle.net/428894.vzg/1ef66282-82d5-4f33-bdfc-3b51f9c59f26')
    expect(md2.sachgruppe).toBe('Architekturfotografie')
    expect(md2.sammlung).toBe('Fotografie und neue Medien')
    expect(md2.inventarnummer).toBe('P1994.1387')
    expect(md2.permalink).toBe('http://sammlungonline.mkg-hamburg.de/de/object/Nikolaifleet/P1994.1387/mkg-e00139657')
    expect(links2.length).toBe(0)
  })

  it('Test metadata.', () => {
    expect(md3.year).toBe('1912')
    expect(md3.inventarnummer1).toBe('AB1988.661')
    expect(md3.inventarnummer2).toBe('AB1988.661')
  })

})
