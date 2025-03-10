/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_710432678")

  // update collection data
  unmarshal({
    "name": "inventory"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_710432678")

  // update collection data
  unmarshal({
    "name": "items"
  }, collection)

  return app.save(collection)
})
