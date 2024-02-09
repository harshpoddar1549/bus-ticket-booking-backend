import adminModel from "../models/admin.model"

export const AdminService = {
    getByEmail: async (email:String) => {
        const adminUser = await adminModel.findOne({email:email})
        return adminUser
    }
}