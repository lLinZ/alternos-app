import { FC, Dispatch, ChangeEvent, useState, SyntheticEvent } from 'react'
import Box from '@mui/material/Box';
import { IconButton, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ResetIcon from '@mui/icons-material/RestartAltRounded';
import Swal from 'sweetalert2';

interface Props {
    data: any;
    setData: Dispatch<any>;
    category1: string;
    category2?: string;
    category3?: string;
    category4?: string;
}

export const FilterBox: FC<Props> = ({ data, setData, category1, category2 = '', category3 = '', category4 = '' }) => {
    const [search, setSearch] = useState<string>('');

    const [prev, setPrev] = useState<any>(data);

    /**
     * Funcion para cambiar el valor del input 
     * @param e Event del input
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

        if (e.target.value === '') {
            setSearch(e.target.value);
            handleReset();
        } else {
            setSearch(e.target.value);
        }
    }
    /**
     * Funcion para buscar en el state de datos
     * @param e Event del form
     */
    const handleSearch = (e: SyntheticEvent) => {
        e.preventDefault();
        const newData = prev.filter((d: any) => String(d[category1]).toLowerCase().includes(String(search).toLowerCase())
            || category2 && String(d[category2]).toLowerCase().includes(String(search).toLowerCase())
            || category3 && String(d[category3]).toLowerCase().includes(String(search).toLowerCase())
            || category4 && String(d[category4]).toLowerCase().includes(String(search).toLowerCase()));
        if (newData.length > 0) {
            setData(newData);
            Swal.fire({
                title: "Resultados encontrados",
                icon: "success",
                toast: true,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                position: "bottom-start"
            })
        } else {
            handleReset();
            Swal.fire({
                title: "No se encontraron resultados",
                icon: "error",
                toast: true,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                position: "bottom-start"
            })
        }
    }

    /**
     * Funcion para reestablecer filtros
     */
    const handleReset = () => {
        setData(prev);
    }
    return (
        <Box sx={{ marginBlock: 2, display: "flex", alignItems: "center", justifyContent: "end" }}>
            {/* Reestablecer */}
            <IconButton onClick={handleReset}><ResetIcon /></IconButton>

            {/* Formulario de busqueda */}
            <form onSubmit={handleSearch}>
                <TextField label="Busqueda" onChange={handleChange} color="secondary" variant='standard' />
                <IconButton type="submit"><SearchIcon /></IconButton>
            </form>
        </Box>
    )
}
