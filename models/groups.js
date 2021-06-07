const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    interest: {
        type: String,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    members:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    msgList:

        [
            {
                userId: {
                    type: String
                },
                messages: {
                    type: String
                }
            }
        ]

})

// const Group = mongoose.model('Group',groupsSchema);

// Group.findOne({name:'dsdi'})
//     .populate('msgList.userId')
//     .then(group => console.log(group.msgList));

module.exports = mongoose.model('Group', groupsSchema);