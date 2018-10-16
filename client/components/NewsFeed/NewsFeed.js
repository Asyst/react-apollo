import { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Query } from "react-apollo";
import gql from 'graphql-tag';
import { inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

@inject('newsFeedStore')
class NewsFeed extends Component {

    render() {
        const { newsFeedStore } = this.props;
        console.log('NewsFeed render -> ', this.props);

        return <Query
            query={gql`
                    {
                        books {
                            title
                        }
                    }
                `}
            > 
            {({ loading, error, data }) => (
                    <div className="NewsFeed">
                        <h1>NewsFeed</h1>
                        <DevTools />
                    </div>
                )
            }
        </Query>
    }
}

export default NewsFeed;