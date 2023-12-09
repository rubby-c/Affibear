import React from 'react';
import { Modal, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text } from "@chakra-ui/react";
import {IsString} from "@/lib/helpers";

const EasyModal = ({ title, isOpen, onClose, footer, size, children }) => {
    return (
        <Modal size={size} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent mx={4} color='black' p={4}>
                {onClose && <ModalCloseButton />}

                {IsString(title) ? <Text mb={4} fontWeight='medium' fontSize={20}>{title}</Text> : title}

                {children}

                {footer !== undefined && <ModalFooter mt={4} p={0}>
                    {footer}
                </ModalFooter>}
            </ModalContent>
        </Modal>
    );
};

export default EasyModal;