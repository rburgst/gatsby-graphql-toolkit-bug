import {graphql} from 'gatsby'
import React from 'react'

const TestPage = (props) => {
    console.log('props', props)
    return (
        <>
            <h1>Hello world</h1>
            <pre>{JSON.stringify(props.data, null, 2)}</pre>
        </>
    )
}

export const query = graphql`
    query TestPageQuery {
        categories: allCmCategory {
            nodes {
                ...ConcertCategoryFragment
            }
        }
        events: allCmConcert {
            nodes {
                ...ConcertFragment
            }
        }
    }
`

export default TestPage
