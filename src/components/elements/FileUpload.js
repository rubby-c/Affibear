import React from 'react';
import { Box } from "@chakra-ui/react";
import {FaUpload} from "react-icons/fa";

const MEGABYTE = Math.pow(2, 20);

const FileUpload = ({ hasFile, name, w, h, toast, types, onChange, multiple, maxSize, children }) => {
    function Handle(files) {
        if (files.length === 0) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            if (files[i].size / MEGABYTE > maxSize) {
                toast({
                    title: 'This file is too big',
                    status: 'error',
                    description: 'The maximum size of images is 4 megabytes.'
                });

                return;
            }
        }

        onChange(multiple ? files : files[0]);
    }

    return (
        <Box pos='relative' w={w} h={h}>
            <Box bg='#fff' border='2px dashed black' cursor='pointer' as='label' htmlFor={name} pos='absolute'
                 w='100%' h='100%' transition='0.25s all'
                 opacity={hasFile ? 0 : 1} _hover={{ opacity: 1 }}>
                <FaUpload className='upload-icon' fontSize={24} />
            </Box>

            {children}

            <input id={name} name={name} type='file' multiple={multiple}
                   onChange={(e) => Handle(e.target.files)} style={{ display: 'none' }}
                   accept={Array.isArray(types) ? types.join(',') : '*/*'} />
        </Box>

    );
};

export default FileUpload;