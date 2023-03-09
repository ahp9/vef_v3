import { body, validationResult } from 'express-validator';

export function validationCheck(req: Request, res: Response, next: NextFunction){
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        const errors = validation.array();
        const notFoundError = errors.find((error) => error.msg === 'not found');
        const serverError = errors.find((error) => error.msg === 'server error');
        
        let status = 400;

        if(serverError){
            status = 500;
        } else if (notFoundError){
            status = 404;
        }

        return res.status(status).json({errors});
    }

    return next();
}

function validationResult(req: Request) {
    return req.body;
    throw new Error("Function not implemented.");
}


/*
export function atLeastOneBodyValueValidator( fields: Array<string>){
    return body().custom(async (value, {req}) ={
        const {body : reqBody} = req;
        let valid = false;

        for(let i = 0; i < field)
    })
}
*/



type StringValidatorOptions = {
    field: string;
    maxLength: number;
    valueRequired: boolean;
    optional: boolean;
}

/*
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
        min: valueRequired ? 1 : undefined,
        max: maxLength ? maxLength : undefined,
      })
      .withMessage(
        [
          field,
          valueRequired ? 'required' : '',
          maxLength ? `max ${maxLength} characters` : '',
        ]
          .filter((i) => Boolean(i))
          .join(' '),
      );
    if (optional) {
      return val.optional();
    }
    return val;
  };


/*
export function stringValidator(item: StringValidatorOptions){
    const val = body(item.field)
    .trim()
    .toString()
    .isLength({
        min: item.valueRequired ? 1 : undefined,
        max: item.maxLength ? item.maxLength : undefined,
    })
    .withMessage(
        [
            item.field,
            item.valueRequired ? 'required' : '',
            item.maxLength ? `max ${item.maxLength} characters`: '',
        ]
        .filter((i) => Boolean(i))
        .join(' ')
    );

    if(item.optional){
        return val.optional()
    } 
    return val;
}
*/
