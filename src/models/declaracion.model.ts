import mongoose, { Document, PaginateModel, Schema, mquery } from "mongoose";
import mongooseService from "../common/services/mongoose.service";
import { CustomError } from "../exceptions/customError";
import { IQuery } from "../schemas/yup.query";
import paginate from 'mongoose-paginate-v2';


let mongoose2 = mongooseService.getMongoose();

interface IDeclaracion extends Document {
    nombre: String;
}
const declaracionSchema: Schema = new mongoose2.Schema({
    nombre: String
});

declaracionSchema.set('toJSON', {
    virtuals: true
});

declaracionSchema.plugin(paginate);

interface DeclaracionModel<T extends Document> extends PaginateModel<T> { }

class Declaracion {
    private static model: DeclaracionModel<IDeclaracion> = mongoose.model<IDeclaracion, mongoose.PaginateModel<IDeclaracion>>('Declaracione', declaracionSchema);

    static queryString = (cadena: String) => {
        cadena = cadena
            .toLowerCase()
            .replace("ñ", "#")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/a/g, '[a,á,à,ä]')
            .replace(/e/g, '[e,é,ë]')
            .replace(/i/g, '[i,í,ï]')
            .replace(/o/g, '[o,ó,ö,ò]')
            .replace(/u/g, '[u,ü,ú,ù]')
            .replace(/#/g, "ñ");

        return { $regex: cadena, $options: 'i' };
    }

    static query = async (query: IQuery) => {
        console.log("query: ", query);

        const q = query.query || undefined;
        let nQuery = {};
        let nSort = {};
        let page = query.page || 1;
        let nPageSize = query.pageSize || 10;
        let pageSize = nPageSize < 1 ? 10 : nPageSize > 200 ? 200 : nPageSize;

        if (q?.id && q.id !== '') {
            nQuery = { _id: mongoose.isValidObjectId(q.id) ? q.id : null };
        }

        if (q?.nombres && q.nombres !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosGenerales.nombre']: this.queryString(q.nombres || '') }
        }

        if (q?.primerApellido && q.primerApellido !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosGenerales.primerApellido']: this.queryString(q.primerApellido || '') }
        }

        if (q?.segundoApellido && q.segundoApellido !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosGenerales.segundoApellido']: this.queryString(q.segundoApellido || '') }
        }


        if (q?.escolaridadNivel && q.escolaridadNivel !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosCurricularesDeclarante.escolaridad.nivel.clave']: q.escolaridadNivel }
        }

        if (q?.escolaridadNivel && q.escolaridadNivel !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosCurricularesDeclarante.escolaridad.nivel.clave']: q.escolaridadNivel }
        }

        if (q?.datosEmpleoCargoComision?.nombreEntePublico && q.datosEmpleoCargoComision.nombreEntePublico !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.nombreEntePublico']: this.queryString(q.datosEmpleoCargoComision.nombreEntePublico) }
        }

        if (q?.datosEmpleoCargoComision?.entidadFederativa && q.datosEmpleoCargoComision.entidadFederativa !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.domicilioMexico.entidadFederativa.clave']: q.datosEmpleoCargoComision.entidadFederativa }
        }

        if (q?.datosEmpleoCargoComision?.municipioAlcaldia && q.datosEmpleoCargoComision.municipioAlcaldia !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.domicilioMexico.municipioAlcaldia.clave']: q.datosEmpleoCargoComision.municipioAlcaldia }
        }

        if (q?.datosEmpleoCargoComision?.empleoCargoComision && q.datosEmpleoCargoComision.empleoCargoComision !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.empleoCargoComision']: this.queryString(q.datosEmpleoCargoComision.empleoCargoComision) }
        }

        if (q?.datosEmpleoCargoComision?.nivelOrdenGobierno && q.datosEmpleoCargoComision.nivelOrdenGobierno !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.nivelOrdenGobierno']: this.queryString(q.datosEmpleoCargoComision.nivelOrdenGobierno) }
        }

        if (q?.datosEmpleoCargoComision?.nivelEmpleoCargoComision && q.datosEmpleoCargoComision.nivelEmpleoCargoComision !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.nivelEmpleoCargoComision']: this.queryString(q.datosEmpleoCargoComision.nivelEmpleoCargoComision) }
        }

        if (q?.bienesInmuebles?.superficieConstruccion && Object.keys(q.bienesInmuebles.superficieConstruccion).length > 0) {
            const { superficieConstruccion } = q.bienesInmuebles
            const { min, max } = superficieConstruccion;
            let nRange = {};
            console.log("min, max : ", min, max);

            if (Object.keys(superficieConstruccion).length === 1) {
                if (min && min !== 0) nRange = { $gte: min };
                if (typeof max !== 'undefined') nRange = { $lte: max };
            } else {
                nRange = { $gte: min, $lte: max };
                if (min === max) nRange = { $eq: min }
            }

            //results[*].declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble[*].superficieConstruccion.valor
            if (Object.keys(nRange).length > 0) nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.superficieConstruccion.valor']: nRange }
        }


        if (q?.bienesInmuebles?.superficieTerreno && Object.keys(q.bienesInmuebles.superficieTerreno).length > 0) {
            const { superficieTerreno } = q.bienesInmuebles
            const { min, max } = superficieTerreno;
            let nRange = {};
            console.log("min, max : ", min, max);

            if (Object.keys(superficieTerreno).length === 1) {
                if (min && min !== 0) nRange = { $gte: min };
                if (typeof max !== 'undefined') nRange = { $lte: max };
            } else {
                nRange = { $gte: min, $lte: max };
                if (min === max) nRange = { $eq: min }
            }

            //results[*].declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble[*].superficieTerreno.valor
            if (Object.keys(nRange).length > 0) nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.superficieTerreno.valor']: nRange }
        }

        if (q?.bienesInmuebles?.valorAdquisicion && Object.keys(q.bienesInmuebles.valorAdquisicion).length > 0) {
            const { valorAdquisicion } = q.bienesInmuebles
            const { min, max } = valorAdquisicion;
            let nRange = {};
            console.log("min, max : ", min, max);

            if (Object.keys(valorAdquisicion).length === 1) {
                if (min && min !== 0) nRange = { $gte: min };
                if (typeof max !== 'undefined') nRange = { $lte: max };
            } else {
                nRange = { $gte: min, $lte: max };
                if (min === max) nRange = { $eq: min }
            }

            //results[*].declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble[*].valorAdquisicion.valor
            if (Object.keys(nRange).length > 0) nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.valorAdquisicion.valor']: nRange }
        }

        console.log("nQuery: ", nQuery);

        try {
            let rQuery = await this.model.paginate(nQuery, { page, limit: pageSize, sort: nSort, collation: { locale: 'es' } }).then();

            return {
                pagination: { page: rQuery.page, pageSize: rQuery.limit, totalRows: rQuery.totalDocs, hasNextPage: rQuery.hasNextPage },
                results: rQuery.docs
            }

        } catch (error: object | any) {
            throw new CustomError('e_9002', 'Proceso de consulta fallido', error.message);
        }
    }
}

export default Declaracion;