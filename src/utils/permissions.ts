export function can(permission: string, userRole: number): boolean {
  if (userRole !== 0 && userRole !== 1) {
    return false;
  }

  if (userRole === 0) {
    return permission === 'view';
  }

  if (userRole === 1) {
    return ['create', 'update', 'delete', 'view'].includes(permission);
  }
  return false;
}