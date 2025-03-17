/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_238254098")

  // update collection data
  unmarshal({
    "name": "warehouse_products"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_238254098")

  // update collection data
  unmarshal({
    "name": "warehouse_items"
  }, collection)

  return app.save(collection)
})
