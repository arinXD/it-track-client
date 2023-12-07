// ExcelUpload.js
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ExcelUpload = ({ onUpload }) => {
    const onDrop = useCallback(
        async (acceptedFiles) => {
            const file = acceptedFiles[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:4000/api/subjects', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                onUpload(response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        },
        [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' });

    return (
        <div>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop an Excel file here, or click to select one</p>
            </div>
        </div>
    );
};

export default ExcelUpload;
