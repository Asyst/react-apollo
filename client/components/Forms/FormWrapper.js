import { Component } from 'react';

export default function FormWrapper(WrappedComponnet) {
    return class extends Component {
        state = {
            inputs: {},
            uploader: {
                previewVisible: false,
                previewImage: '',
                fileList: [],
            }
        };

        handleInputChange = e => {
            const name = e.target.getAttribute('name');
            const value = e.target.value;

            console.log('handleInputChange -> ', e.target.value);

            this.setState(state => ({
                ...state,
                inputs: {
                    ...state.inputs,
                    [name]: value
                }
            }));

            // this.props.form.setFieldsValue({ [name]: e.target.value })
        }

        handleCancel = () => this.setState({ uploader: { previewVisible: false } })

        handlePreview = (file) => {
            this.setState({
                uploader: {
                    previewImage: file.url || file.thumbUrl,
                    previewVisible: true,
                }
            });
        }

        handleChange = ({ fileList }) => this.setState({ uploader: { fileList } })

        render() {
            return <WrappedComponnet 
                        { ...this.state } 
                        { ...this.props }
                        handlers={{
                            handleCancel: this.handleCancel,
                            handlePreview: this.handlePreview,
                            handleChange: this.handleChange,
                            handleInputChange: this.handleInputChange
                        }} />
        }

    }
}