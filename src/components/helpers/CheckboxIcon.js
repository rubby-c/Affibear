import React from 'react';
import { Checkbox } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

const CheckboxIcon = ({ isChecked, isIndeterminate, as: Element, ...rest }) => {
    return <Element {...rest} />;
};

Checkbox.defaultProps = {
    icon: <CheckboxIcon fontSize={8} as={FaCheck} />,
    colorScheme: 'brand'
}

export default CheckboxIcon;