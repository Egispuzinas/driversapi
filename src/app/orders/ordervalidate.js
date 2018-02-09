import Joi from 'joi'

function formatOrderValidationError(joiValidationError) {
    const validationErrors = joiValidationError.details
        .map( error => {
            return {
                field: error.path.join('.'),
                message: error.message
            }
        })

        return {
            validationErrors
        }
}

export function validate(schema) {
    return (req, resp, next) => {
        const validationResult = Joi.validate(req.body, schema, {
            abortEarly: false,
            stripUnknown: true
        })
        if (validationResult.error) {
            resp.status(400)
            resp.send(formatOrderValidationError(validationResult.error))
            resp.end()
        }
        req.body = validationResult.value
        next()
    }
}
