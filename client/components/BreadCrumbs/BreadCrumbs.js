import { Breadcrumb } from 'antd';

const BreadCrumbs = ({ crumbs }) => <Breadcrumb style={{ margin: '16px 0' }}>
        { crumbs.map(crumb => crumb !== "" && <Breadcrumb.Item key={ crumb }>{ crumb }</Breadcrumb.Item>) }
    </Breadcrumb>

export default BreadCrumbs;