import { Schema, model } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

const ExampleSchema = new Schema({
  index: { type: ObjectId, unique: true, required: true, index: true },
  sparseIndex: { type: String, sparse: true },
  user: {
    type: ObjectId,
    ref: 'User',
  },
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
}, {
  timestamps: true
});

interface ExampleType {
  _id: Schema.Types.ObjectId
  index: Schema.Types.ObjectId
  sparseIndex?: string
  user?: Schema.Types.ObjectId
  string?: string
  number?: number
  boolean?: boolean
  date?: Date
  stringsArray?: string[]
  objectsArray?: { string?: string, date?: Date }[]
  embedded?: { string?: string, number?: number }
  object?: Record<string, unknown>
  default?: string
  lang?: string
  languages?: string[]
  createdAt?: Date
  updatedAt?: Date
}

const ExampleModel = model('Example', ExampleSchema, 'examples');

export { ExampleModel, ExampleType };
