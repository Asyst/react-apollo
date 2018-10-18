import { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Query } from "react-apollo";
import gql from 'graphql-tag';
import { Layout, Menu, Breadcrumb, Icon, Skeleton } from 'antd';

import MainLayout from '../Layout/MainLayout';
import { load } from 'protobufjs';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const GET_POST = gql`
    query Post($id: ID!) {
        post(id: $id) {
            id
            title
            image
            text
        }
    }
`;

class Post extends Component {
    render() {
        const { match: { params } } = this.props;

        return <Query query={ GET_POST } variables={{ id: params.id }} > 
            {({ loading, error, data, client }) => {
                    const { post } = data;

                    return (
                        <MainLayout>
                            <Layout style={{ padding: '0 24px 24px' }}>
                                <Breadcrumb style={{ margin: '16px 0' }}>
                                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                                    <Breadcrumb.Item>List</Breadcrumb.Item>
                                    <Breadcrumb.Item>App</Breadcrumb.Item>
                                </Breadcrumb>
                                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                                    <div className="Post">
                                        <Skeleton active loading={ loading }>
                                            <h1>{ !loading && post.title }</h1>
                                            <figure><img src={ !loading && post.image } /></figure>
                                            <p>{ !loading && post.text }</p>
                                        </Skeleton>
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

export default Post;