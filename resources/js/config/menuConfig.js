import programHeadMenu from './programHeadMenu';
import studentMenu from './studentMenu';

const menuConfig = {
    program_head: programHeadMenu,
    professor: [], // Add professor menu when available
    dean: [], // Add dean menu when available
    student: studentMenu,
};

export const getMenuByRole = (role) => {
    return menuConfig[role] || [];
};
