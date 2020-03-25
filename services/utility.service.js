module.exports = {
  name: 'utility',
  version: 'v1',
  actions: {
    test: {
      handler(ctx){
        console.log('iCum')
        return 'iCame'
      }
    }
  }
}