import { Component, Fragment } from 'react';
import { NavLink, Link, Route } from 'react-router-dom';
import { Query } from "react-apollo";
import gql from 'graphql-tag';

import { Layout, Icon, List, Avatar, Skeleton, Button } from 'antd';

import MainLayout from '../Layout/MainLayout';

const { Content } = Layout;

const GET_USER = gql`
    query {
        currentUser @client {
            uid
            displayName
            photoURL
            email
            phoneNumber
            providerId
        }   
    }
`;

const GET_PROFILE_PICTURE = gql`
    query fetchPhoto($uid: ID!) {
        fetchUserPhoto(uid: $uid) @client {
            photoURL
        }
    }
`;

class Profile extends Component {
    render() {
        const { match } = this.props;

        return <Query query={ GET_USER }>
            {({ loading, error, data: { currentUser }, client }) => {
                    const crumbs = match.path.split('/');

                    console.log('currentUser -> ', currentUser);

                    return <Fragment>
                        <Route path={ match.url } render={ () => (
                            <MainLayout 
                            match={ match }
                            crumbs={ crumbs }>
                                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                                    <div className="profile">
                                        <Skeleton avatar title={false} loading={ loading } active>
                                            <h1>Profile</h1>
                                            {
                                                !loading && <Query query={ GET_PROFILE_PICTURE } variables={{ uid: currentUser.uid }}>
                                                    { ({ loading, error, data, client }) => {
                                                        console.log('GET_PROFILE_PICTURE client -> ', client);
                                                        console.log('GET_PROFILE_PICTURE data -> ', data);

                                                        return <Avatar>
                                                                    A
                                                                </Avatar>
                                                        }  
                                                    }
                                                </Query>
                                            }
                                            <div>{ !loading && currentUser.displayName }</div>
                                            <div>{ !loading && currentUser.email }</div>
                                            <Button type="primary" ghost>Follow</Button>
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