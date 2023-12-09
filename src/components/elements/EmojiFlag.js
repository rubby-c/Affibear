import React from 'react';
import { FLAG_CODE_TABLE } from "@/lib/constants";

const EmojiFlag = ({ code }) => {
    const str = code ? FLAG_CODE_TABLE[code] || code : undefined;

    return (
        <img src={`https://flagcdn.com/20x15/${code.toLowerCase()}.webp`} title={str} alt={str} />
    );
};

export default EmojiFlag;