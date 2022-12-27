import { Dispatch, FC, ChangeEvent, SetStateAction, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import { User } from '../interfaces/user-type'
import { numberWithDots, validarToken } from '../lib/functions'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/CloseRounded'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { baseUrl } from '../common/baseUrl'
import CheckCircle from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/EditRounded'
import EditOffIcon from '@mui/icons-material/EditOffRounded'
import SaveIcon from '@mui/icons-material/SaveRounded'
import Popover from '@mui/material/Popover'
import Swal from 'sweetalert2'
import CircleOutlined from '@mui/icons-material/CircleOutlined'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import LoadingButton from '@mui/lab/LoadingButton'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import { PageTitle } from '../components/ui'
import { FilterBox } from '../components/data/FilterBox'

interface ItemSelection {
    product_id: number;
    categoria: string;
    description: string;
    descr_larga?: string;
    type: string;
    precio: number | string;
    costo: number | string;
    orden: number;
}

interface IItem {
    id: string | number;
    name: string;
    categoria: string;
    description: string;
    owner_name: string;
    centrodecosto1: string;
    centrodecosto2: string;
    costo: string | number;
    precio: string | number;
    origen: string;
}

interface ItemSelectionProps {
    anchorEl: HTMLElement | null,
    setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    items: IItem[] | null,
    setItems: Dispatch<SetStateAction<IItem[] | null>>,
    selectedItems: ItemSelection[] | null,
    setSelectedItems: Dispatch<SetStateAction<ItemSelection[] | null>>,
    orden: number,
    setOrden: Dispatch<SetStateAction<number>>,
}
const ItemSelectionDialog: FC<ItemSelectionProps> = ({ anchorEl, setAnchorEl, open, setOpen, items, setItems, selectedItems, setSelectedItems, orden, setOrden }) => {

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const selectItem = (product_id: number, categoria: string, description: string, type: string, precio: number | string, costo: number | string, descr_larga: string) => {
        const exists = Boolean(selectedItems?.filter((item: ItemSelection) => item.product_id === product_id).length)

        const newData: ItemSelection = {
            product_id,
            categoria,
            description,
            descr_larga,
            type,
            precio,
            costo,
            orden: orden + 1
        }
        const newItem = exists
            ? (selectedItems?.filter((item: ItemSelection) => item.product_id !== product_id))
            : (selectedItems ? [...selectedItems, newData] : [newData]);

        setSelectedItems(newItem!);
        exists ? setOrden(orden - 1) : setOrden(orden + 1);
    }
    const getItems = async () => {
        const url = `${baseUrl}/listatodoslosprocesos`;
        try {
            const respuesta = await fetch(url);
            switch (respuesta.status) {
                case 200:
                    const data = await respuesta.json();

                    if (data.exito === "SI") {
                        setItems(data.registros);

                    } else {

                        Swal.fire({
                            title: "Error",
                            text: data.mensaje,
                            icon: "error",
                        })
                    }
                    break;
                default:
                    Swal.fire({
                        title: "Error",
                        text: "No se logró conectar",
                        icon: "error",
                    })
                    break;

            }

        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "No se logró conectar",
                icon: "error",
            })
        }
    }

    useEffect(() => {
        getItems();
    }, [])
    const PopOverText = "El último item seleccionado tendrá color verde, indicando que puede ser deseleccionado, esto es así para mantener el orden de los items. Puedes deseleccionar los items clickeando en el orden en que las seleccionaste pero de manera invertida.";
    const localStyles = {
        button: {
            borderRadius: 5,
            mb: 2,
            p: 1.9,
            textTransform: 'none',
            boxShadow: "0 0 5px rgba(100,100,100,0.1)"
        },
        mainContainer: {
            width: '80%',
            margin: '20px auto'
        },
        title: {
            ml: 2,
            flex: 1
        },
        popoverText: {
            p: 1,
            textAlign: "justify",
        },
        item: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            background: "rgba(255,255,255,0.8)",
            boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)",
            borderRadius: 5,
            p: 3,
        },
        selectedItems: {
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            background: "#FFF",
            borderRadius: 5,
            p: 2,
            mb: 2,
            flexDirection: "column",
            "&:hover": {
                boxShadow: "0 0 5px rgba(0,0,0,0.1)"
            },
        }
    }
    const getTotal = (selectedItems: ItemSelection[] | null) => {
        let total = 0;
        if (!selectedItems) {
            return 0;
        } else {
            selectedItems.forEach((si) => total = total + Number(si.precio))
            return total
        }
    }
    return (
        <>
            <Button color="primary" variant="contained" sx={localStyles.button} disableElevation onClick={handleOpen} fullWidth >Seleccionar producto</Button>
            {
                selectedItems && selectedItems.length > 0 && (
                    <Box sx={localStyles.selectedItems}>
                        <Typography variant="overline" fontWeight="bold">Productos seleccionados</Typography>
                        {
                            selectedItems.map((item: ItemSelection) => (
                                <ItemSelected i={item} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                            ))
                        }
                        <Divider sx={{ marginBlock: 2 }} />
                        <Typography variant="subtitle1" color="text.primary" fontWeight="bold">Precio total: ${numberWithDots(getTotal(selectedItems))}</Typography>
                    </Box>
                )
            }
            <Dialog open={open} fullScreen onClose={handleClose} PaperProps={{ sx: { background: "rgba(255,255,255,0.9)", backdropFilter: 'blur(6px)' } }}>
                <AppBar sx={{ position: 'sticky', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }} elevation={0}>
                    <Toolbar>
                        <IconButton onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                            <InfoIcon color="info" />
                        </IconButton>
                        <Typography sx={localStyles.title} variant="h6" component="div">
                            Seleccionar Productos
                        </Typography>
                        <Button color="success" variant="contained" disableElevation onClick={handleClose} size="small" sx={{ borderRadius: 5 }}>
                            Guardar
                        </Button>
                        <Popover id="mouse-over-popover" sx={{ pointerEvents: 'none', }} open={Boolean(anchorEl)} anchorEl={anchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} transformOrigin={{ vertical: 'top', horizontal: 'left', }} onClose={handlePopoverClose} disableRestoreFocus>
                            <Box sx={{ p: 2 }}>
                                <Typography sx={localStyles.popoverText}>{PopOverText}</Typography>
                            </Box>
                        </Popover>
                    </Toolbar>
                </AppBar>
                <Box sx={localStyles.mainContainer}>
                    {items && (<FilterBox data={items} setData={setItems} category1="name" category2="origen" category3="description" />)}
                    {
                        items && (
                            items.map((item: IItem) => (
                                <Box key={`${item.id}${item.name}`} sx={localStyles.item}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">#{item.id}</Typography>
                                        <Typography variant="subtitle2" fontWeight="bold">{item.name}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight={400}>{item.origen}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight={400}>Precio {item.precio}</Typography>
                                    </Box>
                                    <IconButton onClick={() => selectItem(Number(item.id), item.categoria, item.name, item.origen, item.precio, item.costo, item.description)} disabled={Boolean(selectedItems?.filter((itemSelected: ItemSelection) => itemSelected.product_id === item.id && itemSelected.orden !== orden).length)}>
                                        {
                                            Boolean(selectedItems?.filter((itemSelected: ItemSelection) => itemSelected.product_id === item.id).length)
                                                ? (<>
                                                    {selectedItems?.filter((itemSelected: ItemSelection) => itemSelected.product_id === item.id)[0].orden}
                                                    <CheckCircleRounded color={Boolean(selectedItems?.filter((itemSelected: ItemSelection) => itemSelected.product_id === item.id && itemSelected.orden !== orden).length) ? "secondary" : "success"} />
                                                </>)
                                                : (<CircleOutlined />)
                                        }
                                    </IconButton>
                                </Box>
                            ))
                        )
                    }
                    {
                    }
                </Box>
            </Dialog>
        </>
    )
}
interface PropsItemSelected {
    i: ItemSelection | null;
    selectedItems: ItemSelection[] | null;
    setSelectedItems: Dispatch<SetStateAction<ItemSelection[] | null>>
}
const ItemSelected: FC<PropsItemSelected> = ({ i, setSelectedItems, selectedItems }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [newDescr, setNewDescr] = useState<any>(i?.descr_larga ? i.descr_larga : '');

    const save = () => {
        if (i) {
            const excludeItems = selectedItems?.filter((si: ItemSelection) => si?.product_id !== i?.product_id)
            const newSelectedItems: ItemSelection[] = excludeItems ? [...excludeItems, { ...i, descr_larga: newDescr }] : [{ ...i, descr_larga: newDescr }]
            newSelectedItems.sort((a, b) => a.orden - b.orden)
            setSelectedItems(newSelectedItems);
            setEdit(false);
        } else {
            return false;
        }
    }
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", mt: 2, }}>
                <Typography variant="overline">Proceso {i?.type} #{i?.orden}</Typography>
                <Typography variant="subtitle1">{i?.description}</Typography>
                <Typography variant="subtitle2">Precio ${i?.precio} </Typography>
                <Typography variant="subtitle2">Costo ${i?.costo} </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    {
                        edit ?
                            (<>
                                <IconButton size="small" onClick={() => setEdit(false)}><EditOffIcon color="error" /></IconButton>
                                <TextField size="small" label="Descripcion larga" color="secondary" name="newDescr" value={newDescr} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewDescr(e.target.value)} fullWidth multiline />
                                <IconButton size="small" onClick={save}><SaveIcon color="success" /></IconButton>
                            </>
                            )
                            : (
                                <>
                                    <Typography variant="subtitle1">Descripcion larga: {i?.descr_larga}</Typography>
                                    <IconButton size="small" onClick={() => setEdit(true)}><EditIcon /></IconButton>
                                </>
                            )
                    }
                </Box>
            </Box>
        </>
    )
}
interface UserSelectionProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    users: User[] | null;
    setUsers: Dispatch<SetStateAction<User[] | null>>;
    selectedUser: User | null;
    setSelectedUser: Dispatch<SetStateAction<User | null>>;

}
const UserSelectionDialog: FC<UserSelectionProps> = ({ open, setOpen, users, setUsers, selectedUser, setSelectedUser }) => {

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const selectUser = (id: number) => {
        const newUser = users ? users.filter((u) => u.id === id)[0] : null;
        setSelectedUser(newUser);
        setOpen(false);
    }

    const getUsers = async () => {
        const url = `${baseUrl}/listaregistros?role_id=2`
        try {
            const respuesta = await fetch(url)

            switch (respuesta.status) {
                case 200:
                    const data = await respuesta.json()
                    setUsers(data.registros)
                    break;
                default:
                    break;
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    const localStyles = {
        button: {
            borderRadius: 5,
            p: 1.9,
            mb: 2,
            textTransform: 'none',
            boxShadow: "0 0 5px rgba(100,100,100,0.1)"
        },
        mainContainer: {
            width: '80%',
            margin: '20px auto'
        },
        userBox: {
            borderRadius: 5,
            background: "rgba(255,255,255,0.7)",
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
            p: 3,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        selectUserButton: {
            borderRadius: 5,
            p: 2,
            textTransform: "none"
        },
        selectedUserContainer: {
            mb: 2,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FFF",
            borderRadius: 5,
            "&:hover": {
                boxShadow: "0 0 5px rgba(100,100,100,0.1)"
            }
        }
    }
    return (
        <>
            <Button onClick={handleOpen} variant={'contained'} fullWidth disableElevation color={'primary'} sx={localStyles.button}>Seleccionar cliente</Button>

            {
                selectedUser && (
                    <Box sx={localStyles.selectedUserContainer}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={"bold"}>Cliente seleccionado</Typography>
                            <Typography variant="subtitle2" fontWeight={400} color="text.secondary">{selectedUser?.name}</Typography>
                        </Box>
                        <CheckCircle color="success" />
                    </Box>
                )
            }
            <Dialog open={open} fullScreen onClose={handleClose} PaperProps={{ sx: { background: "rgba(255,255,255,0.9)", backdropFilter: 'blur(6px)' } }}>
                <AppBar sx={{ position: 'relative', boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)' }} elevation={0}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar Cliente
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={localStyles.mainContainer}>
                    {users && (<FilterBox data={users} setData={setUsers} category1={'name'} category2={'phone'} />)}
                    {
                        users && users?.map((u: User) => (
                            <>
                                <Box sx={localStyles.userBox} key={`${u.id}${u.name}`}>
                                    <Box>
                                        <Typography variant={'subtitle1'} fontWeight="bold">{u.name}</Typography>
                                        <Typography variant={'subtitle2'} color="text.secondary">{u.phone}</Typography>
                                    </Box>
                                    <Button color="secondary" variant="contained" disableElevation sx={localStyles.selectUserButton} onClick={() => selectUser(u.id)} disabled={u.id === selectedUser?.id}>{u.id === selectedUser?.id ? "Seleccionado" : "Seleccionar"}</Button>
                                </Box>
                            </>
                        ))
                    }
                </Box>
            </Dialog>
        </>
    )
}

export const OfferAddingPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)

    // Props necesarias para el dialog de users
    const [openModalUsers, setOpenModalUsers] = useState<boolean>(false)
    const [users, setUsers] = useState<User[] | null>(null)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const modalUsersProps = { open: openModalUsers, setOpen: setOpenModalUsers, users, setUsers, selectedUser, setSelectedUser }

    // Props necesarias para el dialog de items    
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [openModalItems, setOpenModalItems] = useState<boolean>(false)
    const [items, setItems] = useState<IItem[] | null>(null)
    const [selectedItems, setSelectedItems] = useState<ItemSelection[] | null>(null)
    const [orden, setOrden] = useState<number>(0)
    const modalItemsProps = { anchorEl, setAnchorEl, open: openModalItems, setOpen: setOpenModalItems, items, setItems, selectedItems, setSelectedItems, orden, setOrden }

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const router = useNavigate();

    useEffect(() => {
        validarToken(router, setUserLogged)
    }, [])
    const resetAll = () => {
        setSelectedUser(null);
        setSelectedItems(null);
        setOrden(0);
    }

    const onSubmit = async () => {
        setIsSubmitting(true);

        const url = `${baseUrl}/ofertas.php`
        const body = JSON.stringify({
            customer_id: selectedUser ? selectedUser?.id : 0,
            salesman_id: userLogged ? userLogged?.id : 0,
            items: selectedItems ? selectedItems : []
        })
        const options = {
            method: "POST",
            body
        }
        try {
            const respuesta = await fetch(url, options)

            switch (respuesta.status) {
                case 200:
                    const data = await respuesta.json();
                    if (data.exito === "SI") {
                        Swal.fire({
                            title: "Exito",
                            text: "Se ha registrado la oferta",
                            icon: "success",
                        })
                        resetAll();
                        setIsSubmitting(false);
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: data.mensaje,
                            icon: "error",
                        })
                        setIsSubmitting(false);
                    }
                    break;
                default:
                    Swal.fire({
                        title: "Error",
                        text: "No se logró conectar",
                        icon: "error",
                    })
                    setIsSubmitting(false);
                    break;
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se logró conectar",
                icon: "error",
            })
            setIsSubmitting(false);
        }
    }

    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Registrar oferta" />
                <UserSelectionDialog {...modalUsersProps} />
                <ItemSelectionDialog {...modalItemsProps} />
                <LoadingButton
                    loading={isSubmitting}
                    disabled={isSubmitting || (!selectedItems || (selectedItems && selectedItems.length === 0) || !selectedUser)}
                    onClick={onSubmit}
                    variant="contained"
                    color="secondary"
                    sx={styles.button}
                    fullWidth
                >
                    Enviar
                </LoadingButton>
            </Box>
        </Layout>
    )
}
const styles = {
    mainContainer: {
        width: "80%",
        margin: "20px auto",
        minHeight: "100vh",
    },
    button: {
        borderRadius: 5,
        p: 1.9,
        mb: 2,
        textTransform: 'none',
        boxShadow: "0 0 5px rgba(100,100,100,0.1)"
    },
}