
import { Fragment } from 'react';
import { NavLink, Link, Route } from 'react-router-dom';
import { Query, Mutation } from "react-apollo";
import gql from 'graphql-tag';

import { Form, Input, Tooltip, Icon, Button } from 'antd';

import FormWrapper from './FormWrapper';
import MainLayout from '../Layout/MainLayout';
import ImageUploader from './ImageUploader';

const FormItem = Form.Item;

const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    }
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

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

const ADD_POST = gql`
    mutation AddPost($input: PostInput) {
        addPost(input: $input) {
            author
            title
            image
            text
            tags
        }
    }
`;

const AddPost = ({ match, form: { getFieldDecorator }, uploader, handlers, inputs }) => 
    <Route path={ match.url } render={ () => 
        <Query query={ GET_USER }>
            { ({ data: { currentUser } }) => {
                let input;

                const crumbs = match.path.split('/');

                // console.log('AddPost -> ', uploader);

                return <Mutation mutation={ ADD_POST }>
                    { addPost => (
                        <MainLayout
                            match={ match }
                            crumbs={ crumbs }>
                            <div style={{ padding: '14px', width: '100%' }}>
                                <Form 
                                    layout="horizontal"
                                    onSubmit={ e => {
                                        e.preventDefault();

                                        console.log('AddPost inputs -> ', inputs)
                                        // console.log('AddPost uploader -> ', uploader)

                                        addPost({ 
                                            variables: {
                                                input: { 
                                                    author: currentUser.uid, 
                                                    title: inputs.title,
                                                    image: uploader.fileList,
                                                    text: inputs.text,
                                                    tags: inputs.tags
                                                } 
                                            }
                                        });
                                } }>

                                    <FormItem
                                        label="Заголовок">
                                        { getFieldDecorator('title', {
                                            rules: [{
                                                required: true, message: 'Please input title!',
                                            }, {
                                                // validator: this.validateToNextPassword,
                                            }],
                                        })(
                                            <Input
                                                name="title"
                                                type="text"
                                                onChange={ handlers.handleInputChange } />
                                        ) }    
                                    </FormItem>
                                    <FormItem label="Текст">
                                        <TextArea 
                                            rows={4}
                                            name="text"
                                            onChange={ handlers.handleInputChange } />
                                    </FormItem>
                                    <FormItem>
                                        <ImageUploader uploader={ uploader } handlers={ handlers } />
                                    </FormItem>
                                    <FormItem label="Тэги">
                                        <TextArea 
                                            rows={2}
                                            name="tags"
                                            onChange={ handlers.handleInputChange } />
                                    </FormItem>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit">Add Post</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </MainLayout>
                    ) }
                </Mutation>
            }}
        </Query> } />;

const WrappedAddPostForm = Form.create()(FormWrapper(AddPost));

export default WrappedAddPostForm;