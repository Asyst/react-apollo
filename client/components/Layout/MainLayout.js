import { Component } from 'react';
import { Layout } from 'antd';

import MainHeader from '../MainHeader';
import SideBar from '../SideBar';

class MainLayout extends Component {
    render() {
        const { children } = this.props;

        return <Layout>
            <MainHeader />
            <Layout>
                <SideBar />
            
                { children }
            </Layout>
        </Layout>
    }
}

export default MainLayout;