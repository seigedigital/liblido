module.exports = {

  getXmlLangAttribute: function (attributes) {
    for(let key in attributes) {
      if(attributes[key].name==="xml:lang") {
        return(attributes[key].value)
      }
    }
    return null
  },

  getXmlLangValues: function (query,doc,select,defaultLanguages) {
    let res = select(query,doc)
    let retval = {}
    let lang = null
    let value = null
    if(res.length>0) {
      retval = {}
      for(let key in res) {
        try {
          lang = this.getXmlLangAttribute(res[key].attributes)
          value = res[key].childNodes[0].nodeValue
          if(lang===null) {
            for(let key in defaultLanguages) {
              retval[defaultLanguages[key]] = [value]
            }
          } else {
              retval[lang] = [value]
          }
        } catch(e) {
          console.log({error:e})
        }
      }
    }
    return(JSON.parse(JSON.stringify(retval)))
  },

  getXmlValue: function (query,doc,select) {
    let res = select(query,doc)
    if(res.length>0) {
      try {
        return(this.getXmlValueFromNode(res[0]))
      } catch(e) {return(null)}
    } else {
      return(null)
    }
  },

  getXmlValueFromNode: function (node) {
    return(node.childNodes[0].nodeValue)
  },

  getXmlAttrValue: function (node,name,select) {
    for(let key in node.attributes) {
      if(node.attributes[key].name===name) {
        return(node.attributes[key].value)
      }
    }
    return(null)
  },

  getNodes: function (query,node,select) {
    return select(query,node)
  }

}
