import { AddCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
// import { DepartmentCard } from '../components/department/DepartmentCard';
import { DepartmentCard } from '../components/department/DepartmentCard';
import { FilterBox } from '../components/data/FilterBox';
import { Layout } from '../components/layout';
import { PageTitle } from '../components/ui';
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';
import { Departamentos } from './DepartmentAddingPage';

interface Props {

}

export const DepartmentPage: FC<Props> = () => {

   const [userLogged, setUserLogged] = useState<User | null>(null);

   const [departamentos, setDepartamentos] = useState<Departamentos[] | null>(null)

   const router = useNavigate();

   const getDepartamentos = async () => {
      const url = `${baseUrl}/listafunctions`;

      try {
         const respuesta = await fetch(url);

         const data = await respuesta.json();
         if (data.exito === "SI") {
            setDepartamentos(data.registros)
            console.log(data.registros)
         } else {
            Swal.fire({
               title: "Error",
               text: "No se encontraron los departamentos",
               icon: "error",
            })
         }
      } catch (error) {
         console.log(error)
         Swal.fire({
            title: "Error",
            text: "No se logró conectar",
            icon: "error",
         })
      }

   }

   useEffect(() => {
      validarToken(router, setUserLogged);
      getDepartamentos();
   }, [])

   return (
      <Layout user={userLogged}>
         <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
            <PageTitle title="Lista de Departamentos" navigate='/departments/add' />
            {departamentos && (<FilterBox data={departamentos} setData={setDepartamentos} category1="name" category2='precio' category3='costo' category4='owner_name' />)}
            {
               departamentos && departamentos.map((departamento: Departamentos) => (
                  <DepartmentCard
                     key={departamento.id}
                     departamentos={departamentos}
                     setDepartamentos={setDepartamentos}
                     departamento={departamento}
                  />
               ))
            }
         </Box>
      </Layout>
   )
}
