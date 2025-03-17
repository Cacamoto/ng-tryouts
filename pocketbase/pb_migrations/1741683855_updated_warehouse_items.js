/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_238254098")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "[0-9]{6}",
    "hidden": false,
    "id": "text3208210256",
    "max": 6,
    "min": 6,
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
  const collection = app.findCollectionByNameOrId("pbc_238254098")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "[0-9]{4}",
    "hidden": false,
    "id": "text3208210256",
    "max": 4,
    "min": 4,
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
