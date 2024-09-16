    // Type of errorSources 
    type TErrorSources = {
        path: string | number,
        message: string,
    }[]

    // Type of generic error reponse
    type TGenericErrorResponse = {
        statusCode: number,
        message: string,
        errorSources: TErrorSources
    }

    export { TErrorSources, TGenericErrorResponse }