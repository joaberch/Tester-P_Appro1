import { describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../../src/db/sequelize.mjs', () => ({
    User: {
        findOne: jest.fn(),
    },
}));

const { User } = await import("../../../src/db/sequelize.mjs");
const { getUser } = await import("../../../src/services/me.mjs");

describe('Me Service', () => {
    describe('getUser', () => {
        it('should return user data with correct oid', async () => {
            const users = [
                { idUser: "1", login: "abcdefg", firstname: "Gregor", name: "Samsa", hashedPassword: "$2a$12$BAFWG0WxIHi6/WUm0Zt2IOMEKw.OM8iEbuooF3AgsgVEQOu2Qq0kq", role: "admin", isDeleted: false, createdAt: "2026-03-30", azureOid: "e7b123" },
                { idUser: "2", login: "defghij", firstname: "Rodion", name: "Raskolnikov", hashedPassword: "$2a$12$BAFWG0WxIHi6/WUm0Zt2IOMEKw.OM8iEbuooF3AgsgVEQOu2Qq0kq", role: "student", isDeleted: false, createdAt: "2026-03-30", azureOid: "e7b456" }
            ];
            const outputUsers = [
                { id: "1", firstname: "Gregor", name: "Samsa", isDeleted: false, login: "abcdefg", role: "admin" },
                { id: "2", firstname: "Rodion", name: "Raskolnikov", isDeleted: false, login: "defghij", role: "student" }
            ]
            User.findOne.mockImplementation(({ where }) => {
                return Promise.resolve(users.find(user => user.azureOid == where.azureOid));
            });

            const res1 = await getUser("e7b123");
            const res2 = await getUser("e7b456");

            expect(res1).toEqual(outputUsers[0]);
            expect(User.findOne).toHaveBeenCalledWith({
                where: { azureOid: "e7b123" }
            });
            expect(res2).toEqual(outputUsers[1]);
            expect(User.findOne).toHaveBeenCalledWith({
                where: { azureOid: "e7b456" }
            });
        })
        it('should throw if user not found', async () => {
            User.findOne.mockResolvedValue(null);
            await expect(getUser("unknown")).rejects.toMatchObject({ status: 404 });
        })
    })
})