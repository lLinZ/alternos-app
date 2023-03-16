import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/CloseRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import Typography from '@mui/material/Typography';
import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/layout';
import { User } from '../../interfaces/user-type';
import { validarToken } from '../../lib/functions';
import { baseUrl } from '../../common/baseUrl';
import Swal from 'sweetalert2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { PageTitle } from '../../components/ui';
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
//////////////////////////////////////////////////////////////
// let tasks: Task[] = [];
// let tasks: Task[] = [
//    {
//       start: new Date(2023, 2, 3),
//       end: new Date(2023, 2, 4),
//       name: 'Idea',
//       id: 'Task 0',
//       type: 'task',
//       progress: 45,
//       isDisabled: true,
//       styles: { progressColor: 'coral' }
//    },
//    {
//       start: new Date(2023, 2, 6, 12, 0, 0),
//       end: new Date(2023, 2, 8, 12, 0, 0),
//       name: 'Tarea 2',
//       id: 'Task 2',
//       type: 'task',
//       progress: 0,
//       isDisabled: true,
//       styles: { progressColor: 'coral' }
//    },
//    {
//       start: new Date(2023, 2, 8, 13, 0, 0),
//       end: new Date(2023, 2, 9, 12, 0, 0),
//       name: 'Tarea 3',
//       id: 'Task 3',
//       type: 'task',
//       progress: 75,
//       isDisabled: false,
//       styles: { progressColor: 'coral' },
//       dependencies: ['Task 0']
//    }
// ];
// console.log('xxx',tasks);
//////////////////////////////////////////////////////////////
interface SelectedCase {
   id: number;
   description: string;
   process_name: string;
}
interface Case {
   id: number;
   description: string;
   user_id: number;
   user_name: string;
   process_id: number;
   process_name: string;
   process_owner_id: number;
   process_owner_name: string;
   status: string;
   inicio: Date;
   vence: Date;
   completed_at: string;
   comentario_cierre: string;
}
interface GanttData {
   case_id: number;
   case_name: string;
   items: Item[];
}

interface Item {
   id: number;
   pendiente: string;
   enproceso: string;
   completada: string;
}

export const GanttCase: FC = () => {
   const [userLogged, setUserLogged] = useState<User | null>(null);
   const router = useNavigate();
   const [open, setOpen] = useState<boolean>(false);
   const [cases, setCases] = useState<Case[] | null>(null);
   const [GanttData, setGanttData] = useState<GanttData | null>(null);
   const [tasks, setTasks] = useState(null);
   // const [tasks, setTasks] = useState(null);
   const [selectedCase, setSelectedCase] = useState<SelectedCase | null>(null);
   const handleClose = () => {
      setOpen(false);
   }
   const handleOpen = () => {
      setOpen(true);
   }

   const selectCase = (id: number, description: string, process_name: string) => {
      if (!id) {
         setSelectedCase(null);
         setGanttData(null);
         setOpen(false);
      } else {
         setSelectedCase({ id, description, process_name });
         getData(id);
         setOpen(false);
      }
   }
   const getData = async (id: number) => {
      const url = `${baseUrl}/ganttporcaso?case_id=${id}`;

      try {
         const respuesta = await fetch(url);
         const data = await respuesta.json();
         if (data.exito === "SI") {
            let xtasks:any = [];
            let progreso:any;
            data.registros[0].items.forEach((element:any) => {
               switch (element.status) {
                  case 'pendiente':
                     progreso = 0;
                  break;
                  case 'en proceso':
                     progreso = 50;
                  break;
                  case 'completada':
                     progreso = 100;
                  break;
               }

               if (element.precedente[0]==="0") {
                  xtasks.push({
                     start: new Date(element.inicio),
                     end: new Date(element.vence),
                     name: element.tarea,
                     id: element.id,
                     type:'task',
                     progress: progreso,
                     isDisabled: true,
                     styles: { progressColor: 'lightgreen' }
                  });
               } else {
                  xtasks.push({
                     start: new Date(element.inicio),
                     end: new Date(element.vence),
                     name: element.tarea,
                     id: element.id,
                     type:'task',
                     progress: progreso,
                     isDisabled: true,
                     styles: { progressColor: 'lightgreen' },
                     dependencies: [element.precedente[0]]
                  });
               }
            });
            setTasks(xtasks);
            Swal.fire({
               title: "Exito",
               icon: "success",
               toast: true,
               timer: 2000,
               showConfirmButton: false,
               timerProgressBar: true,
               position: "bottom-start"
            })
         } else {
            Swal.fire({
               title: "Error",
               text: "No se encontro data",
               icon: "error"
            })
            setGanttData(null);

         }
      } catch (error) {
         console.log(error);
         Swal.fire({
            title: 'Error',
            text: 'Error interno del servidor',
            icon: "error",
         })
         setGanttData(null);
      }
   }
   const getCases = async () => {
      const url = `${baseUrl}/listacasos`;
      try {
         const respuesta = await fetch(url);
         const data = await respuesta.json();

         if (data.exito === "SI") {
            setCases(data.registros)
         }
      } catch (error) {
         console.log(error);
      }
   }
   useEffect(() => {
      validarToken(router, setUserLogged);
      getCases();
   }, [])
   return (
      <Layout user={userLogged}>
         <Box sx={styles.mainContainer}>
            <PageTitle title={"Diagrama de Gantt por Requerimiento"} />
            <Box sx={styles.selection}>
               <Button disableElevation fullWidth variant="contained" onClick={handleOpen} color="secondary" sx={styles.button}>Seleccionar requerimiento</Button>
            </Box>
            {selectedCase && (
               <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                     <Typography variant="overline" fontWeight={"bold"}>Requerimiento seleccionado</Typography>
                     <Typography variant="subtitle2" color="text.secondary">{selectedCase.description}</Typography>
                     <Typography variant="overline" fontWeight={"bold"}>Proceso correspondiente</Typography>
                     <Typography variant="subtitle2" color="text.secondary">{selectedCase.process_name}</Typography>
                  </Box>
                  <CheckCircleIcon color="success" />
               </Box>
            )}
            {
               // selectedCase && !GanttData && (
               selectedCase && !tasks && (
                  <Box sx={{ p: 5, width: "100%", mt: 2 }}>
                     <Typography color="text.secondary" textAlign={"center"} fontWeight="bold" variant="subtitle2">No hay registros para requerimiento</Typography>
                  </Box>
               )
            }
            {
               // GanttData && (
               tasks && (
                  <Box sx={{ minWidth: "100%", maxWidth: "100%", minHeight: 400, overflowX: "scroll", display: 'flex', justifyContent: "space-between", alignItems: "start", marginTop: "15px" }}>
                     <Gantt
                        tasks={tasks}
                        todayColor='gray'
                        barBackgroundColor='coral'
                        listCellWidth={"150px"}
                        locale="es"
                     />

                     {/*                      
                     <Box sx={styles.GanttCategory}>
                        <Box sx={styles.GanttCategoryTitle}>
                           <Typography variant="overline" fontWeight={"bold"}>Pendiente</Typography>
                           <AccessTimeIcon color="warning" />
                        </Box>
                        {
                           GanttData && GanttData.items.map((i: Item) => i.pendiente && (
                              <Box sx={styles.GanttDataContainer}>
                                 <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{i.pendiente}</Typography>
                              </Box>
                           ))
                        }
                     </Box>
                     <Box sx={styles.GanttCategory}>
                        <Box sx={styles.GanttCategoryTitle}>
                           <Typography variant="overline" fontWeight={"bold"}>En proceso</Typography>
                           <HourglassBottomRoundedIcon color="info" />
                        </Box>
                        {
                           GanttData && GanttData.items.map((i: Item) => i.enproceso && (
                              <Box sx={styles.GanttDataContainer}>
                                 <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{i.enproceso}</Typography>
                              </Box>
                           ))
                        }
                     </Box>
                     <Box sx={styles.GanttCategory}>
                        <Box sx={styles.GanttCategoryTitle}>
                           <Typography variant="overline" fontWeight={"bold"}>Completado</Typography>
                           <CheckCircleIcon color="success" />
                        </Box>
                        {
                           GanttData && GanttData.items.map((i: Item) => i.completada && (
                              <Box sx={styles.GanttDataContainer}>
                                 <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{i.completada}</Typography>
                              </Box>
                           ))
                        }
                     </Box>
                      */}
                  </Box>
               )
            }
         </Box>
         <Dialog open={open} fullScreen onClose={handleClose} PaperProps={{
            sx: {
               background: '#f1f1f1'
            }
         }} >
            <AppBar color="primary" position="static" sx={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)" }}>
               <Toolbar >
                  <IconButton
                     edge="start"
                     color="inherit"
                     onClick={handleClose}
                     aria-label="close"
                  >
                     <CloseIcon />
                  </IconButton>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                     Seleccionar Requerimiento
                  </Typography>
               </Toolbar>
            </AppBar>
            <Box sx={styles.casesContainer}>
               {
                  cases && cases.map((c: Case) => (
                     <Box key={c.id} sx={styles.userCard}>
                        <Typography variant="subtitle2" color="text.secondary">{c.id}</Typography>
                        <Typography variant="body1">{c.description}</Typography>
                        <Button disabled={selectedCase && Number(selectedCase.id) === Number(c.id) ? true : false} color="secondary" variant="contained" sx={styles.button} onClick={() => selectCase(Number(c.id), c.description, c.process_name)}>{selectedCase && Number(selectedCase.id) === Number(c.id) ? "Seleccionado" : "Seleccionar"}</Button>
                     </Box>
                  ))
               }
            </Box>
         </Dialog>
      </Layout>
   )
}
const styles = {
   mainContainer: {
      minHeight: '100vh',
      width: '80%',
      margin: '20px auto'
   },
   selection: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
   },
   button: {
      p: 1.8,
      borderRadius: 3,
      textTransform: "none"
   },
   casesContainer: {
      width: "80%",
      margin: "20px auto"
   },
   userCard: {
      borderRadius: 5,
      marginBlock: 1,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
      background: "#FFF",
      p: 2
   },
   GanttDataContainer: {
      borderRadius: 5,
      p: 2,
      mb: 1,
      background: "#efefef",
   },
   GanttCategory: {
      background: "#FFF",
      width: 350,
      minHeight: 500,
      m: 2,
      p: 2,
      borderRadius: 5,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)"
   },
   GanttCategoryTitle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly"
   }
}