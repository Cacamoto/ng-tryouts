/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_710432678")

  // remove field
  collection.fields.removeById("text1133154834")

  // remove field
  collection.fields.removeById("text3666068392")

  // remove field
  collection.fields.removeById("select2911171390")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_710432678")

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1133154834",
    "max": 0,
    "min": 0,
    "name": "del1",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3666068392",
    "max": 0,
    "min": 0,
    "name": "del2",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "select2911171390",
    "maxSelect": 1,
    "name": "del3",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "$",
      "€"
    ]
  }))

  return app.save(collection)
})
