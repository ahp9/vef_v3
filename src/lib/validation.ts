import { body } from 'express-validator';

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

export function stringValidator(field: string, maxLength: number){
    if(field){
        console.error(`${field}, must be a string`);
    } 
    if (field.length > maxLength){
        console.error(`${field}, must be no longer than ${maxLength} characters`);
    }
    return null;
}
