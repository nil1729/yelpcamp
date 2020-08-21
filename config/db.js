const mongoose = require('mongoose');
const connecDB = async db => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		console.log('Connected to MongoDB Atlas....');
	} catch (e) {
		console.log('Mongo Atlas Refused to Connect');
		try {
			await mongoose.connect('mongodb://localhost/yelp_camp', {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
			});
			console.log('Local MongoDB Connected ....');
		} catch (e) {
			console.log('Database Not Connected....');
		}
	}
};

module.exports = connecDB;
