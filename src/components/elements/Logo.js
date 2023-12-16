import React from 'react';

import File from '../../../public/logo-name.svg'
import Image from "next/image";

const Logo = () => {
    return (
        <Image height={50} src={File} alt='Afficone Logo' />
    );
};

export default Logo;