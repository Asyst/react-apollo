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

            this.setState(state => ({
                ...state,
                inputs: {
                    ...state.inputs,
                    [name]: value
                }
            }));
        }

        handleCancel = () => this.setState(state => ({
            ...state,
            uploader: {
                ...state.uploader,
                previewVisible: false 
            } 
        }))

        handlePreview = (file) => {
            this.setState(state => ({
                ...state,
                uploader: {
                    ...state.uploader,
                    previewImage: file.url || file.thumbUrl,
                    previewVisible: true,
                }
            }));
        }

        handleChange = ({ fileList }) => this.setState(state => ({
            ...state,
            uploader: {
                ...state.uploader, 
                fileList 
            } 
        }))

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