const { dynamodb } = require("./aws.helper");

const tableName = "Subject";

const SubjectModel = {
    createSubject: async (subjectData) => {
        const params = {
            TableName: tableName,
            Item: {
                id: subjectData.stt,
                stt: subjectData.stt,
                tenMonHoc: subjectData.tenMonHoc,
                loai: subjectData.loai,
                hocKy: subjectData.hocKy,
                khoa: subjectData.khoa,
            },
        };

        try {
            await dynamodb.put(params).promise();
            return params.Item;
        } catch (error) {
            console.error("Error creating subject:", error);
            throw error;
        }
    },

    getSubject: async () => {
        const params = {
            TableName: tableName,
        };

        try {
            const subjects = await dynamodb.scan(params).promise();
            return subjects.Items;
        } catch (error) {
            console.error("Error getting subjects:", error);
            throw error;
        }
    },

    updateSubject: async (stt, subjectData) => {
        const params = {
            TableName: tableName,
            Key: {
                id: stt,
            },
            UpdateExpression:
                "set tenMonHoc = :tenMonHoc, loai = :loai, hocKy = :hocKy, khoa = :khoa",
            ExpressionAttributeValues: {
                ":tenMonHoc": subjectData.tenMonHoc,
                ":loai": subjectData.loai,
                ":hocKy": subjectData.hocKy,
                ":khoa": subjectData.khoa,
            },
            ReturnValues: "ALL_NEW",
        };

        try {
            const updateSubject = await dynamodb.update(params).promise();
            return updateSubject.Attributes;
        } catch (error) {
            console.error("Error updating subject:", error);
            throw error;
        }
    },

    deleteSubject: async (stt) => {
        const params = {
            TableName: tableName,  // 👈 Đã thêm TableName
            Key: {
                id: stt,
            },
        };

        try {
            await dynamodb.delete(params).promise();
            return { id: stt };
        } catch (error) {
            console.error("Error deleting subject:", error);
            throw error;
        }
    },

    getOneSubject: async (stt) => {
        const params = {
            TableName: tableName,
            Key: {
                id: stt,
            },
        };

        try {
            const data = await dynamodb.get(params).promise();
            return data.Item;
        } catch (error) {
            console.error("Error getting subject:", error);
            throw error;
        }
    },
};

module.exports = SubjectModel;
