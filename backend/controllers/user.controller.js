import User from '../models/User.model.js'

const getAllUser = async (req,res) => {
    try {
        const query = req.query.name || ""
        
        const data = await User.find({
            $or: [
                { first_name: { $regex: query, $options: "i"}},
                { last_name: { $regex: query, $options: "i"}}
            ]
        })
        
        return res.status(200).json({
            "message": "success",
            "data": data,
        })
    } catch (error) {
        
        console.log(error)
        res.status(400).json({
            "message": "failed",
        })
        throw new Error(error)
    }
}

const getUserByDate = async (req,res) => {
    try {
        const date = req.query.date
        const condition = req.query.condition === "pass" ? "ผ่านการทดสอบ" : "ไม่ผ่านการทดสอบ"

        const startDate = new Date(date + "T00:00:00Z")
        const endDate = new Date(date + "T23:59:59Z")
        console.log(startDate, endDate)

        const result = await User.where('updatedAt').gte(startDate).lte(endDate).where('status').equals(condition).exec()

        return res.status(200).json({
            "message": "success",
            "data": result,
            "total": result.length,
        })
    } catch (error) {
        res.status(400).json({
            "message": "failed",
        })
        throw new Error(error)
    }
}

const driverLicense = (body_exam, theory_exam, practice_exam) => {
    var body_text = "รอทดสอบ"
    var theory_text = "รอทดสอบ"
    var practice_text = "รอทดสอบ"

    // Body test tasks
    var body_pass = 0
    if (body_exam) {
        body_exam.map(val => {
            if (val){
                body_pass++;
            }
            return val;
        })
        body_text = body_pass >= 3 ? "ผ่านการทดสอบ" : "ไม่ผ่านการทดสอบ"
    }
    
    // Theory test tasks
    var theory_scores = 0
    const theory_percent_pass = 0.8 * 150
    if (theory_exam){
        theory_exam.map(val => {
            theory_scores += val 
        })
        theory_text = theory_scores > theory_percent_pass ? "ผ่านการทดสอบ" : "ไม่ผ่านการทดสอบ"
    }

    if (practice_exam != undefined){
        if(practice_exam == true){
            practice_text = "ผ่านการทดสอบ"
        }else{
            practice_text = "ไม่ผ่านการทดสอบ"
        }
    }

    // status driver
    var status = "รอพิจารณา"
    if (body_exam && theory_exam && practice_exam != undefined){
        if (body_pass > 2 && theory_scores > theory_percent_pass && practice_exam == true){
            status = "ผ่านการทดสอบ"
        }else{
            status = "ไม่ผ่านการทดสอบ"
        }
    }
    return {
        theory_text,
        practice_text,
        body_text,
        status
    }
}

const addUser = async (req, res) => {
    try {
        
        const data = req.body
        const body_exam = data.body_test
        const theory_exam = data.theory_test
        const practice_exam = data.practice_test

        const test_result = driverLicense(body_exam, theory_exam, practice_exam)
        
        const result = await User.create({
            first_name: data.first_name,
            last_name: data.last_name,
            body_test: test_result.body_text,
            theory_test: test_result.theory_text,
            practice_test: test_result.practice_text,
            status: test_result.status,
        })

        return res.status(200).json({
            "message": "success",
            "data": result,
        })
    } catch (error) {
        res.status(400).json({
            "message": "failed"
        })
        throw new Error(error)
    }
} 

const updateUser = async (req,res) => {
    try {
        const userId = req.params.id
        const data = req.body

        const userExist = await User.findOne({ _id: userId}).exec()

        if (!userExist) return res.status(404).json({
            "message": "failed",
        })

        const body_exam = data.body_test
        const theory_exam = data.theory_test
        const practice_exam = data.practice_test
        
        const test_result = driverLicense(body_exam, theory_exam, practice_exam)

        userExist.body_test = body_exam ? test_result.body_text : userExist.body_test
        userExist.theory_test = theory_exam ? test_result.theory_text : userExist.theory_test
        userExist.practice_test = practice_exam != undefined ? test_result.practice_text : userExist.practice_test
        userExist.status = test_result.status

        const result = await userExist.save()

        return res.status(200).json({
            "message":"success",
            "data": result
        })
    } catch (error) {
        res.status(400).json({
            "message": "failed",
        })
        throw new Error(error)
    }
}

const delUser = async (req,res ) => {
    try {
        const userId = req.params.id
        
        const userExist = await User.findOne({ _id: userId}).exec()

        if (!userExist) return res.status(404).json({
            "message": "failed",
        })

        const result = await User.deleteOne({ first_name: userExist.first_name })

        return res.status(200).json({
            "message": "success",
            "data": result
        })
    } catch (error) {
        res.status(400).json({
            "message": "failed"
        })
        throw new Error(error)
    }
}

export {
    addUser,
    getAllUser,
    getUserByDate,
    updateUser,
    delUser
}