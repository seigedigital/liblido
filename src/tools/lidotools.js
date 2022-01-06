const xpath = require('xpath')
const xmltools = require('./xmltools.js')

module.exports = {

  template_md: {
    label: {},
    value: {}
  },

  terminology: {
    objectWorkType: {
      "en": "Object type",
      "de": "Objekttyp"
    },
    displayActorInRole: {
      "en": "Person",
      "de": "Person"
    },
    creationYear: {
      "en": "Year (Creation)",
      "de": "Jahr (Entstehung)"
    },
    creationPlace: {
      "en": "GND, Place (Creation)",
      "de": "GND, Ort (Entstehung)"
    }
  },

  // should be good for many LIDO dialects
  useNamespaces: function() {
    return xpath.useNamespaces({
      "lido": "http://www.lido-schema.org",
      "xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "oai": "http://www.openarchives.org/OAI/2.0/"
    })
  },

  getRecordID: function(node,select) {
    return xmltools.getXmlValue('.//lido:administrativeMetadata/lido:recordWrap/lido:recordID',node,select)
  },

  getLidoRecordID: function(node,select) {
    return xmltools.getXmlValue('.//lido:lido/lido:lidoRecID',node,select)
  },

  getKenomResourceRepresentations: function(node,select) {
    let nodes = xmltools.getNodes('.//lido:resourceRepresentation',node,select)
    let retval = []
    for(let key in nodes) {
      try {
        let url = xmltools.getXmlValue('./lido:linkResource',nodes[key],select)
        let width = xmltools.getXmlValue('./lido:resourceMeasurementsSet[lido:measurementType = "width"]/lido:measurementValue',nodes[key],select)
        let height = xmltools.getXmlValue('./lido:resourceMeasurementsSet[lido:measurementType = "height"]/lido:measurementValue',nodes[key],select)
        let qp = width*height
        retval.push({url:url,width:width,height:height,qp:qp})
      } catch (e) { console.log(e) }
    }
    return retval
  },

  getKenomMaxResourceRepresentation: function(node,select) {
    let reps = this.getKenomResourceRepresentations(node,select)
    let retval = false
    let maxqp = 0
    for(let key in reps) {
      if(reps[key].qp>maxqp) {
        retval = reps[key]
        maxqp = reps[key].qp
      }
    }
    return retval
  },

  getKenomImages: function(node,select) {
    let rnodes = xmltools.getNodes('.//lido:administrativeMetadata/lido:resourceWrap/lido:resourceSet',node,select)
    let retval =  []
    for(let key in rnodes) {
      let img = {}
      img = Object.assign(img,this.getKenomMaxResourceRepresentation(rnodes[key],select))
      retval.push(img)
    }
    return retval
  },

  getWorkType: function(node,select,defaultLanguages) {
    let results = xmltools.getXmlLangValues('.//lido:descriptiveMetadata/lido:objectClassificationWrap/lido:objectWorkTypeWrap/lido:objectWorkType/lido:term',node,select,defaultLanguages)
    if(results.length===0 || results===null) {
      return null
    }
    let retval = this.clone(this.template_md)
    for(let key in results) {
      retval.label[key] = [this.terminology.objectWorkType[key]]
      retval.value[key] = results[key]
    }
    return retval
  },

  getLabel: function(node,select) {
    return xmltools.getXmlValue('.//lido:descriptiveMetadata/lido:objectIdentificationWrap/lido:titleWrap/lido:titleSet/lido:appellationValue',node,select)
  },

  getCreationYear: function(node,select) {
    console.log("getCreationYear")
    let nodes = xmltools.getNodes('.//lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event',node,select)
    for(let key in nodes) {
      let concept = xmltools.getXmlValue('.//lido:eventType/lido:conceptID',node,select)
      console.log({concept:concept})
      if(
        ['http://terminology.lido-schema.org/lido00007'
        ,'http://terminology.lido-schema.org/lido00031'
        ,'http://terminology.lido-schema.org/lido00224'
        ,'http://terminology.lido-schema.org/lido00228'
        ].includes(concept)) {
          let date = xmltools.getXmlValue('.//lido:eventDate/lido:date/lido:earliestDate',node,select)
          if(date!==null) {
            console.log({date:date})
            date = date.replace(/^(-?[0-9]{4}).*$/,"$1")
            let retval = this.clone(this.template_md)
            retval.label['en'] = [this.terminology.creationYear['en']]
            retval.label['de'] = [this.terminology.creationYear['de']]
            retval.value['en'] = [date]
            retval.value['de'] = [date]
            console.log({returning:retval})
            return retval
          }
      }
    }
    return null
  },

  getCreationPlace: function(node,select) {
    console.log("getCreationPlace")
    let nodes = xmltools.getNodes('.//lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event',node,select)
    for(let key in nodes) {
      let concept = xmltools.getXmlValue('.//lido:eventType/lido:conceptID',node,select)
      console.log({concept:concept})
      if(
        ['http://terminology.lido-schema.org/lido00007'
        ,'http://terminology.lido-schema.org/lido00031'
        ,'http://terminology.lido-schema.org/lido00224'
        ,'http://terminology.lido-schema.org/lido00228'
        ].includes(concept)) {
          let place = xmltools.getNodes('.//lido:eventPlace/lido:place/lido:placeID[@lido:source="GND"]',node,select)
          if(place&&place.length>0) {
            place=place[0] // just choose the 1st one
            console.log({place:place})
            console.log({place_cn:place.childNodes})
            let placeuri = xmltools.getXmlValueFromNode(place)
            console.log({placeuri:placeuri})
            let placeid = placeuri.replace(/^.*\/([^\/]*)$/,"$1")
            console.log({placeid:placeid})
            // const response = await fetch('https://hub.culturegraph.org/entityfacts/'+placeid);
            // const efdata = await response.json();
            let retval = this.clone(this.template_md)
            retval.label['en'] = [this.terminology.creationPlace['en']]
            retval.label['de'] = [this.terminology.creationPlace['de']]
            retval.value['en'] = [placeid]
            retval.value['de'] = [placeid]
            console.log({returning:retval})
            return retval
          }
      }
    }
    return null
  },

  getLicenseUri: function(node,select) {
    let retval = xmltools.getXmlValue('.//lido:administrativeMetadata/lido:rightsWorkWrap/lido:rightsWorkSet/lido:rightsType/lido:conceptID',node,select)
    if(retval!==null) {
      return retval
    }
    retval = xmltools.getXmlValue('.//lido:administrativeMetadata/lido:recordWrap/lido:recordRights/lido:rightsType/lido:conceptID',node,select)
    return retval
  },

  getReqStatement: function(node,select) {
    let stmt = xmltools.getXmlValue('.//lido:administrativeMetadata/lido:resourceWrap/lido:resourceSet/lido:rightsResource/lido:creditLine',node,select)
    if(stmt===null) {
      stmt = ""
      stmt += xmltools.getXmlValue('.//lido:administrativeMetadata/lido:recordWrap/lido:recordRights/lido:rightsHolder/lido:legalBodyName/lido:appellationValue',node,select)
      stmt += " "+xmltools.getXmlValue('.//lido:administrativeMetadata/lido:recordWrap/lido:recordRights/lido:rightsType/lido:term',node,select)
    }
    return {
      label: { en: ["Attribution"] },
      value: { en: [stmt] }
    }
  },

  getEventActorRoles: function(node,select,defaultLanguages) {
    let results = xmltools.getXmlLangValues('.//lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event/lido:eventActor/lido:displayActorInRole',node,select,defaultLanguages)
    if(results.length===0 || results===null) {
      return null
    }
    let retval = this.clone(this.template_md)
    for(let key in results) {
      retval.label[key] = [this.terminology.displayActorInRole[key]]
      retval.value[key] = results[key]
    }
    return retval
  },

  clone: function(i) {
    return JSON.parse(JSON.stringify(i))
  }

}