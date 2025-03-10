/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_500247992")

  // add field
  collection.fields.addAt(13, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3573984430",
    "hidden": false,
    "id": "relation3357801493",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "employeeItems",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_500247992")

  // remove field
  collection.fields.removeById("relation3357801493")

  return app.save(collection)
})
