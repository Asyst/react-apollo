import { Component, Fragment } from 'react';
import { NavLink, Link, Route } from 'react-router-dom';
import { Query } from "react-apollo";
import gql from 'graphql-tag';

import { Layout, Icon, List, Avatar, Skeleton } from 'antd';

import MainLayout from '../Layout/MainLayout';

const { Content } = Layout;

const GET_USER = gql`
    query User($facebookId: String!) {
        user(facebookId: $facebookId) {
            id
            first_name
            picture
            email
        }   
    }
`;

class Profile extends Component {
    render() {
        const { match } = this.props;

        return <Query query={ GET_USER } variables={{ facebookId: match.params.userId }}>
            {({ loading, error, data, client }) => {
                    const [user] = data.user ? data.user : [];

                    const crumbs = match.path.split('/');

                    return <Fragment>
                        <Route path={ match.url } render={ () => (
                            <MainLayout 
                            match={ match }
                            crumbs={ crumbs }>
                                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                                    <div className="profile">
                                        <Skeleton avatar title={false} loading={ loading } active>
                                            <h1>Profile</h1>
                                            <div>{ !loading && <Avatar src={ user.picture } size={64} >{ user.first_name.substr(0, 1) }</Avatar> }</div>
                                            <div>{ !loading && user.first_name }</div>
                                            <div>{ !loading && user.email }</div>
                                        </Skeleton>
                                    </div>
                                </Content>
                            </MainLayout>
                        ) } />
                    </Fragment>
                }
            }
        </Query>
    }
}

export default Profile;