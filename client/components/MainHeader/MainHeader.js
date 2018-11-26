import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Query } from "react-apollo";
import { Layout, Menu, Icon, Avatar, Spin, Dropdown } from 'antd';
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
}

const getUser = (user) => {
    if (user) {
        const [userData] = user.providerData;

        return userData;
    } else {
        return null;
    }
};

const menu = (currentUser) => (
    <Menu>
        <Menu.Item key="0">
            <NavLink to={ `/profile/${ currentUser.uid }` }>Профиль</NavLink>
        </Menu.Item>
        <Menu.Item key="1">
            <a href="http://www.taobao.com/">Настройки</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">Выход</Menu.Item>
    </Menu>
);

const MainHeader = ({ collapsed, toggle }) => {
    return <Query query={ GET_USER }>
        {({ loading, error, data: { currentUser }, client }) => {

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
                    <div className="user-info" 
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            width: '240px',
                            height: '100%' 
                        }}>
                        { loading
                            ? <Spin size="large" />
                            : <Fragment>
                                <Avatar 
                                    src={ currentUser.photoURL }
                                    style={{ margin: '0 12px' }}>
                                        { currentUser.displayName }
                                </Avatar>
                                <Dropdown overlay={ menu(currentUser) } trigger={['click']}>
                                    <div className="user-name" style={{ color: '#fff', cursor: 'pointer' }}>{ currentUser.displayName }</div>
                                </Dropdown>
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