import { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Query } from "react-apollo";
import gql from 'graphql-tag';
import { Layout, Menu, Icon, Skeleton } from 'antd';

import MainLayout from '../Layout/MainLayout';
import BreadCrumbs from '../BreadCrumbs';
import { load } from 'protobufjs';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

import './Post.css';

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
        const { match } = this.props;

        console.log('Post render -> ', this.props);

        return <Query query={ GET_POST } variables={{ id: match.params.id }} > 
            {({ loading, error, data, client }) => {
                    const { post } = data;

                    const crumbs = match.path.split('/');

                    return (
                        <MainLayout crumbs={ crumbs }>
                            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                                <div className="Post">
                                    <Skeleton active loading={ loading }>
                                        <h1>{ !loading && post.title }</h1>
                                        <figure><img src={ !loading && post.image } /></figure>
                                        <p>{ !loading && post.text }</p>
                                    </Skeleton>
                                </div>
                            </Content>
                        </MainLayout>
                    )
                }
            }
        </Query>
    }
}

export default Post;