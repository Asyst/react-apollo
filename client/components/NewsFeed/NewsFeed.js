import { Component, Fragment } from 'react';
import { NavLink, Link, Route } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import { Query } from "react-apollo";
import gql from 'graphql-tag';

import { Layout, List, Icon, Card, Avatar, Skeleton } from 'antd';

import MainLayout from '../Layout/MainLayout';
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
    state = {
        limit: new Array(10)
    };

    render() {
        const { limit } = this.state;
        const { match } = this.props; 

        return <Query query={ GET_POSTS }> 
            {({ loading, error, data, client }) => {
                    const crumbs = match.path.split('/');

                    return ( <Fragment>
                            <Route exact path={ match.url } render={() => (
                                <MainLayout
                                    match={ match } 
                                    crumbs={ crumbs }>
                                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                                        <div className="NewsFeed">
                                            <h1>NewsFeed</h1>
                                            
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={ data.posts || limit }
                                                renderItem={ (post, idx) => {
                                                    return <List.Item>
                                                        <Card
                                                            key={ idx }
                                                            style={{ 
                                                                margin: '0 0 14px',
                                                                minWidth: '550px',
                                                                width: '100%'
                                                            }}
                                                            // loading={ loading }
                                                            cover={ <img alt={ !loading ? post.title : '' } src={ !loading ? post.image : '' } />}
                                                            actions={!loading && [
                                                                <Icon type="like" style={{ fontSize: '20px' }} />, 
                                                                <Icon type="message" style={{ fontSize: '20px' }} />, 
                                                                <Icon type="share-alt" style={{ fontSize: '20px' }} />
                                                            ]}
                                                        >
                                                            <Skeleton active loading={ loading }>
                                                                <Meta
                                                                    // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                                    title={ !loading && <Link to={ `/feed/${ post.id }` }>{ post.title }</Link> }
                                                                    description={ !loading && post.text }
                                                                />
                                                            </Skeleton>
                                                        </Card>
                                                    </List.Item>
                                                }}
                                            />

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