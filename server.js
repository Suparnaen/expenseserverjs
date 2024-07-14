// server.js
import express from 'express';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/expenses', (req, res) => {
	fs.readFile('db.json', 'utf-8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading database file');
		} else {
			res.send(JSON.parse(data));
		}
	});
});

app.post('/expenses', (req, res) => {
	fs.readFile('db.json', 'utf-8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading database file');
		} else {
			const issues = JSON.parse(data);
			const newIssue = { id: Date.now(), ...req.body };
			issues.push(newIssue);
			fs.writeFile('db.json', JSON.stringify(issues), err => {
				if (err) {
					res.status(500).send('Error writing to database file');
				} else {
					res.status(201).send(newIssue);
				}
			});
		}
	});
});

app.put('/expenses/:id', (req, res) => {
	fs.readFile('db.json', 'utf-8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading database file');
		} else {
			let issues = JSON.parse(data);
			const updatedIssue = { id: parseInt(req.params.id, 10), ...req.body };
			issues = issues.map(issue => issue.id === updatedIssue.id ? updatedIssue : issue);
			fs.writeFile('db.json', JSON.stringify(issues), err => {
				if (err) {
					res.status(500).send('Error writing to database file');
				} else {
					res.send(updatedIssue);
				}
			});
		}
	});
});

app.delete('/expenses/:id', (req, res) => {
	fs.readFile('db.json', 'utf-8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading database file');
		} else {
			let issues = JSON.parse(data);
			issues = issues.filter(issue => issue.id !== parseInt(req.params.id, 10));
			fs.writeFile('db.json', JSON.stringify(issues), err => {
				if (err) {
					res.status(500).send('Error writing to database file');
				} else {
					res.status(204).send();
				}
			});
		}
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
