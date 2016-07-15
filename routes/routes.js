var apiRouter = function(tdapi, db) {
	tdapi.get('/getone', function(req, res) {
		console.log('requested to-do by id');
		if(!req.query.id) {
			return res.status(400).send('To-do ID missing');
		} else {
			db.get(req.query.id).then(function (response) {
				return res.status(201).send(response)
			}).catch(function (err) {
				return res.status(503).send(err)
			})
		}
	});

	tdapi.get('/getall', function(req, res) {
		console.log('requested all to-dos');
		db.allDocs({
			include_docs: true,
		}).then(function (response) {
			return res.status(200).send(response)
		}).catch(function (err) {
			return res.status(503).send(err)
		})
	});

	tdapi.put('/update', function(req, res) {
		console.log('request to update to-do: ',req.body._id);
		if(!req.body.content) {
			return res.status(400).send('To-do content missing');
		}
		else if(!req.body._id){
			return res.status(400).send('To-do ID missing')
		}
		else {
			db.get(req.body._id).then(function(doc) {
				return db.put({
					_id: req.body._id,
					_rev: doc._rev,
					content:req.body.content,
					isComplete: req.body.isComplete
				})
			}).then(function(response) {
				return res.status(201).send(response)
			}).catch(function (err) {
				return res.status(503).send(err)
			})
		}
	});

	tdapi.post('/create', function(req, res) {
		console.log('request to create new to-do');
		if(!req.body.content) {
			return res.status(400).send('To-do content missing');
		} else {
			db.put({
				_id:req.body._id,
				content: req.body.content,
				priority:req.body.priority,
				isComplete:false
			}).then(function (response) {
				return res.status(200).send(response)
			}).catch(function (err) {
				return res.status(503).send(err)
			})
		}
	});

	tdapi.put('/delete', function(req, res){
		console.log('request to delete to-do: ', req.body._id)
		if(!req.body._id){
			return res.status(400).send('To-do ID missing')
		} else {
			db.get(req.body._id).then(function(doc) {
				return db.remove(doc);
			}).then(function (response) {
				return res.status(200).send(response)
			}).catch(function (err) {
				return res.status(503).send(err)
			});
		}

	})
}
 
module.exports = apiRouter;