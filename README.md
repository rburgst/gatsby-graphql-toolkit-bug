Sample repo showing a problem in

Gatsby GraphQL Source Toolkit

To replicate do the following

1. start the dev server
   ```
   cd server
   pnpm install
   pnpm dev
   ```
2. In another shell start a gatsby build
   ```
   cd gatsby
   yarn install
   yarn build
   ```

### Expected 

the build runs through

### Actual

The following error is thrown

```

 ERROR #85925  GRAPHQL

There was an error in your GraphQL query:

Cannot return null for non-nullable field CMCategory.nameDe.

The field "CMCategory.nameDe." was explicitly defined as non-nullable via the schema customization API (by yourself or a plugin/theme). This means that this field is not optional and you have to define a value. If this is not your
desired behavior and you defined the schema yourself, go to "createTypes" in gatsby-node.js. If you're using a plugin/theme, you can learn more here on how to fix field types:
https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization#fixing-field-types

   1 | fragment ConcertCategoryFragment on CMCategory {
   2 |   remoteId
>  3 |   nameDe
     |   ^
   4 |   nameEn
   5 |   isSubcategoryOf {
   6 |     remoteId
   7 |     nameDe
   8 |     nameEn
   9 |   }
  10 | }
  11 |
```