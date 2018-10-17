import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import { Query } from "react-apollo";
import gql from 'graphql-tag';

import { Layout, Menu, Breadcrumb, Icon, Card, Avatar, Skeleton } from 'antd';

const { Content } = Layout;

import MainLayout from '../Layout/MainLayout';

import 'antd/lib/card/style/css';
import './NewsFeed.css';

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
        return <Query query={ GET_POSTS }> 
            {({ loading, error, data, client }) => {
                    console.log('client -> ', client);

                    return (
                        <MainLayout>
                            <Layout style={{ padding: '0 24px 24px' }}>
                                <Breadcrumb style={{ margin: '16px 0' }}>
                                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                                    <Breadcrumb.Item>List</Breadcrumb.Item>
                                    <Breadcrumb.Item>App</Breadcrumb.Item>
                                </Breadcrumb>
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
                                                    style={{ width: 300 }}
                                                    loading={ loading }
                                                    cover={ !loading && <img alt={ post.title } src={ post.image } />}
                                                    actions={ !loading && [
                                                        <Icon type="setting" />, 
                                                        <Icon type="edit" />, 
                                                        <Icon type="ellipsis" />
                                                    ]}
                                                >
                                                    <Skeleton loading={loading} active avatar>
                                                        <Meta
                                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                            title={ <NavLink to={ `/${ post.id }` }>{ post.title }</NavLink> }
                                                            description={ post.text }
                                                        />
                                                    </Skeleton>
                                                </Card>) 
                                            }
                                        </div>

                                    </div>
                                </Content>
                            </Layout>
                        </MainLayout>
                    )
                }
            }
        </Query>
    }
}

export default NewsFeed;