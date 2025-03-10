/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3573984430")

  // update collection data
  unmarshal({
    "name": "inventoryr"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3573984430")

  // update collection data
  unmarshal({
    "name": "inventory"
  }, collection)

  return app.save(collection)
})
