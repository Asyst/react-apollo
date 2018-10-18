import { Component } from 'react';
import { Layout } from 'antd';

import MainHeader from '../MainHeader';
import BreadCrumbs from '../BreadCrumbs';
import SideBar from '../SideBar';

const { Content } = Layout; 

class MainLayout extends Component {
    state = {
        collapsed: false,
    };
    
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        const { collapsed } = this.state;
        const { children, crumbs } = this.props;

        return <Layout>
                    <MainHeader 
                        collapsed={ collapsed }
                        toggle={ this.toggle } />
                    <Content style={{ padding: '0 24px' }}>
                        <BreadCrumbs crumbs={ crumbs } />
                        <Layout>
                            <SideBar collapsed={ collapsed } />
                        
                            { children }
                        </Layout>
                    </Content>
                </Layout>
    }
}

export default MainLayout;