// 定义后端接口
type User = { id: string; name: string; };
type userList = () => User[];
type userById = (id: string) => User;
type userCreate = (data: { name: string }) => User;