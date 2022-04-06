import { graphql } from "gatsby";

export const ConcertFragment = graphql`
  fragment ConcertFragment on CMConcert {
    titleDe
    titleEn
    category {
      ...ConcertCategoryFragment
    }
  }
`;

export const ConcertCategoryFragment = graphql`
  fragment ConcertCategoryFragment on CMCategory {
    remoteId
    nameDe
    nameEn
    isSubcategoryOf {
      remoteId
      nameDe
      nameEn
    }
  }
`;
