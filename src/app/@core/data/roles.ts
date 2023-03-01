import { RoleI } from './../interfaces/Role';

export const rolesList: RoleI[] = [
    {
        id: 1,
        ref: 'ROLE_ADMIN',
        nombre: 'Administrador del Negocio',
        code: 'admin'
    },
    {
        id: 2,
        ref: 'ROLE_SUPERVISOR',
        nombre: 'Usuario Supervisor',
        code: 'supervisor'
    },
    {
        id: 3,
        ref: 'ROLE_VENDEDOR',
        nombre: 'Usuario Vendedor',
        code: 'vendedor'
    },
    {
        id: 4,
        ref: 'ROLE_SUPER_ADMIN',
        nombre: 'Super Usuario Administrador',
        code: 'super_admin'
    },
]
