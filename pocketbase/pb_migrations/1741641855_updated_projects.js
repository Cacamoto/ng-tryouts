/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // add field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3573984430",
    "hidden": false,
    "id": "relation3776899405",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "items",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // remove field
  collection.fields.removeById("relation3776899405")

  return app.save(collection)
})
