import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import { getDepartmentBySlug } from '../routes/departments.js';
import { slugify } from './slugify.js';
import {findCourseByCourseId} from '../routes/courses.js';


export const stringValidator = ({
    field = '',
    valueRequired = true,
    maxLength = 0,
    optional = false,
  } = {}) => {
    const val = body(field)
      .trim()
      .isString()
      .isLength({
        min: valueRequired ? 1: undefined,
        max: maxLength ? maxLength : undefined,
      })
      .withMessage(
        [
          field,
          valueRequired ? 'required' : '',
          maxLength ? `${maxLength} characters` : '',
        ]
          .filter((i) => Boolean(i))
          .join(' '),
      );
    if (optional) {
      return val.optional();
    }
    return val;
};

export const numberValidator = ({
    field = '',
    optional = false,
  } = {}) => {
    const val = body(field)
    .isInt({
        min: 0,
    })
    .withMessage([
        field ? `Verður að vera stærra en 0`: '',
    ]
        .filter((i) => Boolean(i))
        .join(' '),
    );
    if (optional) {
        return val.optional();
    }

    return val;
}

export const idValidator = ({
    field = '',
    valueRequired = true,
    maxLength = 0,
    optional = false,
  } = {}) => {
    const val = body(field)
      .trim()
      .isString()
      .isLength({
        min: maxLength ? maxLength : undefined,
        max: maxLength ? maxLength : undefined,
      })
      .withMessage(
        [
          field,
          valueRequired ? 'required' : '',
          maxLength ? `${maxLength} characters` : '',
        ]
          .filter((i) => Boolean(i))
          .join(' '),
      );
    if (optional) {
      return val.optional();
    }
    return val;
};

export function semesterValidator(req: Request, res: Response, next: NextFunction){
    const {semester}= req.body
    console.log(semester);
    if(semester === "Vor" || semester === "Haust" || semester === "Sumar" || semester === "Heilsárs"){

        return next()
    }

    return res.status(404).json({ errors: `Ekki löglegt kennslumisseri, Verður að vera 'Vor', 'Sumar', 
    'Haust' eða 'Heilsárs'`});
}

export async function departmentDoesNotExistValitador(req: Request, res: Response, next: NextFunction){
    const {title} = req.body;
    const slug = slugify(title);
    const department = await getDepartmentBySlug(slug);

    if(!department){
        return next();
    } 

    return res.status(404).json({ errors: `Nú þegar til ${title}`});
}

export async function courseDoesNotExistValitador(req: Request, res: Response, next: NextFunction){
    const{number} = req.body;
    const couse = await findCourseByCourseId(number);

    console.log(couse);
    if(!couse){
        return next();
    } 

    return res.status(404).json({ errors: `Nú þegar til ${number} námskeið`});
}


export function validationCheck(req: Request, res: Response, next: NextFunction) {
    const validation = validationResult(req);
  
    if (!validation.isEmpty()) {
        const errors = validation.array();
        const notFoundError = errors.find(
            (error: { msg: string; }) => error.msg === 'not found'
        );
        const serverError = errors.find(
            (error: { msg: string; }) => error.msg === 'server error'
        );
  
  
        let status = 400;
  
        if (serverError) {
            status = 500;
        } else if (notFoundError) {
            status = 404;
        } 
  
      return res.status(status).json({ errors: errors });
    }
  
    return next();
}


export function xssSanitizer(field: string) {
    return [
      body('name').customSanitizer((v) => xss(v)),
      body(field).customSanitizer((v) => xss(v)),
    ];
}

export function genericSanitizerT(field: string) {
    return [body('title').trim().escape(), body(field).trim().escape()];
}





