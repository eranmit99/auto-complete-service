export type ValidationResponse = {
     isValid: boolean,
     error: string | null
}
export interface Validator {
    name: string
    validate: (str: string) => Promise<ValidationResponse>
}