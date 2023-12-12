import React from 'react';
import {HStack, Icon, Modal, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text} from "@chakra-ui/react";
import {IsString} from "@/lib/helpers";

const EasyModal = ({ icon, title, isOpen, onClose, footer, size, children }) => {
    return (
        <Modal size={size} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent mx={4} color='black' p={4}>
                {onClose && <ModalCloseButton />}

                <HStack mb={4} spacing={3}>
                    <Icon fontSize={20} as={icon} />
                    {IsString(title) ? <Text fontWeight='medium' fontSize={20}>{title}</Text> : title}
                </HStack>

                {children}

                {footer !== undefined && <ModalFooter mt={4} p={0}>
                    {footer}
                </ModalFooter>}
            </ModalContent>
        </Modal>
    );
};

export default EasyModal;