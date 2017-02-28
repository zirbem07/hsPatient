export interface User {
    PatientID: string,
    FirstName: string,
    LastName: string
    Email: string,
    BodyPart: string,
    ClinicID: number,
    TherapistID: string,
    GoalsSet: boolean,
    Discharged: boolean,
    Deleted: boolean,
    LastActive: string,
    Activated: boolean,
    PatientLogID: string,
    deviceToken: string,
    document_id: string
}