export class RoleHelper {

    static isAdmin(role){
        return !!role?.admin_access;
    }

}