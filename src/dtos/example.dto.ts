import joi from 'joi';

export default joi.object({
  index: joi.string().required(),
  sparseIndex: joi.string(),
  string: joi.string(),
  number: joi.number(),
  boolean: joi.boolean(),
  date: joi.date(),
  stringsArray: joi.array().items(joi.string()),
  objectsArray: joi.array().items(
    joi.object({
      string: joi.string(),
      date: joi.date(),
    })
  ),
  embedded: joi.object({
    string: joi.string(),
    number: joi.number(),
  }),
  object: joi.object(),
  default: joi.string(),
  lang: joi.string().valid('en', 'es', 'fr'),
  languages: joi.array().items(joi.string().valid('en', 'es', 'fr')),
});
