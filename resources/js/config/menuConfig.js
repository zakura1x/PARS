import programHeadMenu from './programHeadMenu';
import studentMenu from './studentMenu';
import professorMenu from './professorMenu';

const menuConfig = {
    program_head: programHeadMenu,
    professor: professorMenu, // Add professor menu when available
    dean: programHeadMenu, // Add dean menu when available
    student: studentMenu,
};

export const getMenuByRole = (role) => {
    return menuConfig[role] || [];
};
