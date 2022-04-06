import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import fastify, { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import mercurius from "mercurius";
import { gql } from "mercurius-codegen";

/**
 * Create instance of our Fastify server
 * We need to export it here so we can easily use it in our automated tests
 */
export const app: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({ logger: false });

interface Category {
  id: string;
  nameDe: string;
  nameEn: string;
  displayOrder: number;
  isSubcategoryOf?: Category;
}

interface Concert {
  id: string;
  category?: Category;
  titleDe: string;
  titleEn: string;
}
/**
 * Type Definitions
 */
const typeDefs = gql`
  type Query {
    getCategories: [Category]!
    getConcerts: [Concert]!
  }

  type Category {
    id: String!
    nameDe: String!
    nameEn: String!
    displayOrder: Int!
    isSubcategoryOf: Category
  }
  type Concert {
    id: ID!
    category: Category
    titleDe: String!
    titleEn: String!
  }
`;
let parentCategory = {
  id: "b392e16c-dea8-48c2-b27b-9676ee62f7f5",
  nameDe: "Main",
  nameEn: "main",
  displayOrder: 0,
  isSubcategoryOf: undefined,
};
let parentCategory2 = {
  id: "40a78127-48dc-42a6-b3cc-59d65e3ebfa7",
  nameDe: "parent2",
  nameEn: "parent2",
  displayOrder: 2,
  isSubcategoryOf: undefined,
};
let childCategory = {
  id: "16f2489c-1686-4910-8334-88134a950f1e",
  nameDe: "sub",
  nameEn: "sub",
  displayOrder: 2,
  isSubcategoryOf: parentCategory,
};
/** ********* **/

const allCategories: Category[] = [
  parentCategory,
  childCategory,
  parentCategory2,
];

const allConcerts: Concert[] = [
  {
    id: "794316c1-d988-45b5-b79a-e1d926fbf03a",
    titleDe: "concert1",
    titleEn: "concert1",
    category: childCategory,
  },
  {
    id: "69e2025a-2573-4d25-b2e1-a6d34a7bcefd",
    titleDe: "fgdg",
    titleEn: "asdf",
    category: parentCategory2,
  },
];

/**
 * Resolvers
 */
const resolvers = {
  Query: {
    getCategories: async (_: unknown): Promise<Category[]> => {
      return allCategories;
    },
    getConcerts: async (_: unknown): Promise<Concert[]> => {
      return allConcerts;
    },
  },
};

/**
 * Add 'mercurius' to our fastify server
 */
app.register(mercurius, {
  schema: makeExecutableSchema({
    typeDefs: mergeTypeDefs([typeDefs]),
    resolvers: mergeResolvers([resolvers]),
  }),
  // Enable the GraphQL Playground
  graphiql: "playground",
});

const port = process.env.PORT || 9000;

// Start server
const start = async (): Promise<void> => {
  try {
    await app.listen(port, "0.0.0.0");
    console.log(`Listening on port ${port}`);
  } catch (err) {
    console.error("error launchign", err);
    app.log.error(err);
    process.exit(1);
  }
};
start()
  .catch((err) => console.error("caught", err))
  .then((res) => console.log("started"));
