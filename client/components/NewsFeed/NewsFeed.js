import { Component, Fragment } from 'react';
import { NavLink, Link, Route } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import { Query } from "react-apollo";
import gql from 'graphql-tag';

import { Layout, Icon, Card, Avatar, Skeleton } from 'antd';

import MainLayout from '../Layout/MainLayout';
import BreadCrumbs from '../BreadCrumbs';
import Post from '../Post';

import 'antd/lib/card/style/css';
import './NewsFeed.css';

const { Content } = Layout;
const { Meta } = Card;

const GET_POSTS = gql`
{
    posts {
        id
        title
        author
        image
    }
}`;

class NewsFeed extends Component {
    render() {
        const { match } = this.props; 

        return <Query query={ GET_POSTS }> 
            {({ loading, error, data, client }) => {
                    const crumbs = match.path.split('/');

                    return ( <Fragment>
                            <Route exact path={ match.url } render={() => (
                                <MainLayout crumbs={ crumbs }>
                                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                                        <div className="NewsFeed">
                                        <h1>NewsFeed</h1>
                                            <div className="card-container">
                                                { loading 
                                                    ? <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
                                                            <Meta
                                                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                                title="Card title"
                                                                description="This is the description"
                                                            />
                                                        </Card>
                                                    : data.posts.map((post, idx) => 
                                                    <Card
                                                        key={ idx }
                                                        style={{ 
                                                            margin: '0 0 14px',
                                                            width: '100%' 
                                                        }}
                                                        loading={ loading }
                                                        cover={ !loading && <img alt={ post.title } src={ post.image } />}
                                                        actions={ !loading && [
                                                            <Icon type="like" />, 
                                                            <Icon type="message" />, 
                                                            <Icon type="share-alt" />
                                                        ]}
                                                    >
                                                        <Skeleton loading={loading} active avatar>
                                                            <Meta
                                                                // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                                title={ <Link to={ `/feed/${ post.id }` }>{ post.title }</Link> }
                                                                description={ post.text }
                                                            />
                                                        </Skeleton>
                                                    </Card>) 
                                                }
                                            </div>

                                        </div>
                                    </Content>
                                
                                </MainLayout>
                            )} />

                            <Route path="/feed/:id" component={ Post } />
                        </Fragment>
                    )
                }
            }
        </Query>
    }
}

export default NewsFeed;