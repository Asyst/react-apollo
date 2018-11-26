import { Component, Fragment } from 'react';
import { NavLink, Link, Route } from 'react-router-dom';
import { graphql } from "react-apollo";
import gql from 'graphql-tag';
import axios from 'axios';

import { Layout, Avatar, Skeleton, Button } from 'antd';

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

class Profile extends Component {
    state = {
        photoURL: ''
    };

    componentDidMount() {
        const { photoURL } = this.state;
        const { data: { currentUser } } = this.props;

        if (currentUser.uid && !photoURL) {
            axios.get(`https://graph.facebook.com/v3.2/${currentUser.uid}/picture?type=large`)
                .then(response => response.request.responseURL)
                .then(photoURL => {
                    this.setState({ photoURL });
                })
        }
    }

    componentDidUpdate() {
        const { photoURL } = this.state;
        const { data: { currentUser } } = this.props;

        if (currentUser.uid && !photoURL) {
            axios.get(`https://graph.facebook.com/v3.2/${currentUser.uid}/picture?type=large`)
                .then(response => response.request.responseURL)
                .then(photoURL => {
                    this.setState({ photoURL });
                })
        }
    }

    render() {
        const { photoURL } = this.state;
        const { match, data: { currentUser } } = this.props;

        const crumbs = match.path.split('/');

        const { userId } = match.params;

        console.log('userId -> ', userId);

        return <Fragment>
            <Route path={ match.url } render={ () => (
                <MainLayout 
                    match={ match }
                    crumbs={ crumbs }>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        <div className="profile" 
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                margin: '0 auto',
                                width: '240px'
                            }}>
                            <h1>Profile</h1>

                            <Avatar 
                                src={ photoURL } 
                                icon="user" 
                                size={ 120 }
                                style={{ margin: '0 0 8px' }}>
                                { currentUser.displayName.substr(0, 1) }    
                            </Avatar>

                            <Skeleton
                                active
                                title={ false }
                                loading={ !photoURL }>
                                <div>{ currentUser.displayName }</div>
                                <div style={{ margin: '0 0 8px' }}>{ currentUser.email }</div>

                                { userId !== currentUser.uid && <Button type="primary" ghost>Follow</Button> }
                            </Skeleton>

                        </div>
                    </Content>
                </MainLayout>
            ) } />
        </Fragment> 
    }
}

export default graphql(GET_USER)(Profile);