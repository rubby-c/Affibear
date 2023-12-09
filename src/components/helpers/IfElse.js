import React from 'react';

const IfElse = ({ boolean, children }) => {
    return (
        boolean ? children[0] : children[1]
    );
};

export default IfElse;