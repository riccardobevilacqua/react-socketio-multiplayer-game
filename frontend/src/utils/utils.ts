export const generateUserId = () => Math.random().toString(36).substring(2, 15) + performance.now().toString();
