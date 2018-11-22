import { Component } from 'react';
import { Upload, Icon, Modal } from 'antd';
import { cons } from 'fp-ts/lib/Array';

class ImageUploader extends Component {
    render () {
        const { 
            uploader: { previewVisible, previewImage, fileList }, 
            handlers: { handlePreview, handleChange, handleCancel }
        } = this.props;

        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );

        console.log('previewVisible -> ', previewVisible);

        return (
            <div className="clearfix">
                <Upload
                    action={ `${ window.origin }/upload` }
                    listType="picture-card"
                    fileList={ fileList }
                    onPreview={ handlePreview }
                    onChange={ handleChange }
                >
                    { fileList.length >= 3 ? null : uploadButton }
                </Upload>
                <Modal visible={ previewVisible } footer={ null } onCancel={ handleCancel }>
                    <img alt="example" style={{ width: '100%' }} src={ previewImage } />
                </Modal>
            </div>
        );
    }
}

export default ImageUploader;