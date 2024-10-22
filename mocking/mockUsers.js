import bcrypt from 'bcrypt';

export function generateMockUsers(count) {
    const users = [];
    for (let i = 0; i < count; i++) {
        const passwordHash = bcrypt.hashSync('coder123', 10);
        const role = Math.random() > 0.5 ? 'user' : 'admin';
        users.push({
            firstName: `User${i}`,
            lastName: `Mock${i}`,
            email: `user${i}@mock.com`,
            password: passwordHash,
            role: role,
            pets: []
        });
    }
    return users;
}