import React from 'react';
import {
    Center,
    Popover,
    PopoverTrigger,
    Button,
    PopoverContent,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    SimpleGrid,
    Input,
    PopoverArrow,
    IconButton,
    Icon, Box,
} from '@chakra-ui/react';

import { BsDropletHalf } from 'react-icons/bs';
import { FaPaintBrush } from 'react-icons/fa';
import {GetForegroundColor} from "../../lib/helpers";
const ColorPicker = ({ button, color, setColor }) => {
    const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#f7fafc', '#293142'];

    return (
        <Popover variant='picker'>
            <PopoverTrigger>
                {button ? color !== 'none' ? <Box border='1px solid #000' cursor='pointer' bg={color} w='32px' h='32px'/> :
                        <Button size='sm' leftIcon={<Icon as={FaPaintBrush}/>}>Pick Color</Button>
                    : <IconButton aria-label='Change Color' size='xs' variant='unstyled' color={GetForegroundColor(color)} icon={
                        <Icon as={BsDropletHalf}/>}/>}
            </PopoverTrigger>

            <PopoverContent width='170px' border='none' boxShadow='lg'>
                <PopoverArrow bg={color}/>
                <PopoverCloseButton color={GetForegroundColor(color)}/>
                <PopoverHeader
                    height='100px'
                    backgroundColor={color === 'none' ? 'black' : color}
                    color='black'
                >
                    <Center height='100%' color={GetForegroundColor(color)}>{color}</Center>
                </PopoverHeader>

                <PopoverBody bg='#fff' height='120px'>
                    <SimpleGrid columns={5} spacing={2}>
                        {colors.map((c) => (
                            <Button
                                key={c}
                                aria-label={c}
                                background={c}
                                height='22px'
                                width='22px'
                                padding={0}
                                minWidth='unset'
                                borderRadius={3}
                                _hover={{ background: c }}
                                onClick={() => {
                                    setColor(c);
                                }}
                            ></Button>
                        ))}
                    </SimpleGrid>

                    <Input
                        borderRadius={3}
                        marginTop={3}
                        placeholder='HEX'
                        size='sm'
                        value={color}
                        minLength={6}
                        onChange={(e) => {
                            setColor(e.target.value);
                        }}
                    />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default ColorPicker;