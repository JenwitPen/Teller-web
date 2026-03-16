import { authService } from '../services/authService';

export const useDashboard = () => {
  const user = authService.getUser();

  // For now, these are static as in the original component, 
  // but this is where you'd fetch real data in the future.
  const stats = [
    { title: 'บัญชีทั้งหมด', value: 1248, type: 'wallet' },
    { title: 'ธุรกรรมวันนี้', value: 452, type: 'transaction' },
    { title: 'เจ้าหน้าที่ออนไลน์', value: 12, type: 'user' },
    { title: 'รายการรอดำเนินการ', value: 3, type: 'history' },
  ];

  return {
    user,
    stats,
  };
};
