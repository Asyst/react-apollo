import { Breadcrumb } from 'antd';

const BreadCrumbs = ({ crumbs }) => <Breadcrumb style={{ margin: '74px 0px 14px' }}>
        { crumbs.map(crumb => crumb !== "" && <Breadcrumb.Item key={ crumb }>{ crumb }</Breadcrumb.Item>) }
    </Breadcrumb>

export default BreadCrumbs;