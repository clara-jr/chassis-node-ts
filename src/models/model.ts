import { Schema, InferSchemaType, model } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

const ModelSchema = new Schema({
  index: { type: ObjectId, unique: true, required: true, index: true },
  sparseIndex: { type: String, sparse: true },
  string: String,
  number: Number,
  boolean: Boolean,
  date: Date,
  stringsArray: [String],
  objectsArray: [{ string: String, date: Date, _id: false }],
  embedded: {
    string: String,
    number: Number
  },
  object: { type: Object },
  default: { type: String, default: 'default' },
  lang: {
    type: String,
    validate: {
      validator: (value: string) => ['en', 'es', 'fr'].includes(value),
      message: (props: { value: string }) => `'${props.value}' is not a valid value for 'lang' field.`,
    },
    default: 'en',
    lowercase: true,
  },
  languages: {
    type: [String],
    validate: {
      validator: (value: string[]) => value.every((lang) => ['en', 'es', 'fr'].includes(lang)),
      message: (props: { value: string }) => `'${props.value}' is not a valid value for 'languages' field.`,
    },
    default: ['en'],
  },
});

type _ModelType = InferSchemaType<typeof ModelSchema>;
interface ModelType extends _ModelType {
  _id: Schema.Types.ObjectId
}

const Model = model<_ModelType>('Model', ModelSchema);

export { Model, ModelType };
