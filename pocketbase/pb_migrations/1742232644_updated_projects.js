/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "[0-9]{5}",
    "hidden": false,
    "id": "text3208210256",
    "max": 5,
    "min": 5,
    "name": "id",
    "pattern": "^[0-9]+$",
    "presentable": false,
    "primaryKey": true,
    "required": true,
    "system": true,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "[0-9]{8}",
    "hidden": false,
    "id": "text3208210256",
    "max": 8,
    "min": 8,
    "name": "id",
    "pattern": "^[0-9]+$",
    "presentable": false,
    "primaryKey": true,
    "required": true,
    "system": true,
    "type": "text"
  }))

  return app.save(collection)
})
