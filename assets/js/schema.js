// This is really not great but I'm testing without a web server
// And really just want this to work yesterday... TODO add a proper schema file

const sardines_schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Sardines Deck Schema",
  "type": "object",
  "properties": {
    "deck_name": {
      "type": "string"
    },
    "cards": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "text": {
            "type": "string"
          },
          "favorited": {
            "type": "boolean"
          },
          "category": {
            "type": "string"
          }
        },
        "required": [
          "title",
          "text"
        ]
      }
    }
  },
  "required": [
    "deck_name",
    "cards"
  ]
}