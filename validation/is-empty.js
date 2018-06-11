const isEmpty = (value)=>{
    value === undefined|| // cannot define
    value === null||     //hv no value
    (typeof value === 'object' && Object.keys(value).length===0)|| //no Object
    (typeof value === 'string' && value.trim().length===0)    //no string
}

module.exports= isEmpty;

