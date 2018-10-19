import { NavLink } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { SubMenu } = Menu;
const { Sider } = Layout;

const SideBar = ({ match, collapsed }) => {
    let selectedItem = typeof match !== 'undefined' ? match.url.substr(1) : selectedItem;

    return <Sider 
        trigger={null}
        breakpoint="lg"
        collapsedWidth="0"
        collapsible
        collapsed={ collapsed }  
        width={200} 
        style={{ padding: '18px 0 0', background: '#fff' }}>
        <Menu
            mode="inline"
            selectedKeys={[`${ selectedItem }`]}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }} >
            <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                <Menu.Item key="feed">
                    <NavLink to="/feed">News</NavLink>
                </Menu.Item>
                <Menu.Item key="users">
                    <NavLink to="/users">Users</NavLink>
                </Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
        </Menu>
    </Sider>
}
    

export default SideBar;