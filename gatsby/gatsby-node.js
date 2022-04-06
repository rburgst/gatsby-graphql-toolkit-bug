const {
  createDefaultQueryExecutor,
  loadSchema,
  generateDefaultFragments,
  compileNodeQueries,
  sourceAllNodes,
  createSchemaCustomization,
  buildNodeDefinitions,
  writeCompiledQueries,
} = require("gatsby-graphql-source-toolkit");

async function createSourcingConfig(gatsbyApi) {
  // Step1. Set up remote schema:
  const execute = createDefaultQueryExecutor("http://localhost:9000/graphql");

  const schema = await loadSchema(execute);

  // Step2. Configure Gatsby node types

  const gatsbyNodeTypes = [
    {
      remoteTypeName: `Concert`,
      queries: `
        query LIST_CONCERT {
          getConcerts { ..._ConcertId_ }
        }
        fragment _ConcertId_ on Concert { __typename id }
      `,
    },
    {
      remoteTypeName: `Category`,
      queries: `
        query LIST_CATEGORY {
          getCategories { ..._CategoryId_ }
        }
        fragment _CategoryId_ on Category { __typename id }
      `,
    },
  ];

  // Step3. Provide (or generate) fragments with fields to be fetched
  const fragments = generateDefaultFragments({ schema, gatsbyNodeTypes });

  // Step4. Compile sourcing queries
  const documents = compileNodeQueries({
    schema,
    gatsbyNodeTypes,
    customFragments: fragments,
  });

  await writeCompiledQueries(`./queries`, documents);

  return {
    gatsbyApi,
    schema,
    execute,
    gatsbyTypePrefix: `CM`,
    gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
  };
}

exports.sourceNodes = async (gatsbyApi) => {
  const config = await createSourcingConfig(gatsbyApi);

  // Step5. Add explicit types to gatsby schema
  await createSchemaCustomization(config);

  // Step6. Source nodes
  await sourceAllNodes(config);
};

exports.onCreateNode = ({ node }) => {
  if (node.internal.type.startsWith("CMCategory")) {
    // console.log("onCreateNode", node);
    if (!node.nameDe) {
      console.error("ERRR: NODE", node);
    }
  }
};
