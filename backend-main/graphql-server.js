const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../products.json');

const schema = buildSchema(
  `type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
    categories: [String]
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }
`);

const readProducts = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || [];
};

const root = {
    products: () => readProducts(),
    product: ({ id }) => readProducts().find(p => p.id === parseInt(id)),
};

const app = express();
app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
}));

app.listen(4000, () => {
    console.log('GraphQL API запущен на http://localhost:4000/graphql');
});