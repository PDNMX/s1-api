import { object, string, number, date, InferType } from 'yup';

export const querySchema = object({
    page: number().integer('solo acepta numeros enteros.').positive('solo acepta valores positivos.'),
    pageSize: number().integer(),
    sort: object({
        nombres: string().matches(/(asc|desc)/),
        primerApellido: string().matches(/(asc|desc)/),
        segundoApellido: string().matches(/(asc|desc)/),
        escolaridadNivel: string().matches(/(asc|desc)/),
        datosEmpleoCargoComision: object({
            nombreEntePublico: string().matches(/(asc|desc)/),
            entidadFederativa: string().matches(/(asc|desc)/),
            municipioAlcaldia: string().matches(/(asc|desc)/),
            empleoCargoComision: string().matches(/(asc|desc)/),
            nivelEmpleoCargoComision: string().matches(/(asc|desc)/),
            nivelOrdenGobierno: string().matches(/(asc|desc)/),
        }),
        totalIngresosNetos: string().matches(/(asc|desc)/),
        bienesInmuebles: object({
            superficieConstruccion: string().matches(/(asc|desc)/),
            superficieTerreno: string().matches(/(asc|desc)/),
            formaAdquisicion: string().matches(/(asc|desc)/),
            valorAdquisicion: string().matches(/(asc|desc)/),
        })
    }),
    query: object({
        id: string().min(1),
        nombres: string().min(1),
        primerApellido: string().min(1),
        segundoApellido: string().min(1),
        escolaridadNivel: string().min(1),
        datosEmpleoCargoComision: object({
            nombreEntePublico: string().min(1),
            entidadFederativa: string().min(2).max(2),
            municipioAlcaldia: string().min(3).max(3),
            empleoCargoComision: string().min(1),
            nivelOrdenGobierno: string().min(1),
            nivelEmpleoCargoComision: string().min(1),
        }),
        bienesInmuebles: object({
            superficieConstruccion: object({
                min: number().integer(),
                max: number().integer(),
            }),
            superficieTerreno: object({
                min: number().integer(),
                max: number().integer(),
            }),
            formaAdquisicion: string().min(1),
            valorAdquisicion: object({
                min: number().integer(),
                max: number().integer(),
            })
        }),
        totalIngresosNetos: object({
            min: number().integer(),
            max: number().integer(),
        })
    })
});


export type IQuery = InferType<typeof querySchema>;
