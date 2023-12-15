'use client';

import React from 'react';
import TitleCard from "@/components/elements/TitleCard";
import {
    Button, HStack, IconButton,
    Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement,
    Select,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure, useToast, VStack
} from "@chakra-ui/react";
import { FaArrowUp, FaChevronLeft, FaPencilAlt, FaPlus, FaShoppingBasket, FaTrash, FaWrench } from "react-icons/fa";

import NoSsr from "@/components/helpers/NoSsr";
import {GetCurrency, GetNumber} from "@/lib/helpers";
import IfElse from "@/components/helpers/IfElse";
import EasyModal from "@/components/elements/EasyModal";
import TitleOption from "@/components/elements/TitleOption";
import Api, {SendRequest} from "@/lib/api";
import { TOAST_OPTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import {BsCart, BsCart4} from "react-icons/bs";

const Products = ({ _data }) => {
    const router = useRouter();
    const toast = useToast(TOAST_OPTIONS);

    const [state, setState] = React.useState({
        id: null,
        name: '',
        type: 0,
        amount: undefined
    });

    const [data, setData] = React.useState(_data);

    const [modalType, setModalType] = React.useState('add');
    const modal = useDisclosure();

    async function AddProduct() {
        if (state.name.length === 0)
            return;

        await SendRequest(
            toast,
            'post',
            `/website/commissions/products`,
            state,
            () => {
                setData([...data, res.data]);

                setState({
                    id: null,
                    name: '',
                    type: 0,
                    amount: undefined
                });

                modal.onClose();
            },
            null,
            {
                success: {
                    title: `Success`,
                    description: 'You have successfully added a product.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Adding..'
                }
            }
        );
    }

    async function DeleteProduct(id) {
        await SendRequest(
            toast,
            'delete',
            `/website/commissions/products?id=${id}`,
            null,
            () => setData(data.filter(i => i.id !== id)),
            null,
            {
                success: {
                    title: `Success`,
                    description: 'You have successfully deleted a product.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Deleting..'
                }
            }
        );
    }

    async function EditProduct() {
        await SendRequest(
            toast,
            'patch',
            `/website/commissions/products`,
            state,
            () => {
                const arr = [...data];
                const idx = arr.findIndex(i => i.id === state.id);

                arr[idx] = state;
                setData(arr);

                modal.onClose();
            },
            null,
            {
                success: {
                    title: `Success`,
                    description: 'You have successfully updated a product.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Updating..'
                }
            }
        );
    }

    return (
        <>
            <TitleCard title={<HStack>
                <IconButton mr={2} size='sm' icon={<FaChevronLeft />} variant='ghost' aria-label='Go Back'
                            onClick={() => router.push('/dashboard/commissions')} />
                <FaShoppingBasket />
                <Text ml={2} fontWeight='medium' fontSize={20}>Products</Text>
            </HStack>} item={<Button onClick={() => {
                setModalType('add');
                modal.onOpen();
            }} leftIcon={<FaPlus/>}>Add Product</Button>}>
                <TableContainer as={IfElse} boolean={data.length > 0}>
                    <Table variant='striped'>
                        <Thead>
                            <Tr>
                                <Th>Product</Th>
                                <Th>Type</Th>
                                <Th>Commission</Th>
                                <Th isNumeric>Actions</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {data.map((product, idx) => <Tr key={idx}>
                                <Td>{product.name}</Td>
                                <Td>{product.type === 0 ? 'Percentage' : 'Fixed'}</Td>
                                <Td>{product.type === 0 ? `${product.amount}%` :
                                    <NoSsr>{GetNumber(product.amount)}</NoSsr>}</Td>
                                <Td>
                                    <HStack justifyContent='end'>
                                        <Button size='sm' leftIcon={<FaWrench />} onClick={() => {
                                            setState(product);
                                            setModalType('edit');
                                            modal.onOpen();
                                        }}>Edit</Button>

                                        <Button size='sm' colorScheme='red' leftIcon={<FaTrash />}
                                                onClick={() => DeleteProduct(product.id)}>Delete</Button>
                                    </HStack>
                                </Td>
                            </Tr>)}
                        </Tbody>
                    </Table>

                    <Text>You don't have any products.</Text>
                </TableContainer>
            </TitleCard>

            <EasyModal icon={BsCart4} title={modalType === 'add' ? 'Add a product' : 'Edit product'} isOpen={modal.isOpen}
                       onClose={() => {
                           modal.onClose();

                           setState({
                               name: '',
                               type: 0,
                               amount: undefined
                           });
                       }}
                       footer={
                           <Button onClick={modalType === 'add' ? AddProduct : EditProduct} leftIcon={modalType === 'add' ? <FaPlus /> : <FaWrench />}>
                               {modalType === 'add' ? 'Add Product' : 'Update Product'}
                           </Button>
                       }>
                <VStack alignItems='stretch' spacing={4}>
                    <TitleOption title='Name' subtitle={<Text fontSize={14} mb={2}>The <Text as='span' fontWeight='bold'>exact</Text> name of the product.</Text>}>
                        <Input placeholder='Product' value={state.name}
                               onChange={(e) => setState({...state, name: e.target.value})}/>
                    </TitleOption>

                    <TitleOption title='Commission Type'>
                        <Select value={state.type.toString()}
                                onChange={(e) => setState({...state, type: Number(e.target.value)})}>
                            <option value='0'>Percentage</option>
                            <option value='1'>Fixed</option>
                        </Select>
                    </TitleOption>

                    <TitleOption title='Amount'>
                        <InputGroup>
                            {state.type === 1 && <InputLeftAddon>{GetCurrency()}</InputLeftAddon>}
                            <Input placeholder='10' type='number' value={state.amount}
                                   onChange={(e) => setState({...state, amount: e.target.value})}/>
                            {state.type === 0 && <InputRightAddon>%</InputRightAddon>}
                        </InputGroup>
                    </TitleOption>
                </VStack>
            </EasyModal>
        </>
    );
};

export default Products;