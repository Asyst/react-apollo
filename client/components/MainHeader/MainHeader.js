import { Component } from 'react';
import { Query } from "react-apollo";
import { Layout, Menu, Icon, Avatar } from 'antd';

import './MainHeader.css';

const { Header } = Layout;

const GET_USER = gql`
    query User($id: ID!) {
        user(id: $id) {
            id
            first_name
            picture
        }   
    }
`;

const MainHeader = ({ collapsed, toggle }) => 
    <Header 
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
                <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
        </div>
        <Query query={ GET_USER }>
            {() => <Avatar />}>
        </Query>
        <Icon
            className="trigger"
            type={ collapsed ? 'menu-unfold' : 'menu-fold' }
            style={{ color: '#fff', fontSize: '20px' }}
            onClick={ toggle } />
    </Header>

export default MainHeader;