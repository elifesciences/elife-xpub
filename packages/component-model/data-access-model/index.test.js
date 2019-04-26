const DataAccessModel = require('.')

describe('DataAccessModel extends PubSweet BaseModel', () => {
  it('should not-recursively save when save() is called', () => {
    // TODO: Check save() saves non-recursively
    //
  })

  it('should recursively save when saveRecursively() is called ', () => {
    // TODO: Check saveRecursively() saves recursively
    //
  })

  it('should have save recursively', () => {
    const dam = new DataAccessModel()
    // Cannot easily check the class has the save method
    expect(dam).toHaveProperty('saveRecursively')
  })
})
