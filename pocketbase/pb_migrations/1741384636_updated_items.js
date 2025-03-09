/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_710432678")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "number2524893523",
    "max": null,
    "min": null,
    "name": "seq",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1398119645",
    "max": 0,
    "min": 0,
    "name": "productName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2053362243",
    "max": 0,
    "min": 0,
    "name": "productCode",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

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
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number4288744912",
    "max": null,
    "min": null,
    "name": "fixedAsset",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number2069360702",
    "max": null,
    "min": null,
    "name": "serialNumber",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "date294735238",
    "max": "",
    "min": "",
    "name": "expireDate",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3703245907",
    "max": 0,
    "min": 0,
    "name": "unit",
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
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number1588330520",
    "max": null,
    "min": null,
    "name": "warehouseFrom",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1573282057",
    "max": 0,
    "min": 0,
    "name": "employeeFrom",
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

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1767278655",
    "max": 0,
    "min": 0,
    "name": "currency",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "number2683508278",
    "max": null,
    "min": null,
    "name": "quantity",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "number3402113753",
    "max": null,
    "min": null,
    "name": "price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "date812373755",
    "max": "",
    "min": "",
    "name": "assignDate",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "number1555926557",
    "max": null,
    "min": null,
    "name": "assignDocument",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_710432678")

  // remove field
  collection.fields.removeById("number2524893523")

  // remove field
  collection.fields.removeById("text1398119645")

  // remove field
  collection.fields.removeById("text2053362243")

  // remove field
  collection.fields.removeById("text1133154834")

  // remove field
  collection.fields.removeById("number4288744912")

  // remove field
  collection.fields.removeById("number2069360702")

  // remove field
  collection.fields.removeById("date294735238")

  // remove field
  collection.fields.removeById("text3703245907")

  // remove field
  collection.fields.removeById("text3666068392")

  // remove field
  collection.fields.removeById("number1588330520")

  // remove field
  collection.fields.removeById("text1573282057")

  // remove field
  collection.fields.removeById("select2911171390")

  // remove field
  collection.fields.removeById("text1767278655")

  // remove field
  collection.fields.removeById("number2683508278")

  // remove field
  collection.fields.removeById("number3402113753")

  // remove field
  collection.fields.removeById("date812373755")

  // remove field
  collection.fields.removeById("number1555926557")

  return app.save(collection)
})
