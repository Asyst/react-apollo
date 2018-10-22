import { Component, Fragment } from 'react';
import { NavLink, Link, Route } from 'react-router-dom';
import { Query } from "react-apollo";
import gql from 'graphql-tag';

import { Layout, Icon, List, Avatar, Skeleton } from 'antd';

import MainLayout from '../Layout/MainLayout';

const { Content } = Layout;

const GET_USERS = gql`
{
    users {
        id
        facebookId
        first_name
        picture
    }
}`;

const GET_USER = gql`
    query User($facebookId: String!) {
        user(facebookId: $facebookId) {
            id
            facebookId
            first_name
            picture
            email
        }   
    }
`;

class UsersList extends Component {
    state = {
        limit: new Array(2)
    };

    render() {
        const { limit } = this.state;
        const { match } = this.props;

        return <Query query={ GET_USERS }> 
            {({ loading, error, data, client }) => {
                    const crumbs = match.path.split('/');

                    return ( <Fragment>
                            <Route exact path={ match.url } render={() => (
                                <MainLayout 
                                    match={ match }
                                    crumbs={ crumbs }>
                                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                                        <div className="UsersList">
                                            <h1>UsersList</h1>
                                            
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={ data.users || limit }
                                                renderItem={ user => {
                                                    return <List.Item>
                                                        <Skeleton avatar title={false} loading={ loading } active>
                                                            <List.Item.Meta
                                                                avatar={!loading && <Avatar src={ user.picture } >{ user.first_name.substr(0, 1) }</Avatar>}
                                                                title={!loading && <Link to={ `/profile/${user.facebookId}` } >{ user.first_name }</Link>}
                                                                onMouseOver={() => client.query({
                                                                    query: GET_USER,
                                                                    variables: { facebookId: user.facebookId }
                                                                })}
                                                                // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                                            />
                                                        </Skeleton>
                                                    </List.Item>
                                                }}
                                            />

                                        </div>
                                    </Content>
                                
                                </MainLayout>
                            )} />

                        </Fragment>
                    )
                }
            }
        </Query>
    }
}

export default UsersList;