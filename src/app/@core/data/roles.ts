import { RoleI } from './../interfaces/Role';

export const rolesList: RoleI[] = [
    {
        id: 1,
        ref: 'ROLE_ADMIN',
        nombre: 'Administrador del Negocio'
    },
    {
        id: 2,
        ref: 'ROLE_SUPERVISOR',
        nombre: 'Usuario Supervisor'
    },
    {
        id: 3,
        ref: 'ROLE_VENDEDOR',
        nombre: 'Usuario Vendedor'
    },
    {
        id: 4,
        ref: 'SUPER_USUARIO_ADMIN',
        nombre: 'Super Usuario Administrador'
    },
]