interface AddressInfo {
  cep: string
  logradouro: string
  number: number
  uf: string
}

interface ContactInfo {
  name: string
  lastName: string
  email: string
  gender: string
  address: AddressInfo
  phone: string
  profilePicture: File | null | string
  birthday: Date
}

interface employeeInfo {
  role: string
  admissioDate: Date
  sector: string
  salary: number
  isFired?: boolean
}

interface Histories {
  user: string
}

export interface Iemployees {
  id?: string
  ContactInfo: ContactInfo
  employeeInfo: employeeInfo
  employeePDF: string
  histories: Histories
}
