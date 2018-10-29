import { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Query } from "react-apollo";
import { Layout, Menu, Icon, Avatar, Spin } from 'antd';
import gql from 'graphql-tag';
import firebase from 'firebase';

import './MainHeader.css';

const { Header } = Layout;

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

// const app = firebase.auth();

const authRequest = (operation) => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');

    firebase.auth().signInWithRedirect(provider);

    console.log('request operation -> ', operation);
    console.log('request provider -> ', provider);
}

const getUser = (user) => {
    if (user) {
        const [userData] = user.providerData;

        console.log('getUser -> ', userData);

        return userData;
    } else {
        return null;
    }
};

const MainHeader = ({ collapsed, toggle }) => {
    return <Query query={ GET_USER }>
        {({ loading, error, data: { currentUser }, client }) => {

                console.log('currentUser -> ', currentUser);

                return (<Header 
                    className="header"
                    style={{ position: 'fixed', zIndex: 1, width: '100%', padding: '0 24px' }}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div className="logo">
                            <img src={ `${ window.location.origin }/assets/images/logo/logo.png` } />
                        </div>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={ ['2'] }
                            style={{ lineHeight: '64px' }}>
                            <Menu.Item key="1">nav 1</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3" onClick={ authRequest }>Войти</Menu.Item>
                        </Menu>
                    </div>
                    <div className="user-info" style={{
                        position: 'relative', 
                        width: '240px',
                        height: '100%' }}>
                        { loading
                            ? <Spin size="large" />
                            : <Fragment>
                                <NavLink 
                                    to="/profile" 
                                    style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#fff'
                                    }}>
                                    <Avatar 
                                        src={ currentUser.photoURL }
                                        style={{ margin: '0 12px' }}>{ currentUser.displayName }</Avatar>
                                    <div className="user-name">{ currentUser.displayName }</div>
                                </NavLink>
                            </Fragment> 
                        }
                    </div>
                    {/* <Icon
                        className="trigger"
                        type={ collapsed ? 'menu-unfold' : 'menu-fold' }
                        style={{ color: '#fff', fontSize: '20px' }}
                        onClick={ toggle } /> */}
                </Header>);
            }
        }
    </Query>
}
    

export default MainHeader;