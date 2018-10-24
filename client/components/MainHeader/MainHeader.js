import { Component } from 'react';
import { Query } from "react-apollo";
import { Layout, Menu, Icon, Avatar } from 'antd';
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
    firebase.auth().onAuthStateChanged(getUser);
    
    return <Query query={ GET_USER }>
        {({ loading, error, data, client }) => {

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
                    {/* <Avatar src={ currentUser && currentUser.photoURL }>{ currentUser && currentUser.displayName }</Avatar> */}
                    <Icon
                        className="trigger"
                        type={ collapsed ? 'menu-unfold' : 'menu-fold' }
                        style={{ color: '#fff', fontSize: '20px' }}
                        onClick={ toggle } />
                </Header>);
            }
        }
    </Query>
}
    

export default MainHeader;