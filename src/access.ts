/**
 * Khai bao quyen truy cap dung cho `access` trong routes va hook useAccess().
 * @see https://umijs.org/docs/max/access
 */

const checkRole = (currentUser: API.CurrentUser | undefined) => {
  return (roles: string[]): boolean => {
    const per = currentUser?.permissions;
    if (!per || per.length === 0) {
      return false;
    }
    if (per.includes('all')) {
      return true;
    }
    return roles.some((role) => per.includes(role));
  };
};

export default function access(
  initialState: { currentUser?: API.CurrentUser } | undefined,
): ACCESS.Check {
  const { currentUser } = initialState ?? {};
  const c = checkRole(currentUser);

  return {
    isAdmin: currentUser?.isAdmin || currentUser?.isSuperUser || false,

    // Menu cha "Thanh vien" hien khi co it nhat 1 quyen con.
    menuUser: c(['GET_USER', 'GET_ROLES']),

    listUser: c(['GET_USER']),
    createUser: c(['CREATE_USER']),
    updateUser: c(['UPDATE_USER']),
    deleteUser: c(['DELETE_USER']),
    banUser: c(['BANED_USER']),

    listRole: c(['GET_ROLES']),
    createRole: c(['CREATE_ROLES']),
    updateRole: c(['UPDATE_ROLES']),
    deleteRole: c(['DELETE_ROLES']),
    updateRolePermissions: c(['UPDATE_ROLE_PERMISSIONS']),
  };
}
