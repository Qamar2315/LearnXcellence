const ProctoringImage = require('../models/ProtoringImage');

const createProtoringImage = (image_id , cheaing_indicators) => ProctoringImage.create({image_id , cheaing_indicators});

module.exports = {
    createProtoringImage
};
